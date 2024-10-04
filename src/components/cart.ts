import {CartModal} from "../types";

export class Modal implements CartModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    items: any[] = [];  // Массив товаров в корзине

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(): void {
        // Клонируем содержимое шаблона каждый раз при открытии модального окна
        const content = this.contentTemplate.content.cloneNode(true) as HTMLElement;
        this.modal.querySelector('.modal__content')!.innerHTML = '';
        this.modal.querySelector('.modal__content')!.appendChild(content);
        this.modal.classList.add('modal_active');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }
}