function getQuote() {
  console.log("Just a sec while I grab the QOTD");
//need to add proxy to avoid errors
const proxyURL = 'https://cors-anywhere.herokuapp.com/';
const actualURL = 'https://zenquotes.io/api/random';
  
fetch(proxyURL + actualURL)
  .then(function(response) {
    if (!response.ok) {
      throw new Error("QOTD failed :(");
    }
    return response.json();
  })
  .then(function(data) {
    var quote = data[0];
    document.getElementById('quote').textContent = '"' + quote.q + '"';
    document.getElementById('quote-author').textContent = '- ' + quote.a;
    console.log("Quote of the Day: " + quote.q);
  })
  //default quote will be from the Queen of rap
  .catch(function(error) {
    console.error("QOTD failed to load :(", error);
    document.getElementById('quote').textContent = '"Sometimes you dont realize how far youve gotten until you look around at the people who are stlil trailing far behind you"';
    docuemnt.getElementById('quote-author).textContent = '- Onika Maraj';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("Load received from DOM");
  getQuote();
});
