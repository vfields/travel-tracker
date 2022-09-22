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

function postData(dataset, userData) {
  const requestData = {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    };

  return fetch(`http://localhost:3001/api/v1/${dataset}`, requestData)
    .then(response => {
      if (!response.ok) {
        throw new Error('Not a 200 status');
      }
      alert('Trip request successfully submitted!');
      return response.json();
    })
    .catch(error => {
      alert('Oops, something went wrong. Try again later');
    });
}

export { fetchData, postData };
