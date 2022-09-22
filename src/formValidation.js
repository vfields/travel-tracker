//consider isValidUN with Regex and isValidPW with string literal for loggin

function isRequired(value) {
  return value === '' ? false : true;
}

// play with these - something is off with the userinput value!

// function isDate(date) {
//   const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
//   return dateRegex.test(date);
// }

function isDateInFuture(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date > today ? true : false;
}

// function isNumber(value) {
//   return typeof value === 'number' ? true : false;
// }

function isBetween(length, min, max) {
  return length < min || length > max ? false : true;
}

function isSelected(list) {
  const selectedValue = list.options[list.selectedIndex].value;
  return selectedValue === '' ? false : true;
}

function displayError(input, message) {
  const formField = input.parentElement;
  formField.classList.remove('success');
  formField.classList.add('error');
  formField.querySelector('.error-message').textContent = '';
  formField.querySelector('.error-message').textContent = message;
}

function displaySuccess(input) {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.classList.add('success');
  formField.querySelector('.error-message').textContent = '';
  // could also consider adding hidden class pending on display
}


export { isRequired, isDateInFuture, isBetween, isSelected, displayError, displaySuccess };
