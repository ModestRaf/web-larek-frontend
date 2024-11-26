import {EventEmitter} from "./base/events";

export class Order {
    modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    orderTemplate: HTMLTemplateElement;
    private paymentMethod: string;
    private address: string;
    private email: string;
    private phone: string;
    private eventEmitter: EventEmitter;

    constructor(modalId: string, contentTemplateId: string, eventEmitter: EventEmitter) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.paymentMethod = 'card';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('setEmail', (data: { email: string }) => this.setEmail(data.email));
        this.eventEmitter.on('setPhone', (data: { phone: string }) => this.setPhone(data.phone));
        this.eventEmitter.on('setAddress', (data: { address: string }) => this.setAddress(data.address));
        this.eventEmitter.on('setPaymentMethod', (data: { method: string }) => this.setPaymentMethod(data.method));
        this.eventEmitter.on('validateAddress', (data: {
            addressField: HTMLInputElement,
            nextButton: HTMLButtonElement,
            formErrors: HTMLElement
        }) => {
            this.validateAddressField(data.addressField, data.nextButton, data.formErrors);
        });
        this.eventEmitter.on('validateContactFields', (data: {
            emailField: HTMLInputElement,
            phoneField: HTMLInputElement,
            payButton: HTMLButtonElement,
            formErrors: HTMLElement
        }) => {
            this.validateContactFields(data.emailField, data.phoneField, data.payButton, data.formErrors);
        });
    }

    validateAddressField(addressField: HTMLInputElement, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean {
        if (addressField.value.trim() === '') {
            formErrors.textContent = 'Необходимо указать адрес доставки';
            formErrors.classList.add('form__errors_visible');
            nextButton.disabled = true;
            return false;
        } else {
            formErrors.classList.remove('form__errors_visible');
            nextButton.disabled = false;
            return true;
        }
    }

    validateContactFields(emailField: HTMLInputElement, phoneField: HTMLInputElement, payButton: HTMLButtonElement, formErrors: HTMLElement): boolean {
        const emailValue = emailField.value.trim();
        const phoneValue = phoneField.value.trim();
        if (emailValue === '' && phoneValue === '') {
            formErrors.textContent = 'Необходимо ввести email и номер телефона';
            formErrors.classList.add('form__errors_visible');
            payButton.disabled = true;
            return false;
        } else if (emailValue === '') {
            formErrors.textContent = 'Необходимо ввести email';
            formErrors.classList.add('form__errors_visible');
            payButton.disabled = true;
            return false;
        } else if (phoneValue === '') {
            formErrors.textContent = 'Необходимо ввести номер телефона';
            formErrors.classList.add('form__errors_visible');
            payButton.disabled = true;
            return false;
        } else {
            formErrors.textContent = '';
            formErrors.classList.remove('form__errors_visible');
            payButton.disabled = false;
            return true;
        }
    }

    setPaymentMethod(method: string): void {
        this.paymentMethod = method;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    getPaymentMethod(): string {
        return this.paymentMethod;
    }

    getAddress(): string {
        return this.address;
    }

    getEmail(): string {
        return this.email;
    }

    getPhone(): string {
        return this.phone;
    }
}