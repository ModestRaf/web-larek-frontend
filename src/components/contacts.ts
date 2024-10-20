import {SuccessModal} from "./orderSuccess";
import {ModalBase} from "./modalBase";

export class ContactsModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    }

    open(totalPrice: number): void {
        super.open(); // Используем метод open из ModalBase
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(contactsClone);
        this.setupContactFields();
        this.setupPayButton(totalPrice);
    }

    setupContactFields(): void {
        const emailField = this.modal.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneField = this.modal.querySelector('input[name="phone"]') as HTMLInputElement;
        const payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        const formErrors = this.modal.querySelector('.form__errors') as HTMLElement;
        const checkFields = () => {
            const emailValue = emailField.value.trim();
            const phoneValue = phoneField.value.trim();
            if (emailValue === '' && phoneValue === '') {
                formErrors.textContent = 'Необходимо ввести email и номер телефона';
                formErrors.classList.add('form__errors_visible');
                payButton.disabled = true;
            } else if (emailValue === '') {
                formErrors.textContent = 'Необходимо ввести email';
                formErrors.classList.add('form__errors_visible');
                payButton.disabled = true;
            } else if (phoneValue === '') {
                formErrors.textContent = 'Необходимо ввести номер телефона';
                formErrors.classList.add('form__errors_visible');
                payButton.disabled = true;
            } else {
                formErrors.textContent = '';
                formErrors.classList.remove('form__errors_visible');
                payButton.disabled = false;
            }
        };
        emailField.addEventListener('input', checkFields);
        phoneField.addEventListener('input', checkFields);
    }

    setupPayButton(totalPrice: number): void {
        const payButton = this.modal.querySelector('.button') as HTMLButtonElement;
        payButton.addEventListener('click', () => {
            this.close(); // Используем метод close из ModalBase
            new SuccessModal('modal-container', 'success', totalPrice).open();
        });
    }
}