import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/async-storage.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.saveLoc = saveLoc;

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
        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCcepevgXQ0DFmsXrdyecMV11LMtvFSoWs`
          )
          .then((res) => res.data.results[0].formatted_address)
          .then((adress) => {
            saveLoc(lat, lng, adress);
            storageService.post(LOC_KEY, { lat, lng, adress });
          });
      });
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2);
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
function onPanTo() {
  console.log('Panning the Map');
  mapService.panTo(35.6895, 139.6917);
}

function saveLoc(lat, lng, name) {
  locService
    .getLocs()
    .then((locs) => {
      locs.push(locService.createLoc(lat, lng, name));
      return locs;
    })
    .then((locs) => {
      return renderLocations(locs);
    });
}

function renderLocations(locs) {
  console.log(locs);
  const strHtml = locs
    .map((loc) => {
      let { adress, lat, lng } = loc;
      return `
    <tr>
    <td>${adress}</td>
    <td>${lat}</td>
    <td>${lng}</td>
    </tr>
    `;
    })
    .join('');
  console.log(strHtml);
  const elTbody = document.querySelector('.locations');
  console.log(elTbody);
  console.log(document.querySelector('table'));
  elTbody.innerHTML = strHtml;
}
