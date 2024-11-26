import {EventEmitter} from "./base/events";

export class OrderView {
    private contentTemplate: HTMLTemplateElement;
    private orderElement: HTMLElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressField: HTMLInputElement;
    private nextButton: HTMLButtonElement;
    private formErrors: HTMLElement;
    private selectedPaymentMethod: string;
    public formSubmitHandler: (event: Event) => void;
    private readonly openContactsModal: () => void;
    private readonly onSuccess: () => void;
    private eventEmitter: EventEmitter;

    constructor(
        contentTemplateId: string,
        openContactsModal: () => void,
        onSuccess: () => void,
        formSubmitHandler: (event: Event) => void,
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
        this.onSuccess = onSuccess;
        this.formSubmitHandler = formSubmitHandler;
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
            this.eventEmitter.emit('validateAddress', {
                addressField: this.addressField,
                nextButton: this.nextButton,
                formErrors: this.formErrors
            });
        });
    }

    private setupNextButton(): void {
        this.nextButton.addEventListener('click', () => {
            this.eventEmitter.emit('validateAddress', {
                addressField: this.addressField,
                nextButton: this.nextButton,
                formErrors: this.formErrors
            });
            this.openContactsModal();
            this.onSuccess();
        });
    }
}