import {ContactsModal} from "./contacts";

export class OrderModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private orderModal: HTMLElement;
    private orderContent: HTMLElement;
    private orderTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.orderModal = document.querySelector('.modal') as HTMLElement;
        this.orderContent = this.orderModal.querySelector('.modal__content') as HTMLElement;
        this.orderTemplate = document.getElementById('order') as HTMLTemplateElement;
        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        // Получаем элементы для модального окна заказа
        const orderClone = document.importNode(this.orderTemplate.content, true);
        // Очищаем и обновляем содержимое модального окна заказа
        this.orderContent.innerHTML = '';
        this.orderContent.appendChild(orderClone);
        // Отображаем модальное окно заказа
        this.orderModal.classList.add('modal_active');
        // Добавляем обработчики событий для кнопок оплаты
        this.setupPaymentButtons();
        // Добавляем обработчик событий для поля address
        this.setupAddressField();
        const onlineButton = this.modal.querySelector('button[name="card"]') as HTMLButtonElement;
        onlineButton.classList.add('button_alt-active');
        // Добавляем обработчик событий для кнопки "Далее"
        this.setupNextButton(totalPrice);
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    setupPaymentButtons(): void {
        const paymentButtons = this.modal.querySelectorAll('.order__buttons .button_alt');
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
            });
        });
    }

    setupAddressField(): void {
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        addressField.addEventListener('input', () => {
            // Проверяем, пустое ли поле address
            if (addressField.value.trim() === '') {
                formErrors.textContent = 'Необходимо указать адрес доставки';
                formErrors.style.display = 'block';
                nextButton.disabled = true; // Делаем кнопку "Далее" неактивной
            } else {
                formErrors.style.display = 'none';
                nextButton.disabled = false; // Делаем кнопку "Далее" активной
            }
        });
    }

    setupNextButton(totalPrice: number): void {
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        nextButton.addEventListener('click', () => {
            // Проверяем, заполнено ли поле address
            if (addressField.value.trim() === '') {
                formErrors.textContent = 'Необходимо указать адрес доставки';
                formErrors.style.display = 'block';
                nextButton.disabled = true; // Делаем кнопку "Далее" неактивной
            } else {
                formErrors.style.display = 'none';
                nextButton.disabled = false; // Делаем кнопку "Далее" активной
                this.close(); // Закрываем текущее модальное окно
                new ContactsModal('modal-container', 'contacts').open(totalPrice); // Открываем модальное окно contacts
            }
        });
    }
}