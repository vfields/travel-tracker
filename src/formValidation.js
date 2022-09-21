function isRequired(value) {
  return value === '' ? false : true;
}

function isDate(date) {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
}

function isDateInFuture(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date > today ? true : false;
}

function isNumber(value) {
  return typeof value === 'number' ? true : false;
}

function isBetween(length, min, max) {
  return length < min || length > max ? false : true;
}

function isSelected(list) {
  const selectedValue = list.options[list.selectedIndex].value;
  return selectedValue === '' ? false : true;
}
