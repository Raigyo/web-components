// Custom element
class RgMap extends HTMLElement {
  // CONSTRUCTOR
  constructor() {
    super();
    // Shadow DOM elements
    this._root = this.attachShadow({ mode: "open" });

    // DOM elements
    this._mapTitle = null;
    this._mapTitleText = "";

    // watched datas (default values)
    this._zoom = 1; // used with attribute zoom
    this._title = "Town"; // used with attribute map-title
    this._geoData = {
      center: {
        lat: 50.6412, // used with attribute lat
        lng: 5.5718, // used with attribute lng
      },
    };
    this._mapDiv = null;
    this._map = null;
    this._marker = null;
    // object containing all markers
    this._markersPosition = {
      location: [],
    };

    this._coord = [];
    //this._markersPositionTotal = [{}];
  } // \ CONSTRUCTOR

  // CALLBACKS
  connectedCallback() {
    console.log("rg-map added to DOM");

    this._root.innerHTML = `
      <style>
      #map {
        width: 600px;
        height: 400px;
      }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
      <h3 id="map-title"></h3>
      <div id="map"></div>
    `;
    this._mapDiv = this._root.querySelector("#map");
    this._mapTitle = this._root.querySelector("#map-title");
    // we replace the title of the map by the one provided as attribute || default
    this._mapTitle.innerHTML = this.getAttribute("map-title") || this._title;
    // we replace the zoom value by the one provided as attribute || default
    this._zoom = this.getAttribute("zoom") || this._zoom;
    // we replace coordinates values by the ones provided as attributes || default
    this._geoData.center.lat =
      this.getAttribute("lat") || this._geoData.center.lat;
    this._geoData.center.lng =
      this.getAttribute("lng") || this._geoData.center.lng;
    // we add the first location marker in JSON object
    this._markersPosition["location"].push({
      lat: this._geoData.center.lat,
      lng: this._geoData.center.lng,
    });
    // we create layer for markers
    this._markersLayer = new L.LayerGroup();
    // we attach shadow dom to the map div
    this._root.appendChild(this._mapDiv);
    this._render();
  } // \ connectedCallback()
  _render() {
    if (!L.map) {
      console.log("Maps are not ready");
      return;
    } else {
      // we create a map with coordinates and zoom value
      this._map = L.map(this._mapDiv).setView(
        [
          parseFloat(this._geoData.center.lat),
          parseFloat(this._geoData.center.lng),
        ],
        parseInt(this._zoom)
      );
      // URL below is for 'mapbox'. It works for all countries but it's a private service.
      // It can be replaced by open products:
      // Belgium: https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png
      // France: https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png
      // In this case no "accessToken" is required
      // WARNING: lat and lng have to be in the scope of countries maps otherwise
      // server will send 404 error
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        }
      ).addTo(this._map); // we add the layer with tiles to the map
      this._markersLayer.addTo(this._map); // we add a layer to add markers
    }
    this._addMarker();
  } // \ render

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("name: ", name, "oldValue: ", oldValue, "newValue: ", newValue);
    if (this._mapDiv === null) return;
    if (name === "zoom") {
      // console.log("Call set zoom");
      this._setZoom(newValue);
    }
    if (name === "map-title") {
      this._setTitle(newValue);
    }
    if (name === "lat") {
      this._setLat(newValue);
    }
    if (name === "lng") {
      this._setLng(newValue);
    }
  } // \ attributeChangedCallback()

  // \ CALLBACKS

  // METHODS

  _renderTitle() {
    this._mapTitle.innerHTML = this._mapTitleText;
  }

  _addMarker() {
    // we remove all markers of the layers otherwise they will be duplicated
    this._markersLayer.clearLayers();
    /* we map the array with all location markers coordinate and add them to the map */
    this._markersPosition.location.map((item) => {
      this._marker = L.circle([item.lat, item.lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 1000,
      });
      this._markersLayer.addLayer(this._marker); // we add the markers to the layer
    });
  }
  // \ METHODS

  // GETTERS / SETTERS (used with attributeChangedCallback())
  static get observedAttributes() {
    return ["zoom", "map-title", "lat", "lng"];
  }

  _setZoom(value) {
    if (value === null) return;
    this._zoom = parseInt(value);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }

  _setTitle(value) {
    if (value === null) return;
    this._title = value;
    if (this._mapTitle) {
      this._mapTitle.innerHTML = value;
    }
  }

  _setLat(value) {
    if (value === null) return;
    this._geoData.center.lat = parseFloat(value);
    // console.log("new var this._zoom: ", this._zoom);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }

  _setLng(value) {
    if (value === null) return;
    this._geoData.center.lng = parseFloat(value);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we rerender it again
  }
  // \ GETTERS / SETTERS (used with attributeChangedCallback())

  // GETTERS / SETTERS (that will allow to programmatically get and set some datas)

  // zoom level
  get zoom() {
    return this._zoom;
  }
  set zoom(value) {
    if (this._zoom === value) return;
    this._zoom = value;
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }

  // map title
  get mapTitleText() {
    return this._mapTitleText;
  }
  set mapTitleText(value) {
    if (this._mapTitle === value) return;
    this._mapTitleText = value;
    this._renderTitle();
  }

  // set coords
  get geoData() {
    return this._geoData;
  }
  set geoData(value) {
    if (this._geoData === value) return;
    this._geoData = value;
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }
  // set markers
  get markersPositions() {
    return this._markersPositions;
  }
  set markersPositions(value) {
    // we push the markers values from DevTool console into an array in a JSON with 'location' as key
    // we need this array to render all the markers on the layer
    // if we add a marker without maping an array including all the markers,
    // previous marker is replaced by new one
    this._markersPosition["location"].push({ lat: value[0], lng: value[1] });
    this._addMarker();
  }

  // \ GETTERS / SETTERS(that will allow to programmatically get and set some datas)
}
// \ CLASS

// New tag creation define ('tag', ClassInstance)
window.customElements.define("rg-map-mapbox", RgMap);
