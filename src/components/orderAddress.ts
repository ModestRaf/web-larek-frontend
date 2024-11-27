import {EventEmitter} from "./base/events";

export class OrderView {
    private contentTemplate: HTMLTemplateElement;
    private orderElement: HTMLElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressField: HTMLInputElement;
    private nextButton: HTMLButtonElement;
    private formErrors: HTMLElement;
    private selectedPaymentMethod: string;
    private readonly openContactsModal: () => void;
    private eventEmitter: EventEmitter;

    constructor(
        contentTemplateId: string,
        openContactsModal: () => void,
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
        this.openContactsModal = openContactsModal;
        this.eventEmitter = eventEmitter;
        this.setupPaymentButtons();
        this.setupAddressField();
        this.setupNextButton();
    }

    render(): HTMLElement {
        return this.orderElement;
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
            this.validateAddress(this.addressField.value, this.nextButton, this.formErrors);
        });
    }

    private setupNextButton(): void {
        this.nextButton.addEventListener('click', () => {
            this.validateAddress(this.addressField.value, this.nextButton, this.formErrors);
            this.openContactsModal();
        });
    }

    validateAddress(address: string, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean {
        const isValid = address.trim() !== '';
        if (isValid) {
            formErrors.textContent = '';
            formErrors.classList.remove('form__errors_visible');
            nextButton.disabled = false;
        } else {
            formErrors.textContent = 'Необходимо указать адрес доставки';
            formErrors.classList.add('form__errors_visible');
            nextButton.disabled = true;
        }
        return isValid;
    }
}