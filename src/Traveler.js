class Traveler {
  constructor(travelerData) {
    this.id = travelerData.id;
    this.name = travelerData.name;
    this.travelerType = travelerData.travelerType;
    this.pastTrips = [];
    this.pendingTrips = [];
    this.upcomingTrips = [];
  }

  findFirstName() {
    return this.name.split(' ', 1)[0];
  }

  setTravelerTrips(dataset, property) {
    this.trips = dataset.findTravelerTrips(this.id, property);
    this.trips.sort((a, b) => b.date.split('/').join('') - a.date.split('/').join(''))
    // trips are now in order of most recent to most past

    const today = new Date().toISOString().slice(0, 10).split('-').join('/');
    this.trips.forEach(trip => {
      if (trip.status === 'pending') {
        this.pendingTrips.push(trip);
      }
      else if (trip.date < today) {
        this.pastTrips.push(trip);
      }
      else {
        this.upcomingTrips.push(trip);
      }
    });
  }

  setTravelerDestinations(dataset) {
    this.destinations = dataset.findTravelerDestinations(this.trips);
  }

  calcTotalSpent() {
    const pastDestinationIDs = this.pastTrips.map(trip => trip.destinationID);

    const total = this.destinations
      .reduce((acc, destination) => {
        if (pastDestinationIDs.includes(destination.id)) {
          const pastTrip = this.trips.find(trip => trip.destinationID === destination.id);
          const flightCosts = pastTrip.travelers * destination.estimatedFlightCostPerPerson;
          const lodgingCosts = pastTrip.duration * destination.estimatedLodgingCostPerDay;
          const destinationCost = flightCosts + lodgingCosts;
          acc += destinationCost;
        }
        return acc;
      }, 0);

    const totalWithFee = total * 1.10;

    return Math.round(totalWithFee * 100) / 100;
  }
}

export default Traveler;
