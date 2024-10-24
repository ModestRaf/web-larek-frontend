import {ModalBase} from "./modalBase";
import {IContactValidator} from "../types";

export class ContactsModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    private contactValidator: IContactValidator; // Используем интерфейс
    private readonly onSuccess: () => void; // Функция, вызываемая при успешной отправке формы
    private readonly formSubmitHandler: (event: Event) => void;
    private emailField: HTMLInputElement | null = null;
    private phoneField: HTMLInputElement | null = null;
    private payButton: HTMLButtonElement | null = null;
    private formErrors: HTMLElement | null = null;

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

        this.setupContactFields();
        this.setupFormSubmitHandler();
    }

    setupContactFields(): void {
        const checkFields = () => {
            this.contactValidator.validateContactFields(this.emailField, this.phoneField, this.payButton, this.formErrors);
        };
        this.emailField.addEventListener('input', checkFields);
        this.phoneField.addEventListener('input', checkFields);
    }

    setupFormSubmitHandler(): void {
        const form = this.modal.querySelector('form[name="contacts"]');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault(); // Предотвращаем стандартное поведение формы

                if (this.emailField && this.phoneField) {
                    const isValid = this.contactValidator.validateContactFields(this.emailField, this.phoneField, this.payButton, this.formErrors);
                    if (isValid) {
                        this.formSubmitHandler(event); // Вызываем обработчик отправки формы
                        this.onSuccess(); // Вызываем функцию успеха
                    } else {
                        console.error('Форма не прошла валидацию');
                    }
                }
            });
        } else {
            console.error('Форма не найдена');
        }
    }
}