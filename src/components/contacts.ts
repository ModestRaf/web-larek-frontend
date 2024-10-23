import {SuccessModal} from "./orderSuccess";
import {ModalBase} from "./modalBase";
import {Order} from "./order";

export class ContactsModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    private order: Order;
    private successModal: SuccessModal;
    public formSubmitHandler: (event: Event) => void;

    constructor(modalId: string, contentTemplateId: string, order: Order, successModal: SuccessModal, formSubmitHandler: (event: Event) => void) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.order = order;
        this.successModal = successModal;
        this.formSubmitHandler = formSubmitHandler;
    }

    open(totalPrice: number): void {
        super.open(); // Используем метод open из ModalBase
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(contactsClone);
        this.setupContactFields();
        this.setupFormSubmitHandler();
    }

    setupContactFields(): void {
        const emailField = this.modal.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneField = this.modal.querySelector('input[name="phone"]') as HTMLInputElement;
        const payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;

        const checkFields = () => {
            this.order.validateContactFields(emailField, phoneField, payButton, formErrors);
        };

        emailField.addEventListener('input', checkFields);
        phoneField.addEventListener('input', checkFields);
    }

    setupFormSubmitHandler(): void {
        const form = document.querySelector('form[name="contacts"]');
        if (form) {
            form.addEventListener('submit', this.formSubmitHandler);
        } else {
            console.error('Форма не найдена');
        }
    }
}