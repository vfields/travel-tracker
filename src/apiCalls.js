function fetchData(dataset) {
  return fetch(`http://localhost:3001/api/v1/${dataset}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Not a 200 status');
      }
      return response.json();
    })
    .then(data => data[dataset])
    .catch(error => {
      alert('Oops, something went wrong. Try refreshing your page.');
    })
}

export { fetchData };
