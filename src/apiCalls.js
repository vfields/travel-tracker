function fetchData(dataset) {
  return fetch(`http://localhost:3001/api/v1/${dataset}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return response.json();
    });
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
        throw new Error(`${response.status}`);
      }
      return response.json();
    });
}

export { fetchData, postData };
