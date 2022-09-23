// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData, postData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';
import { isRequired, isDateInFuture, isBetween, isSelected, displayError, displaySuccess } from './formValidation.js';

// GLOBAL DATA ****************************************************
let tripDataset;
let destinationDataset;
let currentTraveler;

// DOM ELEMENTS ***************************************************
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const loginBtn = document.querySelector('.login-btn');
const loginSection = document.querySelector('.login-section');
const mainSection = document.querySelector('main');

const travelerFirstName = document.querySelector('.traveler-first-name');
const todaysDate = document.querySelector('.todays-date');
const travelerTotalSpent = document.querySelector('.total-spent');
const pastTripsSection = document.querySelector('.past-trips-section');
const pendingTripsSection = document.querySelector('.pending-trips-section');
const upcomingTripsSection = document.querySelector('.upcoming-trips-section');

const tripRequestForm = document.querySelector('.trip-request-form');
const tripDate = document.querySelector('#tripDate');
const tripDuration = document.querySelector('#tripDuration');
const numOfTravelers = document.querySelector('#numOfTravelers');
const destinationChoices = document.querySelector('#destinationChoices');

const tripEstimateDisplay = document.querySelector('.trip-estimate-display');
const tripEstimate = document.querySelector('.trip-estimate');
const requestTripBtn = document.querySelector('.request-trip-btn');

// EVENT LISTENERS ************************************************
loginBtn.addEventListener('click', function() {
  if (checkUsername(username) && checkPassword(password)) {
    Promise.all([fetchData(`travelers/${username.value.slice(8)}`), fetchData('trips'), fetchData('destinations')])
      .then(datasets => {
        setData(datasets);
      });
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    console.log('this is the right combo!');
  }
  else {
    console.log('this is the wrong combo!');
  }
});

function checkUsername(input) {
  let valid = false;
  const id = parseInt(input.value.slice(8));
  if (input.value.slice(0, 8) === 'traveler' && id > 0 && id < 51) {
    valid = true;
  }
  // else {
  //   displayError(input, 'Incorrect username, try again!');
  // }
  return valid;
}

function checkPassword(input) {
  let valid = false;
  if (input.value === 'travel') {
    valid = true;
  }
  // else {
  //   displayError(input, 'Incorrect password, try again!');
  // }
  return valid;
}


// might be something to consider later:
// const allRequiredInputs = Array.from(document.querySelectorAll('[required]'));
// allRequiredInputs.forEach(input => {
//   console.log(input);
// })


// refactor this!
tripRequestForm.addEventListener('input', function() {
  if (isRequired(tripDate.value) && isRequired(tripDuration.value) && isRequired(numOfTravelers.value) && isSelected(destinationChoices)) {
    displayEstimate();
  }
})

requestTripBtn.addEventListener('click', function() {
  // validate the data
  // consider a trip class or some sort of function here,
  // where you could pass the destination
  // maybe not a trip class, maybe just a function or method

  const userSelection = destinationChoices.options[destinationChoices.selectedIndex].value;
  const userDestination = destinationDataset.data
    .find(destination => destination.destination === userSelection);

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
    .then(responseJSON => createTripCard(pendingTripsSection, userDestination, responseJSON.newTrip));
})

// FUNCTIONS ******************************************************
function setData(datasets) {
  currentTraveler = new Traveler(datasets[0]);
  tripDataset = new Dataset(datasets[1].trips);
  destinationDataset = new Dataset(datasets[2].destinations);
  currentTraveler.setTravelerTrips(tripDataset, 'userID');
  currentTraveler.setTravelerDestinations(destinationDataset);
  displayData();
};

function displayData() {
  displayTravelerInfo();
  displayTravelerTrips();
  displayDestinationChoices();
}

function displayTravelerInfo() {
  travelerFirstName.innerText = currentTraveler.findFirstName();
  todaysDate.innerText = new Date().toLocaleDateString();
  travelerTotalSpent.innerText = currentTraveler.calcTotalSpent().toFixed(2);
}

function displayTravelerTrips() {
  const today = new Date().toISOString().slice(0, 10).split('-').join('/');
  currentTraveler.trips.forEach(trip => {
    const destination = currentTraveler.destinations.find(destination => trip.destinationID === destination.id);
    // manipulate trip date to display a range of days in second <p>
    if (trip.status === 'pending') {
      // pending trips
      createTripCard(pendingTripsSection, destination, trip);
    }
    else if (trip.date < today) {
      // past trips
      createTripCard(pastTripsSection, destination, trip);
    }
    else {
      // upcoming trips
      createTripCard(upcomingTripsSection, destination, trip);
    }
  })
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
  const userDestination = destinationDataset.data
    .find(destination => destination.destination === userSelection);
  const flightCosts = numOfTravelers.value * userDestination.estimatedFlightCostPerPerson;
  const lodgingCosts = tripDuration.value * userDestination.estimatedLodgingCostPerDay;
  const total = flightCosts + lodgingCosts;
  const totalWithFee = total * 1.10;
  return (Math.round(totalWithFee * 100) / 100).toFixed(2)
  // console.log('heres the estimate', totalWithFee, 'trip', userDestination);
}

/// trip request form stuff brainstorm ///

function checkDate() {
  let valid = false;
  const date = tripDate.value;
  if (!isRequired(date)) {
    displayError(tripDate, 'Please select a date.');
  }
  else if (!isDateInFuture(date)) {
    displayError(tripDate, 'Please choose a future date.')
  }
  else {
    displaySuccess(tripDate);
    valid = true;
  }
  return valid;
}

function checkNumberInput(input) {
  let valid = false;
  const value = parseInt(input.value);
  console.log(value);
  if (typeof value === 'NaN') {
    displayError(input, 'Please enter a number.');
  }
  else if (!isBetween(value, 0)) {
    displayError(input, 'Number must be greater than or equal to one.')
  }
  else {
    displaySuccess(input);
    valid = true;
  }
  return valid;
}
