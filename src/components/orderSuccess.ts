import {ProductListModel} from "./ProductList";
import {CartView} from "./cartView";
import {CartModel} from "./cart";
import {CardsModel} from "./cards";
import {CardsView} from "./cardsView";
import {ProductListView} from "./larekView";
import {OrderModel} from "./order";
import {ModalBase} from "./modalBase";

export class SuccessModal extends ModalBase { // Наследуем от ModalBase
    private contentTemplate: HTMLTemplateElement;
    private readonly totalPrice: number;
    private successTemplate: HTMLTemplateElement;
    constructor(modalId: string, contentTemplateId: string, totalPrice: number) {
        super(`#${modalId}`, '.modal__close'); // Вызываем конструктор ModalBase
        this.contentTemplate = document.getElementById(contentTemplateId) as HTMLTemplateElement;
        this.totalPrice = totalPrice;
        this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
    }

    open(): void {
        super.open(); // Используем метод open из ModalBase
        const successClone = document.importNode(this.successTemplate.content, true);
        this.content.innerHTML = ''; // Используем this.content из ModalBase
        this.content.appendChild(successClone);
        this.modal.classList.add('modal_active'); // Используем this.modal из ModalBase
        const successDescription = this.modal.querySelector('.order-success__description') as HTMLElement;
        successDescription.textContent = `Списано ${this.totalPrice} синапсов`;
        const closeButton = this.modal.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.close(); // Закрываем текущее модальное окно
            this.clearBasket(); // Очищаем корзину
        });
    }

    clearBasket(): void {
        const cartModel = new CartModel();
        const orderModel = new OrderModel('modal-container', 'order');
        const basketModal = new CartView('modal-container', 'basket', cartModel, orderModel);
        const cardsModel = new CardsModel('card-catalog', 'card-preview');
        const cardsView = new CardsView('.modal', '.modal__close', cardsModel);
        const productListModel = new ProductListModel();
        const productListView = new ProductListView(
            'gallery',
            basketModal,
            cartModel,
            cardsView,
            productListModel
        );
        // Очищаем корзину и обновляем счетчик
        productListModel.products.forEach(product => {
            product.selected = false;
        });
        productListModel.saveSelectedToStorage();
        productListView.updateBasketCounter();
        // Очищаем содержимое корзины
        basketModal.renderBasketItems();
    }
}