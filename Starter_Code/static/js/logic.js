d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(d => {
    console.log(d)
    
    //Assigning d.features to data
    data = d.features

    console.log(data)

    //Create inital map
    var map = L.map('map').setView([37.8, -96], 1);

    //Create inital layout for map
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //Defining base properties for circle markers
    var geojsonMarkerOptions = {
        weight: 1,
        opacity: 1,
        fillOpacity: 1
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

            //Create the circle markers + their popup information
            marker = L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(
            `<p>
            Mag: ${feature.properties.mag} ${feature.properties.magType}</br>
            Depth:${feature.geometry.coordinates[2]}</br>
            Type: ${feature.properties.type}</br>
            Place: ${feature.properties.place}</br>
            Time: ${new Date(feature.properties.time)}</br>
            Link: ${feature.properties.detail}</br></p></div>`, {maxWidth:500})

            return marker
        }
        
    }).addTo(map)

    //Set Legend position
    var legend = L.control({position: 'bottomleft'});

    //Create legend visual
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,10,20,30,40,50,60,70,80,90,100],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<ul style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };

legend.addTo(map);

});

    //Function to change circle colours depening on depth.
    function getColor(d) {
        //Checks if depth is more than 100, and sets color of the circle marker to max of color range. 
        if (d>100) {
            d = 100
        }
        //Return color between Orange and Purple depending on depth. 
        var colorScale = d3.scaleLinear()
            .domain([0,100])
            .range(['Orange','purple'])
        
            return colorScale(d)
};