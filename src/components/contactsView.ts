import {IContactValidator, IOrderModel} from "../types";
import {EventEmitter} from "./base/events";

export class ContactsView {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    contactValidator: IContactValidator;
    readonly onSuccess: () => void;
    readonly formSubmitHandler: (event: Event) => void;
    form: HTMLFormElement;
    emailField: HTMLInputElement;
    phoneField: HTMLInputElement;
    payButton: HTMLButtonElement;
    formErrors: HTMLElement;
    private model: IOrderModel;
    private eventEmitter: EventEmitter;
    private content: HTMLElement;

    constructor(
        contentTemplateId: string,
        contactValidator: IContactValidator,
        onSuccess: () => void,
        formSubmitHandler: (event: Event) => void,
        model: IOrderModel,
        eventEmitter: EventEmitter
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.contactValidator = contactValidator;
        this.onSuccess = onSuccess;
        this.formSubmitHandler = formSubmitHandler;
        this.model = model;
        this.eventEmitter = eventEmitter;
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.content = document.createElement('div');
        this.content.appendChild(contactsClone);
        this.form = this.content.querySelector('form') as HTMLFormElement;
        this.emailField = this.form.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneField = this.form.querySelector('input[name="phone"]') as HTMLInputElement;
        this.payButton = this.form.querySelector('.button') as HTMLButtonElement;
        this.formErrors = this.form.querySelector('.form__errors') as HTMLElement;
        this.setupFormHandlers();
    }

    private checkFields(): void {
        const isValid = this.contactValidator.validateContactFields(
            this.emailField,
            this.phoneField,
            this.payButton,
            this.formErrors
        );

        if (isValid) {
            this.payButton.removeAttribute('disabled');
            this.model.setEmail(this.emailField.value.trim());
            this.model.setPhone(this.phoneField.value.trim());
        } else {
            this.payButton.setAttribute('disabled', 'true');
        }
    }

    private setupFormHandlers(): void {
        this.emailField.addEventListener('input', this.checkFields.bind(this));
        this.phoneField.addEventListener('input', this.checkFields.bind(this));
        this.form.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            if (this.contactValidator.validateContactFields(
                this.emailField,
                this.phoneField,
                this.payButton,
                this.formErrors
            )) {
                this.model.setEmail(this.emailField.value.trim());
                this.model.setPhone(this.phoneField.value.trim());
                this.formSubmitHandler(event);
                this.onSuccess();
            }
        });
    }

    render(): HTMLElement {
        return this.content;
    }

    openModal(): void {
        const content = this.render();
        this.eventEmitter.emit('openModal', content);
    }
}