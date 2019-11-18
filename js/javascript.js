// custom javascript

let option = {
  id: 787657,
  appid: "5eb60d5c4cea51ae7a2e6aba25c6c327",
  units: "metric"
};

let dani = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let dailyData = [];
let trenutniDatum = new Date();
console.log(dailyData);

let factory = {
  currentWeatherData: function() {
    $.getJSON(
      "http://api.openweathermap.org/data/2.5/weather?id=" +
        option.id +
        "&APPID=" +
        option.appid +
        "&units=" +
        option.units
    ).done(function(response) {
      factory.initCurrentData(response);
      widget.initWidgetData(response);
    });
  },
  initCurrentData: function(data) {
    // trenutno vreme
    let datum = new Date(data.dt * 1000);
    // vreme izlaska sunca
    let sunrise = new Date(data.sys.sunrise * 1000);
    // vreme zalaska sunca
    let sunset = new Date(data.sys.sunset * 1000);

    $(".weather-body-single-city-title h2").text(data.name);
    $(".weather-body-single-temp span").text(Math.round(data.main.temp));
    $(".weather-body-single-city-icon-circle i")
      .removeClass()
      .addClass(factory.checkWeatherIcon(data.weather[0].icon));
    $(".weather-body-single-status h4").text(data.weather[0].description);
    $(".weather-body-single-humidity-value span").text(data.main.humidity);
    $(".weather-body-single-wind-value span").text(data.main.wind);
    $(".weather-body-single-pressure-value span").text(data.main.pressure);
    $(".weather-body-single-cloudness-value span").text(data.clouds.all);
    // $('')
    if (datum > sunrise && datum < sunset) {
      $(".container-gradient").css(
        "background-image",
        'url("../images/background.jpg")'
      );
    } else {
      $(".container-gradient").css(
        "background-image",
        'url("../images/background2.jpg")'
      );
    }
  },
  dailyWeatherData: function() {
    $.getJSON(
      "http://api.openweathermap.org/data/2.5/forecast?id=" +
        option.id +
        "&APPID=" +
        option.appid +
        "&units=" +
        option.units
    ).done(function(response) {
      factory.initDailyData(response);
    });
  },
  checkWeatherIcon: function(name) {
    switch (name) {
      // ikonice za noc
      case "01n":
        return "wi wi-night-clear";
        break;
      case "02n":
        return "wi wi-night-alt-cloudy";
        break;
      case "03n":
        return "wi wi-cloudy";
        break;
      case "04n":
        return "wi wi-cloudy";
        break;
      case "09n":
        return "wi wi-night-alt-showers";
        break;
      case "10n":
        return "wi wi-night-alt-rain";
        break;
      case "11n":
        return "wi wi-night-alt-thunderstorm";
        break;
      case "13n":
        return "wi wi-night-snow-wind";
        break;
      case "50n":
        return "wi wi-night-fog";
        break;
      // ikonice za dan
      case "01d":
        return "wi wi-day-sunny";
        break;
      case "02d":
        return "wi wi-day-cloudy";
        break;
      case "03d":
        return "wi wi wi-cloudy";
        break;
      case "04d":
        return "wi wi wi-cloudy";
        break;
      case "09d":
        return "wi wi-day-rain-mix";
        break;
      case "10d":
        return "wi wi-day-hail";
        break;
      case "11d":
        return "wi wi-day-sleet-storm";
        break;
      case "13d":
        return "wi wi-day-snow";
        break;
      case "50d":
        return "wi wi-day-fog";
        break;
      default:
        return "wi wi-day-sunny";
    }
  },
  initDailyData: function(data) {
    trenutniDatum.setHours(0, 0, 0, 0);

    $.each(data.list, function(index, value) {
      let loopDate = new Date(value.dt_txt);

      if (trenutniDatum.getHours() === loopDate.getHours()) {
        dailyData.push(value);
      }
    });

    $.each(dailyData, function(index, value) {
      let datum = new Date(value.dt_txt).getDay();
      $("#" + (index + 1) + " .weather-body-daily-list-single-title h4").text(
        dani[datum]
      );
      $("#" + (index + 1) + " .weather-body-daily-list-single-icon-circle i")
        .removeClass()
        .addClass(factory.checkWeatherIcon(value.weather[0].icon));
      $("#" + (index + 1) + " .weather-body-daily-list-single-temp span").text(
        Math.round(value.main.temp)
      );
      $("#" + (index + 1) + " .weather-body-daily-list-single-status").text(
        value.weather[0].description
      );
    });
  }
};

// widget funkcije
let widget = {
  // prikazivanje widgeta
  openWidget: function() {
    $(".widget-wrapper").addClass("opened");
  },
  // skrivanje widgeta
  closeWidget: function() {
    $(".widget-wrapper").removeClass("opened");
  },
  initWidgetData: function(data) {
    // kreiranje instance klase date kome smo prosledili vrednost u
    //UNIXTIMESTAMP formatu i pomocu metode .getDay() dobili trenutni dan u nedelji. (0-6)
    let datum = new Date(data.dt).getDay();

    // upis informacija dobijenih sa servera u widget
    // naziv grada
    $(".widget-city h3").text(data.name);
    // trenutni dan
    $(".widget-title h4").text(dani[datum]);
    // ikonica
    $(".widget-icon-circle i")
      .removeClass()
      .addClass(factory.checkWeatherIcon(data.weather[0].icon));
    // kratak opis vremena
    $(".widget-status").text(data.weather[0].description);
    // trenutna temperatura
    $(".widget-main-temp span").text(Math.round(data.main.temp));
    // minimalna temperatura
    $(".widget-min-max-temp-min-value span").text(
      Math.round(data.main.temp_min)
    );
    // maksimalna temperatura
    $(".widget-min-max-temp-max-value span").text(
      Math.round(data.main.temp_min)
    );
    // vlaznost vazduha
    $(".widget-humidity-value span").text(data.main.humidity);
    // brzina vetra
    $(".widget-wind-value span").text(data.wind.speed);
    // pritisak vazduha
    $(".widget-pressure-value span").text(data.main.pressure);
    // oblacnost
    $(".widget-cloudness-value span").text(data.clouds.all);
  }
};

// podesavanja za EasyAutocomplete plugin.

var autocompleteOptions = {
  // putanja do naseg json fajla
  url: "cities/city-list.json",
  // nacin prikazivanja elemenata kao i njih style
  template: {
    type: "description",
    fields: {
      description: "country"
    }
  },
  placeholder: "Izaberite grad",
  // dodatna podesavanja
  list: {
    match: {
      enabled: true
    },
    // postavljanje maksimalnog broja elemenata u listi
    maxNumberOfElements: 10,
    // kada se izabere neki od gradovaa iz liste pozove ova metoda onChooseEvent , i zatim pisemo logiku koja treba da se izvrsi na taj dogadjaj,
    // nasem slucaju to je pokupljanje vrednosti iz polja ID smestanje istog u option.id objekat,
    // i pozivanje funkcija koje ponovo ucitavaju informacije sa servera
    onChooseEvent: function() {
      let cityId = $("#search").getSelectedItemData().id;
      option.id = cityId;
      factory.currentWeatherData();
      factory.dailyWeatherData();
    }
  },
  // ova funkcija se poziva kada se unese neka vrednost u polje za pretragu, imamo Callback funkciju koji ima povratnu vrednost i vraca sve gradove,
  // preko ispitivanja da li se svojstvo "country" podudara sa nasim "RS" vracamo gradove samo za Srbiju. Odnosno ukoliko se ne podudara vracamo prazan string.
  getValue: function(element) {
    if (element.country == "RS") {
      return element.name;
    } else {
      return "";
    }
  }
};
// ovom funkcijom easyAutocomplete(option) inicijalizujemo nas plugin i vezuje za nase input polje koje treba da predstavlja polje za pretragu
$("#search").easyAutocomplete(autocompleteOptions);

// event kada se klikne na ikonicu sa klasom .open-widget poziva se funkcija openWidget()
$(".open-widget").click(function() {
  widget.openWidget();
});
// event kada se klikne na ikonicu sa klasom .close-widget prikazana kao X simbol , poziva se funkcija closeWidget()
$(".close-widget").click(function() {
  widget.closeWidget();
});

// pocetna inicijalizacija podataka
factory.dailyWeatherData();
factory.currentWeatherData();
