import {CartItem, CartModal} from "../types";
import {CartModel} from "./cart";
import {OrderView} from "./orderAddress";
import {OrderModel} from "./order";

export class CartView implements CartModal {
    protected modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private orderView: OrderView;
    private cartModal: HTMLElement;
    private cartContent: HTMLElement;
    private cartTemplate: HTMLTemplateElement;
    private template: HTMLTemplateElement;
    private model: CartModel;

    constructor(modalId: string, contentTemplateId: string, model: CartModel, orderModel: OrderModel) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderView = new OrderView('modal-container', 'order', orderModel);
        this.cartModal = document.querySelector('.modal') as HTMLElement;
        this.cartContent = this.cartModal.querySelector('.modal__content') as HTMLElement;
        this.cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        this.template = document.querySelector('#card-basket') as HTMLTemplateElement;
        this.model = model;
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(): void {
        const cartClone = document.importNode(this.cartTemplate.content, true);
        this.cartContent.innerHTML = '';
        this.cartContent.appendChild(cartClone);
        this.cartModal.classList.add('modal_active');
        this.renderBasketItems();
        const checkoutButton = this.cartModal.querySelector('.basket__button') as HTMLElement;
        checkoutButton.addEventListener('click', () => this.orderView.open(this.model.getTotalPrice()));
    }

    close(): void {
        this.modal.classList.remove('modal_active');
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

    items: CartItem[];
}