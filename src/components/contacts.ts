import {SuccessModal} from "./orderSuccess";
import {ModalBase} from "./modalBase";
import {Order} from "./order";

export class ContactsModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    private order: Order;
    private successModal: SuccessModal;
    private readonly formSubmitHandler: (event: Event) => void;
    private emailField: HTMLInputElement | null = null;
    private phoneField: HTMLInputElement | null = null;
    private payButton: HTMLButtonElement | null = null;
    private formErrors: HTMLElement | null = null;

    constructor(modalId: string, contentTemplateId: string, order: Order, successModal: SuccessModal, formSubmitHandler: (event: Event) => void) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.order = order;
        this.successModal = successModal;
        this.formSubmitHandler = formSubmitHandler;
    }

    open(): void {
        super.open(); // Используем метод open из ModalBase
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(contactsClone);
        // Определяем статичные DOM-элементы после добавления шаблона в DOM
        this.emailField = this.modal.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneField = this.modal.querySelector('input[name="phone"]') as HTMLInputElement;
        this.payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        this.formErrors = this.modal.querySelector('.form__errors') as HTMLElement;

        this.setupContactFields();
        this.setupFormSubmitHandler();
    }

    setupContactFields(): void {
        const checkFields = () => {
            this.order.validateContactFields(this.emailField, this.phoneField, this.payButton, this.formErrors);
        };
        this.emailField.addEventListener('input', checkFields);
        this.phoneField.addEventListener('input', checkFields);
    }

    setupFormSubmitHandler(): void {
        const form = this.modal.querySelector('form[name="contacts"]');
        if (form) {
            form.addEventListener('submit', this.formSubmitHandler);
        } else {
            console.error('Форма не найдена');
        }
    }
}