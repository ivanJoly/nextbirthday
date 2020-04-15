const initial = document.getElementById("initial");
const slider = document.getElementById("slider");
const gifScreen = document.getElementById("gif-screen");
const message = document.getElementById("message-quote");
const gif = document.getElementById("gif");
const getNewResult = document.getElementById("getNewResult");

const chooseDate = async function () {
  showSlider();

  let formatedDate = await formatRecievedDate();
  let getBirthdayDateObj = await getBirthdayDate(formatedDate);
  await callGiphyAndQuote(getBirthdayDateObj);

  setTimeout(function () {
    slider.classList.add("hide");
  }, 2000);
};

const showSlider = function (bool) {
  if (!bool) {
    slider.classList.add("show");
    initial.classList.add("up");
    gifScreen.classList.add("show");
  } else {
    slider.classList.remove("hide");
    initial.classList.remove("up");
    gifScreen.classList.remove("show");
    setTimeout(function () {
      slider.classList.remove("show");
    }, 2000);
  }
};

const formatRecievedDate = function () {
  let monthSelected = month_Picker.selected();
  let day = day_Picker.selected();
  let month;
  let year = new Date().getFullYear();
  let index = months_arr.findIndex((el) => el == monthSelected) + 1;

  if (index < 10) {
    month = "0" + index;
  } else {
    month = index;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
};

const formatDate = function (y, m, d) {};

const getBirthdayDate = function (date) {
  let birthdayDate = moment(date);
  let today = moment();

  let birthdayData = {
    date: birthdayDate.format(),
    state: false,
    day: birthdayDate.format("dddd"),
    quotes: [],
    actualQuote: 0,
    actualGifId: 0,
    dayIndex: birthdayDate.day(),
    month: birthdayDate.format("MMMM"),
    year: 0,
  };

  /*
        birthday.state = true --Su cumpleaños es hoy--
    */

  if (birthdayDate.format("MM") == today.format("MM")) {
    if (birthdayDate.format("DD") == today.format("DD")) {
      birthdayData.state = true;
    } else if (birthdayDate.format("DD") < today.format("DD")) {
      let newDate = `${
        Number(birthdayDate.format("YYYY")) + 1
      }-${birthdayDate.format("MM")}-${birthdayDate.format("DD")}`;
      let n = moment(newDate);
      birthdayData.date = n.format();
      birthdayData.day = n.format("dddd");
      birthdayData.dayIndex = n.day();
      birthdayData.month = n.format("MM");
      birthdayData.year = n.format("YYYY");
    }
  } else if (birthdayDate.format("MM") < today.format("MM")) {
    let newDate = `${
      Number(birthdayDate.format("YYYY")) + 1
    }-${birthdayDate.format("MM")}-${birthdayDate.format("DD")}`;
    let n = moment(newDate);
    birthdayData.date = n.format();
    birthdayData.day = n.format("dddd");
    birthdayData.dayIndex = n.day();
    birthdayData.month = n.format("MM");
    birthdayData.year = n.format("YYYY");
  }

  return birthdayData;
};

const callGiphyAndQuote = function (obj) {
  let arr = daysOfTheWeekData.slice();
  let objData = obj;
  let maxLenght;
  let rM;
  let dayIndex;

  if (!obj) {
    objData = JSON.parse(localStorage.getItem("obj-data"));
    objData.quotes.splice(objData.actualQuote, 1);
    maxLenght = objData.quotes.length;

    if (maxLenght > 2) {
      getNewResult.disabled = true;
    } else {
      rM = Math.floor(Math.random() * maxLenght);

      objData.actualQuote = rM;
      localStorage.setItem("obj-data", JSON.stringify(objData));

      giphyCall(arr[objData.dayIndex][rM]);
    }
  } else {
    if (objData.state) {
      dayIndex = 7;
    } else {
      dayIndex = objData.dayIndex;
    }

    maxLenght = 10;
    rM = Math.floor(Math.random() * maxLenght);

    objData.quotes = arr[dayIndex];
    objData.actualQuote = rM;
    localStorage.setItem("obj-data", JSON.stringify(objData));

    giphyCall(arr[dayIndex][rM]);
  }
};

const giphyCall = function (qS) {
  var url = "https://api.giphy.com/v1/gifs/search?"; //probar cambair translate por random
  var key = "api_key=vlUK5O6v2WQEJaHVNsWaEWsMW3TQyZxB";
  var limitAndStart = "&limit=100&offset=0";
  if (qS.query == null) {
    var KW = "cute+cat";
  } else {
    KW = qS.query;
  }
  var query = "&q=" + KW;

  var finalURL = url + key + query + limitAndStart;

  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint
  request.open("GET", finalURL, true);

  request.onload = function () {
    // Begin accessing JSON data here
    let data = this.response;
    let gifsArr = JSON.parse(data).data;
    let randomGif = Math.floor(Math.random() * gifsArr.length - 1);
    let urlGif = gifsArr[randomGif].images.downsized_large.url;

    let obj = JSON.parse(localStorage.getItem("obj-data"));
    obj.actualGifId = gifsArr[randomGif].id;
    localStorage.setItem("obj-data", JSON.stringify(obj));
    gifsArr.splice(randomGif, 1);
    localStorage.setItem("giphy-data", JSON.stringify(gifsArr));
    /* Spiner loading*/

    gif.onload = function () {
      /* Remove Spiner loading*/
    };
    gif.src = urlGif;
    message.innerHTML = qS.quote;
  };

  // Send request
  request.send();
};

const getNewGif = function () {
  let dataGifs = JSON.parse(localStorage.getItem("giphy-data"));
  let randomGif = Math.floor(Math.random() * dataGifs.length - 1);
  let urlGif = dataGifs[randomGif].images.downsized_large.url;
  dataGifs.splice(randomGif, 1);
  localStorage.setItem("giphy-data", JSON.stringify(dataGifs));
  /* Spiner loading*/
  gif.onload = function () {
    /* Remove Spiner loading*/
  };
  gif.src = urlGif;
};
