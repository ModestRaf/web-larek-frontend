import {ContactsModal} from "./contacts";
import {Order} from "./order";
import {ModalBase} from "./modalBase";
import {SuccessModal} from "./orderSuccess";

export class OrderView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private orderTemplate: HTMLTemplateElement;
    private model: Order;
    private successModal: SuccessModal;
    private selectedPaymentMethod: string;
    public formSubmitHandler: (event: Event) => void; // Add formSubmitHandler

    constructor(modalId: string, contentTemplateId: string, model: Order, successModal: SuccessModal, formSubmitHandler: (event: Event) => void) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.model = model;
        this.successModal = successModal;
        this.selectedPaymentMethod = 'card';
        this.formSubmitHandler = formSubmitHandler; // Assign formSubmitHandler
    }

    open(totalPrice: number): void {
        super.open(totalPrice);
        const orderClone = document.importNode(this.orderTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(orderClone);
        this.setupPaymentButtons();
        this.setupAddressField();
        const onlineButton = this.modal.querySelector('button[name="card"]') as HTMLButtonElement;
        onlineButton.classList.add('button_alt-active');
        this.setupNextButton(totalPrice);
    }

    setupPaymentButtons(): void {
        const paymentButtons = this.modal.querySelectorAll('.order__buttons .button_alt');
        paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                const selectedButton = event.target as HTMLElement;
                selectedButton.classList.add('button_alt-active');
                this.selectedPaymentMethod = selectedButton.getAttribute('name');
                this.model.setPaymentMethod(this.selectedPaymentMethod); // Save payment method to model
            });
        });
    }

    setupAddressField(): void {
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        addressField.addEventListener('input', () => {
            this.model.validateAddressField(addressField, nextButton, formErrors);
            this.model.setAddress(addressField.value); // Save address to model
        });
    }

    setupNextButton(totalPrice: number): void {
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        nextButton.addEventListener('click', () => {
            if (this.model.validateAddressField(addressField, nextButton, formErrors)) {
                this.close();
                new ContactsModal('modal-container', 'contacts', this.model, this.successModal, this.formSubmitHandler).open(totalPrice);
            }
        });
    }

    getSelectedPaymentMethod(): string {
        return this.selectedPaymentMethod;
    }
}