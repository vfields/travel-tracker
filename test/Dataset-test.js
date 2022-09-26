import { expect } from 'chai';
import Dataset from '../src/Dataset';
import travelerData from '../src/data/travelerData';
import tripData from '../src/data/tripData';
import destinationData from '../src/data/destinationData';

describe('Dataset', () => {
  it('should be a function', () => {
    expect(Dataset).to.be.a('function');
  });

  let travelerDataset;
  let tripDataset;
  let destinationDataset;

  beforeEach(() => {
    travelerDataset = new Dataset(travelerData);
    tripDataset = new Dataset(tripData);
    destinationDataset = new Dataset(destinationData);
  });

  it('should be an instance of Dataset', () => {
    expect(tripDataset).to.be.an.instanceOf(Dataset);
  });

  it('should store any dataset data', () => {
    expect(tripDataset.data).to.deep.equal(tripData);
    expect(destinationDataset.data).to.deep.equal(destinationData);
  });

  it('should be able to find a unique travelers trips', () => {
    expect(tripDataset.findTravelerTrips(1, 'userID')).to.deep.equal([tripData[0], tripData[1], tripData[2]]);
    expect(tripDataset.findTravelerTrips(2, 'userID')).to.deep.equal([tripData[3], tripData[4]]);
  });

  it('should be able to find a unique travelers destinations', () => {
    const traveler1trips = tripDataset.findTravelerTrips(1, 'userID');
    const traveler2trips = tripDataset.findTravelerTrips(2, 'userID');

    expect(destinationDataset.findTravelerDestinations(traveler1trips)).to.deep.equal([destinationData[0], destinationData[1], destinationData[2]]);
    expect(destinationDataset.findTravelerDestinations(traveler2trips)).to.deep.equal([destinationData[3], destinationData[4]]);
  });

  it('given a destination name, it should be able to return that unique destinations data', () => {
    expect(destinationDataset.findSelectedDestination('Lima, Peru')).to.deep.equal(destinationData[0]);
    expect(destinationDataset.findSelectedDestination('Stockholm, Sweden')).to.deep.equal(destinationData[1]);
  });

});
