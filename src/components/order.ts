import {ContactsModal} from "./contacts";

export class OrderModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private orderModal: HTMLElement;
    private orderContent: HTMLElement;
    private orderTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderModal = document.querySelector('.modal') as HTMLElement;
        this.orderContent = this.orderModal.querySelector('.modal__content') as HTMLElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        const orderClone = document.importNode(this.orderTemplate.content, true);
        this.orderContent.innerHTML = '';
        this.orderContent.appendChild(orderClone);
        this.orderModal.classList.add('modal_active');
        this.setupPaymentButtons();
        this.setupAddressField();
        const onlineButton = this.modal.querySelector('button[name="card"]') as HTMLButtonElement;
        onlineButton.classList.add('button_alt-active');
        this.setupNextButton(totalPrice);
    }

    close(): void {
        this.modal.classList.remove('modal_active');
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
            this.validateAddressField(addressField, nextButton, formErrors);
        });
    }

    setupNextButton(totalPrice: number): void {
        const nextButton = this.modal.querySelector('.order__button') as HTMLButtonElement;
        const addressField = this.modal.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;

        nextButton.addEventListener('click', () => {
            if (this.validateAddressField(addressField, nextButton, formErrors)) {
                this.close();
                new ContactsModal('modal-container', 'contacts').open(totalPrice);
            }
        });
    }

    private validateAddressField(addressField: HTMLInputElement, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean {
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
}