// DEPENDENCIES **************************************************
import './css/styles.css';
import { checkUsername, checkPassword, isRequired, isDateInFuture, isGreaterThanZero } from './formValidation.js';
import { fetchData, postData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';

// GLOBAL DATA ****************************************************
let tripDataset;
let destinationDataset;
let currentTraveler;

// DOM ELEMENTS ***************************************************
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const allLoginInputs = Array.from(document.querySelectorAll('.login'));
const loginSection = document.querySelector('.login-section');
const loginBtn = document.querySelector('.login-btn');
const loginErrorDisplay = document.querySelector('.login-error-display');
const loginTryAgainBtn = document.querySelector('.login-try-again-btn');
const mainSection = document.querySelector('main');
const travelerFirstName = document.querySelector('.traveler-first-name');
const todaysDate = document.querySelector('.todays-date');
const travelerTotalSpent = document.querySelector('.total-spent');
const pastTripsSection = document.querySelector('.past-trips-container');
const pendingTripsSection = document.querySelector('.pending-trips-container');
const upcomingTripsSection = document.querySelector('.upcoming-trips-container');
const tripRequestForm = document.querySelector('.trip-request-form');
const tripDate = document.querySelector('#tripDate');
const tripDuration = document.querySelector('#tripDuration');
const numOfTravelers = document.querySelector('#numOfTravelers');
const destinationChoices = document.querySelector('#destinationChoices');
const allTripRequestInputs = Array.from(document.querySelectorAll('.trip-request-input'));
const tripEstimateDisplay = document.querySelector('.trip-estimate-display');
const tripEstimate = document.querySelector('.trip-estimate');
const requestTripBtn = document.querySelector('.request-trip-btn');
const postResponseDisplay = document.querySelector('.post-response-display');
const postResponseMessage = document.querySelector('.post-response-message');
const resetRequestFormBtn = document.querySelector('.reset-request-form-btn');
const reloadBtn = document.querySelector('.reload-page');

// EVENT LISTENERS ************************************************
// loginBtn.addEventListener('click', attemptLogin);
// loginTryAgainBtn.addEventListener('click', resetLogin);
tripDate.addEventListener('input', handleDateErrors);
tripDuration.addEventListener('input', handleNumberErrors);
numOfTravelers.addEventListener('input', handleNumberErrors);
tripRequestForm.addEventListener('input', displayEstimate);
requestTripBtn.addEventListener('click', requestTrip);
resetRequestFormBtn.addEventListener('click', resetTripRequest);
reloadBtn.addEventListener('click', () => location.reload());

// FUNCTIONS ******************************************************
// function attemptLogin() {
//   if (checkUsername(username) && checkPassword(password)) {
//     Promise.all([fetchData(`travelers/${username.value.slice(8)}`), fetchData('trips'), fetchData('destinations')])
//       .then(datasets => {
//         setData(datasets);
//       })
//       .catch(error => {
//         displayGETError(error);
//       });
//   }
//   else {
//     disableForm(allLoginInputs);
//     loginErrorDisplay.classList.remove('hidden');
//     loginBtn.classList.add('hidden');
//   }
// }

Promise.all([fetchData(`travelers`), fetchData('trips'), fetchData('destinations')])
  .then(datasets => {
    setData(datasets);
  });
  // .catch(error => {
  //   displayGETError(error);
  // });

function setData(datasets) {
  currentTraveler = new Traveler(datasets[0].travelers[6]);
  tripDataset = new Dataset(datasets[1].trips);
  destinationDataset = new Dataset(datasets[2].destinations);
  currentTraveler.setTravelerTrips(tripDataset, 'userID');
  currentTraveler.setTravelerDestinations(destinationDataset);
  displayData();
};

function displayData() {
  // displayMain();
  displayTravelerInfo();
  displayTravelerTrips();
  displayDestinationChoices();
}

// function displayMain() {
//   loginSection.classList.add('hidden');
//   mainSection.classList.remove('hidden');
// }

function displayTravelerInfo() {
  travelerFirstName.innerText = currentTraveler.findFirstName();
  todaysDate.innerText = new Date().toLocaleDateString();
  travelerTotalSpent.innerText = currentTraveler.calcTotalSpent();
}

function displayTravelerTrips() {
  displayTripsByStatus('pastTrips', pastTripsSection, 'past');
  displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
  displayTripsByStatus('upcomingTrips', upcomingTripsSection, 'upcoming');
}

function displayTripsByStatus(tripList, section, status) {
  section.innerHTML = '';
  if (currentTraveler[tripList].length > 0) {
    currentTraveler[tripList].forEach(trip => {
      const destination = currentTraveler.destinations.find(destination => trip.destinationID === destination.id);
      createTripCard(section, destination, trip);
    });
  }
  else {
    section.innerHTML += `
      <p>You don't have any ${status} trips, yet!</p>
    `
  }
}

function createTripCard(section, destination, trip) {
  const date = [trip.date.split('/')[1], trip.date.split('/')[2], trip.date.split('/')[0]].join('/');
  let amount = 'days';
  if (trip.duration === 1) {
    amount = 'day';
  }
  section.innerHTML += `
  <article class="trip-card" tabindex="0">
    <p><span class="trip-card-date">${date}</span>: ${trip.duration} ${amount} in ${destination.destination}</p>
    <img src="${destination.image}" alt="${destination.alt}">
  </article>
  `
}

function displayDestinationChoices() {
  destinationDataset.data
    .reduce((acc, destination) => {
      acc.push(destination.destination);
      return acc;
    }, [])
    .sort()
    .forEach(destination => {
      const option = document.createElement('option');
      option.value = destination;
      option.text = destination;
      destinationChoices.appendChild(option);
    });
}

// function displayGETError(error) {
//   loginSection.innerHTML = ``;
//   loginSection.innerHTML += `
//     <h1>Oops! Something went wrong. Please try again later!</h1>
//   `;
// }

function disableForm(formInputs) {
  formInputs.forEach(input => {
    input.disabled = true;
  })
}

function resetLogin() {
  loginErrorDisplay.classList.add('hidden');
  loginBtn.classList.remove('hidden');
  allLoginInputs.forEach(input => {
    input.disabled = false;
    input.value = '';
  })
}

function handleDateErrors() {
  if (!isDateInFuture(this.value)) {
    displayInputError(this, 'Please pick a date in the future!');
  }
  else {
    removeInputError(this);
  }
}

function displayInputError(input, message) {
  const formField = input.parentElement;
  formField.querySelector('.error-message').textContent = message;
  const releventInputs = allTripRequestInputs.filter(requestInput => requestInput !== input);
  disableForm(releventInputs);
}

function removeInputError(input) {
  const formField = input.parentElement;
  formField.querySelector('.error-message').textContent = '';
  allTripRequestInputs.forEach(input => {
    input.disabled = false;
  })
}

function handleNumberErrors() {
  if (!isGreaterThanZero(this.value)) {
    displayInputError(this, 'Please pick a number greater than zero.');
  }
  else {
    removeInputError(this);
  }
}

function displayEstimate() {
  if (isDateInFuture(tripDate.value) && isGreaterThanZero(tripDuration.value) && isGreaterThanZero(numOfTravelers.value) && isRequired(destinationChoices.value)) {
    tripEstimate.innerText = calculateEstimatedTotal();
    tripEstimateDisplay.classList.remove('hidden');
  }
  else {
    tripEstimateDisplay.classList.add('hidden');
  }
}

function calculateEstimatedTotal() {
  const userSelection = destinationChoices.options[destinationChoices.selectedIndex].value;
  // this is repetitive... must be a way to make dynamic with Traveler class... not sure how yet!
  const userDestination = destinationDataset.findSelectedDestination(userSelection);
  const flightCosts = numOfTravelers.value * userDestination.estimatedFlightCostPerPerson;
  const lodgingCosts = tripDuration.value * userDestination.estimatedLodgingCostPerDay;
  const total = flightCosts + lodgingCosts;
  const totalWithFee = total * 1.10;
  return (Math.round(totalWithFee * 100) / 100).toFixed(2);
}

function requestTrip() {
  const userSelection = destinationChoices.options[destinationChoices.selectedIndex].value;
  const userDestination = destinationDataset.findSelectedDestination(userSelection);

  const userInputData = {
    id: Date.now(),
    userID: currentTraveler.id,
    destinationID: userDestination.id,
    travelers: parseInt(numOfTravelers.value),
    date: tripDate.value.split('-').join('/'),
    duration: parseInt(tripDuration.value),
    status: 'pending',
    suggestedActivities: []
  };

  postData('trips', userInputData)
    .then(responseJSON => {
      displayPOSTSuccess();
      currentTraveler.addTrip(responseJSON.newTrip, 'pendingTrips');
      currentTraveler.destinations.push(userDestination);
      displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
      disableForm(allTripRequestInputs);
    })
    .catch(error => {
      displayPOSTError(error)
      disableForm(allTripRequestInputs);
    });
}

function displayPOSTSuccess() {
  postResponseDisplay.classList.remove('hidden');
  tripEstimateDisplay.classList.add('hidden');
}

function displayPOSTError(error) {
  postResponseDisplay.classList.remove('hidden');
  resetRequestFormBtn.classList.add('hidden');
  tripEstimateDisplay.classList.add('hidden');
  if (error.message[0] === '5') {
    postResponseMessage.innerText = 'Oops! Something is wrong with the server. Please try submitting this form again later!';
  }
  else {
    postResponseMessage.innerText = `Something isn't right. Please try submitting this form again later!`;
  }
  reloadBtn.classList.remove('hidden');
}

function resetTripRequest() {
  postResponseDisplay.classList.add('hidden');
  allTripRequestInputs.forEach(input => {
    input.disabled = false;
    input.value = '';
  })
}
