import {ProductItem} from "../types";
import {CardsModel} from "./cards";
import {ModalBase} from "./modalBase";

export class CardsView extends ModalBase { // Наследуем от ModalBase
    model: CardsModel;

    constructor(popupSelector: string, closeSelector: string, model: CardsModel) {
        super(popupSelector, closeSelector); // Вызываем конструктор ModalBase
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

        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(popupClone);
        this.open(); // Используем метод open из ModalBase
    }
}