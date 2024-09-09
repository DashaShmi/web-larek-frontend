import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IApiOrderData, ICartData, IProductDetailViewData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductDetailView } from "./components/ProductDetailView";
import { CartView as CartView } from "./components/views/CartView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";
import { CatalogView } from './components/views/CatalogView';
import { CatalogModel } from './components/models/CatalogModel';
import { ContactsView } from './components/ContactsView';
import { PaymentInfoView } from './components/PaymentInfoView';
import { SuccessfulOrderView } from './components/SuccessfulOrderView';
import { ContactsModel } from './components/models/ContactsModal';
import { PaymentInfoModel } from './components/models/PaymentInfoModel';
import { CartModel } from './components/models/CartModel';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events: IEvents = new EventEmitter();

// models
const cartModel = new CartModel(events);
const catalogModel = new CatalogModel(events);
const contactsModal = new ContactsModel(events);
const paymentInfoModel = new PaymentInfoModel(events);

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

events.on('contacts:submit', () => {
  console.log('contacts:submit');

  const apiOrderData: IApiOrderData = {
    payment: paymentInfoModel.data.value.paymentMethod,
    email: contactsModal.data.value.email,
    phone: contactsModal.data.value.phone,
    address: paymentInfoModel.data.value.address,
    total: cartModel.total,
    items: cartModel.products.map(productData => productData.id)
  };

  api.sendOrder(apiOrderData).then(() => {
    events.emit('order:completed', {
      total: cartModel.total,
    });
  });

  modalView.close();
})

events.on('order:completed', orderData => {
  console.log('order:completed', orderData);

  // очистка контактов
  contactsModal.reset();

  const successfulOrderViewElement = successfulOrderView.render(orderData);
  modalView.render({ content: successfulOrderViewElement });
  modalView.open();
})

events.on('order:close', () => {
  console.log('order:close');
  modalView.close();
  cartModel.reset();
})

events.on('paymentsInfo:submit', () => {
  console.log('paymentsInfo:submit');
  const contactsViewElement = contactsView.render(contactsModal.data);
  modalView.render({ content: contactsViewElement });
  modalView.open();
  console.log("ищем модалку с контактами")
})

events.on('cart:completed', (productsData) => {
  console.log('cart:completed', productsData)
  const paymentInfoViewElement = paymentInfoView.render(paymentInfoModel.data);
  modalView.render({ content: paymentInfoViewElement });
  modalView.open();
})

events.on('contacts:input-change', (valueInput) => {
  console.log('contacts:input-change', valueInput);
  contactsModal.setField(valueInput.name, valueInput.value
  );
})

events.on('contacts:error-change', (contactData) => {
  console.log('contacts:error-change', contactData);
  contactsView.render(contactData);
})

events.on('paymentsInfo:input-change', (valueInput) => {
  console.log('paymentsInfo:input-change', valueInput);
  paymentInfoModel.setField(valueInput.name, valueInput.value)
})

events.on('paymentsInfo:error-change', (paymentsData) => {
  console.log('paymentsInfo:error-change', paymentsData);
  paymentInfoView.render(paymentsData)
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

