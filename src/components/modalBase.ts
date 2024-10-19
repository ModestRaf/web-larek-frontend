export class ModalBase {
    protected modal: HTMLElement;
    protected content: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(modalSelector: string, closeSelector: string) {
        this.modal = document.querySelector(modalSelector) as HTMLElement;
        this.content = this.modal.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.modal.querySelector(closeSelector);
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
    }

    open(totalPrice?: number): void {
        this.modal.classList.add('modal_active');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }
}