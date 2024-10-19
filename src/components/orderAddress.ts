import {ContactsModal} from "./contacts";
import {OrderModel} from "./order";

export class OrderView {
    private orderModal: HTMLElement;
    private orderContent: HTMLElement;
    private model: OrderModel;

    constructor(modalId: string, contentTemplateId: string, model: OrderModel) {
        this.orderModal = document.querySelector('.modal') as HTMLElement;
        this.orderContent = this.orderModal.querySelector('.modal__content') as HTMLElement;
        this.model = model;
        this.model.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        const orderClone = document.importNode(this.model.orderTemplate.content, true);
        this.orderContent.innerHTML = '';
        this.orderContent.appendChild(orderClone);
        this.orderModal.classList.add('modal_active');
        this.setupPaymentButtons();
        this.setupAddressField();
        const onlineButton = this.model.modal.querySelector('button[name="card"]') as HTMLButtonElement;
        onlineButton.classList.add('button_alt-active');
        this.setupNextButton(totalPrice);
    }

    close(): void {
        this.model.close();
    }

    setupPaymentButtons(): void {
        const paymentButtons = this.model.modal.querySelectorAll('.order__buttons .button_alt');
        paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                (event.target as HTMLElement).classList.add('button_alt-active');
            });
        });
    }

    setupAddressField(): void {
        const addressField = this.model.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.model.modal.querySelector('.order__button') as HTMLButtonElement;
        const formErrors = this.model.modal.querySelector('.form__errors') as HTMLElement;

        addressField.addEventListener('input', () => {
            this.model.validateAddressField(addressField, nextButton, formErrors);
        });
    }

    setupNextButton(totalPrice: number): void {
        const nextButton = this.model.modal.querySelector('.order__button') as HTMLButtonElement;
        const addressField = this.model.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = this.model.modal.querySelector('.form__errors') as HTMLElement;

        nextButton.addEventListener('click', () => {
            if (this.model.validateAddressField(addressField, nextButton, formErrors)) {
                this.close();
                new ContactsModal('modal-container', 'contacts').open(totalPrice);
            }
        });
    }
}