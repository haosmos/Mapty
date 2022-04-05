import View from './View.js';
import 'leaflet';

import logoIcon from 'url:../../img/icon.png';

import {
    MAP_ZOOM_LEVEL,
    ICON_SIZE,
    ICON_ANCHOR,
    POPUP_ANCHOR,
    POPUP_MAX_WIDTH,
    POPUP_MIN_WIDTH,
    POPUP_AUTO_CLOSE,
    POPUP_CLOSE_ON_CLICK,
    MAP_PADDING,
    PAN_DURATION_SEC,
    ANIMATE
} from '../config.js';

class MapView extends View {
    _map = document.querySelector('.map');
    _mapZoomLevel = MAP_ZOOM_LEVEL;

    _errMsg = "Fail to load your position. </br>Please allow location access of this site to access your location🗺";

    _inputDistance = document.querySelector(".form__input--distance");

    addHandlerSetViewToPopup(handler) {
        this._map.addEventListener("click", function (e) {
            const popup = e.target.closest(".leaflet-popup");

            if (!popup) return;

            handler(popup);
        });
    }

    loadMap(position, workouts, handler) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const coords = [latitude, longitude];

        this._map = L.map("map").setView(coords);
        // todo add mapzoomlevel;

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this._map);

        this.addHandlerShowForm(workoutListView.showForm.bind(workoutListView));

        // IF LOCAL STORAGE IS EMPTY RETURN
        if (workouts.leaflet === 0) return;

        workouts.forEach((work) => this.renderWorkoutMarker(work));

        // TODO zoom to fit all workout markers
    }

    addHandlerShowForm(handler) {
        this._map.on("click", handler);
    }

    renderWorkoutMarker(workout) {
        const myIcon = L.icon({
            iconUrl:   logoIcon,
            className: `${workout.id}`,

            // todo icon options
        });

        L.marker(workout.coords, { icon: myIcon })
            .addTo(this._map)
            .bindPopup(
                L.popup({
                    // todo maxwidth, minwidth, autoclose, closeOnClick
                    className: `${workout.type}-popup ${workout.id}`,
                })
            )
    }

    setZoomAndFit(workout) {
        if (workout.length === 1) return this.setViewToPopup(workout[0]);

        const allCoords = workout.map((workout) => workout.coords);
        this._map.fitBounds(allCoords, { padding: MAP_PADDING });
    }

    setViewToPopup(workout) {
        this._map.setView(workout.coords, this._mapZoomLevel, {
            animate: ANIMATE,
            pan:     {
                duration: PAN_DURATION_SEC,
            },
        });
    }
}

export default new MapView();
