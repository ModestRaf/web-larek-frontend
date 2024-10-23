import {ModalBase} from "./modalBase";

export class SuccessModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private successTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
    }

    open(totalPrice: number): void {
        console.log('Открытие SuccessModal с суммой:', totalPrice); // Лог для проверки
        super.open();
        const successClone = document.importNode(this.successTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(successClone);
        const successDescription = this.modal.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${totalPrice} синапсов`;
        const closeButton = this.modal.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.close();
            this.onSuccessClose();
        });
    }

    private onSuccessClose(): void {
        const event = new CustomEvent('orderSuccessClosed', {bubbles: true});
        this.modal.dispatchEvent(event);
    }
}