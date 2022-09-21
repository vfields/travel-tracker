class Dataset {
  constructor(data) {
    this.data = data;
  }

  findTravelerData(id, property) {
    return this.data.filter(data => data[property] === id);
  }
}

export default Dataset;
