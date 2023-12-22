d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(d => {
    console.log(d)

    data = d.features

    console.log(data)

    var map = L.map('map').setView([37.8, -96], 4);

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geojsonMarkerOptions = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {

            //Change the radius size depening on magnitude 
            var radius = feature.properties.mag
            scaleRadius = radius * 5
            geojsonMarkerOptions.radius = scaleRadius
            
            //Change the color based on depth 
            geojsonMarkerOptions.fillColor = getColor(feature.geometry.coordinates[2])

            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);

});

function getColor(d) {
    var colorScale = d3.scaleLinear()
        .domain([0,10])
        .range(['orange','purple'])
    
        return colorScale(d)
}





