import {ProductItem} from "../types";
import {CardsModel} from "./cards";

export class CardsView {
    private popup: HTMLElement;
    private popupContent: HTMLElement;
    private readonly closeButton: HTMLElement;
    model: CardsModel;

    constructor(popupSelector: string, closeSelector: string, model: CardsModel) {
        this.popup = document.querySelector(popupSelector) as HTMLElement;
        this.popupContent = this.popup.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.popup.querySelector(closeSelector);
        this.model = model;
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.popup.classList.remove('modal_active'));
        }
    }

    openPopup(product: ProductItem, toggleProductInCart: (product: ProductItem) => void): void {
        const popupClone = document.importNode(this.model.popupTemplate.content, true);
        const popupCard = popupClone.querySelector('.card') as HTMLElement;
        this.model.updateCardContent(popupCard, product);
        const button = popupCard.querySelector('.card__button') as HTMLButtonElement | null;
        if (button) {
            button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
            button.addEventListener('click', () => {
                toggleProductInCart(product);
                this.model.updateCardContent(popupCard, product);
            });
        }

        this.popupContent.innerHTML = '';
        this.popupContent.appendChild(popupClone);
        this.popup.classList.add('modal_active');
    }
}