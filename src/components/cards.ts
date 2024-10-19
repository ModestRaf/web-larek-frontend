import { ProductItem } from "../types";
import { CDN_URL } from "../utils/constants";

export class CardsModel {
    private cardTemplate: HTMLTemplateElement;
    popupTemplate: HTMLTemplateElement;

    constructor(cardTemplateId: string, popupTemplateId: string) {
        this.cardTemplate = document.querySelector(`#${cardTemplateId}`) as HTMLTemplateElement;
        this.popupTemplate = document.querySelector(`#${popupTemplateId}`) as HTMLTemplateElement;
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const productCard = cardClone.querySelector('.gallery__item') as HTMLElement;
        this.updateCardContent(productCard, product);
        return productCard;
    }

    updateCardContent(productCard: HTMLElement, product: ProductItem): void {
        const image = productCard.querySelector('.card__image') as HTMLImageElement;
        const title = productCard.querySelector('.card__title') as HTMLElement;
        const price = productCard.querySelector('.card__price') as HTMLElement | null;
        const category = productCard.querySelector('.card__category') as HTMLElement;
        const button = productCard.querySelector('.card__button') as HTMLButtonElement;
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
}