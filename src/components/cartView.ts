import {CartItem, ICart} from "../types";
import {EventEmitter} from "./base/events";

export class CartView {
    private contentTemplate: HTMLTemplateElement;
    private readonly onCheckout: (totalPrice: number) => void;
    private readonly model: ICart;
    private basketList: HTMLElement | null = null;
    private basketPrice: HTMLElement | null = null;
    private checkoutButton: HTMLButtonElement | null = null;
    private readonly basketCounter: HTMLElement;

    constructor(
        contentTemplateId: string,
        model: ICart,
        onCheckout: (totalPrice: number) => void,
        private eventEmitter: EventEmitter
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.onCheckout = onCheckout;
        this.model = model;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

        // Подписка на события
        this.eventEmitter.on<{ selectedProductsCount: number }>('productToggled', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });
        this.eventEmitter.on<{ selectedProductsCount: number }>('productRemoved', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });
        this.eventEmitter.on<{ selectedProductsCount: number }>('basketItemRemoved', ({selectedProductsCount}) => {
            this.updateBasketCounter(selectedProductsCount);
        });
    }

    render(): HTMLElement {
        const cartClone = document.importNode(this.contentTemplate.content, true);
        const content = document.createElement('modal__content');
        content.appendChild(cartClone);
        this.basketList = content.querySelector('.basket__list');
        this.basketPrice = content.querySelector('.basket__price');
        this.checkoutButton = content.querySelector('.basket__button');
        this.renderBasketItems();
        this.checkoutButton.addEventListener('click', () => this.onCheckout(this.model.getTotalPrice()));
        return content;
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

    updateBasketCounter(selectedProductsCount: number): void {
        if (this.basketCounter && typeof selectedProductsCount === 'number') {
            this.basketCounter.textContent = selectedProductsCount.toString();
        }
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