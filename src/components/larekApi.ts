import {ProductItem} from "../types";
import {Api, ApiListResponse} from "./base/api";
import {Cards} from "./cards";
import {Modal} from "./cart";

export class ProductList {
    private api: Api;
    private container: HTMLElement;
    private cards: Cards;
    private basketCounter: HTMLElement;
    products: ProductItem[] = [];
    private basketModal: Modal;

    constructor(
        api: Api,
        containerId: string,
        cardTemplateId: string,
        popupSelector: string,
        popupTemplateId: string,
        closeSelector: string,
        basketModal: Modal
    ) {
        this.api = api;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.cards = new Cards(cardTemplateId, popupSelector, popupTemplateId, closeSelector);
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.basketModal = basketModal;
        this.basketModal.setProductList(this);
    }

    async loadProducts(): Promise<void> {
        try {
            const response = await this.api.get('/product');
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
            card.addEventListener('click', () => this.cards.openPopup(product, this.toggleProductInCart.bind(this)));
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

    renderBasketItems(): void {
        const selectedProducts = this.products.filter(product => product.selected);
        this.basketModal.items = selectedProducts.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
        }));
        this.basketModal.renderBasketItems();
    }

    toggleProductInCart(product: ProductItem): void {
        const existingProduct = this.products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.selected = !existingProduct.selected; // Переключаем состояние товара
        }
        this.updateBasketCounter(); // Обновляем счетчик
        this.saveSelectedToStorage(); // Сохраняем текущее состояние корзины
        this.renderBasketItems(); // Рендерим содержимое корзины
    }

    removeProductFromCart(productId: string): void {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.selected = false;
            this.updateBasketCounter();
            this.saveSelectedToStorage();
            this.renderBasketItems();
        }
    }
}