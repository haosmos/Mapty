import * as model from "./model.js";
import mapView from "./View/mapView.js";
import workoutListsView from "./View/workoutListView.js";
import menuItemWorkoutView from "./View/menuItemWorkoutView.js";
import "leaflet";
import { findWorkout, findWorkoutPopup } from "./helper";

// Get position from geo api and control map
const controlMap = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => mapView.loadMap(position, model.state.workouts), () => mapView.renderError()
      .bind(mapView));
  }

};

const controlWorkout = function () {
  // RENDER NEW WORKOUT
  if (!model.state.edit) {
    workoutListsView.newWorkout(
      model.Running,
      model.Cycling,
      model.state.workouts
    );

    // RENDER WORKOUT ON LIST
    const workout = model.state.workouts[model.state.workouts.length - 1];

    workoutListsView.renderWorkout(
      workout,
      model.getGeoCode(workout),
      model.getWeatherData(workout)
    );

    // RENDER WORKOUT ON MAP AS A MARKER AND SET WORKOUT TO LOCAL STORAGE
    mapView.renderWorkoutMarker(workout);
    model.setLocalStorage(model.state.workouts);
  }

  if (model.state.edit) {
    const workout = findWorkout(model.state.workouts, model.state.workoutElement);

    // EDIT WORKOUT AND SET THE EDITED WORKOUT TO LOCAL STORAGE
    workoutListsView.editWorkout(workout);
    model.setLocalStorage(model.state.workouts);

    // DELETE WORKOUT LISTS, POPUP AND RERENDER WORKOUT LISTS, POPUP WITH EDITED DATA
    menuItemWorkoutView.deleteAllWorkouts();
    model.state.edit = false;
    mapView.setZoomAndFit(model.state.workouts);
    model.state.workouts.forEach((work) => mapView.renderWorkoutMarker(work));
    loadWorkouts(model.state.workouts);
  }

  // toggle main menu
  const btnsMenu = document.querySelector('.btns-menu');

  // If workouts array is empty add hidden class
  if (model.state.workouts.length === 0) {
    btnsMenu.classList.add('btns-menu--hidden');
    // If workouts array has entries remove hidden class
  } else {
    btnsMenu.classList.remove('btns-menu--hidden');
  }
};

// const controlMenu = function () {
//   const sortBar = document.querySelector('.sort-bar');
//
//   const btnSort = document.querySelector('.btn-sort');
//   //
//   btnSort.addEventListener("click", () => {
//     sortBar.classList.toggle('sort-bar--hidden');
//   });
// }

const controlMenu = function () {
  const sortBar = document.querySelector('.sort-bar');
  //
  sortBar.classList.toggle('sort-bar--hidden');

}

const loadWorkouts = async function (workouts) {
  if (workouts.length === 0) return;

  // render workout list async
  for (const workout of workouts) {
    await workoutListsView.renderWorkout(workout, model.getGeoCode(workout), model.getWeatherData(workout));
  }
};

// CLICK ON LIST, SET VIEW TO CORRESPONDING POPUP
const controlSetViewToList = function (workoutEl) {
  const workout = findWorkout(model.state.workouts, workoutEl);

  mapView.setViewToPopup(workout);
};

// CLICK ON POP-UP CONTENT ON a MAP, SET VIEW TO THE CORRESPONDING POP-UP
const controlSetViewToPopup = function (popup) {
  const workout = findWorkoutPopup(model.state.workouts, popup);

  mapView.setViewToPopup(workout);
};

const controlEdit = function () {
  workoutListsView.showForm.bind(workoutListsView);
  model.state.edit = false;
}

const controlWorkoutMenuItem = function (workoutEl, menuItem) {
  if (menuItem === null) return; // Guard class
  const workout = findWorkout(model.state.workouts, workoutEl);
  model.state.workoutElement = workoutEl;

  // CLICK ON EDIT BUTTON
  if (menuItem.classList.contains('menu__item--edit')) {
    workoutListsView.showEditForm(workout);
    workoutListsView.defaultElevationField();
    model.state.edit = true;

    // OPEN NEW FORM, WHEN EDIT FORM IS OPENED
    mapView.addHandlerClick(controlEdit);
  }

  // CLICK ON DELETE BUTTON, DELETE THE WORKOUT
  if (menuItem.classList.contains('menu__item--delete')) {
    menuItemWorkoutView.deleteWorkout(workout, workoutEl);

    // DELETE LIST FROM WORKOUT ARRAY AND LOCAL STORAGE
    model.state.workouts =
      model.state.workouts.filter((work) => work.id !== workout.id);
    model.setLocalStorage(model.state.workouts);
    mapView.setZoomAndFit(model.state.workouts);
  }

  // // CLICK ON CLEAR BUTTON, DELETE ALL WORKOUTS FROM THE LIST, MAP AND STORAGE
  if (menuItem.classList.contains('menu__item--clear')) {
    menuItemWorkoutView.deleteAllWorkouts();
    mapView.setZoomAndFit(model.state.workouts);
    model.state.workouts = [];
    model.setLocalStorage(model.state.workouts);
  }

  // CLICK ON SORT BUTTON,
  if (menuItem.classList.contains('menu__item--sort')) {
    // HIDE WORKOUT LISTS AND SORT LISTS BY DISTANCE AND CLICK AGAIN BY TIME
    menuItemWorkoutView.sortWorkout(model.state.workouts, model.state.sort);
    model.state.sort = !model.state.sort;

    // MANIPULATING WORKOUTS DATA AND SET VIEW AND RERENDER WORKOUTS
    model.setLocalStorage(model.state.workouts);
    mapView.setZoomAndFit(model.state.workouts);
    loadWorkouts(model.state.workouts);
  }

  menuItemWorkoutView.hideMenu();
};

// model.clearLocalStorage();

const init = function () {
  controlMap();
  // model.getLocalStorage();
  loadWorkouts(model.state.workouts);
  // workoutListsView.addHandlerControlMenu(controlMenu)
  workoutListsView.addHandlerForm(controlWorkout);
  workoutListsView.addHandlerSetViewToList(controlSetViewToList);
  workoutListsView.addHandlerControlMenu(controlMenu);
  // controlMenu();
  mapView.addHandlerSetViewToPopup(controlSetViewToPopup);
  menuItemWorkoutView.addHandlerControlMenuItem(controlWorkoutMenuItem);
};

init();