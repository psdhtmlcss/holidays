'use strict';

(function() {
  const POPUP_WIDTH = 194;
  const Color = {
    GRAY: '#e1e1e1',
    BLUE: '#2067B0'
  };
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentDay = dayjs();
  const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const monthsCases = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  const popupTemplate = document.querySelector('#employeeHolidayPopup').content.querySelector('.holiday-popup-wrapper');

  let countDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  dayjs.extend(window.dayjs_plugin_isLeapYear);

  const getCoords = (elem) => {
    let box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }

  const renderHead = (arr) => {
    const year = document.createElement('div');
    year.classList.add('employees-holidays-graph-row', 'months');
    year.insertAdjacentHTML('afterbegin', '<div>Сотрудник</div>');
    arr.forEach((item) => {
      let month = document.createElement('div');
      month.insertAdjacentHTML('beforeend', item);
      year.append(month);
    })
    employeesGraph.append(year);
  };

  const setDayToday = () => {
    const currentDayElement = employeesGraph.querySelector('.employees-holidays-graph__current-day');
    const currentDayElementText = currentDayElement.querySelector('span');
    const currentMonth = currentDay.month();
    const dayElement = employeesGraph.querySelector(`[data-month="${currentMonth}"] span[data-day="${currentDay.date()}"]`);
    currentDayElementText.textContent = `Сегодня ${currentDay.date()} ${monthsCases[currentMonth]}`;
    currentDayElement.style.left = `${(getCoords(dayElement).left) - getCoords(employeesGraph).left - currentDayElement.offsetWidth / 2}px`;
  };

  const renderEmployeeInfo = (firstName, lastName, post, avatar) => (
    `<div>
      <div class="employee-info">
        <div class="employee-info__avatar"><img src="${avatar}" alt="${firstName} ${lastName}"></div>
        <div class="employee-info__name-and-post">
          <strong>${firstName} ${lastName}</strong>
          <small>${post}</small>
        </div>
      </div>
    </div>`
  );

  const renderMonths = (wrapper) => {
    countDaysInMonth.forEach((item, index) => {
      const month = document.createElement('div');
      month.dataset.month = index;
      for (let i = 1; i <= item; i++) {
        month.insertAdjacentHTML('beforeend', `<span data-day="${i}"></span>`)
      }
      wrapper.append(month);
    })
  };

  const createPeriod = (width, startDate, endDate, diff) => {
    const period = document.createElement('span');
    period.classList.add('holidays');
    period.style.width = `${width}px`;

    if (currentDay.isAfter(dayjs(endDate))) {
      period.classList.add('past');
    } else if (currentDay.isBefore(dayjs(endDate)) && currentDay.isAfter(dayjs(startDate))) {
      const pastDays = dayjs(currentDay).diff(dayjs(startDate), 'day');
      const pastDaysInPercent = Math.round((Number(pastDays) * 100) / Number(diff));
      period.style.background = `linear-gradient(90deg, ${Color.GRAY} 0%, ${Color.GRAY} ${pastDaysInPercent}%, ${Color.BLUE} ${pastDaysInPercent}%, ${Color.BLUE} 100%)`;
    }

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
      end.textContent = `\u2013 ${endDay} ${monthsCases[endMonth]}`;
    }
    
    total.textContent = returnDeclination(diff === 0 ? 1 : diff, 'день', 'дня', 'дней');

    return popup;
  };

  const renderEmployeeGraph = (data, wrapper) => {
    data.forEach((item) => {
      const startMonth = wrapper.querySelector(`div[data-month="${dayjs(item.start).month()}"]`);
      const startDay = startMonth.querySelector(`span[data-day="${dayjs(item.start).date()}"]`);
      const endMonth = wrapper.querySelector(`div[data-month="${dayjs(item.end).month()}"]`);
      const endDay = endMonth.querySelector(`span[data-day="${dayjs(item.end).date()}"]`);
      const diff = dayjs(item.end).diff(dayjs(item.start), 'day');

      let periodWidth;
      if (dayjs(item.start).month() === dayjs(item.end).month()) {
        periodWidth = Number((startDay.getBoundingClientRect().width).toFixed(2)) * (diff === 0 ? 1 : diff + 1);
      } else {
        startMonth.style.justifyContent = 'flex-end';
        const startMonthWidth = ( Number(dayjs(item.start).daysInMonth()) - Number(dayjs(item.start).date()) ) * Number((startDay.getBoundingClientRect().width).toFixed(2));
        const endMonthWidth = Number(dayjs(item.end).date()) * Number((endDay.getBoundingClientRect().width).toFixed(2));
        periodWidth = startMonthWidth + endMonthWidth + 1 + Number((endDay.getBoundingClientRect().width).toFixed(2));
      }
      startDay.append(createPeriod(periodWidth, item.start, item.end, diff));
      startDay.querySelector('.holidays').append(createPopup(startMonth.dataset.month, startDay.dataset.day, endMonth.dataset.month, endDay.dataset.day, diff, periodWidth));
      
    })
  };

  const renderEmployees = (data) => {
    data.forEach((item) => {
      const employeeItem = document.createElement('div');
      employeeItem.classList.add('employees-holidays-graph-row');
      employeeItem.insertAdjacentHTML('afterbegin', renderEmployeeInfo(item.firstName, item.lastName, item.post, item.avatar));
      employeesGraph.append(employeeItem);
      renderMonths(employeeItem);
      renderEmployeeGraph(item.holidays, employeeItem);
    })
  };

  const renderGraph = (data) => {
    if (dayjs(currentYear).isLeapYear()) {
      countDaysInMonth.splice(1, 1, 29);
    }

    renderHead(months);
    renderEmployees(data);
    setDayToday();
  };

  window.renderEmployeesGraph = {
    render: renderGraph
  };

})();
