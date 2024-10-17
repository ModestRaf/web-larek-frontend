import {CartItem, CartModal} from "../types";
import {OrderModal} from "./order";
import {ProductList} from "./larekApi";

export class Modal implements CartModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    items: CartItem[] = [];  // Массив товаров в корзине
    private productList: ProductList | null = null; // Добавляем ссылку на ProductList
    private orderModal: OrderModal; // Добавляем экземпляр OrderModal
    private cartModal: HTMLElement;
    private cartContent: HTMLElement;
    private cartTemplate: HTMLTemplateElement;
    private template: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.orderModal = new OrderModal('modal-container', 'order');
        this.cartModal = document.querySelector('.modal') as HTMLElement;
        this.cartContent = this.cartModal.querySelector('.modal__content') as HTMLElement;
        this.cartTemplate = document.getElementById('basket') as HTMLTemplateElement;
        this.template = document.getElementById('card-basket') as HTMLTemplateElement;
        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    setProductList(productList: ProductList): void {
        this.productList = productList;
    }

    open(): void {
        // Получаем элементы для модального окна корзины
        const cartClone = document.importNode(this.cartTemplate.content, true);
        // Очищаем и обновляем содержимое модального окна корзины
        this.cartContent.innerHTML = '';
        this.cartContent.appendChild(cartClone);
        // Отображаем модальное окно корзины
        this.cartModal.classList.add('modal_active');
        // Рендерим товары в корзине
        this.renderBasketItems();
        // Добавляем обработчик событий на кнопку "Оформить"
        const checkoutButton = this.cartModal.querySelector('.basket__button') as HTMLElement;
        checkoutButton.addEventListener('click', () => this.orderModal.open(this.getTotalPrice()));
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    renderBasketItems(): void {
        const basketList = this.modal.querySelector('.basket__list') as HTMLElement;
        const basketPrice = this.modal.querySelector('.basket__price') as HTMLElement;
        const checkoutButton = this.modal.querySelector('.basket__button') as HTMLButtonElement;
        // Проверяем, существуют ли элементы перед их использованием
        if (!basketList || !basketPrice || !checkoutButton) {
            console.error('Элементы корзины не найдены');
            return;
        }
        // Очищаем список товаров в корзине
        basketList.innerHTML = '';
        // Считаем общую стоимость товаров в корзине
        let totalPrice = 0;
        // Рендерим каждый товар в корзине
        if (this.items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            basketList.appendChild(emptyMessage);
            checkoutButton.disabled = true; // Делаем кнопку "Оформить" неактивной
        } else {
            this.items.forEach((item, index) => {
                const basketItem = this.createBasketItem(item, index + 1);
                basketList.appendChild(basketItem);
                totalPrice += item.price;
            });
            checkoutButton.disabled = false; // Делаем кнопку "Оформить" активной
        }
        // Обновляем общую стоимость в корзине
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
        // Добавляем обработчик событий на кнопку удаления товара
        deleteButton.addEventListener('click', () => {
            this.removeBasketItem(item.id);
        });
        return clone;
    }

    removeBasketItem(itemId: string): void {
        // Удаляем товар из массива товаров в корзине
        this.items = this.items.filter(item => item.id !== itemId);
        // Обновляем список товаров в корзине
        this.renderBasketItems();
        // Обновляем счетчик корзины
        if (this.productList) {
            this.productList.removeProductFromCart(itemId);
        }
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
}