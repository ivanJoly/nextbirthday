//checking if I have a date in Local Storage
if (localStorage.getItem('b-day-date') === null){
    window.location = "http://localhost:3000/index.html";
}else{
    console.log("Tenemos fecha");
}

//getting the b-day from local storage and showing it
 var bdayRecieve = localStorage.getItem('b-day-date');
 document.getElementById("b-day-date").innerHTML = bdayRecieve;
 localStorage.removeItem( 'b-day-date' ); // Clear the localStorage

//funcion que chequea que dia de la semana es/fue una determinada fecha
 var queDiaEs = function (dia){
    var dateFormatF = new Date(dia);
    var dayNames = ['Sunday ', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var bdayWeek = dayNames[dateFormatF.getDay()]
    return bdayWeek;
}

//funcion que formatea fechas
var propperDateFormat = function (y,m,d){
    var m = m+1;
    var yF = y;
    var mF;
    var dF;
    if (m<10){
        mF = "0"+m;
    }else{
        mF=m;
    }
    if (d<10){
        dF = "0"+d;
    }else{
        dF=d;
    }
    var finalDate = yF+"-"+mF+"-"+dF
    return finalDate;
}

//ejecuto la funcion para ver que dia de la semana nacio
var bdayDay = queDiaEs(bdayRecieve);
document.getElementById("b-day-week").innerHTML = bdayDay;

//Checking when is the next birthday
var dateFormat = new Date(bdayRecieve);
var bDate = dateFormat.getDate();
var bMonth = dateFormat.getMonth();
var today = new Date();
var tDate = today.getDate();
var tMonth = today.getMonth();
var tYear = today.getFullYear();
var nextBDay = null;
if (bMonth == tMonth){
    if (bDate == tDate){
        console.log("hoy es tu cumpleaños!");
    }
    else if (bDate > tDate){
        console.log("tu cumple esta por venir, este mismo mes!");
        nextBDay = true;
    }
    else if (bDate < tDate){
        console.log("tu cumple ya pasó y fue este mes!");
        nextBDay = false;
    }
} else if (bMonth < tMonth){
    console.log("tu cumple ya pasó este año!");
    nextBDay = false;
} else if (bMonth > tMonth){
    console.log("tu cumple todavia no pasó este año!");
    nextBDay = true;
}

//switch segun si cumple hoy, este año, o el año que viene
switch (nextBDay) {
    case null:
        document.getElementById("next-b-date").innerHTML = "HOY ES TU CUMPLEAÑOS";
        break;
    case true:
        document.getElementById("next-b-date").innerHTML = "TU CUMPLEAÑOS ES ESTE AÑO";
        var formatNextBday = propperDateFormat(tYear, bMonth, bDate);
        var queDiaCumplis = queDiaEs (formatNextBday);
        document.getElementById("next-b-day").innerHTML = "CAE UN: " + queDiaCumplis; 
        break;
    case false:
        var nextYear = tYear + 1;
        document.getElementById("next-b-date").innerHTML = "TU CUMPLEAÑOS ES EL AÑO QUE VIENE";
        var formatNextBday = propperDateFormat(nextYear, bMonth, bDate);
        var queDiaCumplis = queDiaEs (formatNextBday);
        document.getElementById("next-b-day").innerHTML = "CAE UN: " + queDiaCumplis;
        break;
}