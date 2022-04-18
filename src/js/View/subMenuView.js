import 'leaflet';

import View from './View.js';
import { findMarkerByClassName, findPopupByClassName } from "../helper";

class SubmenuView extends View {
  _parentEl = document.querySelector(".side-bar");

  constructor() {
    super();
    this._addHandlerRender();
    this._addHandlerHideMenu();
  }

  // render popup-menu when click on the three dots
  _addHandlerRender() {
    this._parentEl.addEventListener('click', function (e) {
      if (e.target.tagName !== "svg" && e.target.tagName !==
          "use") {
        return;
      }

      const menu = e.target.closest(".workout").querySelector(".menu");

      // for animations
      menu.style.display = "block";
      setTimeout(() => menu.classList.remove("menu__hidden"), 10);
    });
  }

  _addHandlerHideMenu() {
    this._parentEl.addEventListener("click", this._hideMenuClickOutside.bind(this));
  }

  addHandlerControlMenu(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const menuItem = e.target.closest(".menu__item");
      const workoutEl = e.target.closest(".workout");

      handler(workoutEl, menuItem);
    });
  }

  // delete list from local storage and workout array
  deleteWorkout(workout, workoutEl) {
    // [...arr] = array.from(arr) — converting DOM to an array
    const popups = [...document.querySelectorAll(".leaflet-popup")];
    const markers = [...document.querySelectorAll(".leaflet-marker-icon")];

    const popup = findPopupByClassName(popups, workout);
    const marker = findMarkerByClassName(markers, workout);

    // delete popup, marker and workout from list
    popup.style.display = "none";
    marker.style.display = "none";
    workoutEl.style.display = "none";
  }

  deleteAllWorkouts(workout, workoutEl) {
    const popups = document.querySelectorAll(".leaflet-popup");
    const markers = document.querySelectorAll(".leaflet-marker-icon");

    const popup = findPopupByClassName(popups, workout);
    const marker = findMarkerByClassName(markers, workout);

    // delete popup, marker and workout from list
    popup.style.display = "none";
    marker.style.display = "none";
    workoutEl.style.display = "none";
  }

  // delete workout item
  deleteWorkoutLists() {
    const workoutLists = document.querySelectorAll(".workout");
    workoutLists.forEach((workout) => (workout.style.display = "none"));
  }

  hideMenu() {
    const menus = this._parentEl.querySelectorAll(".menu");

    menus.forEach((menu) => {
      if (menu.classList.contains("menu__hidden")) return;

      menu.classList.add("menu__hidden");
      menu.style.display = "none";
    });
  }

  // clicking outside the menu area hides the menu, hides the menu when the menu is shown
  _hideMenuClickOutside(e) {
    const menus = Array.from(this._parentEl.querySelectorAll(".menu"));
    const isHidden = menus.every((menu) => menu.classList.contains("menu__hidden"));

    if (e.target.closest(".menu__item") !== null || isHidden) return;

    this.hideMenu();
  }

  sortWorkout(workout, sortBoolean) {
    this.deleteWorkoutLists();

    if (sortBoolean) {
      workout.sort((a, b) => a.distance - b.distance);
    }

    if (!sortBoolean) {
      workout.sort((a, b) => new Date(a.date).getTime() -
                             new Date(b.date).getTime());
    }
  }
}

export default new SubmenuView();
