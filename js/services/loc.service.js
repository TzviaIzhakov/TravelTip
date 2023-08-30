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
    console.log(id);
    storageService.remove(LOC_KEY, id);
    console.log(locs, 'in delete!!');
    return locs;
  });
}

function addLoc(lat, lng, adress) {
  getLocs().then((locs) => {
    storageService.post(LOC_KEY, createLoc(lat, lng, adress));
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
