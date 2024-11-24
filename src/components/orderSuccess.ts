import {ModalBase} from "./modalBase";
export class SuccessModal {
    private contentTemplate: HTMLTemplateElement;
    private successTemplate: HTMLTemplateElement;

    constructor(contentTemplateId: string) {
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
    }

    open(modalBase: ModalBase, totalPrice: number): void {
        console.log('Открытие SuccessModal с суммой:', totalPrice); // Лог для проверки
        const successClone = document.importNode(this.successTemplate.content, true);
        const successElement = successClone.firstElementChild as HTMLElement; // Преобразуем DocumentFragment в HTMLElement
        const successDescription = successElement.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${totalPrice} синапсов`;
        const closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            modalBase.close();
            this.onSuccessClose();
        });
        modalBase.open(undefined, successElement);
    }

    private onSuccessClose(): void {
        const event = new CustomEvent('orderSuccessClosed', {bubbles: true});
        document.dispatchEvent(event);
    }
}