import Axios, { AxiosRequestConfig } from 'axios';

//Переменная для хранения url из .env и доступа к cookies
export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  withCredentials: true,
});

//Обработка ошибок
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source(); //Создание токена для отмены запроса
  
  const promise = AXIOS_INSTANCE({
    ...config,                      //Все настройки
    cancelToken: source.token,      //Токен для отмены
  }).then(({ data }) => data);      //Извлекаем только data из ответа

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');   //Функция отмены запроса
  };

  return promise;
};