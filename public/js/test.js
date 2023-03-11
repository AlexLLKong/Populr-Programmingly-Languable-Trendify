const protocol = "http://"
const hostname = "localhost"
const port = 8000
const baseUrl = protocol + hostname + ":" + port
const testEndpoint = "/test-call"

fetch(baseUrl + testEndpoint)
  .then((response) => response.json())
  .then((data) => {
  		console.log(data)
  });