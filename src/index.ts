import './scss/styles.scss';
import {Api} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {CartModel} from "./components/cart";
import {CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {CardsModel} from "./components/cards";
import {ProductListView} from "./components/larekView";
import {ProductListModel} from "./components/larekApi";
import {OrderModel} from "./components/order";
import {SuccessModal} from "./components/orderSuccess";

document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const cartModel = new CartModel();
    const orderModel = new OrderModel('modal-container', 'order');
    const basketModal = new CartView('modal-container', 'basket', cartModel, orderModel);
    const containerId = 'gallery';
    const cardTemplateId = 'card-catalog';
    const popupSelector = '.modal';
    const popupTemplateId = 'card-preview';
    const closeSelector = '.modal__close';
    const cardsModel = new CardsModel(cardTemplateId, popupTemplateId);
    const cardsView = new CardsView(popupSelector, closeSelector, cardsModel);
    const productListModel = new ProductListModel(api);
    const productListView = new ProductListView(
        containerId,
        basketModal,
        cartModel,
        cardsView,
        productListModel
    );
    cartModel.setProductList(productListView);
    productListView.loadProducts();
    const basketButton = document.querySelector('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());
    const successModal = new SuccessModal('modal-container', 'success', 100); // Замените 100 на реальную сумму
    const successButton = document.querySelector('.order-success__close');
    successButton.addEventListener('click', () => {
        successModal.close();
        successModal.clearBasket();
    });
});