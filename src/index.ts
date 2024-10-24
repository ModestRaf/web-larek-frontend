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
import {OrderForm, ProductItem, IOrder, IOrderResult} from "./types";
import {SuccessModal} from "./components/orderSuccess";
import {ContactsModal} from "./components/contacts";
import {OrderView} from "./components/orderAddress";
import {ensureElement} from "./utils/utils";
import {EventEmitter, IEvents} from "./components/base/events";

let eventEmitter: IEvents;

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
        const response = await api.post('/order', order, 'POST') as IOrderResult;
        console.log('Ответ сервера:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error.message || error.response?.data || error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    eventEmitter = new EventEmitter();

    const api = new Api(API_URL);
    const products = await loadProducts(api);
    const cart = new Cart();
    const orderModel = new Order('modal-container', 'order');

    const formSubmitHandler = async (event: Event) => {
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
                eventEmitter.emit('orderSuccess', new CustomEvent('orderSuccess', {detail: {totalPrice}}));
                cart.clearCart();
                productList.clearSelectedProducts();
                updateBasketCounter();
                productListView.renderProducts(productList.products);
            } else if (response.error) {
                console.error('Ошибка при отправке заказа:', response.error);
            } else {
                console.error('Неизвестная ошибка при отправке заказа');
            }
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
        }
    };
    const onSuccess = () => {
        console.log('Форма успешно отправлена');
    };

    const openContactsModal = () => {
        contactsModal.open();
    };

    const createProductCard = (product: ProductItem) => {
        return cardsView.model.createProductCard(product);
    };

    const openPopup = (product: ProductItem, callback: () => void) => {
        cardsView.openPopup(product, callback);
    };

    const successModal = new SuccessModal('modal-container', 'success');
    const contactsModal = new ContactsModal(
        'modal-container',
        'content-template',
        orderModel,
        onSuccess, // Передаем функцию onSuccess
        formSubmitHandler
    );
    const orderView = new OrderView(
        'modal-container',
        'content-template',
        orderModel, // Передаем объект, реализующий интерфейс
        openContactsModal, // Передаем функцию openContactsModal
        onSuccess, // Передаем функцию onSuccess
        formSubmitHandler
    );
    const basketModal = new CartView(
        'modal-container',
        'basket',
        cart,
        (totalPrice) => orderView.open(totalPrice)
    );
    const openBasketModal = () => {
        basketModal.open();
    };
    const cardTemplateId = 'card-catalog';
    const popupSelector = '.modal';
    const popupTemplateId = 'card-preview';
    const closeSelector = '.modal__close';
    const cards = new Cards(cardTemplateId, popupTemplateId);
    const cardsView = new CardsView(popupSelector, closeSelector, cards);
    const productList = new ProductList();
    productList.products = productList.loadSelectedFromStorage(products);
    const cartModel = new Cart();
    const productListView = new ProductListView(
        'gallery',
        cartModel, // Передаем объект, реализующий интерфейс
        createProductCard, // Передаем функцию createProductCard
        openPopup, // Передаем функцию openPopup
        openBasketModal // Передаем функцию openBasketModal
    );
    cart.setProductList(productListView);
    cart.setCartView(basketModal);

    function loadProductsLogic(): void {
        productListView.renderProducts(productList.products);
        updateBasketCounter();
    }

    function updateBasketCounter(): void {
        const selectedProductsCount = productList.products.filter(product => product.selected).length;
        productListView.updateBasketCounter(selectedProductsCount);
    }

    function toggleProductInCart(product: ProductItem): void {
        productList.toggleProductInCart(product);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    }

    function removeProductFromCart(productId: string): void {
        productList.removeProductFromCart(productId);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    }

    productListView.toggleProductInCart = toggleProductInCart;
    productListView.removeProductFromCart = removeProductFromCart;

    loadProductsLogic();

    const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());

    eventEmitter.on('orderSuccessClosed', () => {
        cart.clearCart();
        productList.clearSelectedProducts();
        updateBasketCounter();
        productListView.renderProducts(productList.products);
    });

    eventEmitter.on('orderSuccess', (event: CustomEvent) => {
        const totalPrice = event.detail.totalPrice;
        if (totalPrice !== undefined) {
            successModal.open(totalPrice);
        } else {
            console.error('totalPrice is undefined');
        }
    });

    cart.updateCartItems(productList.products);

    const form = ensureElement<HTMLFormElement>('form[name="contacts"]', contactsModal.modal);
    if (form) {
        form.addEventListener('submit', formSubmitHandler);
    } else {
        console.error('Форма не найдена');
    }
});