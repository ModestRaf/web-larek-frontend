import {ModalBase} from "./modalBase";
import {IContactValidator} from "../types";
import {setupContactFields, setupFormSubmitHandler} from "../index";

export class ContactsModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    contactValidator: IContactValidator; // Используем интерфейс
    readonly onSuccess: () => void; // Функция, вызываемая при успешной отправке формы
    readonly formSubmitHandler: (event: Event) => void;
    emailField: HTMLInputElement | null = null;
    phoneField: HTMLInputElement | null = null;
    payButton: HTMLButtonElement | null = null;
    formErrors: HTMLElement | null = null;

    constructor(
        modalId: string,
        contentTemplateId: string,
        contactValidator: IContactValidator, // Передаем объект, реализующий интерфейс
        onSuccess: () => void, // Передаем функцию onSuccess
        formSubmitHandler: (event: Event) => void
    ) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.contactValidator = contactValidator; // Присваиваем объект, реализующий интерфейс
        this.onSuccess = onSuccess; // Присваиваем функцию onSuccess
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

        // Устанавливаем обработчики событий
        setupContactFields(this);
        setupFormSubmitHandler(this);
    }
}