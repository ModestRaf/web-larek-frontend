// Тип для сущности Товар (ProductModel)
export interface ProductItem {
    id: string;               // Уникальный идентификатор товара
    price: number | null;            // Цена товара
    image: string;         // URL изображения товара
    category: string;         // Категория товара
    description: string;
    title: string;
    selected: boolean;
}

// Тип для сущности Корзина (CartModel)
export interface CartModal {
    open(): void;

    close(): void;

    items: CartItem[];        // Массив товаров в корзине
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