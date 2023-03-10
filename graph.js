'use strict';
(function() {
  const SEC_IN_MS = 1000;
  const date = new Date();
  const currentYear = date.getFullYear();
  const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const monthsCases = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  const popupTemplate = document.querySelector('#holidayPopup').content.querySelector('.holiday-popup');

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
    year.addEventListener('mouseover', onYearOver);
    year.addEventListener('mouseout', onYearOut);
  };

  const fillHolidays = (data) => {
    data.forEach((item) => {
      const startMonth = graph.querySelector(`li[data-month="${dayjs(item.start).month()}"]`);
      const startDay = startMonth.querySelector(`span[data-day="${dayjs(item.start).date()}"]`);
      const endMonth = graph.querySelector(`li[data-month="${dayjs(item.end).month()}"]`);
      const endDay = endMonth.querySelector(`span[data-day="${dayjs(item.end).date()}"]`);
      const diff = dayjs(item.end).diff(dayjs(item.start), 'day');

      createPopup(startMonth.dataset.month, startDay.dataset.day, endMonth.dataset.month, endDay.dataset.day, diff);

      if (startMonth.dataset.month === endMonth.dataset.month) {
        for (let i = Number(startDay.dataset.day) + 1; i < Number(startDay.dataset.day) + diff; i++) {
          const day = startMonth.querySelector(`span[data-day="${i}"]`);
          console.log(Math.round(diff / 2));
          day.classList.add('holiday');
          day.dataset.holidayMonth = startMonth.dataset.month;
        }
      } else {
        for (let i = Number(startDay.dataset.day) + 1; i <= countDaysInMonth[startMonth.dataset.month]; i++) {
          const day = startMonth.querySelector(`span[data-day="${i}"]`);
          day.classList.add('holiday');
          day.dataset.holidayMonth = startMonth.dataset.month;
        }
        for (let i = Number(endDay.dataset.day) - 1; i >= 1; i--) {
          const day = endMonth.querySelector(`span[data-day="${i}"]`);
          day.classList.add('holiday');
          day.dataset.holidayMonth = startMonth.dataset.month;
        }
      }
      
      startDay.classList.add('start-day', 'holiday');
      startDay.dataset.holidayMonth = startMonth.dataset.month;
      endDay.classList.add('end-day', 'holiday');
      endDay.dataset.holidayMonth = startMonth.dataset.month;
    })
  };

  const createPopup = (startMonth, startDay, endMonth, endDay, diff) => {
    const popup = popupTemplate.cloneNode(true);
    const start = popup.querySelector('.start-day');
    const end = popup.querySelector('.end-day');
    const total = popup.querySelector('.total-days');

    popup.dataset.popupMonth = startMonth;
    start.textContent = `${startDay} ${monthsCases[startMonth]}`;
    end.textContent = `${endDay} ${monthsCases[endMonth]}`;
    total.textContent = returnDeclination(diff, 'день', 'дня', 'дней');

    graph.append(popup);
  };

  const onYearOver = (evt) => {
    if (!evt.target.classList.contains('holiday')) {
      return;
    }
    graph.querySelector(`.holiday-popup[data-popup-month="${evt.target.dataset.holidayMonth}"]`).style.display = 'block';
  };

  const onYearOut = (evt) => {
    if (!evt.target.classList.contains('holiday')) {
      return;
    }
    const openPopup = graph.querySelector(`.holiday-popup[data-popup-month="${evt.target.dataset.holidayMonth}"]`);
    setTimeout(() => {
      openPopup.style.display = 'none';
    }, SEC_IN_MS);
  };

  dayjs.extend(window.dayjs_plugin_isLeapYear);

  if (dayjs(currentYear).isLeapYear()) {
    countDaysInMonth.splice(1, 1, 29);
  }

  renderYear(countDaysInMonth);
  fillHolidays(holidaysData);

})();