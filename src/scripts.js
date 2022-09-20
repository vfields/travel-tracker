// DEPENDENCIES **************************************************
import './css/styles.css';
import { fetchData } from './apiCalls';
import Traveler from './Traveler.js';
import Dataset from './Dataset.js';

// GLOBAL DATA ***************************************************
let travelerDataset;

// FETCH DATA *****************************************************
fetchData('travelers')
  .then(data => console.log('this works, here is the data[dataset]', data));

fetchData('trips')
  .then(data => console.log('this works, here is the data[dataset]', data));

fetchData('destinations')
  .then(data => console.log('this works, here is the data[dataset]', data));
