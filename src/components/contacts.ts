import {SuccessModal} from "./orderSuccess";

export class ContactsModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private contactsModal: HTMLElement;
    private contactsContent: HTMLElement;
    private contactsTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.contactsModal = document.querySelector('.modal') as HTMLElement;
        this.contactsContent = this.contactsModal.querySelector('.modal__content') as HTMLElement;
        this.contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        // Получаем элементы для модального окна контактов
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        // Очищаем и обновляем содержимое модального окна контактов
        this.contactsContent.innerHTML = '';
        this.contactsContent.appendChild(contactsClone);
        // Отображаем модальное окно контактов
        this.contactsModal.classList.add('modal_active');
        // Добавляем обработчики событий для полей email и phone
        this.setupContactFields();
        // Добавляем обработчик событий для кнопки "Оплатить"
        this.setupPayButton(totalPrice);
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    setupContactFields(): void {
        const emailField = this.modal.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneField = this.modal.querySelector('input[name="phone"]') as HTMLInputElement;
        const payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        const checkFields = () => {
            if (emailField.value.trim() === '' && phoneField.value.trim() === '') {
                formErrors.textContent = 'Необходимо ввести email и номер телефона';
                formErrors.style.display = 'block';
                payButton.disabled = true; // Отключаем кнопку "Оплатить"
            } else if (emailField.value.trim() === '') {
                formErrors.textContent = 'Необходимо ввести email';
                formErrors.style.display = 'block';
                payButton.disabled = true; // Отключаем кнопку "Оплатить"
            } else if (phoneField.value.trim() === '') {
                formErrors.textContent = 'Необходимо ввести номер телефона';
                formErrors.style.display = 'block';
                payButton.disabled = true; // Отключаем кнопку "Оплатить"
            } else {
                formErrors.style.display = 'none';
                payButton.disabled = false; // Включаем кнопку "Оплатить"
            }
        };
        emailField.addEventListener('input', checkFields);
        phoneField.addEventListener('input', checkFields);
    }

    setupPayButton(totalPrice: number): void {
        const payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        payButton.addEventListener('click', () => {
            this.close(); // Закрываем текущее модальное окно
            new SuccessModal('modal-container', 'success', totalPrice).open(); // Открываем модальное окно success
        });
    }
}