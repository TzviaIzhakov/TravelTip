import { storageService } from './async-storage.service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
};

// Var that is used throughout this Module (not global)
var gMap;
const LOC_KEY='locDB'


function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
    gMap.addListener('click', (ev) => {
      const lat = ev.latLng.lat();
      const lng = ev.latLng.lng();
      // saveCoords({ lat, lng })
      panTo(lat, lng);
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCcepevgXQ0DFmsXrdyecMV11LMtvFSoWs`
        )
        .then((res) => res.data.results[0].formatted_address)
        .then((adress) => {
            saveLoc(lat, lng, adress)
            storageService.post(LOC_KEY,{lat, lng, adress})
        })
    })
  })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyCcepevgXQ0DFmsXrdyecMV11LMtvFSoWs';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
