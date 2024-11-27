import './scss/styles.scss';
import {Api, ApiListResponse} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {Cart} from "./components/cart";
import {BasketItemView, CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {ProductListView} from "./components/ProductListView";
import {ProductList} from "./components/ProductList";
import {Order} from "./components/order";
import {ProductItem, IOrder, OrderForm, CartItem} from "./types";
import {SuccessModal} from "./components/orderSuccess";
import {ContactsView} from "./components/contactsView";
import {OrderView} from "./components/orderAddress";
import {EventEmitter, IEvents} from "./components/base/events";
import {LarekApi} from "./components/LarekApi";
import {ModalBase} from "./components/modalBase";

const eventEmitter: IEvents = new EventEmitter() as IEvents;
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productList = new ProductList(eventEmitter);
const cart = new Cart(eventEmitter);
const orderModel = new Order();
const successModal = new SuccessModal('success', eventEmitter);
const contactsView = new ContactsView(
    'content-template',
    eventEmitter
);
const orderView = new OrderView('content-template', eventEmitter);
const cartView = new CartView('basket', eventEmitter);
const cardsView = new CardsView(
    'card-catalog',
    'card-preview',
    eventEmitter
);
const productListView = new ProductListView('gallery', eventEmitter);
const modalBase = new ModalBase('#modal-container', '.modal__close');

// Загрузка продуктов
async function loadProducts(api: Api): Promise<ProductItem[]> {
    try {
        const response = await api.get('/product') as ApiListResponse<ProductItem>;
        return response.items;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Вспомогательные функции
function updateBasketCounter(): void {
    const selectedProductsCount = productList.products.filter(product => product.selected).length;
    cartView.updateBasketCounter(selectedProductsCount);
}

function resetCart() {
    cart.clearCart();
    productList.clearSelectedProducts();
    updateBasketCounter();
    const productCards = productList.products.map(product => cardsView.createProductCard(product));
    productListView.renderProducts(productCards);
    eventEmitter.emit('cart:change');
}

function loadProductsLogic(): void {
    const productCards = productList.products.map(product => cardsView.createProductCard(product));
    productListView.renderProducts(productCards);
    updateBasketCounter();
    cartView.renderBasketItems();
    eventEmitter.emit('cart:change');
}

// Обработчики событий
eventEmitter.on('openContactsModal', () => {
    contactsView.openModal();
});
successModal.closeButton.addEventListener('click', () => {
    successModal.onSuccessClose();
});

eventEmitter.on('orderSuccess', (data: { totalPrice: number }) => {
    const successElement = successModal.render(data.totalPrice);
    document.body.appendChild(successElement);
});

eventEmitter.on('orderSuccessClosed', () => {
    const successElement = document.querySelector('.order-success');
    if (successElement) {
        successElement.remove();
    }
});
eventEmitter.on('checkout', (data: { totalPrice: number }) => {
    const orderContent = orderView.render();
    modalBase.open(data.totalPrice, orderContent);
});
eventEmitter.on('order:submit', async (event: Event) => {
    event.preventDefault();
    const totalPrice = cart.getTotalPrice();
    try {
        const orderForm: OrderForm = {
            email: orderModel.getEmail(),
            phone: orderModel.getPhone(),
            payment: orderModel.getPaymentMethod(),
            address: orderModel.getAddress(),
        };
        const order: IOrder = {
            ...orderForm,
            items: cart.items.map(item => item.id.toString()),
            total: totalPrice
        };
        const response = await larekApi.submitOrder(order);
        if (response.id) {
            cart.clearCart();
            productList.clearSelectedProducts();
            updateBasketCounter();
            eventEmitter.emit('orderSuccess', {totalPrice});
        }
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
    }
});
eventEmitter.on('orderSuccessClosed', resetCart);
eventEmitter.on('openModal', (content: HTMLElement) => {
    modalBase.open(undefined, content);
});
eventEmitter.on('orderSuccess', (data: { totalPrice: number }) => {
    const totalPrice = data.totalPrice;
    const successContent = successModal.render(totalPrice);
    modalBase.open(undefined, successContent);
    eventEmitter.on('orderSuccessClosed', () => {
        modalBase.close();
    });
});
eventEmitter.on<{ product: ProductItem }>('toggleProductInCart', ({product}) => {
    const existingProduct = productList.products.find(p => p.id === product.id);
    existingProduct.selected = !existingProduct.selected;
    productList.saveSelectedToStorage();
    cart.toggleProductInCart(existingProduct);
    updateBasketCounter();
    cart.updateCartItems(productList.products);
});

eventEmitter.on<{ productId: string }>('removeProductFromCart', ({productId}) => {
    cart.removeProductFromCart(productId);
    updateBasketCounter();
    cart.updateCartItems(productList.products);
});

eventEmitter.on('popup:open', ({product}: { product: ProductItem }) => {
    const popupClone = document.importNode(cardsView.popupTemplate.content, true);
    const popupCard = popupClone.querySelector('.card') as HTMLElement;
    cardsView.updateCardContent(popupCard, product);
    const button = popupCard.querySelector('.card__button') as HTMLButtonElement;
    button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
    button.addEventListener('click', () => {
        eventEmitter.emit('toggleProductInCart', {product});
        cardsView.updateCardContent(popupCard, product);
    });
    eventEmitter.emit('modal:open', popupClone);
});

eventEmitter.on<HTMLElement>('modal:open', (content) => modalBase.open(undefined, content));
eventEmitter.on('cart:open', () => {
    const cartContent = cartView.render();
    const modalContainer = document.querySelector('#modal-container');
    if (!modalContainer) {
        return;
    }
    modalBase.open(undefined, cartContent);
});
eventEmitter.on('cart:change', () => {
    eventEmitter.emit('cart:getItems', (items: CartItem[]) => {
        const basketItems = items.map((item, index) => {
            const basketItem = new BasketItemView(item, index + 1, eventEmitter, cartView.update.bind(cartView));
            return basketItem.render();
        });
        cartView.setItems(basketItems);
        cartView.updateBasketCounter(items.length);
        cartView.renderBasketItems();
    });
});
eventEmitter.on('cards:loaded', (cards: HTMLElement[]) => productListView.renderProducts(cards));
eventEmitter.on<{ productId: string }>('productRemoved', ({productId}) => {
    productList.updateSelectedState(productId);
});
// Обработчики событий для класса Cart
eventEmitter.on('cart:getItems', (callback: (items: CartItem[]) => void) => {
    callback(cart.items);
});
eventEmitter.on('cart:getTotalPrice', (callback: (price: number) => void) => {
    callback(cart.getTotalPrice());
});
eventEmitter.on('cart:getSelectedProductsCount', (callback: (count: number) => void) => {
    callback(cart.getSelectedProductsCount());
});
eventEmitter.on('removeBasketItem', (data: { itemId: string }) => {
    cart.removeProductFromCart(data.itemId);
});
// Обработчики событий для класса Order
eventEmitter.on('setEmail', (data: { email: string }) => orderModel.setEmail(data.email));
eventEmitter.on('setPhone', (data: { phone: string }) => orderModel.setPhone(data.phone));
eventEmitter.on('setAddress', (data: { address: string }) => orderModel.setAddress(data.address));
eventEmitter.on('setPaymentMethod', (data: { method: string }) => orderModel.setPaymentMethod(data.method));
eventEmitter.on('validateContactFields', (data: { email: string; phone: string }) => {
    const error = orderModel.validateContactFields(data.email, data.phone);
    contactsView.updateValidationState(!error, error);
});

eventEmitter.on('validateAddress', (data: { address: string }) => {
    const error = orderModel.validateAddress(data.address);
    orderView.updateValidationState(!error, error);
});

eventEmitter.on('proceedToContacts', () => {
    if (!orderView.nextButton.disabled) {
        eventEmitter.emit('openContactsModal');
    }
});
// Обработчики событий для класса CartView
eventEmitter.on<{ selectedProductsCount: number }>('productToggled', ({selectedProductsCount}) => {
    cartView.updateBasketCounter(selectedProductsCount);
});
eventEmitter.on<{ selectedProductsCount: number }>('productRemoved', ({selectedProductsCount}) => {
    cartView.updateBasketCounter(selectedProductsCount);
});
eventEmitter.on<{ selectedProductsCount: number }>('basketItemRemoved', ({selectedProductsCount}) => {
    cartView.updateBasketCounter(selectedProductsCount);
});
eventEmitter.on('cart:change', () => {
    cartView.update();
});

document.addEventListener('DOMContentLoaded', async () => {
    const products = await loadProducts(api);
    productList.products = productList.loadSelectedFromStorage(products);
    loadProductsLogic();
    const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
    basketButton.addEventListener('click', () => {
        eventEmitter.emit('cart:open');
    });
});