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

  calcTotalSpent() {
    const today = new Date().toISOString().slice(0, 10).split('-').join('/');

    const pastTrips = this.trips
      .reduce((acc, trip) => {
        if (trip.date < today) {
          acc.push(trip.destinationID);
        }
        return acc;
      }, []);

    const total = this.destinations
      .reduce((acc, destination) => {
        if (pastTrips.includes(destination.id)) {
          const pastTrip = this.trips.find(trip => trip.destinationID === destination.id);
          const flightCosts = pastTrip.travelers * destination.estimatedFlightCostPerPerson;
          const destinationCost = flightCosts + destination.estimatedLodgingCostPerDay;
          acc += destinationCost;
        }
        return acc;
      }, 0);

    const totalWithFee = total * 1.10;

    return Math.round(totalWithFee * 100) / 100;
  }
}

export default Traveler;
