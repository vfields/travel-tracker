class Traveler {
  constructor(travelerData) {
    this.id = travelerData.id;
    this.name = travelerData.name;
    this.travelerType = travelerData.travelerType;
  }

  findFirstName() {
    return this.name.split(' ', 1)[0];
  }

  setTravelerTrips(dataset, property) {
    this.trips = dataset.findTravelerTrips(this.id, property);
  }

  setTravelerDestinations(dataset) {
    this.destinations = dataset.findTravelerDestinations(this.trips);
  }

}

export default Traveler;

// needed date format = new Date().toISOString().slice(0, 10).split('-').join('/');
