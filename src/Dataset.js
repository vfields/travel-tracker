class Dataset {
  constructor(data) {
    this.data = data;
  }

  findTravelerTrips(id, property) {
    return this.data.filter(trip => trip[property] === id);
  }

  findTravelerDestinations(travelersTrips) {
    const tripDestinationIDs = travelersTrips
      .map(trip => trip.destinationID);
    return this.data.reduce((acc, destination) => {
      if (tripDestinationIDs.includes(destination.id)) {
        acc.push(destination)
      }
      return acc;
    }, []);
  }
}

export default Dataset;
