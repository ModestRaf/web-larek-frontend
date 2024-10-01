import './scss/styles.scss';
import { Api, ApiListResponse } from "./components/base/api";
import {ProductItem} from "./types";
import { API_URL } from "./utils/constants";
import { Cards } from './components/cards';

class ProductList {
    private api: Api;
    private container: HTMLElement;
    private cards: Cards;
    private basketCounter: HTMLElement;
    private products: ProductItem[] = [];  // Массив для хранения всех товаров

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
            this.products = this.loadSelectedFromStorage(data.items);  // Загружаем сохраненное состояние из localStorage
            this.renderProducts(this.products);
            this.updateBasketCounter();  // Обновляем счетчик сразу после загрузки товаров
        } catch (error) {
            console.error(error);
        }
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = ''; // Очищаем контейнер перед отображением новых данных

        products.forEach(product => {
            const card = this.cards.createProductCard(product);
            this.container.appendChild(card);
            card.addEventListener('click', () => this.cards.openPopup(product, this.updateBasketCounter.bind(this)));
        });
    }

    updateBasketCounter(): void {
        const selectedProductsCount = this.products.filter(product => product.selected).length;  // Считаем, сколько товаров выбрано
        this.basketCounter.textContent = selectedProductsCount.toString();  // Обновляем счетчик
        this.saveSelectedToStorage();  // Сохраняем состояние в localStorage
    }

    // Метод для сохранения состояния в localStorage
    saveSelectedToStorage(): void {
        const selectedState = this.products.map(product => ({
            id: product.id,
            selected: product.selected,
        }));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedState));
    }

    // Метод для загрузки состояния из localStorage
    loadSelectedFromStorage(products: ProductItem[]): ProductItem[] {
        const savedSelectedState = localStorage.getItem('selectedProducts');
        if (savedSelectedState) {
            const selectedState = JSON.parse(savedSelectedState) as { id: string; selected: boolean }[];
            // Соотносим сохраненное состояние с загруженными товарами
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


// Пример использования
document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const productList = new ProductList(api, 'gallery', 'card-catalog');
    productList.loadProducts();
});