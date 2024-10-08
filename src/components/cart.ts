import {CartItem, CartModal} from "../types";
import {API_URL} from "../utils/constants";
import {Api} from "./base/api";
import {ProductList} from "../index";

export class Modal implements CartModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    items: CartItem[] = [];  // Массив товаров в корзине
    private productList: ProductList | null = null; // Добавляем ссылку на ProductList

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    setProductList(productList: ProductList): void {
        this.productList = productList;
    }

    open(): void {
        // Получаем элементы для модального окна корзины
        const cartModal = document.querySelector('.modal') as HTMLElement;
        const cartContent = cartModal.querySelector('.modal__content') as HTMLElement;
        const cartTemplate = document.getElementById('basket') as HTMLTemplateElement;
        const cartClone = document.importNode(cartTemplate.content, true);

        // Очищаем и обновляем содержимое модального окна корзины
        cartContent.innerHTML = '';
        cartContent.appendChild(cartClone);

        // Отображаем модальное окно корзины
        cartModal.classList.add('modal_active');

        // Рендерим товары в корзине
        this.renderBasketItems();
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    renderBasketItems(): void {
        const basketList = this.modal.querySelector('.basket__list') as HTMLElement;
        const basketPrice = this.modal.querySelector('.basket__price') as HTMLElement;

        // Проверяем, существуют ли элементы перед их использованием
        if (!basketList || !basketPrice) {
            console.error('Элементы корзины не найдены');
            return;
        }

        // Очищаем список товаров в корзине
        basketList.innerHTML = '';

        // Считаем общую стоимость товаров в корзине
        let totalPrice = 0;

        // Рендерим каждый товар в корзине
        this.items.forEach((item, index) => {
            const basketItem = this.createBasketItem(item, index + 1);
            basketList.appendChild(basketItem);
            totalPrice += item.price;
        });

        // Обновляем общую стоимость в корзине
        basketPrice.textContent = `${totalPrice} синапсов`;
    }

    createBasketItem(item: CartItem, index: number): HTMLElement {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as HTMLElement;

        const itemIndex = clone.querySelector('.basket__item-index') as HTMLElement;
        const itemTitle = clone.querySelector('.card__title') as HTMLElement;
        const itemPrice = clone.querySelector('.card__price') as HTMLElement;
        const deleteButton = clone.querySelector('.basket__item-delete') as HTMLElement;

        itemIndex.textContent = index.toString();
        itemTitle.textContent = item.title;
        itemPrice.textContent = `${item.price} синапсов`;

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

        // Обновляем счетчик корзины в ProductList
        if (this.productList) {
            this.productList.removeProductFromCart(itemId);
        }
    }
}