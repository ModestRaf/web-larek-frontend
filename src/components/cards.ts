import { ProductItem } from "../types";
import { CDN_URL } from "../utils/constants";

export class Cards {
    private cardTemplate: HTMLTemplateElement;
    private popup: HTMLElement;
    private popupContent: HTMLElement;
    private popupTemplate: HTMLTemplateElement;
    private closeButton: HTMLElement;

    constructor(cardTemplateId: string, popupSelector: string, popupTemplateId: string, closeSelector: string) {
        this.cardTemplate = document.getElementById(cardTemplateId) as HTMLTemplateElement;
        this.popup = document.querySelector(popupSelector) as HTMLElement;
        this.popupContent = this.popup.querySelector('.modal__content') as HTMLElement;
        this.popupTemplate = document.getElementById(popupTemplateId) as HTMLTemplateElement;
        this.closeButton = this.popup.querySelector(closeSelector);
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.popup.classList.remove('modal_active'));
        }
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const card = cardClone.querySelector('.gallery__item') as HTMLElement;
        this.updateCardContent(card, product);
        return card;
    }

    updateCardContent(card: HTMLElement, product: ProductItem): void {
        const image = card.querySelector('.card__image') as HTMLImageElement;
        const title = card.querySelector('.card__title') as HTMLElement;
        const price = card.querySelector('.card__price') as HTMLElement | null;
        const category = card.querySelector('.card__category') as HTMLElement;
        const button = card.querySelector('.card__button') as HTMLButtonElement;

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

    setCategoryClass(category: HTMLElement, categoryName: string): void {
        const categoryClasses = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button'
        };

        category.classList.remove(...Object.values(categoryClasses));
        const className = categoryClasses[categoryName as keyof typeof categoryClasses];
        if (className) {
            category.classList.add(className);
        }
    }

    openPopup(product: ProductItem, toggleProductInCart: (product: ProductItem) => void): void {
        const popupClone = document.importNode(this.popupTemplate.content, true);
        const popupCard = popupClone.querySelector('.card') as HTMLElement;
        this.updateCardContent(popupCard, product);
        const button = popupCard.querySelector('.card__button') as HTMLButtonElement | null;
        if (button) {
            button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
            button.addEventListener('click', () => {
                toggleProductInCart(product);
                this.updateCardContent(popupCard, product);
            });
        }

        this.popupContent.innerHTML = '';
        this.popupContent.appendChild(popupClone);
        this.popup.classList.add('modal_active');
    }
}