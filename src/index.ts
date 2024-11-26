import './scss/styles.scss';
import {Api, ApiListResponse} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {Cart} from "./components/cart";
import {BasketItemView, CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {ProductListView} from "./components/ProductListView";
import {ProductList} from "./components/ProductList";
import {Order} from "./components/order";
import {ProductItem, IOrder, OrderForm, IOrderModel, CartItem} from "./types";
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
const orderModel = new Order('modal-container', 'order');
const successModal = new SuccessModal('success', eventEmitter);
const contactsView = new ContactsView(
    'content-template',
    orderModel,
    () => console.log('Форма успешно отправлена'),
    handleFormSubmit,
    orderModel,
    eventEmitter
);
const orderView = new OrderView(
    'content-template',
    orderModel,
    () => contactsView.openModal(),
    () => console.log('Форма успешно отправлена'),
    handleFormSubmit,
);
const cartView = new CartView(
    'basket',
    (totalPrice: number) => {
        const orderContent = orderView.render();
        modalBase.open(totalPrice, orderContent);
    },
    eventEmitter
);
const cardsView = new CardsView(
    '.modal',
    '.modal__close',
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

eventEmitter.on<{ product: ProductItem }>('popup:open', ({product}) => {
    const popupClone = document.importNode(cardsView.popupTemplate.content, true);
    const popupCard = popupClone.querySelector('.card') as HTMLElement;
    cardsView.updateCardContent(popupCard, product);
    const button = popupCard.querySelector('.card__button') as HTMLButtonElement;
    button.textContent = product.selected ? 'Убрать' : 'Добавить в корзину';
    button.addEventListener('click', () => {
        eventEmitter.emit('toggleProductInCart', {product});
        cardsView.updateCardContent(popupCard, product);
    });
    cardsView.content.innerHTML = '';
    cardsView.content.appendChild(popupClone);
    cardsView.open();
});

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

async function handleFormSubmit(event: Event) {
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
            const productCards = productList.products.map(product => cardsView.createProductCard(product));
            productListView.renderProducts(productCards);
            eventEmitter.emit('orderSuccess', {totalPrice});
        }
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
    }
}

export function setupContactFields(contactsView: ContactsView, orderModel: IOrderModel): void {
    const checkFields = () => {
        const isValid = contactsView.contactValidator.validateContactFields(
            contactsView.emailField,
            contactsView.phoneField,
            contactsView.payButton,
            contactsView.formErrors
        );
        if (isValid) {
            contactsView.payButton.removeAttribute('disabled');
            if (orderModel.setEmail) {
                orderModel.setEmail(contactsView.emailField.value.trim());
            }
            if (orderModel.setPhone) {
                orderModel.setPhone(contactsView.phoneField.value.trim());
            }
        } else {
            contactsView.payButton.setAttribute('disabled', 'true');
        }
    };
    contactsView.emailField.addEventListener('input', checkFields);
    contactsView.phoneField.addEventListener('input', checkFields);
}

export function setupFormSubmitHandler(contactsView: ContactsView, orderModel: IOrderModel): void {
    const form = contactsView.form;
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        if (contactsView.emailField && contactsView.phoneField) {
            const isValid = contactsView.contactValidator.validateContactFields(
                contactsView.emailField,
                contactsView.phoneField,
                contactsView.payButton,
                contactsView.formErrors
            );
            if (isValid) {
                if (orderModel.setEmail) {
                    orderModel.setEmail(contactsView.emailField.value.trim());
                }
                if (orderModel.setPhone) {
                    orderModel.setPhone(contactsView.phoneField.value.trim());
                }
                contactsView.formSubmitHandler(event);
                contactsView.onSuccess();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await loadProducts(api);
    productList.products = productList.loadSelectedFromStorage(products);
    loadProductsLogic();
    const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
    basketButton.addEventListener('click', () => {
        eventEmitter.emit('cart:open');
    });
    const form = document.querySelector('form[name="contacts"]') as HTMLFormElement
    form.addEventListener('submit', handleFormSubmit);
});