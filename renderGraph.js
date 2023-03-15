'use strict';
(function() {
  const POPUP_WIDTH = 194;
  const date = new Date();
  const currentYear = date.getFullYear();
  const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const monthsCases = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  const popupTemplate = document.querySelector('#holidayPopup').content.querySelector('.holiday-popup-wrapper');

  let countDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  dayjs.extend(window.dayjs_plugin_isLeapYear);

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

  const createHolidays = (data) => {
    data.forEach((item) => {
      const startMonth = graph.querySelector(`li[data-month="${dayjs(item.start).month()}"]`);
      const startDay = startMonth.querySelector(`span[data-day="${dayjs(item.start).date()}"]`);
      const endMonth = graph.querySelector(`li[data-month="${dayjs(item.end).month()}"]`);
      const endDay = endMonth.querySelector(`span[data-day="${dayjs(item.end).date()}"]`);
      const diff = dayjs(item.end).diff(dayjs(item.start), 'day');

      const periodWidth = Number(startDay.offsetWidth) * (diff === 0 ? 1 : diff);
      startDay.append(createPeriod(periodWidth));
      startDay.querySelector('.holidays').append(createPopup(startMonth.dataset.month, startDay.dataset.day, endMonth.dataset.month, endDay.dataset.day, diff, periodWidth));
      
    })
  };

  const createPeriod = (width) => {
    const period = document.createElement('span');
    period.classList.add('holidays');
    period.style.width = `${width}px`;
    return period;
  };

  const createPopup = (startMonth, startDay, endMonth, endDay, diff, periodWidth) => {
    const popup = popupTemplate.cloneNode(true);
    const start = popup.querySelector('.start-day');
    const end = popup.querySelector('.end-day');
    const total = popup.querySelector('.total-days');

    popup.style.marginLeft = `-${(POPUP_WIDTH - periodWidth) / 2}px`;
    start.textContent = `${startDay} ${monthsCases[startMonth]}`;
    if (diff !== 0) {
      end.textContent = `– ${endDay} ${monthsCases[endMonth]}`;
    }
    
    total.textContent = returnDeclination(diff === 0 ? 1 : diff, 'день', 'дня', 'дней');

    return popup;
  };

  const renderGraph = (data) => {
    if (dayjs(currentYear).isLeapYear()) {
      countDaysInMonth.splice(1, 1, 29);
    }

    renderYear(countDaysInMonth);
    createHolidays(data);
  };

  window.renderGraph = {
    render: renderGraph
  };

})();