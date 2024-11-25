import {IContactValidator, IOrderModel} from "../types";
import {setupContactFields, setupFormSubmitHandler} from "../index";
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
    }

    render(): HTMLElement {
        setupContactFields(this, this.model);
        setupFormSubmitHandler(this, this.model);
        return this.content;
    }

    openModal(): void {
        const content = this.render();
        this.eventEmitter.emit('openModal', content);
    }
}