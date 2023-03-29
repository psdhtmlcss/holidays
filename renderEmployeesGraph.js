'use strict';

(function() {
  const POPUP_WIDTH = 194;
  const date = new Date();
  const currentYear = date.getFullYear();
  const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const monthsCases = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  // const popupTemplate = document.querySelector('#holidayPopup').content.querySelector('.holiday-popup-wrapper');

  let countDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  dayjs.extend(window.dayjs_plugin_isLeapYear);

  const renderHead = (arr) => {
    const year = document.createElement('ul');
    year.classList.add('employees-holidays-graph__head');
    year.insertAdjacentHTML('afterbegin', '<li class="employee-col">Сотрудник</li>');
    arr.forEach((item, index) => {
      let month = document.createElement('li');
      month.classList.add('month-col');
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
    employeesGraph.append(year);
  };

  const renderEmployeeInfo = (firstName, lastName, post, avatar) => (
    `<li>${firstName}, ${lastName}, ${post}</li>`
  );

  const renderEmployeeGraph = (data) => {
    console.log('holidays', data);
  };

  const renderEmployees = (data) => {
    data.forEach((item) => {
      const employeeItem = document.createElement('ul');
      employeeItem.classList.add('employees-holidays-graph__item');
      employeeItem.insertAdjacentHTML('afterbegin', renderEmployeeInfo(item.firstName, item.lastName, item.post, item.avatar));
      employeesGraph.append(employeeItem);
      // renderEmployeeGraph(item.holidays);
    })
  };

  const renderGraph = (data) => {
    if (dayjs(currentYear).isLeapYear()) {
      countDaysInMonth.splice(1, 1, 29);
    }

    renderHead(countDaysInMonth);
    renderEmployees(data);
  };

  window.renderEmployeesGraph = {
    render: renderGraph
  };

})();
