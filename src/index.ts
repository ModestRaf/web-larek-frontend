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
        console.log('Отправка заказа на сервер:', JSON.stringify(order, null, 2)); // Лог перед отправкой заказа
        const response = await api.post('/order', order, 'POST') as IOrderResult;
        console.log('Ответ сервера:', JSON.stringify(response, null, 2)); // Лог ответа сервера
        return response;
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error.message || error.response?.data || error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api(API_URL);
    const products = await loadProducts(api);
    const cart = new Cart();
    const orderModel = new Order('modal-container', 'order');

    const formSubmitHandler = async (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const totalPrice = cart.getTotalPrice();
        const emailField = form.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneField = form.querySelector('input[name="phone"]') as HTMLInputElement;

        try {
            const orderForm: OrderForm = {
                email: emailField.value,
                phone: phoneField.value,
                payment: orderModel.getPaymentMethod(),
                address: orderModel.getAddress()
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
                successModal.open(totalPrice);
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

    // Создаем статичный экземпляр SuccessModal при загрузке страницы
    const successModal = new SuccessModal('modal-container', 'success');
    const basketModal = new CartView('modal-container', 'basket', cart, orderModel, successModal, formSubmitHandler);
    const containerId = 'gallery';
    const cardTemplateId = 'card-catalog';
    const popupSelector = '.modal';
    const popupTemplateId = 'card-preview';
    const closeSelector = '.modal__close';
    const cards = new Cards(cardTemplateId, popupTemplateId);
    const cardsView = new CardsView(popupSelector, closeSelector, cards, api);
    const productList = new ProductList();
    productList.products = productList.loadSelectedFromStorage(products);
    const productListView = new ProductListView(
        containerId,
        basketModal,
        cart,
        cardsView,
        productList
    );
    cart.setProductList(productListView);
    cart.setCartView(basketModal);

    // Логика загрузки продуктов
    function loadProductsLogic(): void {
        productListView.renderProducts(productList.products);
        updateBasketCounter();
    }

    // Логика обновления счетчика корзины
    function updateBasketCounter(): void {
        const selectedProductsCount = productList.products.filter(product => product.selected).length;
        productListView.updateBasketCounter(selectedProductsCount);
    }

    // Логика переключения продукта в корзине
    function toggleProductInCart(product: ProductItem): void {
        productList.toggleProductInCart(product);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    }

    // Логика удаления продукта из корзины
    function removeProductFromCart(productId: string): void {
        productList.removeProductFromCart(productId);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
    }

    // Привязка логики к представлению
    productListView.toggleProductInCart = toggleProductInCart;
    productListView.removeProductFromCart = removeProductFromCart;

    // Загрузка продуктов при старте
    loadProductsLogic();

    const basketButton = document.querySelector('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());

    // Обработка закрытия модального окна после успешного оформления заказа
    document.addEventListener('orderSuccessClosed', () => {
        cart.clearCart(); // Очистка корзины после успешного заказа
        productList.clearSelectedProducts(); // Очистка выбранных товаров в ProductList
        updateBasketCounter(); // Обновляем счетчик корзины после очистки
        productListView.renderProducts(productList.products); // Обновляем отображение продуктов
    });

    // Обработка события успешного оформления заказа
    document.addEventListener('orderSuccess', (event: CustomEvent) => {
        const totalPrice = event.detail.totalPrice;
        console.log('Открытие окна успеха');
        successModal.open(totalPrice);
    });

    // Восстановление состояния корзины после перезагрузки страницы
    cart.updateCartItems(productList.products);

    // Создаем экземпляр ContactsModal и передаем в него orderModel, successModal и обработчик сабмита
    const contactsModal = new ContactsModal('modal-container', 'content-template', orderModel, successModal, formSubmitHandler);

    // Обработчик сабмита формы
    const form = contactsModal.modal.querySelector('form[name="contacts"]');
    if (form) {
        form.addEventListener('submit', formSubmitHandler);
    } else {
        console.error('Форма не найдена');
    }
});