import './scss/styles.scss';
import { Api, ApiListResponse } from "./components/base/api";
import {ProductItem} from "./types";
import { API_URL } from "./utils/constants";
import { Cards } from './components/cards';
import {Modal} from "./components/cart";

export class ProductList {
    private api: Api;
    private container: HTMLElement;
    private cards: Cards;
    private basketCounter: HTMLElement;
    products: ProductItem[] = [];
    private basketModal: Modal;

    constructor(api: Api, containerId: string, cardTemplateId: string, basketModal: Modal) {
        this.api = api;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.cards = new Cards(cardTemplateId);
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.basketModal = basketModal;
    }

    async loadProducts(): Promise<void> {
        try {
            const response = await this.api.get(`/product`);
            const data = response as ApiListResponse<ProductItem>;
            this.products = this.loadSelectedFromStorage(data.items);
            this.renderProducts(this.products);
            this.updateBasketCounter();
            this.renderBasketItems();
        } catch (error) {
            console.error(error);
        }
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = '';
        products.forEach(product => {
            const card = this.cards.createProductCard(product);
            this.container.appendChild(card);
            card.addEventListener('click', () => this.cards.openPopup(product, this.updateBasketCounter.bind(this)));
        });
    }

    toggleProductSelection(product: ProductItem): void {
        product.selected = !product.selected;
        this.updateBasketCounter();
        this.renderBasketItems();
    }

    updateBasketCounter(): void {
        const selectedProductsCount = this.products.filter(product => product.selected).length;
        this.basketCounter.textContent = selectedProductsCount.toString();
        this.saveSelectedToStorage();
    }

    saveSelectedToStorage(): void {
        const selectedState = this.products.map(product => ({
            id: product.id,
            selected: product.selected,
        }));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedState));
    }

    loadSelectedFromStorage(products: ProductItem[]): ProductItem[] {
        const savedSelectedState = localStorage.getItem('selectedProducts');
        if (savedSelectedState) {
            const selectedState = JSON.parse(savedSelectedState) as { id: string; selected: boolean }[];
            return products.map(product => {
                const savedProduct = selectedState.find(p => p.id === product.id);
                if (savedProduct) {
                    product.selected = savedProduct.selected;
                }
                return product;
            });
        }
        return products;
    }

    renderBasketItems(): void {
        const selectedProducts = this.products.filter(product => product.selected);
        this.basketModal.items = selectedProducts.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
        }));
        this.basketModal.renderBasketItems();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const basketModal = new Modal('modal-container', 'basket');
    const productList = new ProductList(api, 'gallery', 'card-catalog', basketModal);
    productList.loadProducts();

    const basketButton = document.querySelector('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());
});