var getImageFromData = function(){
  var dataGifs = JSON.parse(localStorage.getItem('giphy-data'));
  var randomGif = Math.floor(Math.random() * 100); 
  console.log("estas obteniendo el gif numero "+randomGif);
  var giphySrc = dataGifs.data[randomGif].images.original.url;
  document.getElementById("giphy-img").src = giphySrc;
};

var giphyCall = function (qS, c){
  var c = c;
  var url ="http://api.giphy.com/v1/gifs/search?"; //probar cambair translate por random
  var key ="api_key=vlUK5O6v2WQEJaHVNsWaEWsMW3TQyZxB";
  var limitAndStart = "&limit=100&offset=0";
  if(qS == null){
    var KW = "cute+cat";
  }else{
    KW=qS;
  }
  var query ="&q=" + KW;
  
  var finalURL = url + key + query + limitAndStart;
  
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();
  
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', finalURL, true);
  
  request.onload = function() {
    // Begin accessing JSON data here
    var data = this.response;
    localStorage.setItem('giphy-data', data);
    getImageFromData();
  }
  
  // Send request
  request.send();
};
