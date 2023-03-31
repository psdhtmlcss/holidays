'use strict';

const holidaysData = [
  {
    start: '2023-09-15',
    end: '2023-09-15'
  },
  {
    start: '2023-06-15',
    end: '2023-07-15'
  },
  {
    start: '2023-11-15',
    end: '2023-11-25'
  }
];

const employeesHolidaysData = [
  {
    holidays: [
      {
        start: '2023-02-15',
        end: '2023-02-25'
      },
      {
        start: '2023-03-29',
        end: '2023-04-25'
      },
      {
        start: '2023-09-15',
        end: '2023-09-15'
      },
      {
        start: '2023-06-15',
        end: '2023-07-15'
      },
      {
        start: '2023-11-15',
        end: '2023-11-25'
      }
    ],
    firstName: 'Александр',
    lastName: 'Попков',
    post: 'Lead UI/UX',
    avatar: 'https://bitrix.axbit.ru/upload/resize_cache/main/6fb/3qx3flbeo8gf86wfc5gnpcka1iu7i0cb/212_212_1/IMG_46262%201%202.png'
  },
  {
    holidays: [
      {
        start: '2023-03-15',
        end: '2023-04-01'
      },
      {
        start: '2023-08-15',
        end: '2023-08-20'
      },
      {
        start: '2023-06-15',
        end: '2023-06-18'
      },
      {
        start: '2023-11-15',
        end: '2023-12-25'
      }
    ],
    firstName: 'Ярослава',
    lastName: 'Дубцова',
    post: 'Lead UI/UX',
    avatar: 'https://bitrix.axbit.ru/upload/resize_cache/main/fe9/j3pzgvw6xouterb6cx0zpn21wrqfnijc/212_212_1/d91125c7-5f6e-4eac-b070-7ac6629df933.png'
  },
];

window.renderGraph.render(holidaysData);
window.renderEmployeesGraph.render(employeesHolidaysData);