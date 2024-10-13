import {ProductList} from "../index";
import {API_URL} from "../utils/constants";
import {Modal} from "./cart";
import {Api} from "./base/api";

export class OrderModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        // Получаем элементы для модального окна заказа
        const orderModal = document.querySelector('.modal') as HTMLElement;
        const orderContent = orderModal.querySelector('.modal__content') as HTMLElement;
        const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
        const orderClone = document.importNode(orderTemplate.content, true);

        // Очищаем и обновляем содержимое модального окна заказа
        orderContent.innerHTML = '';
        orderContent.appendChild(orderClone);

        // Отображаем модальное окно заказа
        orderModal.classList.add('modal_active');

        // Добавляем обработчики событий для кнопок оплаты
        this.setupPaymentButtons();

        // Добавляем обработчик событий для поля address
        this.setupAddressField();

        // Устанавливаем класс button_alt-active по умолчанию для кнопки "Онлайн"
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
                // Убираем класс button_alt-active у всех кнопок
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));

                // Добавляем класс button_alt-active к нажатой кнопке
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

export class ContactsModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        // Получаем элементы для модального окна контактов
        const contactsModal = document.querySelector('.modal') as HTMLElement;
        const contactsContent = contactsModal.querySelector('.modal__content') as HTMLElement;
        const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
        const contactsClone = document.importNode(contactsTemplate.content, true);

        // Очищаем и обновляем содержимое модального окна контактов
        contactsContent.innerHTML = '';
        contactsContent.appendChild(contactsClone);

        // Отображаем модальное окно контактов
        contactsModal.classList.add('modal_active');

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

export class SuccessModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private totalPrice: number;

    constructor(modalId: string, contentTemplateId: string, totalPrice: number) {
        this.modal = document.getElementById(modalId) as HTMLElement;
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.totalPrice = totalPrice;

        // Добавляем обработчик событий на кнопку закрытия
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(): void {
        // Получаем элементы для модального окна успешного заказа
        const successModal = document.querySelector('.modal') as HTMLElement;
        const successContent = successModal.querySelector('.modal__content') as HTMLElement;
        const successTemplate = document.getElementById('success') as HTMLTemplateElement;
        const successClone = document.importNode(successTemplate.content, true);

        // Очищаем и обновляем содержимое модального окна успешного заказа
        successContent.innerHTML = '';
        successContent.appendChild(successClone);

        // Отображаем модальное окно успешного заказа
        successModal.classList.add('modal_active');

        // Обновляем текст с суммарной стоимостью
        const successDescription = successModal.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${this.totalPrice} синапсов`;

        // Добавляем обработчик событий для кнопки "order-success__close"
        const closeButton = successModal.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.close(); // Закрываем текущее модальное окно
            this.clearBasket(); // Очищаем корзину
        });
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    clearBasket(): void {
        const productList = new ProductList(new Api(API_URL), 'gallery', 'card-catalog', new Modal('modal-container', 'basket'));
        productList.products.forEach(product => {
            product.selected = false;
        });
        productList.updateBasketCounter();
        productList.saveSelectedToStorage();
        productList.renderBasketItems();
    }
}