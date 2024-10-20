import {ContactsModal} from "./contacts";
import {Order} from "./order";
import {ModalBase} from "./modalBase";

export class OrderView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private orderTemplate: HTMLTemplateElement;
    private model: Order;

    constructor(modalId: string, contentTemplateId: string, model: Order) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.model = model;
    }

    open(totalPrice: number): void {
        super.open(totalPrice); // Используем метод open из ModalBase
        const orderClone = document.importNode(this.orderTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
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
                (event.target as HTMLElement).classList.add('button_alt-active');
            });
        });
    }

    setupAddressField(): void {
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        addressField.addEventListener('input', () => {
            this.model.validateAddressField(addressField, nextButton, formErrors);
        });
    }

    setupNextButton(totalPrice: number): void {
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        nextButton.addEventListener('click', () => {
            if (this.model.validateAddressField(addressField, nextButton, formErrors)) {
                this.close(); // Используем метод close из ModalBase
                new ContactsModal('modal-container', 'contacts').open(totalPrice);
            }
        });
    }
}