import "leaflet";
import icons from "url:../../img/SVG/sprite.svg";

import View from "./View.js";

// todo validation

class WorkoutListView extends View {
    _errMsg = `⚠️ Characters or Symbols and Negative Numbers are NOT allowed for inputs.⚠️ <br />Only Positive Numbers are permitted unless elevation field. <br />
    On elevation input, Negative number is good to put!😄`;

    _mapEvent;

    _parentEl = document.querySelector(".workouts");
    _form = document.querySelector(".form");
    _inputType = document.querySelector(".form__input--type");
    _inputDistance = document.querySelector(".form__input--distance");
    _inputDuration = document.querySelector('.form__input--duration');
    _inputCadence = document.querySelector('.form__input--cadence');
    _inputElevation = document.querySelector('.form__input--elevation');

    constructor() {
        super();
        this._addHandlerSelect();
        this.defaultElevationField();
    }

    addHandlerSetViewToList(handler) {
        this._parentEl.addEventListener('click', function (e) {
            const workoutEl = e.target.closest('.workout');
            if (!workoutEl) return;

            handler(workoutEl);
        });
    }

    // Handler form when user submits
    _addHandlerSelect() {
        this._inputType.addEventListener('change', this._toggleElevationField.bind(this));
    }

    newWorkout(running, cycling, workouts) {
        const type = this._inputType.value;
        const duration = +this._inputDuration.value;
        const distance = +this._inputDistance.value;
        const cadence = +this._inputCadence.value;
        const elevation = +this._inputElevation.value
        const { lat, lng } = this._mapEvent.latlng;

        let workout;

        // check type and create corresponding object
        if (type === "running") {
            if (!isNumber(duration, distance, cadence) ||
                !isPositive(duration, distance, cadence)) {
                return this.renderError();
            }
            workout = new running([lat, lng], distance, duration, cadence);
        }

        if (type === "cycling") {
            if (!isNumber(duration, distance, cadence) ||
                !isPositive(duration, distance, cadence)) {
                return this.renderError();
            }
            workout = new cycling([lat, lng], distance, duration, cadence);
        }

        // add new object to workouts array
        workouts.push(workout);

        this._hideForm();
    }

    // todo edit workout

    async renderWorkout(workout, geoData, weatherData) {
        try {
            const geoData = await geoData;
            const weatherData = await weatherData;

            let markup = this._generateMarkup(workout, geo, weather);

            workout.type === "running" ?
            (markup += this._generateMarkupRunning(workout)) :
            (markup += this._generateMarkupCycling(workout));

            this._form.insertAdjacentElement("afterend", markup);
        } catch (err) {
            console.error(err);
        }
    }

    addHandlerUpdate() {
    };

    showForm(mapE) {
        this._form.classList.remove("hidden");
        this._clearInputFields();
        this._inputDistance.focus();

        // mapE — event to get location from leaflet map
        this._mapEvent = mapE;
    }

    // todo show edit form

    _hideForm() {
        this._clearInputFields();

        // prevent animations
        this._form.style.display = 'none';
        this._form.classList.add("hidden");
        setTimeout(() => (this._form.style.display = "grid"), 1000);
    }

    _clearInputFields() {
        this._inputDuration.value = this._inputDistance.value =
            this._inputCadence.value = this._inputElevation.value = "";
    }

    _toggleElevationField() {
        this._inputCadence.closest(".form__row")
            .classList
            .toggle("form__row--hidden");
        this._inputElevation.closest(".form__row")
            .classList
            .toggle("form__row--hidden");
    }

    // set default field
    defaultElevationField() {
        if (this._inputType.value === "running") {
            this._inputCadence.closest(".form__row")
                .classList
                .remove("form__row--hidden");
            this._inputElevation.closest(".form__row")
                .classList
                .add("form__row--hidden");
        }

        if (this._inputType.value === "cycling") {
            this._inputCadence.closest(".form__row")
                .classList
                .remove("form__row--hidden");
            this._inputElevation.closest(".form__row")
                .classList
                .add("form__row--hidden");

        }
    }

    _generateMarkup(workout, geo, weather) {
        return `
            <li class="workout workout__${workout.type}" data-id="${workout.id}">
                <div class="menu menu__hidden">
                    <ul class="menu__list">
                        <li class="menu__item menu__item--edit">
                            <svg class="menu__icon">
                                <use xlink:href="${icons}#icon-pencil"></use>
                            </svg>
                            <span>Edit form</span>
                        </li>
                        <li class="menu__item menu__item--delete">
                            <svg class="menu__icon">
                                <use xlink:href="${icons}#icon-trash"></use>
                            </svg>
                            <span>Delete this list</span>
                        </li>
                        <li class="menu__item menu__item--clear">
                            <svg class="menu__icon">
                                <use xlink:href="${icons}#icon-trash"></use>
                            </svg>
                            <span>Clear all lists</span>
                        </li>
                        <li class="menu__item menu__item--sort">
                            <svg class="menu__icon">
                                <use xlink:href="${icons}#icon-chevron-down"></use>
                            </svg>
                            <span>Sort by</span><span class="menu__sort--text">(km, date)</span>
                        </li>
                    </ul>
                </div>
                
                <h2 class="workout__title">${setDescription(workout)}${geo ?
                                                                       ',' : ''}
                ${geo ?? ''} <img class="workout__weather" src="${weather}"/>
                
                </h2>
                <svg class="workout__icon">
                    <use xlink:href="${icons}#icon-dots-three-horizontal"></use>
                </svg>
                <div class="workout__details">
                    <span class="workout__imoji workout__imoji--type">${workout.type ===
                                                                        'running' ?
                                                                        '🏃‍♂' :
                                                                        '🚴‍♀️'}</span>
                    <span class="workout__value workout__value--distance">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                    <div class="workout__details">
                    <span class="workout__imoji">⏱</span>
                    <span class="workout__value workout__value--duration">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `
    }

    _generateMarkupCycling(workout) {
        return `
            <div class="workout__details">
                <span class="workout__imoji">⚡️</span>
                <span class="workout__value workout__value--speed">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__imoji">⛰</span>
                <span class="workout__value workout__value--elevation">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
        </li>
        `;
    }
}

export default new WorkoutListView();