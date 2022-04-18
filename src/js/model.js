import { AJAX } from './helper.js';
import { SORT_TOGGLE, EDIT_TOGGLE } from "./config";
import { async } from "regenerator-runtime";

export const state = {
  workouts:       [],
  edit:           EDIT_TOGGLE,
  sort:           SORT_TOGGLE,
  workoutElement: "",
};

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDateDescription() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'];

    this.dateDescription =
      `${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

export class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDateDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

export class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDateDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
  }
}

// get geocode from coordinates from geocode api
export const getGeoCode = async function (workout) {
  try {
    const [lat, lng] = workout.coords;
    const data = await AJAX(
      `https://geocode.xyz/${lat},${lng}?geoit=json`,
      'Please try to reload the page again.'
    );

    console.log(data);

    return data.osmtags.name;
  } catch (err) {
    console.error(err);
    return '';
  }
};

export const getWeatherData = async function (workout) {
  try {
    const myKey = "5c04291f0b2520cd23ea484f5b1e34e2";
    const [lat, lng] = workout.coords;

    const data = await AJAX(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${myKey}`,
      'Failed to load data from API'
    )

    const { icon } = data.weather[0];

    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  } catch (err) {
    console.error(err);
    return '';
  }
}

export const setLocalStorage = function (workout) {
  localStorage.setItem("workout", JSON.stringify(workout));
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("workouts"));

  if (!data) return;
  state.workouts = data;
};

