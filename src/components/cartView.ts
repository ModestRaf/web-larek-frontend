import {CartItem, ICart} from "../types";
import {ModalBase} from "./modalBase";

export class CartView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private readonly onCheckout: (totalPrice: number) => void;
    private readonly model: ICart;
    private basketList: HTMLElement | null = null;
    private basketPrice: HTMLElement | null = null;
    private checkoutButton: HTMLButtonElement | null = null;

    constructor(
        modalId: string,
        contentTemplateId: string,
        model: ICart,
        onCheckout: (totalPrice: number) => void
    ) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.onCheckout = onCheckout;
        this.model = model;
    }

    open(): void {
        super.open();
        const cartClone = document.importNode(this.contentTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(cartClone);
        this.basketList = this.modal.querySelector('.basket__list');
        this.basketPrice = this.modal.querySelector('.basket__price');
        this.checkoutButton = this.modal.querySelector('.basket__button');
        if (!this.basketList || !this.basketPrice || !this.checkoutButton) {
            console.error('Basket elements not found');
            return;
        }
        this.renderBasketItems();
        this.checkoutButton.addEventListener('click', () => this.onCheckout(this.model.getTotalPrice()));
    }

    update(): void {
        this.renderBasketItems();
    }

    renderBasketItems(): void {
        if (!this.basketList || !this.basketPrice || !this.checkoutButton) {
            console.error('Basket elements not found');
            return;
        }
        this.basketList.innerHTML = '';
        if (this.model.items.length === 0) {
            this.renderEmptyCart();
        } else {
            this.renderItems();
        }
        this.basketPrice.textContent = `${this.model.getTotalPrice()} синапсов`;
    }

    private renderEmptyCart(): void {
        if (!this.basketList || !this.checkoutButton) {
            console.error('Basket elements not found');
            return;
        }
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        this.basketList.appendChild(emptyMessage);
        this.checkoutButton.disabled = true;
    }

    private renderItems(): void {
        if (!this.basketList || !this.checkoutButton) {
            console.error('Basket elements not found');
            return;
        }
        this.model.items.forEach((item, index) => {
            const basketItem = new BasketItemView(item, index + 1, this.model, this.update.bind(this));
            this.basketList.appendChild(basketItem.render());
        });
        this.checkoutButton.disabled = false;
    }
}

export class BasketItemView {
    private item: CartItem;
    private index: number;
    private model: ICart;
    private updateCart: () => void;
    private template: HTMLTemplateElement;

    constructor(item: CartItem, index: number, model: ICart, updateCart: () => void) {
        this.item = item;
        this.index = index;
        this.model = model;
        this.updateCart = updateCart;
        this.template = document.querySelector('#card-basket') as HTMLTemplateElement;
    }

    render(): HTMLElement {
        const clone = this.template.content.cloneNode(true) as HTMLElement;
        const itemIndex = clone.querySelector('.basket__item-index') as HTMLElement;
        const itemTitle = clone.querySelector('.card__title') as HTMLElement;
        const itemPrice = clone.querySelector('.card__price') as HTMLElement;
        const deleteButton = clone.querySelector('.basket__item-delete') as HTMLElement;
        itemIndex.textContent = this.index.toString();
        itemTitle.textContent = this.item.title;
        itemPrice.textContent = this.item.price === null ? 'Бесценно' : `${this.item.price} синапсов`;
        deleteButton.addEventListener('click', () => {
            this.model.removeBasketItem(this.item.id);
            this.updateCart();
        });
        return clone;
    }
}