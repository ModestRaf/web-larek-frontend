import {ProductList} from "./larekApi";
import {Api} from "./base/api";
import {API_URL} from "../utils/constants";
import {Modal} from "./cart";

export class SuccessModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private readonly totalPrice: number;
    private successModal: HTMLElement;
    private successContent: HTMLElement;
    private successTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string, totalPrice: number) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.totalPrice = totalPrice;
        this.successModal = document.querySelector('.modal') as HTMLElement;
        this.successContent = this.successModal.querySelector('.modal__content') as HTMLElement;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(): void {
        // Получаем элементы для модального окна успешного заказа
        const successClone = document.importNode(this.successTemplate.content, true);
        // Очищаем и обновляем содержимое модального окна успешного заказа
        this.successContent.innerHTML = '';
        this.successContent.appendChild(successClone);
        // Отображаем модальное окно успешного заказа
        this.successModal.classList.add('modal_active');
        // Обновляем текст с суммарной стоимостью
        const successDescription = this.successModal.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${this.totalPrice} синапсов`;
        // Добавляем обработчик событий для кнопки "order-success__close"
        const closeButton = this.successModal.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.close(); // Закрываем текущее модальное окно
            this.clearBasket(); // Очищаем корзину
        });
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    clearBasket(): void {
        const productList = new ProductList(
            new Api(API_URL),
            'gallery',
            'card-catalog',
            '.modal',             // popupSelector
            'card-preview',       // popupTemplateId
            '.modal__close',      // closeSelector
            new Modal('modal-container', 'basket')
        );
        productList.products.forEach(product => {
            product.selected = false;
        });
        productList.updateBasketCounter();
        productList.saveSelectedToStorage();
        productList.renderBasketItems();
    }
}