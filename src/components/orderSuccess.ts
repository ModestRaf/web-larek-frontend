import {EventEmitter} from "./base/events";

export class SuccessModal {
    private contentTemplate: HTMLTemplateElement;
    private successTemplate: HTMLTemplateElement;
    private eventEmitter: EventEmitter;

    constructor(contentTemplateId: string, eventEmitter: EventEmitter) {
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
        this.eventEmitter = eventEmitter;
    }

    render(totalPrice: number): HTMLElement {
        const successClone = document.importNode(this.successTemplate.content, true);
        const successElement = successClone.firstElementChild as HTMLElement; // Преобразуем DocumentFragment в HTMLElement
        const successDescription = successElement.querySelector('.order-success__description') as HTMLElement;
        if (successDescription) {
            successDescription.textContent = `Списано ${totalPrice} синапсов`;
        }
        const closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.onSuccessClose();
            });
        }
        const newPurchasesButton = successElement.querySelector('.order-success__new-purchases') as HTMLButtonElement;
        if (newPurchasesButton) {
            newPurchasesButton.addEventListener('click', () => {
                this.onSuccessClose();
            });
        }
        return successElement;
    }

    private onSuccessClose(): void {
        this.eventEmitter.emit('orderSuccessClosed');
    }
}