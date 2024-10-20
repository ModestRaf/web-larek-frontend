import {CartItem} from "../types";
import {CartModel} from "./cart";
import {OrderView} from "./orderAddress";
import {OrderModel} from "./order";
import {ModalBase} from "./modalBase";

export class CartView extends ModalBase { // Наследуем от ModalBase
    private contentTemplate: HTMLTemplateElement;
    private orderView: OrderView;
    private cartTemplate: HTMLTemplateElement;
    private template: HTMLTemplateElement;
    private model: CartModel;

    constructor(modalId: string, contentTemplateId: string, model: CartModel, orderModel: OrderModel) {
        super(`#${modalId}`, '.modal__close'); // Вызываем конструктор ModalBase
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderView = new OrderView('modal-container', 'order', orderModel);
        this.cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        this.template = document.querySelector('#card-basket') as HTMLTemplateElement;
        this.model = model;
    }

    open(): void {
        super.open(); // Используем метод open из ModalBase
        const cartClone = document.importNode(this.cartTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(cartClone);
        this.renderBasketItems();
        const checkoutButton = this.modal.querySelector('.basket__button') as HTMLElement;
        checkoutButton.addEventListener('click', () => this.orderView.open(this.model.getTotalPrice()));
    }

    renderBasketItems(): void {
        const basketList = this.modal.querySelector('.basket__list') as HTMLElement;
        const basketPrice = this.modal.querySelector('.basket__price') as HTMLElement;
        const checkoutButton = this.modal.querySelector('.basket__button') as HTMLButtonElement;

        if (!basketList || !basketPrice || !checkoutButton) {
            console.error('Элементы корзины не найдены');
            return;
        }

        basketList.innerHTML = '';
        let totalPrice = 0;

        if (this.model.items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            basketList.appendChild(emptyMessage);
            checkoutButton.disabled = true;
        } else {
            this.model.items.forEach((item, index) => {
                const basketItem = this.createBasketItem(item, index + 1);
                basketList.appendChild(basketItem);
                totalPrice += item.price;
            });
            checkoutButton.disabled = false;
        }

        basketPrice.textContent = `${totalPrice} синапсов`;
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
        deleteButton.addEventListener('click', () => this.model.removeBasketItem(item.id));
        return clone;
    }
}