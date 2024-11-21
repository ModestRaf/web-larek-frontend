import {ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class ProductListView {
    private container: HTMLElement;
    private readonly basketCounter: HTMLElement;
    private readonly createProductCard: (product: ProductItem) => HTMLElement;

    constructor(
        containerId: string,
        createProductCard: (product: ProductItem) => HTMLElement,
        private eventEmitter: EventEmitter // Передаем EventEmitter
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.createProductCard = createProductCard;

        // Подписка на события через EventEmitter
        this.eventEmitter.on<{ selectedProductsCount: number }>('productToggled', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });

        this.eventEmitter.on<{ selectedProductsCount: number }>('productRemoved', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });

        this.eventEmitter.on<{ selectedProductsCount: number }>('basketItemRemoved', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = '';
        products.forEach(product => {
            const card = this.createProductCard(product);
            this.container.appendChild(card);
            card.addEventListener('click', () => {
                const event = new CustomEvent('preview:open', {detail: {product}});
                window.dispatchEvent(event);
            });
        });
    }

    updateBasketCounter(selectedProductsCount: number): void {
        if (this.basketCounter && typeof selectedProductsCount === 'number') {
            this.basketCounter.textContent = selectedProductsCount.toString();
        }
    }
}