import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Получаем карточки с сервера
Promise.all([api.getProducts()])
  .then(([products]) => {
    console.log(products);
  })
  .catch((err) => {
    console.error(err);
  });