import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IProductData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductView } from './components/ProductView';
import { ProductDetailView } from "./components/ProductDetailView";
import { BasketView } from "./components/BasketView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// views
const modalView = new ModalView(ensureElement('#modal-container'));

const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);
console.log('фигняяя');

events.on('product:open', (productData: IProductData) => {
  console.log(`event: `, productData);

  const productElement = detailProductView.render(productData);

  modalView.render({ content: productElement });

  modalView.open();
});

// Получаем карточки с сервера

const promise = api.getProductList();

const newPromise = promise.then((productList) => {

  const basketView = new BasketView(cloneTemplate('#basket'));

  const basketElement = basketView.render({
    products: productList.items.slice(1, 4) // [productList.items[0], productList.items[1], productList.items[3]]
  });
  modalView.render({ content: basketElement });
  modalView.open();

  console.log(productList.items);
  const productsContainer = ensureElement('.gallery');

  for (let i = 0; i < productList.items.length; i++) {
    const productData = productList.items[i];
    const productView = new ProductView(cloneTemplate('#card-catalog'), events);

    const productElement = productView.render(productData);
    productsContainer.appendChild(productElement);
  }
});

newPromise.catch((err) => {
  console.error(err);
});

