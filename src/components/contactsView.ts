import {EventEmitter} from "./base/events";

export class ContactsView {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    readonly onSuccess: () => void;
    readonly formSubmitHandler: (event: Event) => void;
    form: HTMLFormElement;
    emailField: HTMLInputElement;
    phoneField: HTMLInputElement;
    payButton: HTMLButtonElement;
    formErrors: HTMLElement;
    private eventEmitter: EventEmitter;
    private content: HTMLElement;

    constructor(
        contentTemplateId: string,
        onSuccess: () => void,
        formSubmitHandler: (event: Event) => void,
        eventEmitter: EventEmitter
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.onSuccess = onSuccess;
        this.formSubmitHandler = formSubmitHandler;
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
        this.eventEmitter.emit('validateContactFields', {
            emailField: this.emailField,
            phoneField: this.phoneField,
            payButton: this.payButton,
            formErrors: this.formErrors
        });
    }

    private setupFormHandlers(): void {
        this.emailField.addEventListener('input', this.checkFields.bind(this));
        this.phoneField.addEventListener('input', this.checkFields.bind(this));
        this.form.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.eventEmitter.emit('validateContactFields', {
                emailField: this.emailField,
                phoneField: this.phoneField,
                payButton: this.payButton,
                formErrors: this.formErrors
            });
            if (this.payButton.disabled) {
                return;
            }
            this.eventEmitter.emit('setEmail', {email: this.emailField.value.trim()});
            this.eventEmitter.emit('setPhone', {phone: this.phoneField.value.trim()});
            this.formSubmitHandler(event);
            this.onSuccess();
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