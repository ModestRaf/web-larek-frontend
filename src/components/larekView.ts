import {ProductItem} from "../types";
import {CartView} from "./cartView";
import {CartModel} from "./cart";
import {CardsView} from "./cardsView";
import {ProductListModel} from "./ProductList";

export class ProductListView {
    private container: HTMLElement;
    private basketCounter: HTMLElement;
    private basketModal: CartView;
    private cartModel: CartModel;
    private cardsView: CardsView;
    private model: ProductListModel;

    constructor(
        containerId: string,
        basketModal: CartView,
        cartModel: CartModel,
        cardsView: CardsView,
        model: ProductListModel
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
            card.addEventListener('click', () => this.cardsView.openPopup(product, this.toggleProductInCart.bind(this)));
        });
    }

    updateBasketCounter(selectedProductsCount: number): void {
        this.basketCounter.textContent = selectedProductsCount.toString();
    }

    toggleProductInCart(product: ProductItem): void {
        this.model.toggleProductInCart(product);
        this.updateBasketCounter(this.model.products.filter(p => p.selected).length);
        this.cartModel.updateCartItems(this.model.products);
        this.basketModal.renderBasketItems();
    }

    removeProductFromCart(productId: string): void {
        this.model.removeProductFromCart(productId);
        this.updateBasketCounter(this.model.products.filter(p => p.selected).length);
        this.cartModel.updateCartItems(this.model.products);
        this.basketModal.renderBasketItems();
    }
}