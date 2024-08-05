import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { IApi } from './types/contracts';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

// Получаем карточки с сервера
api.getProductList()
  .then((productList) => {
    console.log(productList.items);
  })
  .catch((err) => {
    console.error(err);
  });


// 1) убрать промис олл
// 2) использовать IAppApi в AppApi
// 3) сделать абстрактныый View и из него класс ProductView. render самой писать не надо
