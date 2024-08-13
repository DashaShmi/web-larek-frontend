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

## Данные и типы данных, исользуемые в приложении

Товар

```
interface IProductData {
 id: string;
 description: string;
 image: string;
 title: string;
 category: string;
 price: number | null;
}
```

Контакты

```
interface IContactsData {
 email: string;
 telephone: string;
}
```

Данные информации о платеже

```
interface IPaymentInfoData {
 paymentMethod: "online" | "offline";
 adress: string;
}
```

Данные о заказе

```
interface  IOrderData {
 readonly total:number;
 contacts: IContactsData;
 products: IProductData[];
 paymentInfo: IPaymentInfoData;
}
```

Данные модального окна

```
interface IModalData{
  content: HTMLElement;
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

Интерфейс для модели данных продуктов
Events:
"products:changed"(data: IProductData[])"

```
export interface IProductsModel {
 products: IProductData[];
}
```

Интерфейс для модели данных заказа
Events:
"order:changed";

```
export interface IOrderModel {
  contacts: IContactsData;
  products: IProductData[];
  paymentInfo: IPaymentInfoData;
}
```

Интерфейс модели корзины
Events:
"cart:changed"(data:IProductData[]);

```
export interface ICartModel {
  products: IProductData[];
  add(data: IProductData): void;
  delete(productId: string): void;
  counter: number;
}
```


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс View
Класс является дженериком и родителем всех View слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных во View. В конструктор принимает элемент разметки, являющийся основным родительским контейнером View. Содержит метод render, отвечающий за отрисовку данных. (Для ревьюереки коментарий -  хочу оставить abstract render, потому что иначе получается не типизированный код через object.assign. Он  вызывает гетттеры и сеттеры в обход проверки типов)

```
abstract class View<T> {
  abstract render(data: T):HTMLElement;
  element: HTMLElement;
  ...
}
```

#### Класс ViewWithEvents
Класс помогает сократить код и не писать везде  события

```
abstract class ViewWithEvents<T> extends View<T> {
 events: IEvents;
}
```

#### Класс ViewWithForm
Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

```
abstract class ViewWithForm extends ViewWithEvents <T> {
 inputs: HTMLInputElement[];
 form: HTMLFormElement;
 errors: Record<string, HTMLElement>;
 submitButton: HTMLButtonElement;
}
```


#### Класс ModalView
Реализует модальное окно. Так же предоставляет методы `open`, `close` и `render` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 

interface IModalData{
  content: HTMLElement|View;
}

```
class ModalView extends View<IModalData> {
 open(): void;
 close(): void;
 render(data: Partial<IModalData>){
    ... // отображение дочернего View}
}
```

#### Класс ProductView
Расширяет класс View. Предназначен для реализации отобродения оного продукта. 
События - Events:
 "product:open" (data:IProductData);

```
class ProductView extends View<IProductData> {
  render(data: IProductData):HTMLElement;
  }
```

#### Класс ProductListView
Отвечает за отображение блока с товарами на главной странице. В метод render принимает массив элементов разметки продуктов, который отображает в контейнере, за который отвечает.

```
class ProductListView {
 render(data: IProductData[]):HTMLElement;
}
```
#### Класс ProductDetailView
Отвечает за отоброжение продукта с полными данными, когда кликнули по нему.
События - 
Events:
"product:add_to_cart" (data:IProductData);

```class ProductDetailView extends ViewWithForm<IProductData> {
 render(data:IProductData):HTMLElement;
}
```

#### Класс CartView
Расширяет класс ViewWithForm  и предназначен для управления отображением и событиями для интерфейса корзины.  И сосредоточен на работе с массивами данных о продуктах IProductData. Метод render создает HTML-представления корзины и генерирует события для уведомления об изменениях и завершении операций с корзиной.
Events:
"cart:item-deleted"(productId:string);
"cart:competed" (IProductData[]);

```
class CartView extends ViewWithForm<IProductData[]> {
 render(data: IProductData[]):HTMLElement;
}
```

#### Класс PaymentInfoView
Расширяет класс ViewWithForm и отвечает за отображение информации о платеже. Метод render принимает объект данных о платеже и отображает его в контейнере, за который отвечает.
Events:
"payment_info:filled"(data:IPaymentInfoData);

```
class PaymentInfoView extends ViewWithForm<IPaymentInfoData> {
 render(data: IPaymentInfoData)HTMLElement;
}
```

#### Класс ContactsView
Расширяет класс ViewWithForm, метод render принимает объект данных о контактах и отображает его в контейнере.
События - 
Events:
"contacts_info:filled"(data:IContactsData);

```
class ContactsView extends ViewWithForm<IContactsData>{
 render(data:IContactsData):HTMLElement;
}
```

#### Класс SuccessfulOrderView
Расширяет класс ViewWithEvents и отвечает за отображение информации об успешном заказе. Метод render принимает объект данных о заказе и отображает его в контейнере.
События - 
Events:
"order:complete"(IOrderData);


```
class SuccessfulOrderView extends ViewWithEvents <IOrderData> {
 render (data:IOrderData): HTMLElement;
}
```

### Слой коммуникации

#### interface AppApi
Принимает в конструктор экземпляр класса Api в будующем, и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

```
interface IAppApi {
 getProductList(): Promise<IListResponse<IProductData>>;
 getProduct(id: string): Promise<IProductData>;
}
```


#### interface IListResponse
Интерфейс используется для описания структуры ответа с сервера, который содержит список товаров.

```
export interface IListResponse<T> {
 total: number;
 items: T[];
}
```

#### interface IApi
Описывает структуру объекта, который используется для взаимодействия с API. Этот интерфейс включает базовый URL для API, а также методы для выполнения GET и POST запросов.
```
interface IApi {
 baseUrl: string;
 get<T>(uri: string): Promise<T>;
 post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `products:changed` - изменение данных о продукте
- `cart:changed` изменение данных в корзине
- `order:changed`  изменение деталей заказа

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `product:open` - открытие модального окна для детального просмотра товара
- `product:add_to_cart` - добавление товара в корзину
- `cart:item-deleted` - удаление товара из корзины
- `сart:competed` - утвердили список товаров, кторорые хотим купить
- `card:delete` - выбор карточки для удаления
- `payment_info:filled` - выбрали способ платежа
- `contacts_info:filled` - заполненли котактные данные покупателя
- `order:complete` - оформили заказ
  

- написать класс ProductViewBase