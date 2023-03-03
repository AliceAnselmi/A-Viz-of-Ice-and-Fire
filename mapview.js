
var map_img = "assets/speculative_map_cut.jpg"

var selected_emblem = null;

var location_to_deaths = {}
var place_to_coordinate = {}
var p = Promise.all([
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
        //.attr("viewBox", "0 0 1000 1000")
        .attr("preserveAspectRatio", "xMinYMin slice")

    const g = map_svg.append("g")

    const map_image = g.append("svg:image")
        .attr("href", d => map_img)
        //.attr('width', "100%")
        //.attr("height", "100%")
        .attr('x', "0")
        .attr('y', "0")
        //.attr("preserveAspectRatio", "xMinYMin slice")

    map_width = parseInt(map_image.style("width"));
    map_height = parseInt(map_image.style("height"));

    g.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", map_width/2 - 5)
        .attr("y", map_height/2 - 5)
        .attr("fill", "#ff00ff");

    // Zoom
    function handleZoom(e) {
        g.attr("transform", e.transform);
        g.attr("scale", e.scale);
    }

    // FIXME: Change these values when the viewport is resized!
    viewport_width = parseInt(map_svg.style("width"))
    viewport_height = parseInt(map_svg.style("height"))

    min_scale_x = viewport_width / map_width;
    min_scale_y = viewport_height / map_height;
    min_scale = Math.max(min_scale_x, min_scale_y);

    let zoom = d3.zoom()
        .touchable(true)
        .scaleExtent([min_scale, 8])
        .translateExtent([[0,0], [map_width, map_height]])
        .on("zoom", handleZoom)
    map_svg.call(zoom);

    zoom.scaleBy(map_svg, min_scale);

    d3.select(window).on("resize", function() {
        viewport_width = parseInt(map_svg.style("width"))
        viewport_height = parseInt(map_svg.style("height"))
    
        min_scale_x = viewport_width / map_width;
        min_scale_y = viewport_height / map_height;
        min_scale = Math.max(min_scale_x, min_scale_y);

        console.log("resize")
        console.log(viewport_width)
        console.log(min_scale)

        zoom.scaleExtent([min_scale, 8])

        map_svg.node().dispatchEvent(new WheelEvent(1));

    });

    console.log(zoom)

    return map_svg
}

function create_emblems(map)
{
    const emblem_g = map.select("g").append("g").attr("class", "emblems");

    map_image = map.select("image")
    map_width = parseInt(map_image.style("width"));
    map_height = parseInt(map_image.style("height"));

    console.log(location_to_deaths)
    // FIXME: Make a parent element to all emblems
    const emblems = emblem_g.selectAll('.emblem')
        .data(Object.values(location_to_deaths))
        .join('g')
        .attr('transform', (d) => {
            let coord = place_to_coordinate[d[0].Death_Location];
            return `translate(${coord.x_pixels},${coord.y_pixels})`
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", click)
    emblems
        .append('svg:image')
        .attr('class', 'emblem')
        .attr("xlink:href", (d) => {
            // FIXME: We want to display all allegiances here...
            var allegiance = d[0].Allegiances;
            //var allegiance = d.Allegiances
            return "assets/emblems/" + allegiance +".PNG"
        })
        .style('width', "2%")
        .style("height", "auto")

    map_image.on("click", function (e, d) { deselect_emblem(selected_emblem); selected_emblem = null; console.log("deselected") });
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
            .html("Name: " + d.Name + "<br> Year of death: " + d.Death_Year + " AC <br> Death location: " + d[0].Death_Location)
    }

    function mouseleave(d)
    {
        tooltip.style("visibility", "hidden");
    }

    function click(e, d)
    {
        emblem = d3.select(this)
        deselect_emblem(selected_emblem, d)
        selected_emblem = emblem;
        select_emblem(emblem, d)
    }
}

function select_emblem(emblem, data)
{
    center = ({id: 0, data: data, x: 0, y: 0, fx: 0, fy: 0})
    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    nodes = [center]
    map = d3.map(data, (d, i) => ({id: i, data: d, x: 0, y: 0})).map(intern);
    nodes = nodes.concat(map)
    //nodes = map
    links = d3.map(map, (d, i) => ({source: center, target: d}));

    //console.log(nodes)
    //console.log(links)
    const forceNode = d3.forceManyBody()
        //.distanceMax(10)
        .distanceMin(40)
    const forceLink = d3.forceLink(links)
        .id(({index: i}) => i)
        .distance((d) => Math.random() * 70 + 35)

    link = emblem.append("g")
        .attr("class", "lines")
        .attr("stroke", "black")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1)
        //.attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");

    node = emblem.selectAll(".popup")
        .data(map)
        .join("svg:image")
        .attr("class", "popup")
        .attr("xlink:href", (d) => {
            // FIXME: We want to display all allegiances here...
            var allegiance = d.data.Allegiances;
            //var allegiance = d.Allegiances
            return "assets/emblems/" + allegiance +".PNG"
        })
        .attr('width', "3%")
        .attr("height", "3%")
        .attr('x', 0)
        .attr('y', 0);
    
    d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", tick)

    function tick()
    {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("x", function (d) { return d.x - (this.width.animVal.value / 2); })
            .attr("y", function (d) { return d.y - (this.height.animVal.value / 2); });
    }
}

function deselect_emblem(emblem)
{
    if (emblem == null) return;
    emblem.select(".emblem").attr("visibility", "visible")

    emblem.selectAll(".popup").remove();
    // FIXME: remove the <g> tags
    emblem.selectAll(".lines").remove();
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

