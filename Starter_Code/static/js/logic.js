d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(d => {
    console.log(d)
    
    //Assigning d.features to data
    data = d.features

    console.log(data)

    //Create inital map
    var map = L.map('map').setView([37.8, -96], 4);

    //Create inital layout for map
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    //Defining base properties for circle markers
    var geojsonMarkerOptions = {
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    // Create circle markers based off features coordinates and properties
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

//Function to change circle colours depening on depth.
function getColor(d) {
    var colorScale = d3.scaleLinear()
        .domain([0,10])
        .range(['orange','purple'])
    
        return colorScale(d)
}





