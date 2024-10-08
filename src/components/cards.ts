import { ProductItem } from "../types";
import { CDN_URL } from "../utils/constants";

export class Cards {
    private cardTemplate: HTMLTemplateElement;

    constructor(cardTemplateId: string) {
        this.cardTemplate = document.getElementById(cardTemplateId) as HTMLTemplateElement;
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
        const price = card.querySelector('.card__price') as HTMLElement;
        const category = card.querySelector('.card__category') as HTMLElement;

        image.src = CDN_URL + product.image;
        image.alt = product.title;
        title.textContent = product.title;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
        category.textContent = product.category;

        this.setCategoryClass(category, product.category);
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

    openPopup(product: ProductItem, addProductToCart: (product: ProductItem) => void): void {
        const popup = document.querySelector('.modal') as HTMLElement;
        const popupContent = popup.querySelector('.modal__content') as HTMLElement;
        const popupTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        const popupClone = document.importNode(popupTemplate.content, true);
        const popupCard = popupClone.querySelector('.card') as HTMLElement;

        this.updateCardContent(popupCard, product);

        const button = popupCard.querySelector('.card__button') as HTMLButtonElement;
        button.textContent = 'Добавить в корзину';
        button.addEventListener('click', () => {
            addProductToCart(product);
        });

        popupContent.innerHTML = '';
        popupContent.appendChild(popupClone);
        popup.classList.add('modal_active');

        const closeButton = popup.querySelector('.modal__close') as HTMLElement;
        closeButton.addEventListener('click', () => popup.classList.remove('modal_active'));
    }

}