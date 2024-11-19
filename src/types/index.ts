export interface ProductItem {
    id: string;               // Уникальный идентификатор товара
    price: number | null;            // Цена товара
    image: string;         // URL изображения товара
    category: string;         // Категория товара
    description: string;
    title: string;
    selected: boolean;
}

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

export interface IProductList {
    saveSelectedToStorage(): void;
}

export interface ICart {
    items: CartItem[];
    toggleProductInCart(product: ProductItem, products: ProductItem[]): void;
    removeProductFromCart(productId: string, products: ProductItem[]): void;
    removeBasketItem(itemId: string): void;
    updateCartItems(products: ProductItem[]): void;
    getTotalPrice(): number;
    clearCart(): void;
    getSelectedProductsCount(): number;
}

export interface IContactValidator {
    validateContactFields(emailField: HTMLInputElement, phoneField: HTMLInputElement, payButton: HTMLButtonElement, formErrors: HTMLElement): boolean;
}

export interface IOrderModel {
    setPaymentMethod(method: string): void;
    setAddress(address: string): void;
    validateAddressField(addressField: HTMLInputElement, nextButton: HTMLButtonElement, formErrors: HTMLElement): boolean;
}