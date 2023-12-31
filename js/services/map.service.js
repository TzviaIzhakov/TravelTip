export const mapService = {
  initMap,
  addMarker,
  panTo,
  getMap,
};

// Var that is used throughout this Module (not global)
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
    // const queryParams = new URLSearchParams(window.location.search)
    // const loc={
    //     lat: queryParams.get('lat') || '',
    //     lng: queryParams.get('lng') || ''
    // }
    // panTo(loc.lat,loc.lng )
    // console.log(loc,'loc')
    const queryParamsNew = new URLSearchParams(window.location.search);
    const myParam1 = queryParamsNew.get('lat');
    const myParam2 = queryParamsNew.get('lng');
    console.log(myParam1, myParam2, 'ppppp');
    if (myParam1 && myParam2) {
      mapService.panTo(myParam1, myParam2);
    }
  });
}

function getMap() {
  return gMap;
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
