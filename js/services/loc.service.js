import { storageService } from './async-storage.service.js';
export const locService = {
  getLocs,
  createLoc,
};
const LOC_KEY = 'locDB';
const locs = storageService.query(LOC_KEY) || [];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
      console.log(locs);
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
