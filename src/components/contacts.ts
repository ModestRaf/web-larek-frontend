import {ModalBase} from "./modalBase";
import {IContactValidator} from "../types";
import {setupContactFields, setupFormSubmitHandler} from "../index";

export class ContactsView extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    contactValidator: IContactValidator;
    readonly onSuccess: () => void;
    readonly formSubmitHandler: (event: Event) => void;
    private form: HTMLFormElement | null = null;
    emailField: HTMLInputElement | null = null;
    phoneField: HTMLInputElement | null = null;
    payButton: HTMLButtonElement | null = null;
    formErrors: HTMLElement | null = null;

    constructor(
        modalId: string,
        contentTemplateId: string,
        contactValidator: IContactValidator,
        onSuccess: () => void,
        formSubmitHandler: (event: Event) => void
    ) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.contactValidator = contactValidator;
        this.onSuccess = onSuccess;
        this.formSubmitHandler = formSubmitHandler;
    }

    open(): void {
        super.open();
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(contactsClone);
        this.form = this.content.querySelector('form') as HTMLFormElement;
        if (this.form) {
            this.emailField = this.form.querySelector('input[name="email"]') as HTMLInputElement;
            this.phoneField = this.form.querySelector('input[name="phone"]') as HTMLInputElement;
            this.payButton = this.form.querySelector('.button') as HTMLButtonElement;
            this.formErrors = this.form.querySelector('.form__errors') as HTMLElement;
        } else {
            console.error('Элемент формы не найден');
        }

        setupContactFields(this);
        setupFormSubmitHandler(this);
    }

    getEmailValue(): string {
        return this.emailField?.value || '';
    }

    getPhoneValue(): string {
        return this.phoneField?.value || '';
    }
}