import './scss/styles.scss';
import {ProductItem} from "./types";
import {Api, ApiListResponse} from './components/base/api';

class ProductList {
    private api: Api;
    private container: HTMLElement;
    private cardTemplate: HTMLTemplateElement;

    constructor(api: Api, containerId: string, cardTemplateId: string) {
        this.api = api;
        this.container = document.getElementById(containerId) as HTMLElement;
        this.cardTemplate = document.getElementById(cardTemplateId) as HTMLTemplateElement;
    }

    async loadProducts(): Promise<void> {
        try {
            const response = await this.api.get('/api/weblarek/product/'); // URL для получения всех товаров
            const data = response as ApiListResponse<ProductItem>;
            this.renderProducts(data.items);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    renderProducts(products: ProductItem[]): void {
        this.container.innerHTML = ''; // Очищаем контейнер перед отображением новых данных

        products.forEach(product => {
            const card = this.createProductCard(product);
            this.container.appendChild(card);
        });
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const card = cardClone.querySelector('.gallery__item') as HTMLElement;

        const image = card.querySelector('.card__image') as HTMLImageElement;
        image.src = product.image;
        image.alt = product.title;

        const title = card.querySelector('.card__title') as HTMLElement;
        title.textContent = product.title;

        const price = card.querySelector('.card__price') as HTMLElement;
        price.textContent = `${product.price !== null ? product.price : 'Бесценно'} синапсов`;

        return card;
    }
}


// Пример использования
document.addEventListener('DOMContentLoaded', () => {
    const api = new Api('https://larek-api.nomoreparties.co');
    const productList = new ProductList(api, 'gallery', 'card-catalog');
    productList.loadProducts();
});
