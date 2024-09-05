import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IApiOrderData, IOrderData, IPaymentInfoData, IProductDetailViewData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView as CartView } from "./components/CartView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";
import { CartModel } from './components/CartModel';
import { CatalogView } from './components/CatalogView';
import { CatalogModel } from './components/CatalogModel';
import { ContactsView } from './components/ContactsView';
import { PaymentInfoView } from './components/PaymentInfoView';
import { SuccessfulOrderView } from './components/SuccessfulOrderView';
import { OrderModel } from './components/OrderModel';
import { ContactsModal } from './components/ContactsModal';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// models
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);
const catalogModel = new CatalogModel(events);
const contactsModal = new ContactsModal(events);

// views
const modalView = new ModalView(ensureElement('#modal-container'));
const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);
const cartView = new CartView(cloneTemplate('#basket'), events);
const contactsView = new ContactsView(cloneTemplate('#contacts'), events);
const paymentInfoView = new PaymentInfoView(cloneTemplate('#order'), events);
const successfulOrderView = new SuccessfulOrderView(cloneTemplate('#success'), events);
const catalogView = new CatalogView(ensureElement('.gallery'), events);

// отрисовываем пустой каталог, пока с апи не пришли данные
catalogView.render(catalogModel.products);

const contactsViewElement = contactsView.render({
  email: "",
  telephone: ""
});
modalView.render({ content: contactsViewElement });
modalView.open();

events.on('product:open', (idData) => {
  console.log(`eventOpen: `, idData);

  api.getProduct(idData.id).then((productData) => {
    const inCart = cartModel.contains(idData.id);

    const productViewData: IProductDetailViewData = {
      ...productData,
      inCart: inCart
    };

    const productElement = detailProductView.render(productViewData);

    modalView.render({ content: productElement });

    modalView.open();
  })
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
  orderModel.contacts = contactsData;

  const orderData: IOrderData = {
    total: cartModel.total,
    products: cartModel.products,
    contacts: orderModel.contacts,
    paymentInfo: orderModel.paymentInfo,
  };

  const apiOrderData: IApiOrderData = {
    payment: orderModel.paymentInfo.paymentMethod,
    email: orderModel.contacts.email,
    phone: orderModel.contacts.telephone,
    address: orderModel.paymentInfo.adress,
    total: cartModel.total,
    items: cartModel.products.map(productData => productData.id)
  };

  api.sendOrder(apiOrderData).then(() => {
    events.emit('order:completed', orderData);
  });

  modalView.close();
})

events.on('order:completed', orderData => {
  console.log('order:completed', orderData);
  const successfulOrderViewElement = successfulOrderView.render(orderData);
  modalView.render({ content: successfulOrderViewElement });
  modalView.open();
})

events.on('paymentsInfo:submit', (paymentInfoData) => {
  orderModel.paymentInfo = paymentInfoData;

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

events.on('contacts:input-change', (valueInput) => {
  console.log('contacts:input-change', valueInput);
  contactsModal.setField(valueInput.name, valueInput.value);
})

// Получаем карточки с сервера

const productListPromise = api.getProductList();

const newPromise = productListPromise.then((productList) => {
  catalogModel.products = productList.items;
  console.log(productList.items);
});

newPromise.catch((err) => {
  console.error(err);
});

