import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IContactsData, IDeleteProductData, IPaymentInfoData, IProductData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductView } from './components/ProductView';
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView as CartView } from "./components/CartView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";
import { CartModel } from './components/CartModel';
import { CatalogView } from './components/CatalogView';
import { CatalogModel } from './components/CatalogModel';
import { ContactsView } from './components/ContactsView';
import { View } from './components/base/View';
import { PaymentInfoView } from './components/PaymentInfoView';
import { SuccessfulOrderView } from './components/SuccessfulOrderView';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// views
const modalView = new ModalView(ensureElement('#modal-container'));
const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);
const cartView = new CartView(cloneTemplate('#basket'), events);
const contactsView = new ContactsView(cloneTemplate('#contacts'), events);
const paymentInfoView = new PaymentInfoView(cloneTemplate('#order'), events);
const successfulOrderView = new SuccessfulOrderView(cloneTemplate('#success'), events);


// models
const cartModel = new CartModel(events);

events.on('product:open', (productData) => {
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

events.on('product:add_to_cart', (productData) => {
  console.log(`eventAddToCart: `, productData);

  modalView.close();
  cartModel.add(productData);

  const cartElement = cartView.render({
    products: cartModel.products,
    total: cartModel.total
  });
  modalView.render({ content: cartElement });
  modalView.open();

})

events.on('cart:changed', (productsData) => {
  console.log(`cart:changed: `, productsData);
  cartView.render({
    products: cartModel.products,
    total: cartModel.total
  });
});

events.on('cart:item-deleted', (productsId) => {
  console.log(`cart:item-deleted: `, productsId);
  cartModel.delete(productsId.id);
});

events.on('product:remove_from_cart', (productsId) => {
  console.log(`'product:remove_from_cart:' `, productsId);
  cartModel.delete(productsId.id);
  modalView.close();
});

events.on('catalog:changed', (productsData) => {
  console.log(`catalog:changed `, productsData);
  catalogView.render(catalogModel.products);
})

events.on('contacts:submit', (contactsData) => {
  console.log('contacts:submit', contactsData);
  console.log(contactsData);

  const successfulOrderViewElement = successfulOrderView.render({
    total: cartModel.total,
    contacts: contactsData,
    products: cartModel.products,
    paymentInfo: paymentsInfo
  })
  modalView.render({ content: successfulOrderViewElement });
  modalView.open();
})

let paymentsInfo: IPaymentInfoData = {
  paymentMethod: 'online',
  adress: ''
};

events.on('paymentsInfo:submit', (paymentInfoData) => {
  paymentInfoData = paymentInfoData;
  console.log('paymentsInfo:submit', paymentInfoData);
  const contactsViewElement = contactsView.render({
    email: "",
    telephone: ""
  });
  modalView.render({ content: contactsViewElement });
  modalView.open();
  console.log("ищем модалку с контактами")
})

events.on('cart:completed', (productsData) => {
  console.log('cart:completed', productsData)
  const paymentInfoViewElement = paymentInfoView.render({
    paymentMethod: "online",
    adress: "ul.Sezam"
  })
  modalView.render({ content: paymentInfoViewElement });
  modalView.open();
})

// Получаем карточки с сервера

const catalogView = new CatalogView(ensureElement('.gallery'), events);
const catalogModel = new CatalogModel(events);
catalogView.render([]);

const productListPromise = api.getProductList();

const newPromise = productListPromise.then((productList) => {
  catalogModel.setProducts(productList.items);
  console.log(productList.items);
});

newPromise.catch((err) => {
  console.error(err);
});

