
map_img = "assets/speculative_map_cut.jpg"

location_to_deaths = {}
place_to_coordinate = {}
p = Promise.all([
    d3.csv("data/character-deaths.csv"),
    d3.csv("data/locations-coordinates.csv"),
])
.then(function(files) {
    const data = files[0];
    const coordinates = files[1];
    place_to_coordinate = Object.fromEntries(coordinates.map(x => [x.Location, x]));

    data.forEach(person => {
        let location = person.Death_Location;
        if (location in location_to_deaths)
        {
            location_to_deaths[location].push(person);
        }
        else 
        {
            location_to_deaths[location] = [person];
        }
    });

    emblems = create_emblems(map_svg);
})
.catch(function(err) {
    alert(err);
});

function create_mapview()
{
    const map_svg = d3.select("#main_svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 1000 1000")
    const g = map_svg.append("g")

    const map_image = g.append("svg:image")
        .attr("xlink:href", d => map_img)
        .style('width', "1000")
        .style("height", "1000")

    // Zoom
    function handleZoom(e) {
        g.attr("transform", e.transform);
        g.attr("scale", e.scale);
    }

    let zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0,0], [1000, 1000]])
        .on("zoom", handleZoom)
    map_svg.call(zoom);

    return map_svg
}

function create_emblems(map)
{
    const emblem_g = map.select("g").append("g").attr("class", "emblems");

    console.log(location_to_deaths)
    // FIXME: Make a parent element to all emblems
    const emblems = emblem_g.selectAll('.emblem')
        .data(Object.values(location_to_deaths))
        .enter()
        .append('svg:image')
        .attr('class', 'emblem')
        .attr("xlink:href", (d) => {
            // FIXME: We want to display all allegiances here...
            var allegiance = d[0].Allegiances;
            //var allegiance = d.Allegiances
            return "assets/emblems/" + allegiance +".PNG"
        })
        .style('width', "1%")
        .style("height", "auto")
        .attr('x', (d) => {
            let coord = place_to_coordinate[d[0].Death_Location];
            return (coord.x_pixels / 4641.0) * 1000;
        })
        .attr('y', (d) => {
            let coord = place_to_coordinate[d[0].Death_Location];
            return (coord.y_pixels / 4032.0) * 1000;
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    return emblems

    function mouseover(d)
    {
        // What odes this do?
        d3.select(this.parentNode).raise();
        tooltip.style("visibility", "visible");
    }

    function mousemove(e, d)
    {
        tooltip
            .style('top', e.pageY - 20 + 'px')
            .style('left', e.pageX + 20 + 'px')
            .html("Name: " + d.Name + "<br> Year of death: " + d.Death_Year + " AC <br> Death location: " + d.Death_Location)
    }

    function mouseleave(d)
    {
        tooltip.style("visibility", "hidden");
    }
}

// This function takes care of filtering the elements that are visible
function update_timeperiod(emblems)
{

}

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

const map_svg = create_mapview();

//const emblems = create_emblems(map_svg);


