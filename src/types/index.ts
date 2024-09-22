// Тип для сущности Товар (ProductModel)
export interface ProductModel {
    id: string;               // Уникальный идентификатор товара
    name: string;             // Название товара
    price: number;            // Цена товара
    imageUrl: string;         // URL изображения товара
    category: string;         // Категория товара
}

// Тип для сущности Элемент корзины (CartItem)
export interface CartItem {
    id: string;               // Уникальный идентификатор товара
    name: string;             // Название товара
    price: number;            // Цена товара
}

// Тип для сущности Корзина (CartModel)
export interface CartModel {
    items: CartItem[];        // Массив товаров в корзине
    totalPrice: number;       // Общая стоимость товаров в корзине
    getTotalPrice(): number;  // Возвращает общую стоимость всех товаров в корзине
    updateTotalPrice(): void; // Пересчитывает общую стоимость
    removeItem(itemId: string): void;
}

// Тип для контактной информации (ContactInfo)
export interface ContactInfo {
    userEmail: string;        // Почта покупателя
    userNumber: string;       // Телефон покупателя
    userAddress: string;      // Адрес доставки
    paymentMethod: 'online' | 'post';  // Способ оплаты: онлайн или при получении
}

// Тип для модального окна (ModalContent)
export interface ModalContent {
    body: HTMLElement;          // Основное содержимое модального окна
}

// Тип для представления товаров (ProductView)
export interface ProductView {
    render(): void;               // Метод для отображения товара
    setName(name: string): void;  // Метод для установки имени товара
    setPrice(price: number): void; // Метод для установки цены товара
    setImage(imageUrl: string): void; // Метод для установки изображения товара
}

// Тип для представления корзины (CartView)
export interface CartView {
    render(items: CartItem[], totalPrice: number): void;  // Отображает товары и общую стоимость
    setItems(items: CartItem[]): void;                   // Устанавливает список товаров
    setTotalPrice(totalPrice: number): void;             // Устанавливает общую стоимость
}

// Тип для модального окна (Modal)
export interface Modal {
    showModal(content: HTMLElement): void;       // Показать модальное окно с контентом
    closeModal(): void;                          // Закрыть модальное окно
    setContent(content: HTMLElement): void;      // Установить контент для модального окна
}

// Тип для кнопки (Button)
export interface Button {
    enable(): void;                          // Активировать кнопку
    disable(): void;                         // Деактивировать кнопку
    setLabel(label: string): void;           // Установить текст на кнопке
    onClick(): void;                         // Обработчик клика
}