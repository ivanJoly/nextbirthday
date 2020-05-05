const initial = document.getElementById("initial");
const slider = document.getElementById("slider");
const gifScreen = document.getElementById("gif-screen");
const message = document.getElementById("message-quote");
const subtitle = document.getElementById("subtitle-quote");
const gif = document.getElementById("gif");
const getNewResult = document.getElementById("getNewResult");
const gifLoading = document.getElementById("gif-loading");
const facebook = document.getElementById("facebook");
const twitter = document.getElementById("twitter");
const whatsapp = document.getElementById("whatsapp");
const clipboard = document.getElementById("clipboard");

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
    globalQuoteIndex: 0,
    disabledQuote: false,
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

    if (objData.disabledQuote) {
      console.log("No, you cant do that! :D");
      return true;
    }

    if (maxLenght === 1) {
      getNewResult.disabled = true;
      objData.disabledQuote = true;
    }

    rM = Math.floor(Math.random() * maxLenght);
    objData.actualQuote = rM;
    objData.globalQuoteIndex = getGlobalPhraseIndex(
      objData.quotes[rM].quote,
      objData.dayIndex
    );
    localStorage.setItem("obj-data", JSON.stringify(objData));
    setHrefs(objData);
    giphyCall(objData.quotes[rM]);
  } else {
    if (objData.state) {
      dayIndex = 7;
    } else {
      dayIndex = objData.dayIndex;
    }
    getNewResult.disabled = false;
    maxLenght = 10;
    rM = Math.floor(Math.random() * maxLenght);

    objData.quotes = arr[dayIndex];
    objData.actualQuote = rM;
    objData.globalQuoteIndex = rM;
    localStorage.setItem("obj-data", JSON.stringify(objData));
    setHrefs(objData);
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

    setHrefs(obj);
    /* Spiner loading*/
    gifLoading.classList.add("loading");
    gif.onload = function () {
      /* Remove Spiner loading*/
      gifLoading.classList.remove("loading");
    };
    gif.src = urlGif;
    message.innerHTML = qS.quote;
    subtitle.innerHTML = `Your next B-day is going to be on a ${obj.day}`;
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
  gifLoading.classList.add("loading");
  gif.onload = function () {
    /* Remove Spiner loading*/
    gifLoading.classList.remove("loading");
  };
  gif.src = urlGif;
};

const getGlobalPhraseIndex = function (quote, dayIndex) {
  let arr = daysOfTheWeekData.slice();
  const index = arr[dayIndex].findIndex((element) => element.quote === quote);
  return index;
};

const getAllUrlParams = function (url) {
  // get query string from url (optional) or window
  let queryString = url ? url.split("?")[1] : window.location.search.slice(1);

  // we'll store the parameters here
  let obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split("#")[0];

    // split our query string into its component parts
    let arr = queryString.split("&");

    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      let a = arr[i].split("=");

      // set parameter name and value (use 'true' if empty)
      let paramName = a[0];
      let paramValue = typeof a[1] === "undefined" ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        let key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          let index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
};

const generateShareUrl = async function (obj) {
  let arr = obj;
  if (!obj) {
    arr = await JSON.parse(localStorage.getItem("obj-data"));
  }
  return `${window.location.origin}/result.html?gifId=${obj.actualGifId}&phraseIndex=${arr.globalQuoteIndex}&dayIndex=${arr.dayIndex}&day=${obj.day}`;
};

const setHrefs = async function (obj) {
  const url = await generateShareUrl(obj);
  const title = "YourNextBirthday";
  const twitterHandler = "IvJoly";
  let facebookUrl = `http://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`;
  let twitterUrl = `http://www.twitter.com/intent/tweet?url=${url}&via=${twitterHandler}&text=${title}`;
  let whatsappUrl = `https://web.whatsapp.com/send?text=${url}`;
  facebook.href = facebookUrl;
  twitter.href = twitterUrl;
  whatsapp.href = whatsappUrl;
  clipboard.dataset.url = url;
};

const clipboardUrl = function () {
  let dummyContent = clipboard.dataset.url;
  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = dummyContent;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

const setResultPhrase = function (params) {
  let arr = daysOfTheWeekData.slice();
  let quote = arr[params.dayindex][params.phraseindex].quote;
  message.innerHTML = quote;
  let day = params.day[0].toUpperCase() + params.day.slice(1);
  subtitle.innerHTML = `Your next B-day is going to be on a ${day}`;
  slider.classList.add("hide");
};

const getGifById = function (params) {
  var url = "https://api.giphy.com/v1/gifs/"; //probar cambair translate por random
  var key = "?api_key=vlUK5O6v2WQEJaHVNsWaEWsMW3TQyZxB";
  var gifId = params.gifid;
  var finalURL = url + gifId + key;

  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint
  request.open("GET", finalURL, true);

  request.onload = function () {
    let data = this.response;
    let gifsArr = JSON.parse(data).data;
    let urlGif = gifsArr.images.downsized_large.url;
    /* Spiner loading*/
    gif.onload = function () {
      /* Remove Spiner loading*/
      gifLoading.classList.remove("loading");
    };
    gif.src = urlGif;
  };

  // Send request
  request.send();
};
