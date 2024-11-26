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
        this.container.append(...cards);
        this.container.addEventListener('click', event => {
            const card = (event.target as HTMLElement).closest('[data-product]') as HTMLElement;
            if (card) {
                const product = JSON.parse(card.dataset.product || '{}') as ProductItem;
                this.eventEmitter.emit<{ product: ProductItem }>('preview:open', {product});
            }
        });
    }
}