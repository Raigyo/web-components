// Custom element
class RgMapOs extends HTMLElement {
  // CONSTRUCTOR
  constructor() {
    super();
    // Shadow DOM elements
    this._root = this.attachShadow({ mode: "open" });

    // DOM elements
    this._mapTitle = null;
    this._mapTitleText = "";
    this._urlMaps = null;

    // watched datas (default values)
    // this._zoom = 12; // used with attribute zoom
    // this._title = "Town"; // used with attribute title
    this._geoData = {
      center: {
        lat: 50.6412, // used with attribute lat
        lng: 5.5718, // used with attribute lng
      },
      title: "Town",
      zoom: 1,
    };
    this._mapDiv = null;
    this._map = null;
    this._marker = null;
    // object containing all markers
    this._markersPosition = {
      location: [],
    };
    this._mapListensForClick = false;
    // Marker icon
    this._markerIcon = L.icon({
      iconUrl: "./src/images/marker-icon.png",
      shadowUrl: "./src/images/marker-shadow.png",
      iconSize: [38, 65], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    this._markerIconNotDrag = L.icon({
      iconUrl: "./src/images/marker-icon-not-drag.png",
      shadowUrl: "./src/images/marker-shadow.png",
      iconSize: [38, 65], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
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
      <h3 id="title"></h3>
      <div id="map"></div>
    `;
    this._mapTitle = this._root.querySelector("#title");
    this._mapDiv = this._root.querySelector("#map");
    // url of maps
    this._urlMaps = this.getAttribute("url");
    // we replace the title of the map by the one provided as attribute || default
    this._geoData.title = this.getAttribute("title") || this._geoData.title;
    this._mapTitle.innerHTML = this._geoData.title;
    this._mapTitleText = this._geoData.title;
    // we replace the zoom value by the one provided as attribute || default
    this._geoData.zoom = this.getAttribute("zoom") || this._geoData.zoom;
    // we replace coordinates values by the ones provided as attributes || default
    this._geoData.center.lat =
      this.getAttribute("lat") || this._geoData.center.lat;
    this._geoData.center.lng =
      this.getAttribute("lng") || this._geoData.center.lng;
    // we add the first location marker in JSON object
    this._markersPosition["location"].push({
      position: {
        lat: this._geoData.center.lat,
        lng: this._geoData.center.lng,
      },
      content: "Popup demo",
      draggable: true,
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
      console.log(this._geoData.center.lat);
      this._map = L.map(this._mapDiv).setView(
        [
          parseFloat(this._geoData.center.lat),
          parseFloat(this._geoData.center.lng),
        ],
        parseInt(this._geoData.zoom)
      );
      L.tileLayer(this._urlMaps, {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this._map); // we add the layer with tiles to the map
      this._markersLayer.addTo(this._map); // we add a layer to add markers
    }
    this._addMarker();
  } // \ render

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("name: ", name, "oldValue: ", oldValue, "newValue: ", newValue);
    if (this._mapDiv === null) return;
    if (name === "zoom") {
      this._setZoom(newValue);
    }
    if (name === "title") {
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
    this._mapTitle.innerText = this._geoData.title;
    this._mapTitleText = this._geoData.title;
  }

  _addMarker(value) {
    // we remove all markers of the layers otherwise they will be duplicated
    this._markersLayer.clearLayers();
    this._markersPosition.location.map((item) => {
      this._marker = L.marker(
        [parseFloat(item.position.lat), parseFloat(item.position.lng)],
        {
          draggable: item.draggable,
          // we change marker color according draggable state
          icon: item.draggable ? this._markerIcon : this._markerIconNotDrag,
        }
      );
      this._marker.bindPopup(item.content);
      this._markersLayer.addLayer(this._marker); // we add the markers to the layer
      // if the marker is draggable we retrieve its new position
      if (item.draggable) {
        this._marker.on("dragend", (event) => {
          this._markerLat = event.target._latlng.lat;
          item.position.lat = this._markerLat;
          this._markerLng = event.target._latlng.lng;
          item.position.lng = this._markerLng;
          console.log("lat: ", this._markerLat, "lng: ", this._markerLng);
          this._marker._popup.setContent(
            `lat: ${this._markerLat} - lng: ${this._markerLng}`
          );
        });
      }
    });
  }

  _addMarkerOnMapClick() {
    this._map.on("click", (event) => {
      // console.log("map click event", event);
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      this._markersPosition["location"] = [
        ...this._markersPosition["location"],
        {
          position: { lat, lng },
          content: `lat: ${lat} - lng: ${lng}`,
          draggable: true,
        },
      ];
      this._addMarker(event);
    });
  }

  // \ METHODS

  // GETTERS / SETTERS
  /* used with attributeChangedCallback() when changing attributes in DevTool elements */
  static get observedAttributes() {
    return ["zoom", "title", "lat", "lng"];
  }

  _setZoom(value) {
    if (value === null) return;
    this._geoData.zoom = parseInt(value);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }

  _setTitle(value) {
    if (value === null) return;
    this._geoData.title = value;
    if (this._mapTitle) {
      this._mapTitle.innerHTML = value;
    }
  }

  _setLat(value) {
    if (value === null) return;
    this._geoData.center.lat = parseFloat(value);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we render it again
  }

  _setLng(value) {
    if (value === null) return;
    this._geoData.center.lng = parseFloat(value);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we rerender it again
  }
  // \ GETTERS / SETTERS (DevTool elements)

  // GETTERS / SETTERS (that will allow to programmatically get and set some datas)
  /* that will allow to programmatically get and set some datas
  when changing attributes in DevTool console */

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
    if (this._mapTitleText === value) return;
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
    this._renderTitle();
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

    this._markersPosition["location"] = [
      ...this._markersPosition["location"],
      value,
    ];
    this._addMarker(value);
  }

  // last added marker
  get mostRecentMarker() {
    const arrayLength = this._markersPosition["location"].length;
    // console.log(arrayLength);
    if (arrayLength > 0) {
      return this._markersPosition["location"][arrayLength - 1];
    } else {
      return {};
    }
  }

  // map clickable (to add markers)
  get mapListensForClick() {
    return this._mapListensForClick;
  }

  set mapListensForClick(value) {
    this._mapListensForClick = value;
    if (this._mapListensForClick) {
      this._addMarkerOnMapClick();
    }
  }

  // \ GETTERS / SETTERS (DevTool console)
}
// \ CLASS

// New tag creation define ('tag', ClassInstance)
window.customElements.define("rg-map-os", RgMapOs);
