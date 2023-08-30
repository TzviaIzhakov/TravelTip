import { storageService } from './async-storage.service.js';
export const locService = {
    getLocs,
    createLoc,
    deleteLocation,
    addLoc,
};
const LOC_KEY = 'locDB';
var locs

function deleteLocation(id) {
    return getLocs()
        .then(locs => storageService.remove(LOC_KEY, id))
        .then(res => getLocs()
        )


}

function addLoc(lat, lng, adress) {
    getLocs().then((locs) => {
        storageService.post(LOC_KEY, { lat, lng, adress });
        return locs;
    });
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            locs = storageService.query(LOC_KEY) || [];
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
