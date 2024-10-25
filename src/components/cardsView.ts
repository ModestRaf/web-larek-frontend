import {ICards, ProductItem} from "../types";
import {ModalBase} from "./modalBase";

export class CardsView extends ModalBase {
    model: ICards;

    constructor(popupSelector: string, closeSelector: string, model: ICards) {
        super(popupSelector, closeSelector);
        this.model = model;
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
        this.content.innerHTML = '';
        this.content.appendChild(popupClone);
        this.open();
    }
}