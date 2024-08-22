import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IDeleteProductData, IProductData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductView } from './components/ProductView';
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView as CartView } from "./components/CartView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";
import { CartModel } from './components/CartModel';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// views
const modalView = new ModalView(ensureElement('#modal-container'));
const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);
const cartView = new CartView(cloneTemplate('#basket'), events);

// models
const cartModel = new CartModel(events);

events.on<IProductData>('product:open', (productData) => {
  console.log(`eventOpen: `, productData);

  const inCart = cartModel.contains(productData.id);

  const productViewData = {
    ...productData,
    inCart: inCart
  };

  const productElement = detailProductView.render(productViewData);

  modalView.render({ content: productElement });

  modalView.open();
});

events.on<IProductData>('product:add_to_cart', (productData) => {
  console.log(`eventAddToCart: `, productData);

  modalView.close();
  cartModel.add(productData);

  const cartElement = cartView.render({
    products: cartModel.products,
    counter: cartModel.counter
  });
  modalView.render({ content: cartElement });
  modalView.open();

})

events.on<IProductData[]>('cards:changed', (productsData) => {
  console.log(`cards:changed: `, productsData);
  cartView.render({
    products: cartModel.products,
    counter: cartModel.counter
  });
});

events.on<IDeleteProductData>('cart:item-deleted', (productsId) => {
  console.log(`cart:item-deleted: `, productsId);
  cartModel.delete(productsId.id);
});

// events.on<ICartData>

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

