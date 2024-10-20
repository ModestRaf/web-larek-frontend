import './scss/styles.scss';
import {Api, ApiListResponse} from "./components/base/api";
import {API_URL} from "./utils/constants";
import {CartModel} from "./components/cart";
import {CartView} from "./components/cartView";
import {CardsView} from "./components/cardsView";
import {CardsModel} from "./components/cards";
import {ProductListView} from "./components/larekView";
import {ProductListModel} from "./components/ProductList";
import {OrderModel} from "./components/order";
import {SuccessModal} from "./components/orderSuccess";
import {ProductItem} from "./types";

// Загрузка продуктов
async function loadProducts(api: Api): Promise<ProductItem[]> {
    try {
        const response = await api.get('/product');
        const data = response as ApiListResponse<ProductItem>;
        return data.items;
    } catch (error) {
        console.error(error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api(API_URL);
    const products = await loadProducts(api);
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
    const productListModel = new ProductListModel();
    productListModel.products = productListModel.loadSelectedFromStorage(products); // Передаем загруженные продукты в ProductListModel
    const productListView = new ProductListView(
        containerId,
        basketModal,
        cartModel,
        cardsView,
        productListModel
    );
    cartModel.setProductList(productListView);

    // Логика загрузки продуктов
    function loadProductsLogic(): void {
        productListView.renderProducts(productListModel.products);
        updateBasketCounter();
    }

    // Логика обновления счетчика корзины
    function updateBasketCounter(): void {
        const selectedProductsCount = productListModel.products.filter(product => product.selected).length;
        productListView.updateBasketCounter(selectedProductsCount);
    }

    // Логика переключения продукта в корзине
    function toggleProductInCart(product: ProductItem): void {
        productListModel.toggleProductInCart(product);
        updateBasketCounter();
        cartModel.updateCartItems(productListModel.products);
        basketModal.renderBasketItems();
    }

    // Логика удаления продукта из корзины
    function removeProductFromCart(productId: string): void {
        productListModel.removeProductFromCart(productId);
        updateBasketCounter();
        cartModel.updateCartItems(productListModel.products);
        basketModal.renderBasketItems();
    }

    // Привязка логики к представлению
    productListView.toggleProductInCart = toggleProductInCart;
    productListView.removeProductFromCart = removeProductFromCart;

    // Загрузка продуктов при старте
    loadProductsLogic();

    const basketButton = document.querySelector('.header__basket');
    basketButton.addEventListener('click', () => basketModal.open());
    const successModal = new SuccessModal('modal-container', 'success', 100); // Замените 100 на реальную сумму
    const successButton = document.querySelector('.order-success__close');
    successButton.addEventListener('click', () => {
        successModal.close();
        successModal.clearBasket();
    });
});