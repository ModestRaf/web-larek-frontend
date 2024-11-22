import './scss/styles.scss';
import {Api, ApiListResponse} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {Cart} from "./components/cart";
import {CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {ProductListView} from "./components/ProductListView";
import {ProductList} from "./components/ProductList";
import {Order} from "./components/order";
import {ProductItem, IOrder, OrderForm} from "./types";
import {SuccessModal} from "./components/orderSuccess";
import {ContactsModal} from "./components/contacts";
import {OrderView} from "./components/orderAddress";
import {EventEmitter, IEvents} from "./components/base/events";
import {LarekApi} from "./components/LarekApi";

const eventEmitter: IEvents = new EventEmitter() as IEvents;
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productList = new ProductList(eventEmitter);
const cart = new Cart(productList, eventEmitter);
const orderModel = new Order('modal-container', 'order');
const successModal = new SuccessModal('modal-container', 'success');
const contactsModal = new ContactsModal(
    'modal-container',
    'content-template',
    orderModel,
    () => console.log('Форма успешно отправлена'),
    handleFormSubmit
);
const orderView = new OrderView(
    'modal-container',
    'content-template',
    orderModel,
    () => contactsModal.open(),
    () => console.log('Форма успешно отправлена'),
    handleFormSubmit
);
const cartView = new CartView(
    'modal-container',
    'basket',
    cart,
    (totalPrice) => orderView.open(totalPrice),
    eventEmitter
);
const cardsView = new CardsView(
    '.modal',
    '.modal__close',
    'card-catalog',
    'card-preview',
    eventEmitter
);

const productListView = new ProductListView(
    'gallery',
    (product) => cardsView.createProductCard(product),
    eventEmitter
);

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
    productListView.renderProducts(productList.products);
}

function loadProductsLogic(): void {
    productListView.renderProducts(productList.products);
    updateBasketCounter();
    cartView.renderBasketItems();
}

// Обработчики событий
eventEmitter.on('orderSuccessClosed', resetCart);
eventEmitter.on('orderSuccess', (data: { totalPrice: number }) => {
    const totalPrice = data.totalPrice;
    if (totalPrice !== undefined) {
        successModal.open(totalPrice);
    } else {
        console.error('totalPrice is undefined');
    }
});
eventEmitter.on<{ product: ProductItem }>('toggleProductInCart', ({product}) => {
    cart.toggleProductInCart(product, productList.products);
    updateBasketCounter();
    cart.updateCartItems(productList.products);
});

eventEmitter.on<{ productId: string }>('removeProductFromCart', ({productId}) => {
    cart.removeProductFromCart(productId, productList.products);
    updateBasketCounter();
    cart.updateCartItems(productList.products);
});

async function handleFormSubmit(event: Event) {
    event.preventDefault();
    const totalPrice = cart.getTotalPrice();
    try {
        const orderForm: OrderForm = {
            email: contactsModal.getEmailValue(),
            phone: contactsModal.getPhoneValue(),
            payment: orderModel.getPaymentMethod(),
            address: orderModel.getAddress(),
        };
        const order: IOrder = {
            ...orderForm,
            items: cart.items.map(item => item.id.toString()),
            total: totalPrice
        };
        const response = await larekApi.submitOrder(order);
        console.log('Ответ от сервера:', response);
        if (response.id) {
            console.log('Заказ успешно отправлен');
            cart.clearCart();
            productList.clearSelectedProducts();
            updateBasketCounter();
            productListView.renderProducts(productList.products);
            eventEmitter.emit('orderSuccess', {totalPrice});
        } else if (response.error) {
            console.error('Ошибка при отправке заказа:', response.error);
        } else {
            console.error('Неизвестная ошибка при отправке заказа');
        }
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
    }
}

export function setupContactFields(contactsModal: ContactsModal): void {
    const checkFields = () => {
        const isValid = contactsModal.contactValidator.validateContactFields(
            contactsModal.emailField,
            contactsModal.phoneField,
            contactsModal.payButton,
            contactsModal.formErrors
        );
        if (isValid) {
            contactsModal.payButton.removeAttribute('disabled');
        } else {
            contactsModal.payButton.setAttribute('disabled', 'true');
        }
    };
    contactsModal.emailField.addEventListener('input', checkFields);
    contactsModal.phoneField.addEventListener('input', checkFields);
}

export function setupFormSubmitHandler(contactsModal: ContactsModal): void {
    const form = contactsModal.modal.querySelector('form[name="contacts"]');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (contactsModal.emailField && contactsModal.phoneField) {
                const isValid = contactsModal.contactValidator.validateContactFields(
                    contactsModal.emailField,
                    contactsModal.phoneField,
                    contactsModal.payButton,
                    contactsModal.formErrors
                );
                if (isValid) {
                    contactsModal.formSubmitHandler(event); // Вызываем обработчик отправки формы
                    contactsModal.onSuccess();
                } else {
                    console.error('Форма не прошла валидацию');
                }
            }
        });
    } else {
        console.error('Форма не найдена');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await loadProducts(api);
    productList.products = productList.loadSelectedFromStorage(products);
    loadProductsLogic();
    const basketButton = document.querySelector('.header__basket') as HTMLButtonElement | null;
    if (basketButton) {
        basketButton.addEventListener('click', () => {
            cartView.open();
        });
    } else {
        console.error('Basket button not found');
    }
    eventEmitter.on<{ product: ProductItem }>('popup:open', ({product}) => {
        console.log('Received popup:open event:', product); // Проверяем получение события
        const popupClone = document.importNode(cardsView.popupTemplate.content, true);
        const popupCard = popupClone.querySelector('.card') as HTMLElement;
        cardsView.updateCardContent(popupCard, product);
        const button = popupCard.querySelector('.card__button') as HTMLButtonElement | null;
        if (button) {
            button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
            button.addEventListener('click', () => {
                eventEmitter.emit('toggleProductInCart', {product});
                cardsView.updateCardContent(popupCard, product);
            });
        }
        cardsView.content.innerHTML = '';
        cardsView.content.appendChild(popupClone);
        cardsView.open();
    });
    const form = document.querySelector('form[name="contacts"]') as HTMLFormElement | null;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Contact form not found');
    }
    setupContactFields(contactsModal);
    setupFormSubmitHandler(contactsModal);
});