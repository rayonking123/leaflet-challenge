
const earthquakeAPI = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// using D3 and process it
d3.json(earthquakeAPI).then(function (response) {
    processEarthquakeData(response.features);
});

//map object
const map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
});

//layer to the map
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// marker size based on magnitude
function getMarkerSize(magnitude) {
    return Math.sqrt(magnitude) * 30000;
}

//marker color based on depth
function getMarkerColor(depth) {
    return depth <= 10 ? "#66FF66" :
           depth <= 30 ? "#FFFF00" :
           depth <= 50 ? "#FFDAB9" :
           depth <= 70 ? "#FFA500" :
           depth <= 90 ? "#FF6347" :
                         "#FF0000";
}

// earthquake features to the map
function processEarthquakeData(earthquakes) {
    earthquakes.forEach(function (quake) {
        const coords = quake.geometry.coordinates;
        const mag = quake.properties.mag;
        const place = quake.properties.place;
        const time = new Date(quake.properties.time);
        const reports = quake.properties.felt;
        const significance = quake.properties.sig;

        const circle = L.circle([coords[1], coords[0]], {
            color: 'blue',
            weight: 1,
            fillColor: getMarkerColor(coords[2]),
            fillOpacity: 0.75,
            radius: getMarkerSize(mag)
        }).addTo(map);

        circle.bindPopup(`<strong>Location:</strong> ${place}<br>
                          <strong>Significance:</strong> ${significance}<br>
                          <strong>Magnitude:</strong> ${mag}<br>
                          <strong>Depth:</strong> ${coords[2]} km<br>
                          <strong>Time:</strong> ${time}<br>
                          <strong>Reports:</strong> ${reports}`);
    });
}

// legend 
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depthLevels = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    div.innerHTML += '<h4 style="text-align: center;">Depth (km)</h4>';

    depthLevels.forEach((level, index) => {
        div.innerHTML +=
            `<i style="background: ${getMarkerColor(level + 1)}"></i> ${level}${(depthLevels[index + 1] ? `&ndash;${depthLevels[index + 1]}` : '+')}<br>`;
    });

    return div;
};

legend.addTo(map);
