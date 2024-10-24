import {CartItem, ICart} from "../types";
import {ModalBase} from "./modalBase";

export class CartView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private readonly onCheckout: (totalPrice: number) => void; // Коллбек для обработки заказа
    private cartTemplate: HTMLTemplateElement;
    private template: HTMLTemplateElement;
    private model: ICart;

    constructor(
        modalId: string,
        contentTemplateId: string,
        model: ICart, // Принимаем абстракцию через интерфейс
        onCheckout: (totalPrice: number) => void, // Передаем функцию для обработки
    ) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.onCheckout = onCheckout;
        this.cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        this.template = document.querySelector('#card-basket') as HTMLTemplateElement;
        this.model = model; // Используем интерфейс ICart
    }

    open(): void {
        super.open();
        const cartClone = document.importNode(this.cartTemplate.content, true);
        this.content.innerHTML = '';  // Очищаем содержимое перед добавлением
        this.content.appendChild(cartClone);  // Добавляем клонированный шаблон
        this.renderBasketItems();  // Рендерим список товаров в корзине
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
            console.error('Элементы корзины не найдены');
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
        // Используем метод интерфейса для удаления товара
        deleteButton.addEventListener('click', () => this.model.removeBasketItem(item.id));

        return clone;
    }
}