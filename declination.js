'use strict';

const TestNumbers = {
  ten: 10,
  hundred: 100
};

const returnDeclination = (num, nominative, genitiveSingular, genitivePlural) => {
  if (num > TestNumbers.ten && (Math.round((num % TestNumbers.hundred) / TestNumbers.ten)) === 1) {
    return `${num} ${genitivePlural}`;
  } else {
    switch (num % TestNumbers.ten) {
      case 1: return `${num} ${nominative}`;
      case 2:
      case 3:
      case 4: return `${num} ${genitiveSingular}`;
    }
    return `${num} ${genitivePlural}`;
  }
}