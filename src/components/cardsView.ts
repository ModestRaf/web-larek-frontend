import {ProductItem} from "../types";
import {ModalBase} from "./modalBase";
import {CDN_URL} from "../utils/constants";

export class CardsView extends ModalBase {
    private readonly cardTemplate: HTMLTemplateElement;
    private readonly popupTemplate: HTMLTemplateElement;

    constructor(popupSelector: string, closeSelector: string, cardTemplateId: string, popupTemplateId: string) {
        super(popupSelector, closeSelector);
        this.cardTemplate = document.querySelector(`#${cardTemplateId}`) as HTMLTemplateElement;
        this.popupTemplate = document.querySelector(`#${popupTemplateId}`) as HTMLTemplateElement;
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
        this.content.innerHTML = '';
        this.content.appendChild(popupClone);
        this.open();
    }

    createProductCard(product: ProductItem): HTMLElement {
        const cardClone = document.importNode(this.cardTemplate.content, true);
        const productCard = cardClone.querySelector('.gallery__item') as HTMLElement;
        this.updateCardContent(productCard, product);
        return productCard;
    }

    updateCardContent(element: HTMLElement, product: ProductItem): void {
        const image = element.querySelector('.card__image') as HTMLImageElement;
        const title = element.querySelector('.card__title') as HTMLElement;
        const price = element.querySelector('.card__price') as HTMLElement | null;
        const category = element.querySelector('.card__category') as HTMLElement;
        const button = element.querySelector('.card__button') as HTMLButtonElement;
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

    private setCategoryClass(category: HTMLElement, categoryName: string): void {
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