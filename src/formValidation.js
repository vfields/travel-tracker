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

export { checkUsername, checkPassword, isRequired, isDateInFuture, isGreaterThanZero };
