'use strict';

//Param values
const ZOOM_LEVEL = 'zoom';
const LATITUDE = 'lat';
const LONGITUDE = 'lng';
const LAYER = 'layer';

//Default map values
//***Should be defined as global or as a separated module */
const DEFAULT_MIN_ZOOM_LEVEL = 3;
const DEFAULT_MAX_ZOOM_LEVEL = 21;

const DEFAULT_ZOOM_LEVEL = 14;
const DEFAULT_LATITUDE = -32.0285;
const DEFAULT_LONGITUDE = -60.3034;
const DEFAULT_BASE_LAYER = 'child-mapasbase0';

class URLInteraction {

    constructor() {
        this._zoom = DEFAULT_ZOOM_LEVEL;
        this._latitude = DEFAULT_LATITUDE;
        this._longitude = DEFAULT_LONGITUDE;
        this._layers = [ DEFAULT_BASE_LAYER ];
        this._areParamsInUrl = false;

        const params = window.location.search;

        if (params) {
            this._areParamsInUrl = true;
            const paramsArray = params.slice(1).split('&');
            paramsArray.forEach(element => {
                const [param, value] = element.split('=');
                switch (param.toLowerCase()) {
                    case ZOOM_LEVEL: {
                        if (+value < DEFAULT_MIN_ZOOM_LEVEL) {
                            this._zoom = DEFAULT_MIN_ZOOM_LEVEL;
                        } else if (+value > DEFAULT_MAX_ZOOM_LEVEL) {
                            this._zoom = DEFAULT_MAX_ZOOM_LEVEL;
                        } else {
                            if (!isNaN(+value))
                                this._zoom = +value;
                        }
                    }
                    break;
                    case LATITUDE: {
                        if (!isNaN(+value))
                            this._latitude = +value;
                    }
                    break;
                    case LONGITUDE: {
                        if (!isNaN(+value))
                            this._longitude = +value;
                    }
                    break;/* 
                    case LAYER: {
                        const idx = this._layers.findIndex(layer => layer === value);
                        if (idx === -1)
                            this._layers.push(value);
                    }
                    break; */
                }
            });
        }
        //this.updateURL();
    }

    get url() {
        return window.location.href.toString();
    }

    get center() {
        return {
            latitude: this._latitude,
            longitude: this._longitude
        };
    }

    get zoom() {
        return this._zoom;
    }

    get areParamsInUrl() {
        return this._areParamsInUrl;
    }

    get layers() {
        return this._layers;
    }

    set center(coords) {
        this._latitude = coords.lat;
        this._longitude = coords.lng;
        this.updateURL();
    }

    set zoom(zoom) {
        this._zoom = zoom;
        this.updateURL();
    }

    set layers(layers) {
        this._layers = layers;
        this.updateURL();
    }

    updateURL() {
        // eval here lat lon for round decimals based on zoom level
        const zoom = `${ZOOM_LEVEL}=${this._zoom}`;
        const lat = `${LATITUDE}=${Math.round((this._latitude) * 10000) / 10000}`; 
        const lng = `${LONGITUDE}=${Math.round((this._longitude) * 10000) / 10000}`;
        /* const layers = this._layers.reduce((prevVal, currentVal) => prevVal !== '' ? prevVal + '&' + `layer=${currentVal}` : `layer=${currentVal}`, '');
        window.history.replaceState(null, null, `?${zoom}&${lat}&${lng}&${layers}`); */
        window.history.replaceState(null, null, `?${zoom}&${lat}&${lng}`);
    }
}
