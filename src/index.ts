import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IProductData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductView } from './components/ProductView';
import { ensureElement } from './utils/utils';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();
// const productData = new 

// Получаем карточки с сервера

const promise = api.getProductList();

const newPromise = promise.then((productList) => {
  console.log(productList.items);

  const productsContainer = ensureElement('.gallery');

  // productList.items.forEach((productData: IProductData) => {
  //   const productView = new ProductView;
  //   const productElement = productView.render(productData);
  //   productContainer.appendChild(productElement);
  // })


  for (let i = 0; i < productList.items.length; i++) {
    const productData = productList.items[i];
    const productView = new ProductView(document.createElement('div'));
    const productElement = productView.render(productData);
    productsContainer.appendChild(productElement);
  }


});

newPromise.catch((err) => {
  console.error(err);
});


// "product:open" (data:IProductData)