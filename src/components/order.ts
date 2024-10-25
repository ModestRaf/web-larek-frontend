export class Order {
    modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    orderTemplate: HTMLTemplateElement;
    private paymentMethod: string;
    private address: string;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.paymentMethod = 'card'; // Устанавливаем значение по умолчанию
        this.address = '';
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

    getPaymentMethod(): string {
        return this.paymentMethod;
    }

    getAddress(): string {
        return this.address;
    }
}