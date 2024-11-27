import {CartItem} from "../types";
import {EventEmitter} from "./base/events";

export class CartView {
    private contentTemplate: HTMLTemplateElement;
    private readonly onCheckout: (totalPrice: number) => void;
    private readonly basketList: HTMLElement;
    private readonly basketPrice: HTMLElement;
    private readonly checkoutButton: HTMLButtonElement;
    private readonly basketCounter: HTMLElement;
    private readonly content: HTMLElement;

    constructor(
        contentTemplateId: string,
        onCheckout: (totalPrice: number) => void,
        private eventEmitter: EventEmitter
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.onCheckout = onCheckout;
        const cartClone = document.importNode(this.contentTemplate.content, true);
        this.content = document.createElement('modal__content');
        this.content.appendChild(cartClone);
        this.basketList = this.content.querySelector('.basket__list') as HTMLElement;
        this.basketPrice = this.content.querySelector('.basket__price') as HTMLElement;
        this.checkoutButton = this.content.querySelector('.basket__button') as HTMLButtonElement;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.checkoutButton.addEventListener('click', () => this.onCheckout(this.getTotalPrice()));
    }

    render(): HTMLElement {
        this.renderBasketItems();
        return this.content;
    }

    update(): void {
        this.renderBasketItems();
    }

    setItems(items: HTMLElement[]): void {
        this.basketList.innerHTML = '';
        items.forEach(item => this.basketList.appendChild(item));
    }

    renderBasketItems(): void {
        this.basketList.innerHTML = '';
        if (this.getSelectedProductsCount() === 0) {
            this.renderEmptyCart();
        } else {
            this.renderItems();
        }
        this.basketPrice.textContent = `${this.getTotalPrice()} синапсов`;
    }

    updateBasketCounter(selectedProductsCount: number): void {
        if (typeof selectedProductsCount === 'number') {
            this.basketCounter.textContent = selectedProductsCount.toString();
        }
    }

    private renderEmptyCart(): void {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        this.basketList.appendChild(emptyMessage);
        this.checkoutButton.disabled = true;
    }

    private renderItems(): void {
        this.eventEmitter.emit('cart:getItems', (items: CartItem[]) => {
            items.forEach((item, index) => {
                const basketItem = new BasketItemView(item, index + 1, this.eventEmitter, this.update.bind(this));
                this.basketList.appendChild(basketItem.render());
            });
            this.checkoutButton.disabled = false;
        });
    }

    private getTotalPrice(): number {
        let totalPrice = 0;
        this.eventEmitter.emit('cart:getTotalPrice', (price: number) => {
            totalPrice = price;
        });
        return totalPrice;
    }

    private getSelectedProductsCount(): number {
        let count = 0;
        this.eventEmitter.emit('cart:getSelectedProductsCount', (selectedCount: number) => {
            count = selectedCount;
        });
        return count;
    }
}

export class BasketItemView {
    private item: CartItem;
    private index: number;
    private readonly updateCart: () => void;
    private template: HTMLTemplateElement;

    constructor(item: CartItem, index: number, private eventEmitter: EventEmitter, updateCart: () => void) {
        this.item = item;
        this.index = index;
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
            this.eventEmitter.emit<{ itemId: string }>('removeBasketItem', {itemId: this.item.id});
            this.updateCart();
        });
        return clone;
    }
}