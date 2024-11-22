import {ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class ProductListView {
    private container: HTMLElement;
    private readonly createProductCard: (product: ProductItem) => HTMLElement;

    constructor(
        containerId: string,
        createProductCard: (product: ProductItem) => HTMLElement,
        private eventEmitter: EventEmitter
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
        this.createProductCard = createProductCard;
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = '';
        products.forEach(product => {
            const card = this.createProductCard(product);
            this.container.appendChild(card);
            card.addEventListener('click', () => {
                this.eventEmitter.emit<{ product: ProductItem }>('preview:open', {product});
            });
        });
    }
}