import {ProductItem} from "../types";
import {CartView} from "./cartView";
import {Cart} from "./cart";
import {CardsView} from "./cardsView";
import {ProductList} from "./ProductList";

export class ProductListView {
    private container: HTMLElement;
    private basketCounter: HTMLElement;
    private basketModal: CartView;
    private cartModel: Cart;
    private cardsView: CardsView;
    private model: ProductList;
    constructor(
        containerId: string,
        basketModal: CartView,
        cartModel: Cart,
        cardsView: CardsView,
        model: ProductList
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.basketModal = basketModal;
        this.cartModel = cartModel;
        this.cardsView = cardsView;
        this.model = model;
        this.cartModel.setProductList(this);
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = '';
        products.forEach(product => {
            const card = this.cardsView.model.createProductCard(product);
            this.container.appendChild(card);
            card.addEventListener('click', () => this.cardsView.openPopup(product, () => this.toggleProductInCart(product)));
        });
    }

    updateBasketCounter(selectedProductsCount: number): void {
        this.basketCounter.textContent = selectedProductsCount.toString();
    }

    toggleProductInCart: (product: ProductItem) => void;
    removeProductFromCart: (productId: string) => void;
}