import { allTripRequestInputs } from './scripts.js'

function checkUsername(input) {
  let valid = false;
  const id = parseInt(input.value.slice(8));
  if (input.value.slice(0, 8) === 'traveler' && id > 0 && id < 51) {
    valid = true;
  }
  return valid;
}

function checkPassword(input) {
  let valid = false;
  if (input.value === 'travel') {
    valid = true;
  }
  return valid;
}

function isRequired(value) {
  return value === '' ? false : true;
}

function isDateInFuture(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date > today ? true : false;
}

function isGreaterThanZero(value) {
  const number = parseInt(value);
  return number > 0 ? true : false;
}

function isTripRequestValid(input) {
  let valid = false;
  if (input === allTripRequestInputs[0] && isRequired(input.value) && isDateInFuture(input.value)) {
    valid = true;
  }
  else if (input === allTripRequestInputs[3] && isRequired(input.value)) {
    valid = true;
  }
  else if (isRequired(input.value) && isGreaterThanZero(input.value)) {
    valid = true;
  }
  return valid;
}

///// playing below here, using above here /////

// play with these - something is off with the userinput value!

// function isDate(date) {
//   const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
//   return dateRegex.test(date);
// }

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
    // after some time has past, reset everything
    // setTimeout(() => {
    //   input.value = '';
    //   formField.classList.remove('error');
    //   formField.querySelector('.error-message').textContent = '';
    // }, 3000);
}

function removeError(input) {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.querySelector('.error-message').textContent = '';
}

function displaySuccess(input) {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.classList.add('success');
  formField.querySelector('.error-message').textContent = '';
  // could also consider adding hidden class pending on display
}


export { checkUsername, checkPassword, isRequired, isGreaterThanZero, isTripRequestValid, removeError, isDateInFuture, isBetween, isSelected, displayError, displaySuccess };
