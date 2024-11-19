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
        this.cardTemplate = document.getElementById(cardTemplateId) as HTMLTemplateElement;
        this.popupTemplate = document.getElementById(popupTemplateId) as HTMLTemplateElement;
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

    updateCardContent(element: HTMLElement, product: ProductItem): void {
        const updateElement = (selector: string, updater: (el: HTMLElement) => void) => {
            const el = element.querySelector(selector);
            if (el) updater(el as HTMLElement);
        };
        updateElement(this.selectors.image, (img: HTMLImageElement) => {
            img.src = CDN_URL + product.image;
            img.alt = product.title;
        });
        updateElement(this.selectors.title, (title) => {
            title.textContent = product.title;
        });
        updateElement(this.selectors.price, (price) => {
            price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
        });
        updateElement(this.selectors.category, (category) => {
            category.textContent = product.category;
            this.setCategoryClass(category, product.category);
        });
        updateElement(this.selectors.button, (button: HTMLButtonElement) => {
            button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
        });
    }

    private setCategoryClass(category: HTMLElement | null, categoryName: string): void {
        if (!category) return;
        category.textContent = categoryName;
        category.classList.remove(...Object.values(this.categoryClasses));
        const className = this.categoryClasses[categoryName] || '';
        if (className) category.classList.add(className);
    }
}
