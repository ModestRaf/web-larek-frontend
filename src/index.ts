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

            document.querySelector('.card')?.addEventListener('click', () => this.openPopup(product));
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

        const category = card.querySelector('.card__category') as HTMLElement;
        category.textContent = product.category;

        // Добавляем класс в зависимости от категории
        switch (product.category) {
            case 'софт-скил':
                category.classList.add('card__category_soft');
                break;
            case 'хард-скил':
                category.classList.add('card__category_hard');
                break;
            case 'другое':
                category.classList.add('card__category_other');
                break;
            case 'дополнительное':
                category.classList.add('card__category_additional');
                break;
            case 'кнопка':
                category.classList.add('card__category_button');
                break;
            default:
                break;
        }

        return card;
    }

    openPopup(product: ProductItem): void {
        const popup = document.querySelector('.modal') as HTMLElement;
        const popupContent = popup.querySelector('.modal__content') as HTMLElement;
        const popupTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        const popupClone = document.importNode(popupTemplate.content, true);

        const image = popupClone.querySelector('.card__image') as HTMLImageElement;
        image.src = CDN_URL + product.image;
        image.alt = product.title;

        const title = popupClone.querySelector('.card__title') as HTMLElement;
        title.textContent = product.title;

        const price = popupClone.querySelector('.card__price') as HTMLElement;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        const category = popupClone.querySelector('.card__category') as HTMLElement;
        category.textContent = product.category;

        const text = popupClone.querySelector('.card__text') as HTMLElement;
        text.textContent = product.description || 'Описание отсутствует';

        // Добавляем класс в зависимости от категории
        switch (product.category) {
            case 'софт-скил':
                category.classList.add('card__category_soft');
                break;
            case 'хард-скил':
                category.classList.add('card__category_hard');
                break;
            case 'другое':
                category.classList.add('card__category_other');
                break;
            case 'дополнительное':
                category.classList.add('card__category_additional');
                break;
            case 'кнопка':
                category.classList.add('card__category_button');
                break;
            default:
                break;
        }

        popupContent.innerHTML = '';
        popupContent.appendChild(popupClone);

        popup.classList.add('modal_active');

        // Добавляем обработчик событий на закрытие модального окна
        const closeButton = popup.querySelector('.modal__close') as HTMLElement;
        closeButton.addEventListener('click', () => popup.classList.remove('modal_active'));
    }
}

// Пример использования
document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const productList = new ProductList(api, 'gallery', 'card-catalog');
    productList.loadProducts();
});
