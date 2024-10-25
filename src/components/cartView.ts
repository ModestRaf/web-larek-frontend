import {CartItem, ICart} from "../types";
import {ModalBase} from "./modalBase";

export class CartView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private readonly onCheckout: (totalPrice: number) => void;
    private cartTemplate: HTMLTemplateElement;
    private template: HTMLTemplateElement;
    private model: ICart;

    constructor(
        modalId: string,
        contentTemplateId: string,
        model: ICart,
        onCheckout: (totalPrice: number) => void
    ) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.onCheckout = onCheckout;
        this.cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        this.template = document.querySelector('#card-basket') as HTMLTemplateElement;
        this.model = model;
    }

    open(): void {
        super.open();
        const cartClone = document.importNode(this.cartTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(cartClone);
        this.renderBasketItems();
        const checkoutButton = this.modal.querySelector('.basket__button') as HTMLElement | null;
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.onCheckout(this.model.getTotalPrice()));
        } else {
            console.error('Checkout button not found');
        }
    }

    renderBasketItems(): void {
        const basketList = this.modal.querySelector('.basket__list') as HTMLElement;
        const basketPrice = this.modal.querySelector('.basket__price') as HTMLElement;
        const checkoutButton = this.modal.querySelector('.basket__button') as HTMLButtonElement;
        if (!basketList || !basketPrice || !checkoutButton) {
            console.error('Basket elements not found');
            return;
        }
        basketList.innerHTML = '';
        if (this.model.items.length === 0) {
            this.renderEmptyCart(basketList, checkoutButton);
        } else {
            this.renderItems(basketList, checkoutButton);
        }
        basketPrice.textContent = `${this.model.getTotalPrice()} синапсов`;
    }

    private renderEmptyCart(basketList: HTMLElement, checkoutButton: HTMLButtonElement): void {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        basketList.appendChild(emptyMessage);
        checkoutButton.disabled = true;
    }

    private renderItems(basketList: HTMLElement, checkoutButton: HTMLButtonElement): void {
        this.model.items.forEach((item, index) => {
            const basketItem = this.createBasketItem(item, index + 1);
            basketList.appendChild(basketItem);
        });
        checkoutButton.disabled = false;
    }

    createBasketItem(item: CartItem, index: number): HTMLElement {
        const clone = this.template.content.cloneNode(true) as HTMLElement;
        const itemIndex = clone.querySelector('.basket__item-index') as HTMLElement;
        const itemTitle = clone.querySelector('.card__title') as HTMLElement;
        const itemPrice = clone.querySelector('.card__price') as HTMLElement;
        const deleteButton = clone.querySelector('.basket__item-delete') as HTMLElement;
        itemIndex.textContent = index.toString();
        itemTitle.textContent = item.title;
        itemPrice.textContent = item.price === null ? 'Бесценно' : `${item.price} синапсов`;

        // Передаем удаление обратно модели
        deleteButton.addEventListener('click', () => {
            this.model.removeBasketItem(item.id);
            this.renderBasketItems(); // Перерисовка корзины
        });

        return clone;
    }
}