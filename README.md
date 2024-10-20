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
- src/components/cartView.ts - представление корзины
- src/components/larekView.ts - представление списка продуктов
- src/components/orderAddress.ts - представление адреса доставки
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

- Модель (Model): Отвечает за логику данных, включая хранение и манипуляцию данными продуктов и корзины.
- Представление (View): Компоненты интерфейса, отвечающие за отображение данных и реагирование на действия пользователя.
- Презентер (Presenter): Связывает модель и представление, обрабатывая пользовательский ввод и обновляя представление на
  основе изменений в модели.

### Слой Модель (Model)

Модель отвечает за данные и логику приложения. Модель включает в себя:
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

#### ProductListModel
##### Данные:
- products: ProductItem[] — список продуктов.
##### Методы:
- saveSelectedToStorage(): void — сохраняет состояние корзины в localStorage.
- loadSelectedFromStorage(products: ProductItem[]): ProductItem[] — загружает состояние корзины из localStorage.
- toggleProductInCart(product: ProductItem): void — переключает состояние продукта в корзине.
- removeProductFromCart(productId: string): void — удаляет продукт из корзины.

#### CartModel

##### Данные:

- items: CartItem[] — список товаров в корзине.
- productList: ProductList | null — ссылка на ProductList.

##### Методы:

- setProductList(productList: ProductListView): void — устанавливает ссылку на ProductListView.
- removeBasketItem(itemId: string): void — удаляет товар из корзины.
- updateCartItems(products: ProductItem[]): void — обновляет содержимое корзины.
- getTotalPrice(): number — возвращает общую стоимость товаров в корзине.

### Слой Представление (View)

Компоненты интерфейса взаимодействуют с пользователем и предоставляют ему визуальную обратную связь.

Основные классы:

#### CartModal

представляет модальное окно корзины и определяет методы open() и close().
для сущности Корзина (CartModal)

```
open(): void;              Открыть корзину
close(): void;             Закрыть корзину
items: CartItem[];         Список товаров в корзине
```

#### CardsModel
##### Данные:

- cardTemplate: HTMLTemplateElement — шаблон карточки товара.
- popupTemplate: HTMLTemplateElement — шаблон модального окна.

##### Методы:
- createProductCard(product: ProductItem): HTMLElement — создает карточку товара.
- updateCardContent(productCard: HTMLElement, product: ProductItem): void — обновляет содержимое карточки товара.
- setCategoryClass(category: HTMLElement, categoryName: string): void — устанавливает класс категории.

#### CardsView
##### Данные:

- model: CardsModel — модель карточек товара.
##### Методы:

- openPopup(product: ProductItem, toggleProductInCart: (product: ProductItem) => void): void — открывает модальное окно
  с подробной информацией о товаре.

#### OrderView
##### Данные:

- model: OrderModel — модель заказа.
##### Методы:

- open(totalPrice: number): void — открывает модальное окно оформления заказа.
- setupPaymentButtons(): void — настраивает кнопки выбора способа оплаты.
- setupAddressField(): void — настраивает поле ввода адреса доставки.
- setupNextButton(totalPrice: number): void — настраивает кнопку "Далее".

#### ContactsModal

##### Данные:

- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна.
- contactsTemplate: HTMLTemplateElement — шаблон контактной информации.

##### Методы:

- open(totalPrice: number): void — открывает модальное окно контактной информации.
- setupContactFields(): void — настраивает поля ввода email и телефона.
- setupPayButton(totalPrice: number): void — настраивает кнопку оплаты.

#### SuccessModal

##### Данные:

- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна.
- successTemplate: HTMLTemplateElement — шаблон успешного завершения заказа.
- totalPrice: number — общая стоимость заказа.

##### Методы:

- open(): void — открывает модальное окно успешного завершения заказа.
- close(): void — закрывает модальное окно успешного завершения заказа.
- clearBasket(): void — очищает корзину.

### Слой Презентер (Presenter)

Презентер управляет логикой взаимодействия между моделью и представлением, обрабатывая события и вызывая соответствующие
методы модели. Основная задача презентера — обработка событий, исходящих от представления,
обновление модели на основе действий пользователя и обновление представления на основе изменений в модели.

##### Пользовательские события

addEventListener используется для установки обработчиков событий на элементы интерфейса, такие как клики по кнопкам для
открытия корзины и загрузки товаров.

- click на кнопку "Закрыть" для закрытия модального окна
- click на кнопку "Добавить в корзину" в карточке товара.
- click на кнопку "Убрать" в карточке товара.
- click на кнопку "Оформить" в модальном окне корзины.
- click на кнопки "Далее" и "Оплатить" в модальных окнах оформления заказа.
- click на кнопку "За новыми покупками" в модальном окне успешного завершения заказа.
- input в поле адреса доставки в модальном окне оформления заказа.
- input в полях email и телефона в модальном окне контактной информации.

#### ProductListView

##### Данные:

- container: HTMLElement — контейнер для отображения продуктов.
- basketCounter: HTMLElement — элемент для отображения счетчика корзины.
- basketModal: CartView — модальное окно корзины.
- cartModel: CartModel — модель корзины.
- cardsView: CardsView — представление карточек товара.
- model: ProductListModel — модель списка продуктов.

##### Методы:

- loadProducts(): void — загружает и отображает продукты на странице.
- renderProducts(products: ProductItem[]): void — отображает продукты на странице.
- updateBasketCounter(): void — обновляет счетчик корзины.
- toggleProductInCart(product: ProductItem): void — переключает состояние продукта в корзине.
- removeProductFromCart(productId: string): void — удаляет продукт из корзины.