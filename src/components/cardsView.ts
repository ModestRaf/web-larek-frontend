import {ProductItem} from "../types";
import {ModalBase} from "./modalBase";
import {CDN_URL} from "../utils/constants";

export class CardsView extends ModalBase {
    private cardTemplate: HTMLTemplateElement;
    readonly popupTemplate: HTMLTemplateElement;
    private readonly selectors: {
        image: string;
        title: string;
        price: string;
        category: string;
        button: string;
    };
    private readonly categoryClasses: Record<string, string> = {
        'софт-скил': 'card__category_soft',
        'хард-скил': 'card__category_hard',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'кнопка': 'card__category_button',
    };

    constructor(popupSelector: string, closeSelector: string, cardTemplateId: string, popupTemplateId: string) {
        super(popupSelector, closeSelector);
        this.cardTemplate = document.querySelector(`#${cardTemplateId}`) as HTMLTemplateElement;
        this.popupTemplate = document.querySelector(`#${popupTemplateId}`) as HTMLTemplateElement;
        // Сохраняем селекторы для всех статичных элементов карточки
        this.selectors = {
            image: '.card__image',
            title: '.card__title',
            price: '.card__price',
            category: '.card__category',
            button: '.card__button',
        };
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const productCard = cardClone.querySelector('.gallery__item') as HTMLElement;
        this.updateCardContent(productCard, product);
        productCard.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('popup:open', {detail: {product}}));
        });
        return productCard;
    }

    updateCardContent(card: HTMLElement, product: ProductItem): void {
        const image = card.querySelector(this.selectors.image) as HTMLImageElement;
        const title = card.querySelector(this.selectors.title) as HTMLElement;
        const price = card.querySelector(this.selectors.price) as HTMLElement | null;
        const category = card.querySelector(this.selectors.category) as HTMLElement;
        const button = card.querySelector(this.selectors.button) as HTMLButtonElement;
        if (image) {
            image.src = CDN_URL + product.image;
            image.alt = product.title;
        }
        if (title) {
            title.textContent = product.title;
        }
        if (price) {
            price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
        }
        if (category) {
            category.textContent = product.category;
            this.setCategoryClass(category, product.category);
        }
        if (button) {
            button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
        }
    }

    private setCategoryClass(category: HTMLElement | null, categoryName: string): void {
        if (!category) return;
        category.textContent = categoryName;
        category.classList.remove(...Object.values(this.categoryClasses));
        const className = this.categoryClasses[categoryName] || '';
        if (className) category.classList.add(className);
    }
}
