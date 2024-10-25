import './scss/styles.scss';
import {Api, ApiListResponse} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {Cart} from "./components/cart";
import {CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {Cards} from "./components/cards";
import {ProductListView} from "./components/ProductListView";
import {ProductList} from "./components/ProductList";
import {Order} from "./components/order";
import {ProductItem, IOrder, IOrderResult, OrderForm} from "./types";
import {SuccessModal} from "./components/orderSuccess";
import {ContactsModal} from "./components/contacts";
import {OrderView} from "./components/orderAddress";
import {ensureElement} from "./utils/utils";
import {EventEmitter, IEvents} from "./components/base/events";

const eventEmitter: IEvents = new EventEmitter();

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

// Отправка заказа на сервер
async function submitOrder(api: Api, order: IOrder): Promise<IOrderResult> {
    try {
        console.log('Отправка заказа на сервер:', JSON.stringify(order, null, 2));
        const response = await api.post('/order', order) as IOrderResult;
        console.log('Ответ сервера:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api(API_URL);
    const products = await loadProducts(api);
    const cart = new Cart();
    const productList = new ProductList();
    productList.products = productList.loadSelectedFromStorage(products);

    const orderModel = new Order('modal-container', 'order');
    const successModal = new SuccessModal('modal-container', 'success');
    const contactsModal = new ContactsModal(
        'modal-container',
        'content-template',
        orderModel,
        () => console.log('Форма успешно отправлена'),
        formSubmitHandler
    );

    const orderView = new OrderView(
        'modal-container',
        'content-template',
        orderModel,
        () => contactsModal.open(),
        () => console.log('Форма успешно отправлена'),
        formSubmitHandler
    );

    const basketModal = new CartView(
        'modal-container',
        'basket',
        cart,
        (totalPrice) => orderView.open(totalPrice)
    );

    const cardsView = new CardsView('.modal', '.modal__close', new Cards('card-catalog', 'card-preview'));

    const productListView = new ProductListView(
        'gallery',
        cart,
        (product) => cardsView.model.createProductCard(product),
        (product, callback) => cardsView.openPopup(product, callback),
        () => basketModal.open()
    );

    productListView.toggleProductInCart = (product) => {
        productList.toggleProductInCart(product);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    };

    productListView.removeProductFromCart = (productId) => {
        productList.removeProductFromCart(productId);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    };

    cart.setProductList(productListView);
    cart.setCartView(basketModal);

    loadProductsLogic();

    // Элементы управления
    const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());

    // Обработчики событий
    eventEmitter.on('orderSuccessClosed', resetCart);
    eventEmitter.on('orderSuccess', (event: CustomEvent) => {
        const totalPrice = event.detail.totalPrice;
        if (totalPrice !== undefined) {
            successModal.open(totalPrice);
        } else {
            console.error('totalPrice is undefined');
        }
    });

    const form = ensureElement<HTMLFormElement>('form[name="contacts"]', contactsModal.modal);
    form?.addEventListener('submit', formSubmitHandler);

    // Вспомогательные функции
    function updateBasketCounter(): void {
        const selectedProductsCount = productList.products.filter(product => product.selected).length;
        productListView.updateBasketCounter(selectedProductsCount);
    }

    function resetCart() {
        cart.clearCart();
        productList.clearSelectedProducts();
        updateBasketCounter();
        productListView.renderProducts(productList.products);
    }

    function loadProductsLogic(): void {
        productListView.renderProducts(productList.products);
        updateBasketCounter();
        basketModal.renderBasketItems();  // Обновляем интерфейс корзины при загрузке
    }

    async function formSubmitHandler(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const totalPrice = cart.getTotalPrice();
        const emailField = ensureElement<HTMLInputElement>('input[name="email"]', form);
        const phoneField = ensureElement<HTMLInputElement>('input[name="phone"]', form);

        try {
            const orderForm: OrderForm = {
                email: emailField.value,
                phone: phoneField.value,
                payment: orderModel.getPaymentMethod(),
                address: orderModel.getAddress(),
            };
            const order: IOrder = {
                ...orderForm,
                items: cart.items.map(item => item.id.toString()),
                total: totalPrice
            };
            const response = await submitOrder(api, order);
            console.log('Ответ от сервера:', response);
            if (response.id) {
                console.log('Заказ успешно отправлен');
                cart.clearCart();
                productList.clearSelectedProducts();
                updateBasketCounter();
                productListView.renderProducts(productList.products);
                eventEmitter.emit('orderSuccess', new CustomEvent('orderSuccess', {detail: {totalPrice}}));
            } else if (response.error) {
                console.error('Ошибка при отправке заказа:', response.error);
            } else {
                console.error('Неизвестная ошибка при отправке заказа');
            }
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
        }
    }
});