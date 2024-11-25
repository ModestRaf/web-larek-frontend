export class ModalBase {
    modal: HTMLElement;
    content: HTMLElement;
    protected closeButton: HTMLElement;
    constructor(modalSelector: string, closeSelector: string) {
        this.modal = document.querySelector(modalSelector) as HTMLElement;
        if (!this.modal) {
            return;
        }
        this.content = this.modal.querySelector('.modal__content') as HTMLElement;
        if (!this.content) {
            return;
        }
        this.closeButton = this.modal.querySelector(closeSelector);
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    open(totalPrice?: number, content?: HTMLElement): void {
        if (!this.modal) {
            return;
        }
        if (content && this.content) {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
        this.modal.classList.add('modal_active');
    }

    close(): void {
        if (!this.modal) {
            return;
        }
        this.modal.classList.remove('modal_active');
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}