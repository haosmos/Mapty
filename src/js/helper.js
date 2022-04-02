export const AJAX = async function (url, errMsg) {
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(errMsg);
        }

        return data;
    } catch (err) {
        throw err;
    }
};

// validation
export const isNumber = (...inputs) => inputs.every((input) => Number.isFinite(input));
export const isPositive = (...inputs) => inputs.every((input) => input > 0);

// description from date and type of workout
export const setDescription = function (workout) {
    if (workout.type === 'running') {
        return `${workout.type.replace(workout.type[0], workout.type[0].toUpperCase())} on ${workout.dateDescription}
        `
    }

    if (workout.type === 'cycling') {
        return `${workout.type.replace(workout.type[0], workout.type[0].toUpperCase())} on ${workout.dateDescription}
        `
    }
};

export const findWorkout = function (workouts, workoutEl) {
    const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

    return workout;
}

export const findWorkoutPopup = function (workout, popup) {
    const worlkout = workouts.find((work) => `leaflet-popup ${work.type}-popup ${work.id} leaflet-zoom-animated` ===
                                             popup.className);

    return worlkout;
}

export const findPopupByClassName = function (popups, workoutEl) {
    const popup = popups.find((pop) => `leaflet-popup ${workoutEl.type}-popup ${workoutEl.id} leaflet-zoom-animated` ===
                                       pop.className);

    return popup;
}

export const findMarkerByClassName = function (markers, workoutEl) {
    const marker = markers.find((mark) => mark.className ===
                                          `leaflet-marker-icon ${workoutEl.id} leaflet-zoom-animated leaflet-interactive`);

    return marker;
};