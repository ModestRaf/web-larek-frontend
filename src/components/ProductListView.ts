import {ICartModel, ProductItem} from "../types";

export class ProductListView {
    private container: HTMLElement;
    private basketCounter: HTMLElement;
    private cartModel: ICartModel; // Используем интерфейс
    private readonly createProductCard: (product: ProductItem) => HTMLElement;
    private readonly openPopup: (product: ProductItem, callback: () => void) => void;
    private readonly openBasketModal: () => void; // Добавляем openBasketModal

    constructor(
        containerId: string,
        cartModel: ICartModel, // Используем интерфейс
        createProductCard: (product: ProductItem) => HTMLElement,
        openPopup: (product: ProductItem, callback: () => void) => void,
        openBasketModal: () => void // Добавляем openBasketModal
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.cartModel = cartModel; // Присваиваем объект, реализующий интерфейс
        this.createProductCard = createProductCard;
        this.openPopup = openPopup;
        this.openBasketModal = openBasketModal; // Присваиваем openBasketModal
        this.cartModel.setProductList(this);
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = '';
        products.forEach(product => {
            const card = this.createProductCard(product); // Используем переданную функцию
            this.container.appendChild(card);
            card.addEventListener('click', () => this.openPopup(product, () => this.toggleProductInCart(product)));
        });
    }

    updateBasketCounter(selectedProductsCount: number): void {
        this.basketCounter.textContent = selectedProductsCount.toString();
    }

    toggleProductInCart: (product: ProductItem) => void;
    removeProductFromCart: (productId: string) => void;
}