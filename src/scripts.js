// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';

// GLOBAL DATA ***************************************************
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
const destinationChoices = document.querySelector('.destination-choices');

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
  // consider alphabetizing these in the future
  destinationDataset.data.forEach(destination => {
    const option = document.createElement('option');
    option.value = destination.destination;
    option.text = destination.destination;
    destinationChoices.appendChild(option);
  });
}
