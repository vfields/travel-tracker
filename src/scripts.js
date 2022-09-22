// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData, postData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';
import { isRequired, isDateInFuture, isBetween, isSelected, displayError, displaySuccess } from './formValidation.js';

// GLOBAL DATA ****************************************************
let travelerDataset;
let tripDataset;
let destinationDataset;
let currentTraveler;

// FETCH DATA *****************************************************
Promise.all([fetchData('travelers'), fetchData('trips'), fetchData('destinations')])
  .then(datasets => {
    setData(datasets);
  });

function setData(datasets) {
  travelerDataset = new Dataset(datasets[0]);
  currentTraveler = new Traveler(travelerDataset.data[6]) // will likely need to be its own function with login functionality
  tripDataset = new Dataset(datasets[1]);
  currentTraveler.setTravelerTrips(tripDataset, 'userID');
  // console.log('currentTraveler.trips', currentTraveler.trips);
  destinationDataset = new Dataset(datasets[2]);
  // console.log('destinationDataset', destinationDataset.data)
  currentTraveler.setTravelerDestinations(destinationDataset);
  // console.log('currentTraveler.destinations', currentTraveler.destinations);
  displayData();
};

// DOM ELEMENTS ***************************************************
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

// might be something to consider later:
// const allRequiredInputs = Array.from(document.querySelectorAll('[required]'));
// allRequiredInputs.forEach(input => {
//   console.log(input);
// })


// refactor this!
tripRequestForm.addEventListener('input', function() {
  if (isRequired(tripDate.value) && isRequired(tripDuration.value) && isRequired(numOfTravelers.value) && isSelected(destinationChoices)) {
    displayEstimate();
    console.log(currentTraveler.id);
  }
})

requestTripBtn.addEventListener('click', function() {
  // validate the data
  // consider a trip class or some sort of function here,
  // where you could pass the destination

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
  // postData('trips', userInputData)
})


// FUNCTIONS ******************************************************
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
    // console.log('destination', destination)
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



/// brainstorm ///
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
