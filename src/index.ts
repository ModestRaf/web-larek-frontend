import './scss/styles.scss';
import { Api, ApiListResponse } from "./components/base/api";
import {ProductItem} from "./types";
import { API_URL } from "./utils/constants";
import { Cards } from './components/cards';
import {Modal} from "./components/cart";

class ProductList {
    private api: Api;
    private container: HTMLElement;
    private cards: Cards;
    private basketCounter: HTMLElement;
    private products: ProductItem[] = [];

    constructor(api: Api, containerId: string, cardTemplateId: string) {
        this.api = api;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.cards = new Cards(cardTemplateId);
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    }

    async loadProducts(): Promise<void> {
        try {
            const response = await this.api.get(`/product`);
            const data = response as ApiListResponse<ProductItem>;
            this.products = this.loadSelectedFromStorage(data.items);
            this.renderProducts(this.products);
            this.updateBasketCounter();
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
}

document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const productList = new ProductList(api, 'gallery', 'card-catalog');
    productList.loadProducts();

    const basketButton = document.querySelector('.header__basket');
    const basketModal = new Modal('modal-container', 'basket');

    basketButton.addEventListener('click', () => basketModal.open());
});