import {SuccessModal} from "./orderSuccess";

export class ContactsModal {
    private modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    private contactsModal: HTMLElement;
    private contactsContent: HTMLElement;
    private contactsTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.contactsModal = document.querySelector('.modal') as HTMLElement;
        this.contactsContent = this.contactsModal.querySelector('.modal__content') as HTMLElement;
        this.contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
        this.modal.querySelector('.modal__close')?.addEventListener('click', () => this.close());
    }

    open(totalPrice: number): void {
        const contactsClone = document.importNode(this.contactsTemplate.content, true);
        this.contactsContent.innerHTML = '';
        this.contactsContent.appendChild(contactsClone);
        this.contactsModal.classList.add('modal_active');
        this.setupContactFields();
        this.setupPayButton(totalPrice);
    }

    close(): void {
        this.modal.classList.remove('modal_active');
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
            this.close();
            new SuccessModal('modal-container', 'success', totalPrice).open();
        });
    }
}