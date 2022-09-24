// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData, postData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';
import { checkUsername, checkPassword, isRequired, removeError, isDateInFuture, isBetween, isSelected, displayError, displaySuccess } from './formValidation.js';

// GLOBAL DATA ****************************************************
let tripDataset;
let destinationDataset;
let currentTraveler;

// DOM ELEMENTS ***************************************************
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const loginSection = document.querySelector('.login-section');
const loginBtn = document.querySelector('.login-btn');
const loginErrorDisplay = document.querySelector('.login-error-display');
const loginTryAgainBtn = document.querySelector('.login-try-again-btn');
const mainSection = document.querySelector('main');

const travelerFirstName = document.querySelector('.traveler-first-name');
const todaysDate = document.querySelector('.todays-date');
const travelerTotalSpent = document.querySelector('.total-spent');
const pastTripsSection = document.querySelector('.past-trips-section');
const pendingTripsSection = document.querySelector('.pending-trips-section');
const upcomingTripsSection = document.querySelector('.upcoming-trips-section');

const tripRequestForm = document.querySelector('.trip-request-form');
const tripDate = document.querySelector('#tripDate');
// const tripDateError = document.querySelector('.trip-date-error-message');
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

// EVENT LISTENERS ************************************************
loginBtn.addEventListener('click', attemptLogin);
loginTryAgainBtn.addEventListener('click', resetLogin);

tripRequestForm.addEventListener('input', function() {
  // refactor this? yep, array!
  // can use probably use allTripRequestInputs here
  if (isRequired(tripDate.value) && isRequired(tripDuration.value) && isRequired(numOfTravelers.value) && isRequired(destinationChoices.value)) {
    displayEstimate();
  }
  else {
    tripEstimateDisplay.classList.add('hidden');
  }
})

/* thinking about this... */
// tripDate.addEventListener('change', function() {
//   if (!isDateInFuture(tripDate.value)) {
//     tripDateError.classList.remove('hidden');
//   }
//   else {
//     tripDateError.classList.add('hidden');
//   }
// });


requestTripBtn.addEventListener('click', function() {
  // validate the data
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
      // what would be better is an 'add trip' method that sorts it appropriately in the Traveler Class
      currentTraveler.pendingTrips.push(responseJSON.newTrip);
      currentTraveler.destinations.push(userDestination);
      displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
    })
    .catch(error => displayPOSTError(error));
})

resetRequestFormBtn.addEventListener('click', resetTripRequest);

// EVENT HANDLERS *************************************************
function attemptLogin() {
  if (checkUsername(username) && checkPassword(password)) {
    Promise.all([fetchData(`travelers/${username.value.slice(8)}`), fetchData('trips'), fetchData('destinations')])
      .then(datasets => {
        setData(datasets);
      })
      .catch(error => {
        displayGETError(error);
      });
  }
  else {
    // create separate function? maybe if it can be dynamic..
    loginErrorDisplay.classList.remove('hidden');
    loginBtn.classList.add('hidden');
  }
}

function resetLogin() {
  loginErrorDisplay.classList.add('hidden');
  loginBtn.classList.remove('hidden');
  username.value = '';
  password.value = '';
}

// ERROR HANDLERS *************************************************
function displayGETError(error) {
  loginSection.innerHTML = ``;
  loginSection.innerHTML += `
    <h1>Oops! Something went wrong. Please try again later!</h1>
  `;
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
}

// FUNCTIONS ******************************************************
function setData(datasets) {
  currentTraveler = new Traveler(datasets[0]);
  tripDataset = new Dataset(datasets[1].trips);
  destinationDataset = new Dataset(datasets[2].destinations);
  currentTraveler.setTravelerTrips(tripDataset, 'userID');
  currentTraveler.setTravelerDestinations(destinationDataset);
  console.log(currentTraveler);
  displayData();
};

function displayData() {
  displayMain();
  displayTravelerInfo();
  displayTravelerTrips();
  displayDestinationChoices();
}

function displayMain() {
  loginSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
}

function displayTravelerInfo() {
  travelerFirstName.innerText = currentTraveler.findFirstName();
  todaysDate.innerText = new Date().toLocaleDateString();
  travelerTotalSpent.innerText = currentTraveler.calcTotalSpent().toFixed(2);
}

function displayTravelerTrips() {
  displayTripsByStatus('pastTrips', pastTripsSection, 'past');
  displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
  displayTripsByStatus('upcomingTrips', upcomingTripsSection, 'upcoming');
}

function displayTripsByStatus(tripList, section, status) {
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
  section.innerHTML += `
  <article class="trip-card" tabindex="0">
    <p>${destination.destination}</p>
    <p>${trip.date}</p>
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

function displayEstimate() {
  tripEstimate.innerText = calculateEstimatedTotal();
  tripEstimateDisplay.classList.remove('hidden');
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

function displayPOSTSuccess() {
  postResponseDisplay.classList.remove('hidden');
  tripEstimateDisplay.classList.add('hidden');
}

function resetTripRequest() {
  postResponseDisplay.classList.add('hidden');
  allTripRequestInputs.forEach(input => {
    input.value = '';
  })
}

/// trip request form validation stuff brainstorm ///
//
// function checkDate() {
//   let valid = false;
//   const date = tripDate.value;
//   if (!isRequired(date)) {
//     displayError(tripDate, 'Please select a date.');
//   }
//   else if (!isDateInFuture(date)) {
//     displayError(tripDate, 'Please choose a future date.')
//   }
//   else {
//     displaySuccess(tripDate);
//     valid = true;
//   }
//   return valid;
// }
//
// function checkNumberInput(input) {
//   let valid = false;
//   const value = parseInt(input.value);
//   console.log(value);
//   if (typeof value === 'NaN') {
//     displayError(input, 'Please enter a number.');
//   }
//   else if (!isBetween(value, 0)) {
//     displayError(input, 'Number must be greater than or equal to one.')
//   }
//   else {
//     displaySuccess(input);
//     valid = true;
//   }
//   return valid;
// }
