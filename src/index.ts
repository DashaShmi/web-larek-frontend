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
// const productData = new 

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

  const productData = productList.items[0];
  const productView = new ProductDetailView(cloneTemplate('#card-preview'), events);
  const modalView = new ModalView(ensureElement('#modal-container'));
  const productElement = productView.render(productData);
  const pipa = document.createElement("div");
  pipa.textContent = "pipa";
  const modalElement = modalView.render({ content: productElement });

  // modalView.open();
  // modalView.close();
  console.log(modalElement);


});

newPromise.catch((err) => {
  console.error(err);
});

