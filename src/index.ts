import './scss/styles.scss';
import {Api} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {Modal} from "./components/cart";
import {ProductList} from "./components/larekApi";

document.addEventListener('DOMContentLoaded', () => {
    const api = new Api(API_URL);
    const basketModal = new Modal('modal-container', 'basket');
    const containerId = 'gallery';
    const cardTemplateId = 'card-catalog';
    const popupSelector = '.modal';
    const popupTemplateId = 'card-preview';
    const closeSelector = '.modal__close';
    const productList = new ProductList(
        api,
        containerId,
        cardTemplateId,
        popupSelector,
        popupTemplateId,
        closeSelector,
        basketModal
    );
    productList.loadProducts();

    const basketButton = document.querySelector('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());
});