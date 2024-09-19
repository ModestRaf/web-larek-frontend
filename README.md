# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения
Приложение разделено на три слоя: Модель, Представление и Презентер (MVP)

### Слой Модели
#### Класс cartModel
Назначение: Управление корзиной покупок пользователя, хранение товаров и расчет общей стоимости.
##### Конструктор
- constructor(items: cartItem[])
##### Параметры:
- items: cartItem[]: массив товаров, добавленных в корзину.
##### Поля класса:
- items: cartItem[]: Список товаров в корзине.
- totalPrice: number: Общая стоимость товаров в корзине.
##### Методы:
- addItem(item: cartItem): void: Добавляет товар в корзину.
- removeItem(itemId: string): void: Удаляет товар из корзины по ID.
- getTotalPrice(): number: Возвращает общую стоимость всех товаров в корзине.
- updateTotalPrice(): void: Пересчитывает и обновляет общую стоимость корзины и генерирует событие basketUpdated.
#### Класс productModel
Назначение: Хранение данных о продукте (товаре), таких как название, цена, изображение и наличие.
##### Конструктор
- constructor(id: string, name: string, price: number, imageUrl: string, isInStock: boolean)
##### Параметры:
- id: string: Уникальный идентификатор товара. 
- name: string: Название товара. 
- price: number: Цена товара. 
- imageUrl: string: URL изображения товара. 
- category: категория товара
##### Поля класса:
- id: string: Уникальный идентификатор товара. 
- name: string: Название товара. 
- price: number: Цена товара. 
- imageUrl: string: URL изображения товара. 
- category: категория товара
##### Методы:
- getDetails(): { id: string, name: string, price: number, imageUrl: string, isInStock: boolean }: Возвращает полную информацию о товаре в виде объекта.
#### Класс contactInfo
##### Конструктор:
- constructor(contactInfo: userEmail: string, userNumber: string, userAddress: string, paymentMethod: 'online' | 'post');
##### Поля класса:
- userEmail: string: почта покупателя
- userNumber: string: телефон покупателя
- userAddress: string: адрес доставки
- paymentMethod: 'online' | 'post': выбор способа оплаты
##### Поля класса:
- userEmail: string: почта покупателя
- userNumber: string: телефон покупателя
- userAddress: string: адрес доставки
- paymentMethod: 'online' | 'post': выбор способа оплаты

### Слой Представления
#### Класс cartView
Назначение: Отображение товаров корзины и обработка взаимодействия пользователя с корзиной.
##### Конструктор
- constructor(containerElement: HTMLElement)
##### Параметры:
- containerElement: HTML-элемент, в котором будет отображаться корзина.
##### Поля класса:
- cartContainer: HTMLElement: Основной контейнер для корзины.
- itemsContainer: HTMLElement: Контейнер для списка товаров в корзине.
- totalPriceElement: HTMLElement: Элемент для отображения общей стоимости.
- checkoutButton: HTMLElement: Кнопка "Оформить", которая открывает модальное окно с выбором способов оплаты.
##### Методы:
- render(items: cartItem[], totalPrice: number): void: Отображает товары в корзине и общую стоимость.
Для установки списка товаров и общей стоимости:
- setItems(items: cartItem[]): void
- setTotalPrice(totalPrice: number): void
#### Класс productCard
Назначение: Отображение информации о товаре в виде карточки с возможностью добавления товара в корзину и взаимодействия с пользователем.
##### Конструктор
- constructor(containerElement: HTMLElement, product: productModel)
##### Параметры:
- containerElement: HTMLElement: Контейнер, в котором будет отображаться карточка товара. 
- product: productModel: Модель данных продукта для отображения.
##### Поля класса:
- container: HTMLElement: Контейнер карточки товара. 
- product: productModel: Модель товара, отображаемого в карточке. 
- nameElement: HTMLElement: Элемент для отображения названия товара. 
- priceElement: HTMLElement: Элемент для отображения цены товара. 
- imageElement: HTMLElement: Элемент для отображения изображения товара.
- addToCartButton: HTMLElement: Кнопка для добавления товара в корзину.
##### Методы:
- render(): void: Отображает карточку товара в указанном контейнере.
Для обновления отдельных частей карточки:
- setName(name: string): void
- setPrice(price: number): void
- setImage(imageUrl: string): void
### Слой Презентера
Презентер управляет логикой взаимодействия между моделью и представлением, обрабатывая события и вызывая соответствующие методы модели

### Модальные окна
#### Класс Modal
Назначение: Универсальный класс для отображения модальных окон с различным контентом. Этот класс управляет только отображением модальных окон, а конкретный контент генерируется другими частями приложения (например, корзина или информация о продукте).
##### Конструктор
- constructor(containerElement: HTMLElement)
##### Параметры:
- containerElement: HTMLElement: Контейнер, в который будет вставлено модальное окно.
##### Поля класса:
- container: HTMLElement: Элемент-контейнер для модального окна.
- contentElement: HTMLElement: Элемент, в который будет загружаться контент модального окна.
##### Методы:
- showModal(content: HTMLElement): void: Отображает модальное окно с переданным содержимым.
- closeModal(): void: Закрывает модальное окно.
- setContent(content: HTMLElement): void: Устанавливает содержимое модального окна.

### Кнопки
#### Класс Button
Назначение: Представляет собой обобщенный класс для кнопок, используемых на страницах.
##### Конструктор
- constructor(buttonElement: HTMLElement, onClick: () => void)
##### Параметры:
- buttonElement: HTMLElement: HTML элемент кнопки.
- onClick: () => void: Коллбэк, который вызывается при нажатии на кнопку.
##### Методы:
- enable(): void: Активирует кнопку.
- disable(): void: Деактивирует кнопку.
- setLabel(label: string): void: Устанавливает текст кнопки.