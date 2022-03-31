import { AJAX } from './helper.js';

export const state = {
    workouts:       [],
    workoutElement: "",
    // todo edit and sort
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

export class cycling extends Workout {
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
export const getGeocode = async function (workout) {
    try {
        const [lat, lng] = workout.coords;
        const data = await AJAX("https://geocode.xyz/${lat},${lng}?geoit=json");

        return data.osmtags.name;
    } catch (err) {
        console.error(err);
        return '';
    }
}
