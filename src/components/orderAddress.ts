import {EventEmitter} from "./base/events";

export class OrderView {
    private contentTemplate: HTMLTemplateElement;
    private orderElement: HTMLElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressField: HTMLInputElement;
    nextButton: HTMLButtonElement;
    formErrors: HTMLElement;
    private selectedPaymentMethod: string;
    private eventEmitter: EventEmitter;

    constructor(
        contentTemplateId: string,
        eventEmitter: EventEmitter
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        const orderClone = document.importNode(orderTemplate.content, true);
        this.orderElement = orderClone.firstElementChild as HTMLElement;
        this.paymentButtons = this.orderElement.querySelectorAll('.order__buttons .button_alt');
        this.addressField = this.orderElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.nextButton = this.orderElement.querySelector('.order__button') as HTMLButtonElement;
        this.formErrors = this.orderElement.querySelector('.form__errors') as HTMLElement;
        this.eventEmitter = eventEmitter;
        this.setupPaymentButtons();
        this.setupAddressField();
        this.setupNextButton();
    }

    render(): HTMLElement {
        return this.orderElement;
    }

    updateValidationState(isValid: boolean, error: string): void {
        this.formErrors.textContent = error;
        this.formErrors.classList.toggle('form__errors_visible', !!error);
        this.nextButton.disabled = !isValid;
    }

    private setupPaymentButtons(): void {
        this.paymentButtons.forEach(button => {
            if (button.getAttribute('name') === 'card') {
                button.classList.add('button_alt-active');
                this.selectedPaymentMethod = 'card';
                this.eventEmitter.emit('setPaymentMethod', {method: this.selectedPaymentMethod});
            }
            button.addEventListener('click', (event) => {
                const selectedButton = event.currentTarget as HTMLButtonElement;
                const paymentMethod = selectedButton.getAttribute('name');
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                selectedButton.classList.add('button_alt-active');
                this.selectedPaymentMethod = paymentMethod;
                this.eventEmitter.emit('setPaymentMethod', {method: this.selectedPaymentMethod});
            });
        });
    }

    private setupAddressField(): void {
        this.addressField.addEventListener('input', () => {
            this.eventEmitter.emit('setAddress', {address: this.addressField.value});
            this.eventEmitter.emit('validateAddress', {address: this.addressField.value});
        });
    }

    private setupNextButton(): void {
        this.nextButton.addEventListener('click', () => {
            this.eventEmitter.emit('validateAddress', {address: this.addressField.value});
            this.eventEmitter.emit('proceedToContacts');
        });
    }
}