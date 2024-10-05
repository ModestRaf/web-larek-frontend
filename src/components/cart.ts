import {CartItem, CartModal} from "../types";

export class Modal implements CartModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    items: CartItem[] = [];  // Массив товаров в корзине

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
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
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }
}