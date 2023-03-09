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
  };

  const fillHolidays = (data) => {
    data.forEach((item) => {
      const startMonth = graph.querySelector(`li[data-month="${dayjs(item.start).month()}"]`);
      const startDay = startMonth.querySelector(`span[data-day="${dayjs(item.start).date()}"]`);
      const endMonth = graph.querySelector(`li[data-month="${dayjs(item.end).month()}"]`);
      const endDay = endMonth.querySelector(`span[data-day="${dayjs(item.end).date()}"]`);
      const diff = dayjs(item.end).diff(dayjs(item.start), 'day');

      createPopup(startMonth.dataset.month, startDay.dataset.day, endMonth.dataset.month, endDay.dataset.day, diff);
      startMonth.addEventListener('mouseover', onStartMonthOver);
      startMonth.addEventListener('mouseout', onStartMonthOut);

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
        endMonth.addEventListener('mouseover', onEndMonthOver);
        endMonth.addEventListener('mouseout', onEndMonthOut);
      }
      
      startDay.classList.add('start-day', 'holiday');
      endDay.classList.add('end-day', 'holiday');
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

  const onStartMonthOver = (evt) => {
    // console.log('current target', evt.currentTarget);
    if (!evt.target.classList.contains('holiday')) {
      return;
    } 
    // console.log('target', evt.target);
    graph.querySelector(`.holiday-popup[data-popup-month="${evt.currentTarget.dataset.month}"]`).style.display = 'block';
  };

  const onStartMonthOut = (evt) => {
    
    if (!evt.target.classList.contains('holiday')) {
      return;
    } 
    console.log('current target', evt.currentTarget.dataset.month);
    const currentMonth = graph.querySelector(`.holiday-popup[data-popup-month="${evt.currentTarget.dataset.month}"]`);
    setTimeout(() => {
      currentMonth.style.display = 'none';
    }, SEC_IN_MS);
  };

  const onEndMonthOver = (evt) => {
    if (!evt.target.classList.contains('holiday')) {
      return;
    }
    // console.log(evt.target);
  };

  const onEndMonthOut = (evt) => {
    if (!evt.target.classList.contains('holiday')) {
      return;
    }
    // console.log(evt.target);
  };

  dayjs.extend(window.dayjs_plugin_isLeapYear);

  if (dayjs(currentYear).isLeapYear()) {
    countDaysInMonth.splice(1, 1, 29);
  }

  renderYear(countDaysInMonth);
  fillHolidays(holidaysData);

})();