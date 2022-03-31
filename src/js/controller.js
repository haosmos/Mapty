// Get position from geo api and control map
const controlMap = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => map);
    }
}