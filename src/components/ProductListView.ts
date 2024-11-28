export class ProductListView {
    private container: HTMLElement;

    constructor(
        containerId: string,
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
    }

    renderProducts(cards: HTMLElement[]): void {
        this.container.append(...cards);
    }
}