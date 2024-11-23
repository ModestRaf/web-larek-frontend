import {ProductItem} from "../types";
import {EventEmitter} from "./base/events";

export class ProductListView {
    private container: HTMLElement;

    constructor(
        containerId: string,
        private eventEmitter: EventEmitter
    ) {
        this.container = document.querySelector(`#${containerId}`) as HTMLElement;
        this.eventEmitter.on('cards:loaded', (cards: HTMLElement[]) => this.renderProducts(cards));
    }

    renderProducts(cards: HTMLElement[]): void {
        this.container.innerHTML = '';
        cards.forEach(card => {
            this.container.appendChild(card);
            card.addEventListener('click', () => {
                const product = JSON.parse(card.dataset.product || '{}') as ProductItem;
                this.eventEmitter.emit<{ product: ProductItem }>('preview:open', {product});
            });
        });
    }
}