// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';

// GLOBAL DATA ***************************************************
let travelerDataset;
let tripDataset;
let destinationDataset;

// FETCH DATA *****************************************************
Promise.all([fetchData('travelers'), fetchData('trips'), fetchData('destinations')])
  .then(datasets => {
    setData(datasets);
  });

function setData(datasets) {
  travelerDataset = new Dataset(datasets[0]);
  tripDataset = new Dataset(datasets[1]);
  destinationDataset = new Dataset(datasets[2]);
};
