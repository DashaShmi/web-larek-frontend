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
 paymentMethod: PaymentMethod;
 address: string;
}
```

Данные о заказе

```

export interface IOrderData {
  readonly total: number;
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
- `handleResponse` - обрабатывает ответ от сервера, проверяет, успешен ли запрос, и возвращает данные в формате JSON или ошибку.
  

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

Интерфейс для модели данных продуктов
Events:
'product:open': (data: IIdData);
'product:add_to_cart': (data: IProductData);
'product:remove_from_cart': (data: IIdData);

```
export interface ICatalogModel {
  products: IProductData[];
}
```

Интерфейс для модели данных заказа
Events:
  'order:completed': (data: IOrderData);
  'order:close': void;

Интерфейс модели корзины
Events:
  'cart:changed': void;
  'cart:item-deleted': IIdData;
  'cart:completed':void;
  'cart:open': void;

```
export interface ICartModel {
  products: IProductData[];
  add(data: IProductData): void;
  delete(productId: string): void;
  total: number;
  contains(productId: string): boolean;
  reset(): void;
}
```

#### Класс CartModel
CartModel — это модель данных корзины покупок, которая управляет состоянием корзины, включая добавление и удаление продуктов, а также вычисление общей стоимости товаров. Наследуется от ModelBase<IAppEventScheme> и реализует интерфейс ICartModel
Конструктор класса принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

- _products: IProductData[] - массив объектов продуктов, добавленных в корзину.
- _total: number - общая стоимость продуктов в корзине.
events: IEvents<IAppEventScheme> - экземпляр класса EventEmitter для инициации событий при изменении данных корзины.
Класс предоставляет набор методов для взаимодействия с этими данными:
- contains(productId: string): boolean
Проверяет, содержится ли продукт с заданным идентификатором в корзине.
- add(data: IProductData): void
Добавляет продукт в корзину. Если продукт с таким идентификатором уже существует в корзине, не добавляет его. Обновляет общую стоимость корзины и вызывает событие cart:changed.
- delete(productId: string): void
Удаляет продукт из корзины по его идентификатору. Если продукт найден, обновляет общую стоимость корзины и вызывает событие cart:changed.
- reset(): void
Очищает корзину, удаляя все продукты и сбрасывая общую стоимость до нуля. Вызывает событие cart:changed.
- get products(): IProductData[]
Геттер, возвращающий массив всех продуктов в корзине.
- get total(): number
Геттер, возвращающий общую стоимость продуктов в корзине.

#### Класс CatalogModel
Класс CatalogModel отвечает за хранение и управление данными каталога продуктов. Наследуется от ModelBase<IAppEventScheme> и реализует интерфейс ICatalogModel.
Конструктор класса принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

- _products: IProductData[] - массив объектов продуктов, доступных в каталоге.
Класс предоставляет следующие методы и свойства для взаимодействия с этими данными:
- get products(): IProductData[]
Геттер, возвращающий массив всех продуктов, доступных в каталоге.
- set products(newProducts: IProductData[]): void
Сеттер, обновляющий массив продуктов в каталоге новыми данными. После обновления генерирует событие catalog:changed, передавая обновленный массив продуктов в качестве параметра.

#### Класс ContactsModel
Класс ContactsModel наследуется от ModelWithValidation<IContactsData, IAppEventScheme> и отвечает за управление данными формы контактов, включая валидацию введенных пользователем данных.

Класс предоставляет набор методов для работы с данными формы:
- setField(name: string, value: string): void
Устанавливает значение для указанного поля формы.
Параметры:
name - строка, имя поля (email или phone).
value - строка, значение, которое нужно установить.
Логика:
Проверяет корректность имени поля. Если имя некорректное, выводит сообщение об ошибке в консоль.
Устанавливает новое значение для поля и вызывает метод валидации validate.
- validate(): void
Защищенный метод, проверяет данные формы на корректность и обновляет состояние ошибок.

#### Класс PaymentInfoModel
Класс PaymentInfoModel отвечает за управление данными формы для информации об оплате, включая валидацию введенных данных. Наследуется от ModelWithValidation<IPaymentInfoData, IAppEventScheme>.
Конструктор класса принимает инстанс брокера событий.

- setField(name: string, fieldValue: string): void
Устанавливает значение для указанного поля формы.
Параметры:
name - строка, имя поля (address или paymentMethod).
fieldValue - строка, значение, которое нужно установить.
Логика:
В зависимости от имени поля вызывает соответствующий метод (setAddress или setPaymentMethod).
Если имя поля не соответствует ожидаемым, выводит сообщение об ошибке в консоль.
Вызывает метод валидации validateOrder.

- setAddress(fieldValue: string): void
Прииватный метод, устанавливает значение для поля address.
Параметры:
fieldValue - строка, новое значение адреса.

- setPaymentMethod(fieldValue: string): void
Приватный метод, устанавливает значение для поля paymentMethod (способ оплаты).
Параметры:
fieldValue - строка, новое значение способа оплаты. Может быть 'online', 'offline', или пустой строкой.
Логика:
Проверяет корректность значения. Если значение некорректно, выводит сообщение об ошибке в консоль.

- validateOrder(): void
Защищенный метод, проверяет данные формы на корректность и обновляет состояние ошибок.
Логика:
Создает объект errors для хранения ошибок валидации.
Проверяет поле address на наличие значения.
Проверяет поле paymentMethod на корректность и наличие значения.
Обновляет внутреннее состояние ошибок и флага валидности (isValid).
Генерирует событие paymentsInfo:error-change с обновленным объектом данных формы.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс View
Класс является дженериком и родителем всех View слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных во View. В конструктор принимает элемент разметки, являющийся основным родительским контейнером View. Содержит метод render, отвечающий за отрисовку данных. //!(Для ревьюера коментарий -  хочу оставить abstract render, потому что иначе получается не типизированный код через object.assign. Он  вызывает гетттеры и сеттеры в обход проверки типов)!

```
abstract class View<T> {
  abstract render(data: T):HTMLElement;
  element: HTMLElement;
  ...
}
```

#### Класс ViewWithEvents
Класс ViewWithEvents расширяет функциональность базового абстрактного класса View, добавляя поддержку событий. Класс используется для представлений, которые не только рендерят данные, но и взаимодействуют с другими компонентами через систему событий. Класс помогает сократить код и не писать везде  события.

```
abstract class ViewWithEvents<T> extends View<T> {
 events: IEvents;
}
```

#### Класс ViewWithForm
Класс ViewWithForm расширяет функциональность класса ViewWithEvents, добавляя поддержку работы с HTML-формами. Этот класс используется для представлений, которые включают в себя формы с полями ввода и кнопкой отправки, а также поддерживают обработку событий, связанных с изменением данных формы и ее отправкой.
Класс служит основой для всех классов представлений, которые работают с формами и требуют обработки событий изменения полей ввода и отправки формы. Дочерние классы должны реализовать методы onSubmit и onInputChange для определения специфической логики обработки этих событий.

```
abstract class ViewWithForm extends ViewWithEvents<T> {
  form: HTMLFormElement;
  formName: string;
  inputs: NodeListOf<HTMLInputElement>;
  submitButton: HTMLButtonElement;
}
```
- onSubmit(): void
Абстрактный метод, который должен быть реализован в дочерних классах. Определяет логику, которая будет выполняться при отправке формы.

- onInputChange(name: string, value: string): void
Абстрактный метод, который должен быть реализован в дочерних классах. Определяет логику, которая будет выполняться при изменении значения любого поля ввода формы.
Параметры:
name - строка, имя поля ввода, значение которого было изменено.
value - строка, новое значение поля ввода.

#### Класс ModalView
Реализует модальное окно. Так же предоставляет методы `open`, `close` и `render` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 
События:
'modal:open':void;
'modal:close':void;

```
class ModalView extends View<IModalData> {
  modalContent: HTMLElement;
  open(): void;
  close(): void;
  render(data: Partial<IModalData>);
  handleEscUpevt(evt:KeyboardEvent);
}
```
- open(): void
Открывает модальное окно:
Добавляет класс 'modal_active' к элементу модального окна для его отображения.
Устанавливает обработчик события keyup для закрытия окна при нажатии клавиши Escape.

- close(): void
Закрывает модальное окно:
Удаляет класс 'modal_active' из элемента модального окна для его скрытия.
Удаляет обработчик события keyup.
  
- render(data: Partial<IModalData>): HTMLElement
Обновляет содержимое модального окна:
Проверяет, передано ли новое содержимое (content). Если да, заменяет текущее содержимое в modalContent.
Возвращает HTML-элемент модального окна.

- handleEscUp(evt: KeyboardEvent): void
Обработчик события нажатия клавиши Escape:
Закрывает модальное окно при нажатии клавиши Escape.

#### Класс ProductViewBase
Это обобщенный класс, предназначенный для отображения информации о продукте. Он наследуется от ViewWithEvents<T>, где T — тип данных, расширяющий IProductData. Класс обеспечивает рендеринг информации о продукте, включая название, изображение, цену и категорию, и динамически изменяет стили в зависимости от категории продукта.

```

class ProductViewBase<T extends IProductData> extends ViewWithEvents<T> {
  private readonly title: HTMLHeadingElement;
  private readonly image: HTMLImageElement;
  private readonly price: HTMLElement;
  private readonly category: HTMLElement;
  protected data?: T;
  render(data: T): HTMLElement;
}
  ```
- render(data: T): HTMLElement
Отображает данные о продукте в HTML-элементе и обновляет стили в зависимости от категории продукта.
Параметры:
data - объект типа T, содержащий данные о продукте, такие как title, image, price, и category.
Логика:
Устанавливает текстовое содержимое заголовка, URL изображения, цену и категорию продукта.
Обновляет стили категории в зависимости от типа продукта, используя класс из заранее определенного объекта map.
Возвращаемое значение: HTMLElement — обновленный HTML-элемент с отображаемыми данными продукта.

#### Класс ProductView
Класс ProductView отвечает за управление представлением продукта и обработку событий, связанных с продуктом. Наследуется от ProductViewBase<IProductData>, добавляя функциональность для оброботки кликов на элементе продукта. При клике на продукт генерируется событие product:open, что позволяет другим частям приложения реагировать на это действие, например, открывать подробное представление продукта.
События - Events:
 'product:open': (data: IIdData)

```
class ProductView extends ProductViewBase<IProductData> {
  render(data: IProductData):HTMLElement;
  }
```

#### Класс CatalogView
Класс CatalogView отвечает за отображение каталога элементов на странице. Наследуется от ViewWithEvents<ICatalogData, IAppEventScheme>, что позволяет использовать возможности рендеринга данных и управления событиями.

```
class CatalogView extendsViewWithEvents<ICatalogData, IAppEventScheme>{
  render(data: ICatalogData): HTMLElement;
}
```
- render(data: ICatalogData): HTMLElement
Переопределяет метод render базового класса для отображения данных каталога в HTML-элементе.
Параметры:
data - объект типа ICatalogData, содержащий элементы каталога, которые нужно отобразить.
Логика:
Заменяет все дочерние элементы в element на новые элементы из data.elements.
Возвращаемое значение: HTMLElement — обновленный HTML-элемент с отображаемым каталогом.

#### Класс ProductDetailView
Класс ProductDetailView отвечает за отображение детальной информации о продукте и взаимодействие с корзиной покупок. Наследуется от ProductViewBase<IProductDetailViewData>, добавляя функциональность для отображения описания продукта и кнопки добавления/удаления из корзины.
Events:
'product:add_to_cart': (data: IProductData);
'product:remove_from_cart'

```
export class ProductDetailView extends ProductViewBase<IProductDetailViewData> {
  private readonly description: HTMLElement;
  private readonly btnAddToCart: HTMLElement;
  render(data: IProductDetailViewData):HTMLElement;
}
```
- render(data: IProductDetailViewData): HTMLElement
Переопределяет метод render базового класса для отображения детальной информации о продукте.
Параметры:
data - объект типа IProductDetailViewData, содержащий данные продукта, которые нужно отобразить.
Логика:
Вызывает метод render базового класса ProductViewBase для отображения основных данных продукта.
Устанавливает текстовое содержимое элемента описания (description).
Обновляет текст кнопки добавления/удаления в зависимости от того, находится ли продукт в корзине (data.inCart).
Возвращаемое значение: HTMLElement — обновленный HTML-элемент с отображаемой детальной информацией о продукте.

#### Класс CartView
Класс CartView отвечает за отображение содержимого корзины покупок на странице. Наследуется от ViewWithEvents<ICartData, IAppEventScheme>, что позволяет использовать возможности рендеринга данных и управления событиями. Обеспечивает динамическое обновление данных корзины и поддерживает обработку пользовательских действий, таких как нажатие кнопки для оформления заказа.
Events:
  'cart:changed': (data: IProductData[]);
  'cart:item-deleted': (data: IIdData);

```

class CartView extends ViewWithEvents<ICartData, IAppEventScheme> {
  private readonly listUl: HTMLElement;
  private readonly cartCount: HTMLElement;
  render(data: ICartData):HTMLElement;
}
```

#### Класс PaymentInfoView
Класс PaymentInfoView отвечает за отображение и управление формой ввода информации об оплате. Наследуется от ViewWithForm<IDataWithErrors<IPaymentInfoData>, IAppEventScheme>, добавляя функциональность для обработки ввода данных, их валидации и отправки формы.

Events:
'paymentsInfo:submit'
'paymentsInfo:input-change'

```
class PaymentInfoView extends ViewWithForm<IPaymentInfoData> {
  private readonly buttonOnline: HTMLButtonElement;
  private readonly buttonOffline: HTMLButtonElement;
  private readonly inputAdress: HTMLInputElement;
  private readonly formErrors: HTMLElement;
  render(data: IPaymentInfoData)HTMLElement;
}
```

#### Класс ContactsView
Класс ContactsView отвечает за отображение и управление формой ввода контактной информации. Наследуется от ViewWithForm<IDataWithErrors<IContactsData>, IAppEventScheme>, добавляя функциональность для обработки ввода данных, их валидации и отправки формы.
События - 
Events:
'contacts:submit'
'contacts:input-change'

```
class ContactsView extends ViewWithForm<IContactsData>{
  private readonly formErrors: HTMLElement;
  private readonly inputEmail: HTMLInputElement;
  private readonly inputPhone: HTMLInputElement;
  render(data: IContactsData):HTMLElement;
}
```

#### Класс SuccessfulOrderView
Класс SuccessfulOrderView отвечает за отображение информации об успешном оформлении заказа и обработку действий пользователя после завершения покупки. Наследуется от ViewWithEvents<ISuccessfulOrderData, IAppEventScheme>, добавляя функциональность для отображения итоговой суммы и закрытия окна успешного заказа.

```
class SuccessfulOrderView extends ViewWithEvents <IOrderData> {
  private readonly totalElement: HTMLElement;
  private readonly buttonNewShop: HTMLButtonElement;
  render (data:IOrderData): HTMLElement;
}
```

### Слой коммуникации

#### Класс AppApi
Класс AppApi реализует интерфейс IAppApi и отвечает за взаимодействие с API приложения. Использует экземпляр базового API (IApi) для отправки HTTP-запросов на сервер и получения данных.

```
class AppApi implements IAppApi{
  private _baseApi: IApi;
  sendOrder(data: IApiOrderData): Promise<IOrderResponse>;
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

#### Класс IApi
Класс Api реализует интерфейс IApi и отвечает за отправку HTTP-запросов к серверу. Предоставляет методы для выполнения GET и POST запросов и обработки ответов от сервера.

```
export class Api implements IApi {
  readonly baseUrl: string;
  protected options: RequestInit;
  protected handleResponse<T>(response: Response): Promise<T>;
  async get<T>(uri: string);
  post<T>(uri: string, data: object, method: ApiPostMethods);
}
```

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `catalog:changed'` - изменение данных о продукте
- `cart:changed` - изменение данных в корзине
- `order:changed` - изменение деталей заказа


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `product:open` - открытие модального окна для детального просмотра товара
- `product:add_to_cart` - добавление товара в корзину
- `product:remove_from_cart` - удаление товара из корзины

- `cart:open` - корзину открыли с главной страницы
- `сart:completed` - утвердили список товаров, которые хотим купить
- `cart:changed` - данные в корзине изменились
- `cart:item-deleted` - данные в корзине удалили

- `catalog:changed` - каталог изменился, нельзя добавить товар повтрно в корзину

- `contacts:submit` - заполнили контактные данные покупателя
- `contacts:input-change` - один инпут изменился в поле контактов
- `contacts:error-change` - следим за ошибками

- `paymentsInfo:submit` - выбрали способ платежа
- `paymentsInfo:error-change` - следим за ошибками
- `paymentsInfo:input-change` - один инпут изменился в поле плптежей
- `order:completed` - заказ завершен
- `order:close` - закрываем модалку с упешным заказом

- `modal:open` - модалка о окрыта
- `modal:close` - модалка закрыта


  
