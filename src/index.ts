import './scss/styles.scss';
import {ProductItem} from "./types";
import {Api, ApiListResponse} from './components/base/api';
import {API_URL, CDN_URL} from "./utils/constants";

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
            const response = await this.api.get(`/product`);
            const data = response as ApiListResponse<ProductItem>;
            this.renderProducts(data.items);
        } catch (error) {
            console.error(error);
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
        image.src = CDN_URL + product.image;
        image.alt = product.title;

        const title = card.querySelector('.card__title') as HTMLElement;
        title.textContent = product.title;

        const price = card.querySelector('.card__price') as HTMLElement;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        return card;
    }
}


// Пример использования
document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const productList = new ProductList(api, 'gallery', 'card-catalog');
    productList.loadProducts();
});
