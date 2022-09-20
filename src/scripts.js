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
  tripDataset = new Dataset(datasets[1]);
  destinationDataset = new Dataset(datasets[2]);
  currentTraveler = new Traveler(travelerDataset.data[6]) // will likely need to be its own function with login functionality
  displayTravelerData();
};

// DOM ELEMENTS ***************************************************
const travelerFirstName = document.querySelector('.traveler-first-name');
const todaysDate = document.querySelector('.todays-date');
const travelerTotalSpent = document.querySelector('.total-spent');

// EVENT HANDLERS *************************************************
function displayTravelerData() {
  displayTravelerInfo();
}

function displayTravelerInfo() {
  travelerFirstName.innerText = currentTraveler.findFirstName();
  todaysDate.innerText = new Date().toLocaleDateString();
  // travelerTotalSpent.innerText = traveler method call
}
