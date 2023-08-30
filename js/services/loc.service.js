import { storageService } from './async-storage.service.js';
export const locService = {
  getLocs,
  createLoc,
  deleteLocation,
  addLoc,
};
const LOC_KEY = 'locDB';
const locs = storageService.query(LOC_KEY) || [];

function deleteLocation(id) {
  getLocs().then((locs) => {
    // locs.splice(i, 1);
    console.log(id);
    storageService.remove(LOC_KEY, id);
    return locs;
  });
}

function addLoc(lat, lng, adress) {
  getLocs().then((locs) => {
    locs.push(createLoc(lat, lng, adress));
    storageService.post(LOC_KEY, { lat, lng, adress });
    return locs;
  });
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
      console.log(locs, 'locs from stroge');
    }, 2000);
  });
}

function createLoc(lat, lng, adress) {
  return {
    adress,
    lat,
    lng,
  };
}
