import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IProductData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductView } from './components/ProductView';
import { ProductDetailView } from "./components/ProductDetailView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// views
const detailModalView = new ModalView(ensureElement('#modal-container'));
const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);

const productElement = detailProductView.render({
  id: '',
  description: '',
  image: '',
  title: '',
  category: '',
  price: null
});

detailModalView.render({ content: productElement });

events.on('product:open', (productData: IProductData) => {
  console.log(`event: `, productData);

  detailProductView.render(productData);
  detailModalView.open();
});

// Получаем карточки с сервера

const promise = api.getProductList();

const newPromise = promise.then((productList) => {
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

