import {ProductItem} from "../types";
import {ModalBase} from "./modalBase";
import {CDN_URL} from "../utils/constants";
import {EventEmitter} from "./base/events";

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
    private eventEmitter: EventEmitter;

    constructor(popupSelector: string, closeSelector: string, cardTemplateId: string, popupTemplateId: string, eventEmitter: EventEmitter) {
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
        this.eventEmitter = eventEmitter;
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const productCard = cardClone.querySelector('.gallery__item') as HTMLElement;
        this.updateCardContent(productCard, product);
        productCard.addEventListener('click', () => {
            this.eventEmitter.emit('popup:open', {product});
        });
        return productCard;
    }

    updateCardContent(element: HTMLElement, product: ProductItem): void {
        this.updateImage(element, product);
        this.updateTitle(element, product);
        this.updatePrice(element, product);
        this.updateCategory(element, product);
        this.updateButton(element, product);
    }

    private updateImage(element: HTMLElement, product: ProductItem): void {
        const img = element.querySelector(this.selectors.image) as HTMLImageElement;
        if (img) {
            img.src = CDN_URL + product.image;
            img.alt = product.title;
        }
    }

    private updateTitle(element: HTMLElement, product: ProductItem): void {
        const title = element.querySelector(this.selectors.title);
        if (title) {
            title.textContent = product.title;
        }
    }

    private updatePrice(element: HTMLElement, product: ProductItem): void {
        const price = element.querySelector(this.selectors.price);
        if (price) {
            price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
        }
    }

    private updateCategory(element: HTMLElement, product: ProductItem): void {
        const category = element.querySelector(this.selectors.category) as HTMLElement;
        if (category) {
            category.textContent = product.category;
            this.setCategoryClass(category, product.category);
        }
    }

    private updateButton(element: HTMLElement, product: ProductItem): void {
        const button = element.querySelector(this.selectors.button) as HTMLButtonElement;
        if (button) {
            if (product.price === null) {
                button.disabled = true;
            } else {
                button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
                button.disabled = false;
            }
        }
    }

    private setCategoryClass(category: HTMLElement, categoryName: string): void {
        category.textContent = categoryName;
        category.classList.remove(...Object.values(this.categoryClasses));
        const className = this.categoryClasses[categoryName];
        if (className) category.classList.add(className);
    }
}