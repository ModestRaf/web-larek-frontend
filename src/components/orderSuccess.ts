import {ModalBase} from "./modalBase";

export class SuccessModal extends ModalBase {
    private contentTemplate: HTMLTemplateElement;
    private readonly totalPrice: number;
    private successTemplate: HTMLTemplateElement;

    constructor(modalId: string, contentTemplateId: string, totalPrice: number) {
        super(`#${modalId}`, '.modal__close');
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.totalPrice = totalPrice;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
    }

    open(): void {
        super.open();
        const successClone = document.importNode(this.successTemplate.content, true);
        this.content.innerHTML = '';
        this.content.appendChild(successClone);
        this.modal.classList.add('modal_active');

        const successDescription = this.modal.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${this.totalPrice} синапсов`;

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