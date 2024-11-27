import {EventEmitter} from "./base/events";

export class SuccessModal {
    private successElement: HTMLElement;
    private successDescription: HTMLElement | null;
    closeButton: HTMLButtonElement | null;
    private eventEmitter: EventEmitter;

    constructor(contentTemplateId: string, eventEmitter: EventEmitter) {
        const successTemplate = document.getElementById('success') as HTMLTemplateElement;
        const successClone = document.importNode(successTemplate.content, true);
        this.successElement = successClone.firstElementChild as HTMLElement;
        this.successDescription = this.successElement.querySelector('.order-success__description');
        this.closeButton = this.successElement.querySelector('.order-success__close');
        this.eventEmitter = eventEmitter;
    }

    render(totalPrice: number): HTMLElement {
        this.successDescription.textContent = `Списано ${totalPrice} синапсов`;
        return this.successElement;
    }

    onSuccessClose(): void {
        this.eventEmitter.emit('orderSuccessClosed');
    }
}