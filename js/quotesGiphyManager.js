//counter de llamadas
var counter = 0;

//get the day in it's propper form for the array to work
var newFormat = new Date(formatNextBday);
var dayN = newFormat.getDay();

//generate a random number
var rM = Math.floor(Math.random() * 10);

//is today your birthday?
var isToday = null;
if (bDate == tDate && bMonth == tMonth){
    isToday = true;
} else{
    isToday = false;
}

var callGiphyAndQuote = function (today, all, random){
    if(today){
        if(all){
            //Re-generate random number
            rM = Math.floor(Math.random() * 10);
            //Make giphy and quote call
            giphyCall(daysOfTheWeekData[7][rM].query, counter);
            document.getElementById("quote").innerHTML = daysOfTheWeekData[7][rM].quote;
            console.log("random"+ rM);
        }else{
            var previousRandom = random;
            giphyCall(daysOfTheWeekData[7][previousRandom].query, counter);
            console.log("random"+ previousRandom);
        }
    }else{
        if(all){
            //Re-generate random number
            rM = Math.floor(Math.random() * 10);
            //Make giphy and quote call
            giphyCall(daysOfTheWeekData[dayN][rM].query, counter);
            document.getElementById("quote").innerHTML = daysOfTheWeekData[dayN][rM].quote;
            console.log("random"+ rM);
        }else{
            var previousRandom = random;
            giphyCall(daysOfTheWeekData[dayN][previousRandom].query, counter);
            console.log("random"+ previousRandom);
        }
    }
}

//get new Gif and Quote when button is clicked
let newAll = document.getElementById("new-all");
newAll.addEventListener("click", () => {
    callGiphyAndQuote(isToday, true);
    console.log("new all");
});

//get New Gif when button is clicked
let buttonNewGif = document.getElementById("new-gif");
buttonNewGif.addEventListener("click", () => {
    callGiphyAndQuote(isToday, false, rM);
    console.log("new gif");
});

callGiphyAndQuote(isToday, true);
