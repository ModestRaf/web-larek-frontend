export class Order {
    modal: HTMLElement;
    private contentTemplate: HTMLTemplateElement;
    orderTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        this.modal = document.querySelector(`#${modalId}`) as HTMLElement;
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    validateAddressField(addressField: HTMLInputElement, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean {
        if (addressField.value.trim() === '') {
            formErrors.textContent = 'Необходимо указать адрес доставки';
            formErrors.classList.add('form__errors_visible');
            nextButton.disabled = true;
            return false;
        } else {
            formErrors.classList.remove('form__errors_visible');
            nextButton.disabled = false;
            return true;
        }
    }
}