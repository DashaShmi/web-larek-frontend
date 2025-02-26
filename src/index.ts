import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi, IApiOrderData, IAppEventScheme, ICartData, IProductDetailViewData } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/events';
import { ProductDetailView } from "./components/views/ProductDetailView";
import { CartView as CartView } from "./components/views/CartView";
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from "./components/base/ModalView";
import { CatalogView } from './components/views/CatalogView';
import { CatalogModel } from './components/models/CatalogModel';
import { ContactsView } from './components/views/ContactsView';
import { PaymentInfoView } from './components/views/PaymentInfoView';
import { SuccessfulOrderView } from './components/views/SuccessfulOrderView';
import { ContactsModel } from './components/models/ContactsModel';
import { PaymentInfoModel } from './components/models/PaymentInfoModel';
import { CartModel } from './components/models/CartModel';
import { PageView } from './components/views/PageView';
import { CartItemView } from './components/views/CartItemView';
import { ProductView } from './components/views/ProductView';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);
const events = new EventEmitter<IAppEventScheme>();

// models
const cartModel = new CartModel(events);
const catalogModel = new CatalogModel(events);
const contactsModel = new ContactsModel(events);
const paymentInfoModel = new PaymentInfoModel(events);

// views
const pageView = new PageView(ensureElement('.page'), events);
const cartView = new CartView(cloneTemplate('#basket'), events);
const modalView = new ModalView(ensureElement('#modal-container'), events);
const catalogView = new CatalogView(ensureElement('.gallery'), events);
const contactsView = new ContactsView(cloneTemplate('#contacts'), events);
const paymentInfoView = new PaymentInfoView(cloneTemplate('#order'), events);
const successfulOrderView = new SuccessfulOrderView(cloneTemplate('#success'), events);
const detailProductView = new ProductDetailView(cloneTemplate('#card-preview'), events);

function renderCart(): HTMLElement {
  const liArray: HTMLElement[] = [];

  for (let i = 0; i < cartModel.products.length; i++) {
    const productData = cartModel.products[i];

    const cartItemView = new CartItemView(cloneTemplate('#card-basket'), events);
    const cartItemElement = cartItemView.render({
      title: productData.title,
      price: productData.price,
      index: `${i + 1}`,
      id: productData.id
    })

    liArray.push(cartItemElement);
  }

  const cartElement = cartView.render({
    elements: liArray,
    total: cartModel.total,
    isValid: cartModel.isValid,
  });

  return cartElement;
}

events.on('product:open', (idData) => {
  console.log(`eventOpen: `, idData);

  api
    .getProduct(idData.id)
    .then((productData) => {
      const inCart = cartModel.contains(idData.id);

      const productViewData: IProductDetailViewData = {
        ...productData,
        inCart: inCart
      };

      const productElement = detailProductView.render(productViewData);

      modalView.render({ content: productElement });

      modalView.open();
    })
    .catch(e => {
      console.error(e);
      alert('Ошибка получения продукта');
    })

});

events.on('product:add_to_cart', (productData) => {
  console.log(`eventAddToCart: `, productData);

  modalView.close();
  cartModel.add(productData);

  const cartElement = renderCart();

  modalView.render({ content: cartElement });
  modalView.open();
})

events.on('cart:changed', () => {
  console.log(`cart:changed`);

  renderCart();

  pageView.render({ count: cartModel.products.length });
});

events.on('cart:item-deleted', (productsId) => {
  console.log(`cart:item-deleted`, productsId);
  cartModel.delete(productsId.id);
});

events.on('cart:open', () => {
  console.log(`cart:open`);

  const cartElement = renderCart();

  modalView.render({ content: cartElement });
  modalView.open();
})

events.on('product:remove_from_cart', (productsId) => {
  console.log(`product:remove_from_cart:`, productsId);
  cartModel.delete(productsId.id);
  modalView.close();
});

events.on('catalog:changed', (productsData) => {
  console.log(`catalog:changed `, productsData);

  const productElements: HTMLElement[] = [];

  for (let i = 0; i < productsData.length; i++) {
    const productData = productsData[i];
    const productView = new ProductView(cloneTemplate('#card-catalog'), events);
    const productElement = productView.render(productData);
    productElements.push(productElement);
  }

  catalogView.render({ elements: productElements });
})

events.on('contacts:submit', () => {
  console.log('contacts:submit');

  const apiOrderData: IApiOrderData = {
    payment: paymentInfoModel.data.value.paymentMethod,
    email: contactsModel.data.value.email,
    phone: contactsModel.data.value.phone,
    address: paymentInfoModel.data.value.address,
    total: cartModel.total,
    items: cartModel.products
      .filter(x => x.price !== null)
      .map(productData => productData.id)
  };

  api
    .sendOrder(apiOrderData)
    .then(() => {
      events.emit('order:completed', {
        total: cartModel.total,
      });

      // очистка данных
      paymentInfoModel.reset();
      contactsModel.reset();
      cartModel.reset();
    })
    .catch(e => {
      console.error(e);
      alert('Ошибка отправки заказа');
    });

  modalView.close();
})

events.on('order:completed', orderData => {
  console.log('order:completed', orderData);

  const successfulOrderViewElement = successfulOrderView.render(orderData);
  modalView.render({ content: successfulOrderViewElement });
  modalView.open();
})

events.on('order:close', () => {
  console.log('order:close');
  modalView.close();
})

events.on('paymentsInfo:submit', () => {
  console.log('paymentsInfo:submit');
  const contactsViewElement = contactsView.render(contactsModel.data);
  modalView.render({ content: contactsViewElement });
  modalView.open();
})

events.on('cart:completed', () => {
  console.log('cart:completed')
  const paymentInfoViewElement = paymentInfoView.render(paymentInfoModel.data);
  modalView.render({ content: paymentInfoViewElement });
  modalView.open();
})

events.on('contacts:input-change', (valueInput) => {
  console.log('contacts:input-change', valueInput);
  contactsModel.setField(valueInput.name, valueInput.value);
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

events.on('modal:open', () => {
  console.log('modal:open');
  pageView.render({ isLocked: true });
})

events.on('modal:close', () => {
  console.log('modal:close');
  pageView.render({ isLocked: false });
})

// Получаем карточки с сервера

api
  .getProductList()
  .then((productList) => {
    catalogModel.products = productList.items;
    console.log(productList.items);
  })
  .catch(e => {
    console.error(e);
    alert('Ошибка получения списка продуктов');
  })
