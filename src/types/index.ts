// Тип для сущности Товар (ProductModel)
import {ProductListView} from "../components/ProductListView";

export interface ProductItem {
    id: string;               // Уникальный идентификатор товара
    price: number | null;            // Цена товара
    image: string;         // URL изображения товара
    category: string;         // Категория товара
    description: string;
    title: string;
    selected: boolean;
}

// Тип для сущности Элемент корзины (CartItem)
export interface CartItem {
    id: string;               // Уникальный идентификатор товара
    title: string;            // Название товара
    price: number;            // Цена товара
}

export interface OrderForm {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export interface IOrder extends OrderForm {
    // Массив ID купленных товаров
    items?: string [];
    payment?: string;
    total?: number;
    address?: string;
    email?: string;
    phone?: string;
}

export interface IOrderResult {
    id?: string;  // Идентификатор заказа (если заказ успешно обработан)
    total?: number;  // Общая сумма заказа (если заказ успешно обработан)
    error?: string;  // Сообщение об ошибке (если заказ не был успешно обработан)
}

export interface IProductListView {
    removeProductFromCart(itemId: string): void;
}

export interface ICartView {
    renderBasketItems(): void;
}

export interface ICart {
    items: CartItem[]; // Список товаров в корзине
    getTotalPrice(): number; // Метод для получения общей стоимости товаров
    removeBasketItem(itemId: string): void; // Метод для удаления товара из корзины
}

export interface ICards {
    popupTemplate: HTMLTemplateElement;

    updateCardContent(card: HTMLElement, product: ProductItem): void;

    createProductCard(product: ProductItem): HTMLElement; // Добавляем метод
}

export interface IContactValidator {
    validateContactFields(emailField: HTMLInputElement, phoneField: HTMLInputElement, payButton: HTMLButtonElement, formErrors: HTMLElement): boolean;
}

export interface IOrderModel {
    setPaymentMethod(method: string): void;

    setAddress(address: string): void;

    validateAddressField(addressField: HTMLInputElement, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean;
}

export interface ICartModel {
    setProductList(productList: ProductListView): void;
}