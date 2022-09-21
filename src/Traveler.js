class Traveler {
  constructor(travelerData) {
    this.id = travelerData.id;
    this.name = travelerData.name;
    this.travelerType = travelerData.travelerType;
  }

  findFirstName() {
    return this.name.split(' ', 1)[0];
  }

  setTravelerData(dataName, dataset, property) {
    this[dataName] = dataset.findTravelerData(this.id, property);
  }

}

export default Traveler;

// needed date format = new Date().toISOString().slice(0, 10).split('-').join('/');
