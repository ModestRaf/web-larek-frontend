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

// Тип для сущности Элемент корзины (CartItem)
export interface CartItem {
    id: string;               // Уникальный идентификатор товара
    title: string;            // Название товара
    price: number;            // Цена товара
}

// Тип для сущности Корзина (CartModel)
export interface CartModel {
    items: CartItem[];        // Массив товаров в корзине
    total: number;       // Общая стоимость товаров в корзине
    getTotal(): number;  // Возвращает общую стоимость всех товаров в корзине
    updateTotal(): void; // Пересчитывает общую стоимость
    removeItem(itemId: string): void;
}

// Тип для контактной информации (ContactInfo)
export interface ContactInfo {
    email: string;        // Почта покупателя
    phone: string;       // Телефон покупателя
    address: string;      // Адрес доставки
    payment: 'online' | 'post';  // Способ оплаты: онлайн или при получении
}

// Тип для модального окна (ModalContent)
export interface ModalContent {
    body: HTMLElement;          // Основное содержимое модального окна
}

// Тип для представления корзины (CartView)
export interface CartView {
    render(items: CartItem[], total: number): void;  // Отображает товары и общую стоимость
    setItems(items: CartItem[]): void;                   // Устанавливает список товаров
    setTotalPrice(total: number): void;             // Устанавливает общую стоимость
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