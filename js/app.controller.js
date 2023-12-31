import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/async-storage.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onPanToLocation = onPanToLocation;
window.onDeleteLocation = onDeleteLocation;
window.saveLoc = saveLoc;
window.onMoveToLoc = onMoveToLoc;
window.onGetLink = onGetLink;

const LOC_KEY = 'locDB';

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
      console.log(mapService.getMap());
      mapService.getMap().addListener('click', (ev) => {
        const lat = ev.latLng.lat();
        const lng = ev.latLng.lng();

        mapService.panTo(lat, lng);
        onAddMarker(lat, lng);

        const queryParams = `?lat=${lat}&lng=${lng}`;
        const newUrl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          queryParams;

        console.log(newUrl);
        window.history.pushState({ path: newUrl }, '', newUrl);
        console.log(window.location.href, '!');

        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCcepevgXQ0DFmsXrdyecMV11LMtvFSoWs`
          )
          .then((res) => res.data.results[0].formatted_address)
          .then((adress) => {
            saveLoc(lat, lng, adress);
          });
      });
    })
    .catch(() => console.log('Error: cannot init map'));
}

function onGetLink() {
  const queryParams = new URLSearchParams(window.location.search);
  const myParam1 = queryParams.get('lat');
  const myParam2 = queryParams.get('lng');
  // console.log(myParam);
  console.log(queryParams);
  const newUrl =
    window.location.protocol +
    '//' +
    'tzviaizhakov.github.io/TravelTip/' +
    window.location.pathname +
    '?' +
    'lat=' +
    myParam1 +
    '&lng=' +
    myParam2;
  navigator.clipboard.writeText(newUrl);
  console.log(newUrl);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onMoveToLoc(ev) {
  const loc = ev.target.value.replace(/ /g, '+');
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=AIzaSyCcepevgXQ0DFmsXrdyecMV11LMtvFSoWs`
    )
    .then((res) => res.data.results[0].geometry.location)
    .then(({ lat, lng }) => {
      mapService.panTo(lat, lng);
      storageService.post(LOC_KEY, { lat, lng, adress: ev.target.value });
    });
}

function onAddMarker(lat = 32.0749831, lng = 34.9120554) {
  console.log('Adding a marker');
  mapService.addMarker({ lat, lng });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    return renderLocations(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}

function saveLoc(lat, lng, adress) {
  locService.getLocs().then((locs) => {
    locService.addLoc(lat, lng, adress).then((locs) => renderLocations(locs));
  });
}

function renderLocations(locs) {
  const strHtml = locs
    .map((loc) => {
      let { adress, lat, lng } = loc;
      return `
    <tr>
    <td>${adress}</td>
    <td>${lat}</td>
    <td>${lng}</td>
    <td>
    <button onclick="onPanToLocation(${lat},${lng})">Go</button> 
    <button onclick="onDeleteLocation('${loc.id}')">Delete</button>
    </td>
   
    </tr>
    `;
    })
    .join('');
  //   console.log(strHtml);
  const elTbody = document.querySelector('.locations');
  elTbody.innerHTML = strHtml;
}

function onDeleteLocation(id) {
  locService.deleteLocation(id).then((res) => {
    console.log('res', res);
    renderLocations(res);
  });
}

function onPanToLocation(lat, lng) {
  mapService.panTo(lat, lng);
  onAddMarker(lat, lng);
}
