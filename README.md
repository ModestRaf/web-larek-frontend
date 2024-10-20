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
- src/components/cart.ts - работа с корзиной
- src/components/cards.ts - работа с отображением карточек товара
- src/components/order.ts - файл с кодом, связанным с окнами подтверждения заказа и их валидацией
- src/components/orderSuccess.ts - работа с завершающим заказ окном
- src/components/contacts.ts - работа с окном заполнения контактов
- src/components/ProductList.ts - загрузка и отображение карточек товара, корзины

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

Модель (Model): Отвечает за логику данных, включая хранение и манипуляцию данными продуктов и корзины.
Представление (View): Компоненты интерфейса, отвечающие за отображение данных и реагирование на действия пользователя.
Презентер (Presenter): Связывает модель и представление, обрабатывая пользовательский ввод и обновляя представление на основе изменений в модели.

### Слой Модель (Model)

Модель отвечает за данные и бизнес-логику приложения. Модель включает в себя:
1) сущности ProductItem и CartItem, определенные в файле src/types/index.ts.

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
- basketCounter: HTMLElement — элемент для отображения счетчика корзины.
- basketModal: Modal — модальное окно корзины.
##### Методы:
- loadProducts(): Promise<void> — загружает продукты с сервера.
- renderProducts(products: ProductItem[]): void — отображает продукты на странице.
- updateBasketCounter(): void — обновляет счетчик корзины.
- saveSelectedToStorage(): void — сохраняет состояние корзины в localStorage.
- loadSelectedFromStorage(products: ProductItem[]): ProductItem[] — загружает состояние корзины из localStorage.
- renderBasketItems(): void — отображает содержимое корзины.
- toggleProductInCart(product: ProductItem): void — переключает состояние продукта в корзине.
- removeProductFromCart(productId: string): void — удаляет продукт из корзины.

#### Modal
##### Данные:
- items: CartItem[] — список товаров в корзине.
- productList: ProductList | null — ссылка на ProductList.
- orderModal: — модальное окно оформления заказа.
##### Методы:
- setProductList(productList: ProductList): void — устанавливает ссылку на ProductList.
- open(): void — открывает модальное окно корзины.
- close(): void — закрывает модальное окно корзины.
- renderBasketItems(): void — отображает содержимое корзины.
- createBasketItem(item: CartItem, index: number): HTMLElement — создает элемент корзины.
- removeBasketItem(itemId: string): void — удаляет товар из корзины.
- getTotalPrice(): number — возвращает общую стоимость товаров в корзине.

### Слой Представление (View)
Компоненты интерфейса взаимодействуют с пользователем и предоставляют ему визуальную обратную связь. Основные классы:

#### CartModal
представляет модальное окно корзины и определяет методы open() и close().
для сущности Корзина (CartModal)
```
open(): void;              Открыть корзину
close(): void;             Закрыть корзину
items: CartItem[];         Список товаров в корзине
```

#### Cards
##### Данные:
- cardTemplate: HTMLTemplateElement — шаблон карточки товара.

##### Методы:
- createProductCard(product: ProductItem): HTMLElement — создает карточку товара.
- updateCardContent(productCard: HTMLElement, product: ProductItem): void — обновляет содержимое карточки товара.
- setCategoryClass(category: HTMLElement, categoryName: string): void — устанавливает класс категории.
- openPopup(product: ProductItem, toggleProductInCart: (product: ProductItem) => void): void — открывает модальное окно с подробной информацией о товаре.

#### OrderModal
##### Данные:
- modal: HTMLElement — модальное окно оформления заказа.
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна.
##### Методы:
- open(totalPrice: number): void — открывает модальное окно оформления заказа.
- close(): void — закрывает модальное окно оформления заказа.
- setupPaymentButtons(): void — настраивает кнопки выбора способа оплаты.
- setupAddressField(): void — настраивает поле ввода адреса доставки.

#### ContactsModal
##### Данные:
- modal: HTMLElement — модальное окно контактной информации.
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна.
##### Методы:
- open(totalPrice: number): void — открывает модальное окно контактной информации.
- close(): void — закрывает модальное окно контактной информации.
- setupContactFields(): void — настраивает поля ввода email и телефона.

#### SuccessModal
##### Данные:
- modal: HTMLElement — модальное окно успешного завершения заказа.
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна.
- totalPrice: number — общая стоимость заказа.
##### Методы:
- open(): void — открывает модальное окно успешного завершения заказа.
- close(): void — закрывает модальное окно успешного завершения заказа.

###  Слой Презентер (Presenter)
Презентер управляет логикой взаимодействия между моделью и представлением, обрабатывая события и вызывая соответствующие методы модели. Основная задача презентера — обработка событий, исходящих от представления, 
обновление модели на основе действий пользователя и обновление представления на основе изменений в модели.
##### Пользовательские события в проекте отсутствуют.
##### addEventListener используется для установки обработчиков событий на элементы интерфейса, такие как клики по кнопкам для открытия корзины и загрузки товаров.

- `click` на кнопку "Закрыть" для закрытия модального окна
- `click` на кнопку "Добавить в корзину" в карточке товара.
- `click` на кнопку "Убрать" в карточке товара.
- `click` на кнопку "Оформить" в модальном окне корзины.
- `click` на кнопки "Далее" и "Оплатить" в модальных окнах оформления заказа.
- `click` на кнопку "За новыми покупками" в модальном окне успешного завершения заказа.
- `input` в поле адреса доставки в модальном окне оформления заказа.
- `input` в полях email и телефона в модальном окне контактной информации.