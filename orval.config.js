module.exports = {
  api: {
    output: {
      target: './app/src/lib/api/client.ts', //Куда генерируется клиент
      schemas: './app/src/lib/api/model',   //Куда сгенерируются схемы данных в TS интерфейсе
      client: 'axios',
      mock: false,
      clean: true,
      mode: 'single', //В отличие от single создает отдельные файлы для разных частей API
      prettier: true, // Для формирования кода
      override: {
        mutator: {
          path: './app/src/lib/axios-instance.ts', //Путь на кастомный axios
          name: 'customInstance',
        },
      },
      exportAll: true,
    },
    input: {
      target: './nest-backend/openapi.json', // Путь к твоему openapi.json
    },
  },
};