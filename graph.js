'use strict';
(function() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

  const holidaysData = [
    {
      start: '2023-04-15',
      end: '2023-05-10'
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

  let countDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const renderYear = (arr) => {
    const year = document.createElement('ul');
    arr.forEach((item, index) => {
      let month = document.createElement('li');
      let daysWrapper = document.createElement('div');
      month.dataset.month = index;
      daysWrapper.classList.add('month-days');
      month.insertAdjacentHTML('beforeend', `<div class="month-name">${months[index]}</div>`);
      for(let i = 0; i < item; i++) {
        daysWrapper.insertAdjacentHTML('beforeend', `<span data-day="${i + 1}"></span>`);
      }
      month.append(daysWrapper);
      year.append(month);
    })
    graph.append(year);
  };

  const fillHolidays = (data) => {
    data.forEach((item) => {
      const startMonth = graph.querySelector(`li[data-month="${dayjs(item.start).month()}"]`);
      const startDay = startMonth.querySelector(`span[data-day="${dayjs(item.start).date()}"]`);
      const endMonth = graph.querySelector(`li[data-month="${dayjs(item.end).month()}"]`);
      const endDay = endMonth.querySelector(`span[data-day="${dayjs(item.end).date()}"]`);
      const diff = dayjs(item.end).diff(dayjs(item.start), 'day');

      if (startMonth.dataset.month === endMonth.dataset.month) {
        for (let i = Number(startDay.dataset.day) + 1; i < Number(startDay.dataset.day) + diff; i++) {
          startMonth.querySelector(`span[data-day="${i}"]`).classList.add('holiday');
        }
      } else {
        for (let i = Number(startDay.dataset.day) + 1; i <= countDaysInMonth[startMonth.dataset.month]; i++) {
          startMonth.querySelector(`span[data-day="${i}"]`).classList.add('holiday');
        }
        for (let i = Number(endDay.dataset.day) - 1; i >= 1; i--) {
          endMonth.querySelector(`span[data-day="${i}"]`).classList.add('holiday');
        }
      }
      
      startDay.classList.add('start-day', 'holiday');
      endDay.classList.add('end-day', 'holiday');
    })
  };

  dayjs.extend(window.dayjs_plugin_isLeapYear);

  if (dayjs(currentYear).isLeapYear()) {
    countDaysInMonth.splice(1, 1, 29);
  }

  renderYear(countDaysInMonth);
  fillHolidays(holidaysData);

})();