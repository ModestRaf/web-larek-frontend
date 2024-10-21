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
import {ProductItem} from "./types";
import {SuccessModal} from "./components/orderSuccess";

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
    cart.setCartView(basketModal);  // Linking CartView for basket rendering

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
        cart.clearCart(); // Clear the cart after the order is successful
        productList.clearSelectedProducts(); // Clear selected products in ProductList
        updateBasketCounter(); // Обновляем счетчик корзины после очистки
        productListView.renderProducts(productList.products); // Обновляем отображение продуктов
    });

    // Обработка события успешного оформления заказа
    document.addEventListener('orderSuccess', (event: CustomEvent) => {
        const totalPrice = event.detail.totalPrice;
        const successModal = new SuccessModal('modal-container', 'success', totalPrice);
        successModal.open();
    });

    // Восстановление состояния корзины после перезагрузки страницы
    cart.updateCartItems(productList.products);
});