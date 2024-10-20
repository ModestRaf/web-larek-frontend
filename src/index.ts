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
    const cart = new Cart();
    const orderModel = new Order('modal-container', 'order');
    const basketModal = new CartView('modal-container', 'basket', cart, orderModel);
    const containerId = 'gallery';
    const cardTemplateId = 'card-catalog';
    const popupSelector = '.modal';
    const popupTemplateId = 'card-preview';
    const closeSelector = '.modal__close';
    const cards = new Cards(cardTemplateId, popupTemplateId);
    const cardsView = new CardsView(popupSelector, closeSelector, cards);
    const productList = new ProductList();
    productList.products = productList.loadSelectedFromStorage(products); // Передаем загруженные продукты в ProductList
    const productListView = new ProductListView(
        containerId,
        basketModal,
        cart,
        cardsView,
        productList
    );
    cart.setProductList(productListView);

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
        basketModal.renderBasketItems();
    }

    // Логика удаления продукта из корзины
    function removeProductFromCart(productId: string): void {
        productList.removeProductFromCart(productId);
        updateBasketCounter();
        cart.updateCartItems(productList.products);
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