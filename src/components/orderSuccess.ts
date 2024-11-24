import {EventEmitter} from "./base/events";

export class SuccessModal {
    private successElement: HTMLElement;
    private successDescription: HTMLElement | null;
    private closeButton: HTMLButtonElement | null;
    private eventEmitter: EventEmitter;

    constructor(contentTemplateId: string, eventEmitter: EventEmitter) {
        const successTemplate = document.getElementById('success') as HTMLTemplateElement;
        const successClone = document.importNode(successTemplate.content, true);
        this.successElement = successClone.firstElementChild as HTMLElement;
        this.successDescription = this.successElement.querySelector('.order-success__description');
        this.closeButton = this.successElement.querySelector('.order-success__close');
        this.eventEmitter = eventEmitter;

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.onSuccessClose();
            });
        }
    }

    render(totalPrice: number): HTMLElement {
        if (this.successDescription) {
            this.successDescription.textContent = `Списано ${totalPrice} синапсов`;
        }
        return this.successElement;
    }

    private onSuccessClose(): void {
        this.eventEmitter.emit('orderSuccessClosed');
    }
}