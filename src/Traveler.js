class Traveler {
  constructor(travelerData) {
    this.id = travelerData.id;
    this.name = travelerData.name;
    this.travelerType = travelerData.travelerType;
  }

  findFirstName() {
    return this.name.split(' ', 1)[0];
  }

}

export default Traveler;
