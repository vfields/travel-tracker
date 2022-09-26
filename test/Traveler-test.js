import { expect } from 'chai';
import Traveler from '../src/Traveler';
import Dataset from '../src/Dataset';
import travelerData from '../src/data/travelerData';
import tripData from '../src/data/tripData';
import destinationData from '../src/data/destinationData';

describe('Traveler', () => {
  it('should be a function', () => {
    expect(Traveler).to.be.a('function');
  });

  let travelerDataset;
  let tripDataset;
  let destinationDataset;
  let traveler1;
  let traveler2;
  let traveler3;

  beforeEach(() => {
    travelerDataset = new Dataset(travelerData);
    tripDataset = new Dataset(tripData);
    destinationDataset = new Dataset(destinationData);
    traveler1 = new Traveler(travelerData[0]);
    traveler2 = new Traveler(travelerData[1]);
    traveler3 = new Traveler(travelerData[2]);
  });

  it('should be an instance of Traveler', () => {
    expect(traveler1).to.be.an.instanceOf(Traveler);
  });

  it('should store traveler properties in each instance from the data', () => {
    Object.keys(travelerData[0])
      .forEach(key => {
        expect(traveler1[key]).to.equal(travelerData[0][key]);
      });
  });

  it('should instantiate with past, pending, and upcoming trip properties set equal to empty arrays', () => {
    expect(traveler1.pastTrips).to.deep.equal([]);
    expect(traveler1.pendingTrips).to.deep.equal([]);
    expect(traveler1.upcomingTrips).to.deep.equal([]);
  });

  it('should return a travelers first name only', () => {
    expect(traveler1.findFirstName()).to.equal('Ham');
    expect(traveler2.findFirstName()).to.equal('Rachael');
  });

  it('given a trip dataset, it should be able to create a property that holds its unique trips sorted by most current date', () => {
    expect(traveler1).to.not.have.property('trips');

    traveler1.setTravelerTrips(tripDataset, 'userID');

    expect(traveler1.trips).to.deep.equal([tripData[1], tripData[0], tripData[2]]);
  });

  it('given a trip dataset, it should be able to allocate trips by status and date to appropriate properties', () => {
    expect(traveler1.pastTrips).to.deep.equal([]);
    expect(traveler1.pendingTrips).to.deep.equal([]);
    expect(traveler1.upcomingTrips).to.deep.equal([]);

    traveler1.setTravelerTrips(tripDataset, 'userID');

    expect(traveler1.pastTrips).to.deep.equal([tripData[0]]);
    expect(traveler1.pendingTrips).to.deep.equal([tripData[2]]);
    expect(traveler1.upcomingTrips).to.deep.equal([tripData[1]]);
  });

  it('once its trips are set, given a destination dataset, it should be able to create a property that holds its unique destinations data', () => {
    expect(traveler1).to.not.have.property('destinations');

    traveler1.setTravelerTrips(tripDataset, 'userID');
    traveler1.setTravelerDestinations(destinationDataset);

    expect(traveler1.destinations).to.deep.equal([destinationData[0], destinationData[1], destinationData[2]]);
  });

  it('once its trips are set, it should be able to add a trip by status to the beginning of the appropriate array', () => {
    traveler2.setTravelerTrips(tripDataset, 'userID');
    expect(traveler2.pendingTrips).to.deep.equal([tripData[4]]);

    const newPendingTrip = {
      id: 11,
      userID: 2,
      destinationID: 18,
      travelers: 2,
      date: "2023/10/30",
      duration: 10,
      status: "pending",
      suggestedActivities: [ ]
    }
    traveler2.addTrip(newPendingTrip, 'pendingTrips');

    expect(traveler2.pendingTrips).to.deep.equal([newPendingTrip, tripData[4]]);
  });

  it('once its trips and destinations are set, it should be able to calculate how much a traveler has spent in the past year', () => {
    traveler1.setTravelerTrips(tripDataset, 'userID');
    traveler1.setTravelerDestinations(destinationDataset);

    traveler3.setTravelerTrips(tripDataset, 'userID');
    traveler3.setTravelerDestinations(destinationDataset);

    expect(traveler1.calcTotalSpent()).to.equal('1056.00');
    expect(traveler3.calcTotalSpent()).to.equal('15433.00');
  });

});
