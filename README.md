# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components/cart.ts - управляет списком товаров в корзине, обновляет их состояние и вычисляет общую стоимость
- src/components/cards.ts - управляет созданием и обновлением карточек товаров
- src/components/cardsView.ts - управляет отображением модального окна подробной информации о товаре
- src/components/order.ts - управляет модальным окном заказа и валидацией поля адреса доставки
- src/components/orderSuccess.ts - отображает информацию о списании средств
- src/components/contacts.ts - управляет отображением и валидацией полей email и телефона, а также обработкой кнопки
  оплаты
- src/components/ProductList.ts - управляет состоянием корзины и переключением/удалением продуктов
- src/components/cartView.ts - управляет отображением элементов корзины
- src/components/ProductListView.ts - управляет отображением продуктов и обновлением счетчика корзины
- src/components/orderAddress.ts - управляет отображением и валидацией поля адреса доставки
- src/components/modalBase.ts - базовый класс для модальных окон

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

Приложение построено на основе архитектуры MVP (Model-View-Presenter), которая состоит из трех слоев:

- Модель (Model): Отвечает за логику данных, включая хранение и манипуляцию данными продуктов и корзины
- Представление (View): Компоненты интерфейса, отвечающие за отображение данных и реагирование на действия пользователя
- Презентер (Presenter): Связывает модель и представление, обрабатывая пользовательский ввод и обновляя представление на
  основе изменений в модели

### Слой Модель (Model)

Модель отвечает за данные и логику приложения. Модель включает в себя:

1) сущности ProductItem и CartItem, определенные в файле src/types/index.ts

для сущности Товар (ProductItem)

```
id: string;               Уникальный идентификатор товара
price: number | null;     Цена товара
image: string;            URL изображения товара
category: string;         Категория товара
description: string;      Описание товара
title: string;            Название товара
selected: boolean;        Флаг, выбран ли товар
```

для сущности Элемент корзины (CartItem)
```
id: string;               Уникальный идентификатор товара
title: string;            Название товара
price: number;            Цена товара
```

2) классы

#### ProductList

##### Данные:

- products: ProductItem[] — список продуктов.

##### Методы:

- saveSelectedToStorage(): void — сохраняет состояние корзины в localStorage
- loadSelectedFromStorage(products: ProductItem[]): ProductItem[] — загружает состояние корзины из localStorage
- toggleProductInCart(product: ProductItem): void — переключает состояние продукта в корзине
- removeProductFromCart(productId: string): void — удаляет продукт из корзины

#### Cart

##### Данные:

- items: CartItem[] — список товаров в корзине
- productList: ProductList | null — ссылка на ProductList

##### Методы:

- setProductList(productList: ProductListView): void — устанавливает ссылку на ProductListView
- removeBasketItem(itemId: string): void — удаляет товар из корзины
- updateCartItems(products: ProductItem[]): void — обновляет содержимое корзины
- getTotalPrice(): number — возвращает общую стоимость товаров в корзине

### Слой Представление (View)

Компоненты интерфейса взаимодействуют с пользователем и предоставляют ему визуальную обратную связь.

Основные классы:

#### CartModal

представляет модальное окно корзины и определяет методы open() и close()
для сущности Корзина (CartModal)

```
open(): void;              Открыть корзину
close(): void;             Закрыть корзину
items: CartItem[];         Список товаров в корзине
```

#### Cards

##### Данные:

- cardTemplate: HTMLTemplateElement — шаблон карточки товара
- popupTemplate: HTMLTemplateElement — шаблон модального окна

##### Методы:

- createProductCard(product: ProductItem): HTMLElement — создает карточку товара
- updateCardContent(productCard: HTMLElement, product: ProductItem): void — обновляет содержимое карточки товара
- setCategoryClass(category: HTMLElement, categoryName: string): void — устанавливает класс категории

#### CardsView

##### Данные:

- model: Cards — модель карточек товара

##### Методы:

- openPopup(product: ProductItem, toggleProductInCart: (product: ProductItem) => void): void — открывает модальное окно
  с подробной информацией о товаре

#### OrderView

##### Данные:

- model: Order — модель заказа

##### Методы:

- open(totalPrice: number): void — открывает модальное окно оформления заказа
- setupPaymentButtons(): void — настраивает кнопки выбора способа оплаты
- setupAddressField(): void — настраивает поле ввода адреса доставки
- setupNextButton(totalPrice: number): void — настраивает кнопку "Далее"

#### ContactsModal

##### Данные:

- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
- contactsTemplate: HTMLTemplateElement — шаблон контактной информации

##### Методы:

- open(totalPrice: number): void — открывает модальное окно контактной информации
- setupContactFields(): void — настраивает поля ввода email и телефона
- setupPayButton(totalPrice: number): void — настраивает кнопку оплаты

#### SuccessModal

##### Данные:

- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
- successTemplate: HTMLTemplateElement — шаблон успешного завершения заказа
- totalPrice: number — общая стоимость заказа

##### Методы:

- open(): void — открывает модальное окно успешного завершения заказа
- close(): void — закрывает модальное окно успешного завершения заказа
- clearBasket(): void — очищает корзину

#### ProductListView

##### Данные:

- container: HTMLElement — контейнер для отображения продуктов
- basketCounter: HTMLElement — элемент для отображения счетчика корзины
- basketModal: CartView — модальное окно корзины
- cart: Cart — модель корзины
- cardsView: CardsView — представление карточек товара
- model: ProductList — модель списка продуктов

##### Методы:

- renderProducts(products: ProductItem[]): void — отображает продукты на странице

#### ModalBase

##### Данные:

- modal: HTMLElement: Элемент модального окна
- content: HTMLElement: Элемент содержимого модального окна
- closeButton: HTMLElement: Кнопка закрытия модального окна

##### Методы:

- open(totalPrice?: number): void: Открывает модальное окно, добавляя класс modal_active
- close(): void: Закрывает модальное окно, удаляя класс modal_active
- handleKeyDown(event: KeyboardEvent): void: Обрабатывает событие нажатия клавиши "Escape", закрывая модальное окно

### Слой Презентер (Presenter)

Презентер управляет логикой взаимодействия между моделью и представлением, обрабатывая события и вызывая соответствующие
методы модели. Основная задача презентера — обработка событий, исходящих от представления,
обновление модели на основе действий пользователя и обновление представления на основе изменений в модели

##### Пользовательские события

addEventListener используется для установки обработчиков событий на элементы интерфейса, такие как клики по кнопкам для
открытия корзины и загрузки товаров

- click на кнопку "Закрыть" для закрытия модального окна
- click на кнопку "Добавить в корзину" в карточке товара
- click на кнопку "Убрать" в карточке товара
- click на кнопку "Оформить" в модальном окне корзины
- click на кнопки "Далее" и "Оплатить" в модальных окнах оформления заказа
- click на кнопку "За новыми покупками" в модальном окне успешного завершения заказа
- input в поле адреса доставки в модальном окне оформления заказа
- input в полях email и телефона в модальном окне контактной информации

В index.ts определены функции, которые связывают пользовательские действия с методами моделей и представлений. Эти
функции отвечают за инициализацию и настройку обработчиков событий для ключевых элементов интерфейса:

- loadProducts(api: Api): Функция для настройки взаимодействия с API и получения данных о продуктах
- loadProductsLogic(): Функция для получения и отображения списка продуктов на странице
- updateBasketCounter(): Функция для обновления счетчика товаров в корзине
- toggleProductInCart(product: ProductItem): Функция для добавления или удаления товара из корзины и обновления
  состояния
- removeProductFromCart(productId: string): Функция для удаления товара из корзины и обновления состояния

Эти функции обеспечивают связь между моделью и представлением, позволяя приложению реагировать на действия пользователя
и обновлять интерфейс в реальном времени