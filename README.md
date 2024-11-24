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
- src/components/cardsView.ts - управляет отображением модального окна подробной информации о товаре и созданием
  карточек
- src/components/order.ts - управляет модальным окном заказа и валидацией поля адреса доставки
- src/components/orderSuccess.ts - отображает информацию о списании средств
- src/components/contactsView.ts - управляет отображением и валидацией полей email и телефона, а также обработкой кнопки
  оплаты
- src/components/LarekApi.ts - проверка результата
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
- products: ProductItem[] — список продуктов
##### Методы:

- saveSelectedToStorage(): void — сохраняет состояние корзины в localStorage
- loadSelectedFromStorage(products: ProductItem[]): ProductItem[] — загружает состояние корзины из localStorage
- updateSelectedState(productId: string): void — обновляет состояние выбранного продукта
- clearSelectedProducts(): void — очищает выбранные продукты

#### Cart
##### Данные:

- items: CartItem[] — список товаров в корзине
- productList: IProductList — ссылка на ProductList
##### Методы:

- toggleProductInCart(product: ProductItem, products: ProductItem[]): void — переключает состояние продукта в корзине
- removeProductFromCart(productId: string, products: ProductItem[]): void — удаляет продукт из корзины
- removeBasketItem(itemId: string): void — удаляет товар из корзины
- updateCartItems(products: ProductItem[]): void — обновляет содержимое корзины
- getTotalPrice(): number — возвращает общую стоимость товаров в корзине
- clearCart(): void — очищает корзину
- getSelectedProductsCount(): number — возвращает количество выбранных товаров
- saveCartToStorage(): void — сохраняет корзину в localStorage
- loadCartFromStorage(): void — загружает корзину из localStorage
- notifyProductToggled(product: ProductItem, selectedProductsCount: number): void — уведомляет о переключении продукта
- notifyProductRemoved(productId: string, selectedProductsCount: number): void — уведомляет об удалении продукта
- notifyBasketItemRemoved(itemId: string, selectedProductsCount: number): void — уведомляет об удалении товара из
  корзины

### Слой Представление (View)

Компоненты интерфейса взаимодействуют с пользователем и предоставляют ему визуальную обратную связь

Основные классы:

#### CartView
##### Данные:
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
##### Методы:

- open(): void — открывает модальное окно корзины
- update(): void — обновляет содержимое корзины
- renderBasketItems(): void — отображает элементы корзины
- renderEmptyCart(): void — отображает сообщение о пустой корзине
- renderItems(): void — отображает элементы корзины

#### CardsView
##### Данные:

- cardTemplate: HTMLTemplateElement — шаблон карточки товара
- popupTemplate: HTMLTemplateElement — шаблон модального окна
- selectors: { image: string; title: string; price: string; category: string; button: string; } — селекторы для
  элементов карточки
- categoryClasses: Record<string, string> — классы для категорий
##### Методы:

- createProductCard(product: ProductItem): HTMLElement — создает карточку товара
- updateCardContent(element: HTMLElement, product: ProductItem): void — обновляет содержимое карточки товара
- setCategoryClass(category: HTMLElement | null, categoryName: string): void — устанавливает класс категории

#### OrderView
##### Данные:
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
- orderTemplate: HTMLTemplateElement — шаблон заказа
- model: IOrderModel — модель заказа
- selectedPaymentMethod: string — выбранный способ оплаты
- formSubmitHandler: (event: Event) => void — обработчик отправки формы
- openContactsModal: () => void — функция для открытия модального окна контактной информации
- onSuccess: () => void — функция, вызываемая при успешной отправке формы
##### Методы:
- open(totalPrice: number): void — открывает модальное окно оформления заказа
- setupPaymentButtons(): void — настраивает кнопки выбора способа оплаты
- setupAddressField(): void — настраивает поле ввода адреса доставки
- setupNextButton(): void — настраивает кнопку "Далее"

#### ContactsModal
##### Данные:
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
- contactsTemplate: HTMLTemplateElement — шаблон контактной информации
- contactValidator: IContactValidator — валидатор контактных данных
- onSuccess: () => void — функция, вызываемая при успешной отправке формы
- formSubmitHandler: (event: Event) => void — обработчик отправки формы
- emailField: HTMLInputElement | null — поле ввода email
- phoneField: HTMLInputElement | null — поле ввода телефона
- payButton: HTMLButtonElement | null — кнопка оплаты
- formErrors: HTMLElement | null — элемент для отображения ошибок
##### Методы:
- open(): void — открывает модальное окно контактной информации
- setupContactFields(): void — настраивает поля ввода email и телефона
- setupFormSubmitHandler(): void — настраивает обработчик отправки формы

#### SuccessModal
##### Данные:
- contentTemplate: HTMLTemplateElement — шаблон содержимого модального окна
- successTemplate: HTMLTemplateElement — шаблон успешного завершения заказа
##### Методы:
- open(totalPrice: number): void — открывает модальное окно успешного завершения заказа
- onSuccessClose(): void — вызывается при закрытии модального окна успешного завершения заказа

#### ProductListView
##### Данные:

- container: HTMLElement — контейнер для отображения продуктов
- basketCounter: HTMLElement — элемент для отображения счетчика корзины
- createProductCard: (product: ProductItem) => HTMLElement — функция для создания карточки товара
##### Методы:

- renderProducts(products: ProductItem[]): void — отображает продукты на странице
- updateBasketCounter(selectedProductsCount: number): void — обновляет счетчик товаров в корзине

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

Пользовательские события (Custom Events) в приложении используются для уведомления других компонентов о важных
изменениях состояния или действий пользователя.

###### Где используются Custom Events

- popup:open: Используется для открытия модального окна с подробной информацией о товаре
- productToggled: Используется для уведомления о переключении состояния продукта в корзине
- productRemoved: Используется для уведомления об удалении продукта из корзины
- basketItemRemoved: Используется для уведомления об удалении товара из корзины
- orderSuccessClosed: Используется для уведомления о том, что пользователь закрыл модальное окно успешного завершения
  заказа
- orderSuccess: Используется для уведомления о том, что заказ был успешно отправлен на сервер
- preview:open: Используется для открытия модального окна с предварительным просмотром товара
- toggleProductInCart: Используется для уведомления о переключении состояния продукта в корзине
- removeProductFromCart: Используется для уведомления об удалении продукта из корзины

Обработка событий. События добавляются и обрабатываются в index.ts, чтобы обеспечить взаимодействие между различными
компонентами приложения.

###### addEventListener

Используется для установки обработчиков событий на элементы интерфейса, такие как клики по кнопкам для
открытия корзины и загрузки товаров

- click на кнопку "Закрыть" для закрытия модального окна
- click на кнопку "Добавить в корзину" в карточке товара
- click на кнопку "Убрать" в карточке товара
- click на кнопку "Оформить" в модальном окне корзины
- click на кнопки "Далее" и "Оплатить" в модальных окнах оформления заказа
- click на кнопку "За новыми покупками" в модальном окне успешного завершения заказа
- input в поле адреса доставки в модальном окне оформления заказа
- input в полях email и телефона в модальном окне контактной информации

###### Функции в index.ts
В index.ts определены функции, которые связывают пользовательские действия с методами моделей и представлений. Эти
функции отвечают за инициализацию и настройку обработчиков событий для ключевых элементов интерфейса:

- loadProducts(api: Api): Promise<ProductItem[]>: Функция для настройки взаимодействия с API и получения данных о
  продуктах
- submitOrder(api: Api, order: IOrder): Promise<IOrderResult>: Функция для отправки заказа на сервер
- updateBasketCounter(): void: Функция для обновления счетчика товаров в корзине
- resetCart(): void: Функция для очистки корзины и обновления интерфейса
- loadProductsLogic(): void: Функция для получения и отображения списка продуктов на странице
- handleFormSubmit(event: Event): void: Обработчик отправки формы заказа
- setupContactFields(contactsModal: ContactsModal): void: Функция для настройки полей ввода email и телефона
- setupFormSubmitHandler(contactsModal: ContactsModal): void: Функция для настройки обработчика отправки формы
  контактной информации

Эти функции обеспечивают связь между моделью и представлением, позволяя приложению реагировать на действия пользователя
и обновлять интерфейс в реальном времени