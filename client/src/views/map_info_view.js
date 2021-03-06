const PubSub = require('../helpers/pub_sub.js');
const leaflet = require('leaflet');

const MapInfoView = function (container) {
  this.container = container;
}

MapInfoView.prototype.bindEvents = function () {
  this.render();
  PubSub.subscribe('Info:mapInfoData', (evt) => {
    this.plotPoints(evt.detail);
});
}

MapInfoView.prototype.render = function (data) {

  this.container.innerHTML = '';
  this.createContainer();
  this.createMap();
};

MapInfoView.prototype.createContainer = function () {
  this.mapContainer = document.createElement('div');
  this.mapContainer.id = 'mapContainer';
  this.container.appendChild(this.mapContainer);
};

MapInfoView.prototype.createMap = function () {
  const CARTOUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const CARTOTileLayer = new leaflet.TileLayer(CARTOUrl, {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://carto.com/attributions">CARTO</a>'
  });

  if (this.leafletMap) {
    this.leafletMap.remove();
  }
  this.leafletMap = leaflet.map(this.mapContainer)
    .addLayer(CARTOTileLayer)
    .setView([37.9838, 23.7275], 4);
};

MapInfoView.prototype.plotPoints = function (data) {
  data.forEach((wonder) => {
    const longitude = wonder.longitude;
    const latitude = wonder.latitude;
    var marker = leaflet.marker([longitude, latitude]).addTo(this.leafletMap);
    marker.on('click', (e) => {
      // if (this.leafletMap) {
      //   this.leafletMap.remove();
      // }
      PubSub.publish('MapInfoView:monumentSelected', wonder.name);
    })
  })
};



module.exports = MapInfoView;
