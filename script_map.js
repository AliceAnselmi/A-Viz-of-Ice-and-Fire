map_img = "assets/Map.png"
slider_bg_img = "assets/slider_bg.png"
range_button_high_img = "assets/PointerUpper.png"
range_button_low_img = "assets/PointerLower.png"
slider_books_bar_img = "assets/slider_bar_6.png"
slider_years_bar_img = "assets/slider_bar_4.png"
slider_info_bg_img = "assets/slider_info_bg.png"
back_button_upper_img = "assets/left_upper.png"
forward_button_upper_img = "assets/right_upper.png"
back_button_lower_img = "assets/left_lower.png"
forward_button_lower_img = "assets/right_lower.png"

// audio stuff
const ctx = new AudioContext();
let audio;

const svg = create_mapview();
var width = window.innerWidth;
var height = window.innerHeight;
var g;

const bottombar_width = 1200;
const bottombar_height = 120;
const sidebar_width = 200;
const sidebar_height = height - bottombar_height;
const sidebar_limit = 500;
var Ytranslation_rescale = 0;

var slider_length = bottombar_width * 0.4
const emblem_size = 3 //Determines the size of the emblems

const bg_color = "#bfae94"
const bg_stroke_color = "#050505"
const btn_color = "#f3e2ce"
const btn_stroke_color = "#000000"
const highlight_color = "#f6fffe"
/*"#493521" OLD HIGHLIGHT COLOR*/

var ui_side_svg = d3.select("#sidebar_svg")
    .attr('width', sidebar_width + 100)
    .attr('height', sidebar_height)
    .attr('transform', "translate(" + (-sidebar_width * 0.75) + " ,0)")
    .attr("visibility", "hidden")


var ui_bottom_svg = d3.select('#bottombar_svg')
    .attr('width', bottombar_width)
    .attr('height', bottombar_height)
    .attr("transform", "translate(" + ((width - bottombar_width) / 2) + "," + (-Ytranslation_rescale) + ")");


window.onresize = function () {
    var height_diff = height - window.innerHeight;
    Ytranslation_rescale = Ytranslation_rescale + height_diff

    width = window.innerWidth
    height = window.innerHeight;
    if (window.innerHeight > sidebar_limit) {
        ui_side_svg.attr('height', height - bottombar_height)
    }

    if (window.innerWidth < sidebar_limit || window.innerWidth < bottombar_width) {
        window.resizeTo(bottombar_width + "px", sidebar_limit + "px");
        console.log("Resize" + " to " + bottombar_width + " x " + sidebar_limit)
    }
    ;
    ui_bottom_svg.attr("transform", "translate(" + ((width - bottombar_width) / 2) + ",0)");

    console.log(Ytranslation_rescale)
};


function create_mapview() {
    const map_svg = d3.select("#main_svg")
        //.attr("viewBox", "0 0 1000 1000")
        .attr("preserveAspectRatio", "xMinYMin slice")

    g = map_svg.append("g")
    const map_image = g.append("svg:image")
        .attr("href", d => map_img)
        //.attr('width', "100%")
        //.attr("height", "100%")
        .attr('x', "0")
        .attr('y', "0")


    //the event occurred
    map_width = parseInt(map_image.style("width"));
    map_height = parseInt(map_image.style("height"));
    console.log(map_width)

    // Zoom
    function handleZoom(e) {
        g.attr("transform", e.transform);
        g.attr("scale", e.scale);
    }

    viewport_width = parseInt(map_svg.style("width"))
    viewport_height = parseInt(map_svg.style("height"))

    if (map_width == 0)
        map_width = 4641
    if (map_height == 0)
        map_height = 4032
    min_scale_x = viewport_width / map_width;
    min_scale_y = viewport_height / map_height;
    min_scale = Math.max(min_scale_x, min_scale_y);

    let zoom = d3.zoom()
        .touchable(true)
        .scaleExtent([min_scale * 0.8, 6])
        .translateExtent([[0, 0], [map_width, map_height]])
        .on("zoom", handleZoom)

    map_svg.call(zoom).on("dblclick.zoom", null);


    zoom.scaleBy(map_svg, min_scale);

    map_svg.call(zoom).on("dblclick.zoom", null);

    return map_svg
}


// ---------------------------//
//       Tooltips              //
// ---------------------------//
const tooltip = d3.select("body").append("g")
    .attr("class", "tooltip")
    .style("top", "0px")
    .style("left", "0px")

const map_tooltip = d3.select("body").append("g")
    .attr("class", "location_tooltip")
    .style("top", "0px")
    .style("left", "0px")
    
const allegiance_tooltip = d3.select(".ui").append("g")
    .attr("class", "allegiance_tooltip")
    .style("top", "0px")
    .style("left", "0px")

// ---------------------------//
//          Slider           //
// --------------------------//
const g_slider = ui_bottom_svg.append("g")
var sliderVals = [0, 344];
const MapMode = {
    Year: "Years",
    Book: "Books",
}
var mapMode = MapMode.Book
const slider_imgs = {}
slider_imgs[MapMode.Book] = slider_books_bar_img;
slider_imgs[MapMode.Year] = slider_years_bar_img;

const min_chapter = 0;
const max_chapter = 344;

const min_year = 297;
const max_year = 300;

function person_filter(person)
{
    let value;
    if (mapMode == MapMode.Book)
        value = person.Timeline_Chapter_Death;
    else
        value = person.Death_Year;

    let min = sliderVals[0]
    let max = sliderVals[1]

    if (selected_allegiances.length > 0)
        return selected_allegiances.includes(person.Allegiances) && value >= min && value <= max
    else
        return value >= min && value <= max
}


// ---------------------------//
//      Slider - infos        //
// --------------------------//

function calculate_book_and_chapter(chapter_tot) {
    var book, chapter;
    if (chapter_tot >= 0 && chapter_tot <= 72) {
        book = 1;
        chapter = chapter_tot;
    } else if (chapter_tot >= 73 && chapter_tot <= 142) {
        book = 2;
        chapter = chapter_tot - 73;
    } else if (chapter_tot >= 143 && chapter_tot <= 224) {
        book = 3;
        chapter = chapter_tot - 143;
    } else if (chapter_tot >= 225 && chapter_tot <= 271) {
        book = 4;
        chapter = chapter_tot - 225;
    } else if (chapter_tot >= 272 && chapter_tot <= 344) {
        book = 5;
        chapter = chapter_tot - 272;
    }
    return [book, chapter];

}

function update_slider_infos(v1, v2) {
    slider_infos_text.text(
        () => {
            if (mapMode == MapMode.Book)
                return "Book " + calculate_book_and_chapter(v1)[0] + " Ch " + calculate_book_and_chapter(v1)[1] + " - Book " + calculate_book_and_chapter(v2)[0] + " Ch " + calculate_book_and_chapter(v2)[1];
            else
                return "Years " + v1 + " - " + v2;
        }
    )
}


slider_background = g_slider.append("rect")
    .attr("height", bottombar_height)
    .attr("width", bottombar_width)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("fill", bg_color)
    .attr('opacity', 0)

var slider_infos = g_slider.append('g')


slider_infos.append("rect")
    .attr("height", bottombar_height / 2)
    .attr("width", slider_length)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("x", (bottombar_width / 3) - 25)
    .attr("y", 5)
    .attr("fill", bg_color)
    .attr('stroke', bg_stroke_color)
slider_background.raise();

var slider_infos_text = slider_infos.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "25px")
    .attr("x", bottombar_width / 2 + 10)
    .attr('y', 35)
update_slider_infos(sliderVals[0], sliderVals[1]);


// ---------------------------//
//      Slider - buttons      //
// --------------------------//
var clickedhandle;

var slider_button_upper = g_slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image")
    .attr("xlink:href", d => d == 0 ? back_button_upper_img : forward_button_upper_img)
    .style("width", "3%")
    .style("height", "auto")
    .attr("x", d => bottombar_width * 0.75 + d * 40 - 36)
    .attr('y', bottombar_height / 2.2)
    .attr('object-position', 'center')
    .attr("cursor", "pointer")
    .on("click", (e, d) => {
        clickedhandle = 1;
        move_handle_one_tick(e, d)
    })

var slider_button_lower = g_slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image")
    .attr("xlink:href", d => d == 0 ? back_button_lower_img : forward_button_lower_img)
    .style("width", "3%")
    .style("height", "auto")
    .attr("x", d => bottombar_width * 0.25 + d * 40 - 18)
    //.attr('y', g_slider.attr('height')/3)
    .attr('y', bottombar_height / 2.2)
    .attr('object-position', 'center')
    .attr("cursor", "pointer")
    .on("click", (e, d) => {
        clickedhandle = 0;
        move_handle_one_tick(e, d)
    })

var move_handle_one_tick = function (e, d,) {
    if (clickedhandle != null) {
        //positioning of button
        let x_handle = x_slider(sliderVals[clickedhandle == 0 ? 0 : 1]);

        let curr_value = Math.round(x_slider.invert(x_handle));
        let new_value = curr_value + (d == 0 ? -1 : 1);
        if (new_value >= x_slider.domain()[0] && new_value <= x_slider.domain()[1]) {
            x_handle = x_slider(new_value)
            let x_other_handle = x_slider(sliderVals[clickedhandle == 0 ? 1 : 0])
            //handle overlap

            // console.log(x_other_handle)

            let value_other_handle = Math.round(x_slider.invert(x_other_handle));
            if (clickedhandle == 0) { //if lower handle
                if (new_value >= value_other_handle) {
                    new_value = value_other_handle
                }
            } else { //otherwise
                if (new_value <= value_other_handle) {
                    new_value = value_other_handle
                }
            }


            if (x_handle < xMin && x_handle <= x_other_handle)
                x_handle = xMin;
            else if (x_handle > xMax && x_handle >= x_other_handle)
                x_handle = xMax;

            d3.selectAll(".handle" + clickedhandle).attr("x", x_handle - handle_offset)

            selRange
                .attr("x1", x_handle)
                .attr("x2", x_other_handle)

            if (clickedhandle == 0) { //if moving lower handle
                sliderVals[0] = Math.min(new_value, sliderVals[1]);
                sliderVals[1] = Math.max(new_value, sliderVals[1]);
            } else { //otherwise
                sliderVals[0] = Math.min(sliderVals[0], new_value);
                sliderVals[1] = Math.max(sliderVals[0], new_value);
            }

            update_slider_infos(sliderVals[0], sliderVals[1]);
            updateMap(sliderVals[0], sliderVals[1], mapMode);
        }
    }
}

// ----------------------------//
//  Slider - handles+bar     //
// --------------------------//
var handle_offset = 20;

const slider = g_slider.append("g")
    //.attr("transform", "translate(" + width / 3 + "," + (height - 55) + ")")
    .attr("transform", "translate(" + (bottombar_width / 3.2) + "," + bottombar_height / 2.2 + ")")


var slider_image = slider.append("svg:image")
    .attr("xlink:href", d => slider_imgs[mapMode])
    .attr('object-position', 'center')
    .attr('width', slider_length)
    .attr('y', 5)

//.attr("transform", "translate(-20,0)")
//.style("height", "17px")

var x_slider = d3.scaleLinear()
    .domain([min_chapter, max_chapter]) // input, book chapter
    .range([slider_length * 0.04 + handle_offset, slider_length * 0.87 + handle_offset]) // output, positions
    .clamp(true);
var xMin = x_slider(min_chapter),
    xMax = x_slider(max_chapter)

var range_button_imgs = []
range_button_imgs[0] = range_button_low_img;
range_button_imgs[1] = range_button_high_img;

// 1 -> GOT -> #0066cc
// 2 -> COK -> #ffcc00
// 3 -> SOS -> #34933fs
// 4 -> FOC -> #990000
// 5 -> DWD -> #cfcfab


var defs = svg.append("defs");

var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", xMin)
    .attr("x2", xMax)
    .selectAll("stop")
    .data([
        {offset: "0%", color: "#0066cc"},
        {offset: "33%", color: "#ffcc00"},
        {offset: "55%", color: "#34933f"},
        {offset: "73%", color: "#990000"},
        {offset: "100%", color: "#cfcfab"},
    ])
    .enter().append("stop")
    .attr("offset", function (d) {
        return d.offset;
    })
    .attr("stop-color", function (d) {
        return d.color;
    });

var rangeSliderLeftHandleOffset = 0;
var selRange = slider.append("line")
    .data(x_slider.range())
    .attr("class", "sel-range")
    .style("stroke", "url(#linear-gradient)")
    .attr("transform", "translate(0,12)")
    .style("opacity", 0.6)
    .style("cursor", "pointer")
    .style("stroke-width", bottombar_height / 8.4 + "px")
    .attr("x1", x_slider(sliderVals[0]))
    .attr("x2", x_slider(sliderVals[1]))
    .call(d3.drag()
            .on("start", function (event, d) {
                rangeSliderLeftHandleOffset = x_slider(sliderVals[0]) - event.x
            })
            .on("drag", function (event, d) {
                let range = sliderVals[1] - sliderVals[0];
                let x_range = x_slider(sliderVals[1]) - x_slider(sliderVals[0]);
                
                let handle0 = event.x + rangeSliderLeftHandleOffset;
                let handle1 = event.x + rangeSliderLeftHandleOffset + x_range;
                
                if (handle0 < xMin)
                {
                    handle0 = xMin;
                    handle1 = xMin + x_range;
                }
                else if (handle1 > xMax)
                {
                    handle0 = xMax - x_range;
                    handle1 = xMax;
                }

                d3.select(handle.nodes()[0]).attr("x", handle0 - handle_offset);
                d3.select(handle.nodes()[1]).attr("x", handle1 - handle_offset);

                selRange
                    .attr("x1", handle0)
                    .attr("x2", handle1)

                // Now that we have the coordinates, lets convert to

                sliderVals[0] = Math.round(x_slider.invert(handle0));
                sliderVals[1] = Math.round(x_slider.invert(handle1));

                update_slider_infos(sliderVals[0], sliderVals[1]);
                updateMap(sliderVals[0], sliderVals[1], mapMode);
            })
            .on("end", function (event, d) {
                // Snap the values to their final values

                let handle0 = x_slider(sliderVals[0]);
                let handle1 = x_slider(sliderVals[1]);

                d3.select(handle.nodes()[0]).attr("x", handle0 - handle_offset);
                d3.select(handle.nodes()[1]).attr("x", handle1 - handle_offset);

                selRange
                    .attr("x1", x_slider(sliderVals[0]))
                    .attr("x2", x_slider(sliderVals[1]))
            }))


var clickedhandle;
var clickedhandle_node;
var handle = slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image").attr("xlink:href", d => range_button_imgs[d])
    .attr("class", d => "handle" + d)
    .attr("x", d => x_slider(sliderVals[d]) - handle_offset)
    .attr("y", -20)
    .style("width", "2.5%")
    .style("height", "auto")
    .style("cursor", "pointer")
    .call(
        d3.drag()
            .on("start", startDrag)
            .on("drag", onDrag)
            .on("end", endDrag)
    );

function startDrag(event) {
    var x_cursor = event.x;
    d3.select(this).raise().classed("active", true)
        .style("cursor", "grabbing")
}

function onDrag(event, d) {
    //positioning of button
    var x_cursor = event.x;
    var x_other_handle = x_slider(sliderVals[d == 0 ? 1 : 0])
    //snap handles together
    if (d == 0) { //if lower handle
        if (x_cursor >= x_other_handle - 10) {
            x_cursor = x_other_handle
        }
    } else { //otherwise
        if (x_cursor <= x_other_handle + 10) {
            x_cursor = x_other_handle
        }
    }

    // snap to edges
    if (x_cursor < xMin && x_cursor <= x_other_handle + 10)
        x_cursor = xMin;
    else if (x_cursor > xMax && x_cursor >= x_other_handle - 10)
        x_cursor = xMax;

    d3.select(this).attr("x", x_cursor - handle_offset)

    selRange
        .attr("x1", x_cursor)
        .attr("x2", x_other_handle)

    var value = Math.round(x_slider.invert(x_cursor))
    if (d == 0) { //if moving lower handle
        sliderVals[0] = Math.min(value, sliderVals[1]);
        sliderVals[1] = Math.max(value, sliderVals[1]);
    } else { //otherwise
        sliderVals[0] = Math.min(sliderVals[0], value);
        sliderVals[1] = Math.max(sliderVals[0], value);
    }
    update_slider_infos(sliderVals[0], sliderVals[1]);
    updateMap(sliderVals[0], sliderVals[1], mapMode);
}

function endDrag(event, d) {
    var v;
    var x_cursor = event.x;
    var x_other_handle = x_slider(sliderVals[d == 0 ? 1 : 0])

    //handle overlap
    if (d == 0) { //if lower handle
        if (x_cursor >= x_other_handle - 10) {
            v = sliderVals[1] //value of the other handle
        } else {
            v = Math.round(x_slider.invert(x_cursor))
        }
    } else { //otherwise
        if (x_cursor <= x_other_handle + 10) {
            v = sliderVals[0] //value of the other handle
        } else {
            v = Math.round(x_slider.invert(x_cursor))
        }
    }

    sliderVals[d] = v
    //console.log(v + "what is this"); // it is chapters
    //console.log(mapMode)
    sliderVals[0] = Math.min(sliderVals[0], sliderVals[1]);
    sliderVals[1] = Math.max(sliderVals[0], sliderVals[1]);

    d3.select(this)
        .classed("active", false)
        .attr("x", x_slider(v) - handle_offset)
        .style("cursor", "pointer")

    selRange
        .attr("x1", x_slider(sliderVals[0]))
        .attr("x2", x_slider(sliderVals[1]))
    
    update_slider_infos(sliderVals[0], sliderVals[1]);
    updateMap(sliderVals[0], sliderVals[1], mapMode);

}

// ---------------------------//
//      View     selector     //
// --------------------------//

const view_selector = g_slider.append("rect")
    .attr("id", "view_selector_rect")
    .attr('width', bottombar_width / 8)
    .attr('height', bottombar_height / 3)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('stroke', btn_stroke_color)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })

view_selector
    .attr("x", bottombar_width * 0.05)
    .attr("y", 40)

var slider_selector_text = g_slider.append("text")
    .attr("x", bottombar_width * 0.07)
    .attr("y", view_selector.attr("y") * 1.7)
    //.attr("font-size", "25px")
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text(mapMode + " view");

slider_selector_text.on("click", updateView)
    .on("mouseover", function (d) {
        d3.select("#view_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#view_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
view_selector.on("click", updateView);

function updateView() {

    switch (mapMode) {
        case MapMode.Book:
            mapMode = MapMode.Year;
            break;
        case MapMode.Year:
        default:
            mapMode = MapMode.Book;
            break;
    }

    slider_image.attr("xlink:href", d => slider_imgs[mapMode])
    // .attr('object-position', 'center')
    // .attr('width', slider_length)
    // .attr('y', 5)

    if (mapMode == MapMode.Book) {
        sliderVals = [min_chapter, max_chapter];
        x_slider = d3.scaleLinear()
            .domain([min_chapter, max_chapter])
            .range([slider_length * 0.04 + handle_offset, slider_length * 0.87 + handle_offset])
            .clamp(true);
        xMin = x_slider(min_chapter);
        xMax = x_slider(max_chapter);

        selRange.style("stroke", "url(#linear-gradient)")
            .attr("transform", "translate(0,12)")
            .style("stroke-width", bottombar_height / 8.4 + "px")
        handle.style("width", "3%")
    } else {
        sliderVals = [min_year, max_year];
        x_slider = d3.scaleLinear()
            .domain([min_year, max_year])
            .range([slider_length * 0.04 + handle_offset, slider_length * 0.87 + handle_offset])
            .clamp(true);

        xMin = x_slider(min_year);
        xMax = x_slider(max_year);
        slider_image
            //     .attr("height", bottombar_height/4 )
            .attr("width", slider_length)
        selRange.style("stroke", "#94C2ED")
            .attr("transform", "translate(0,17)")
            .style("stroke-width", bottombar_height / 5.1 + "px")
        handle.style("width", "3.5%")
    }

    selRange
        .attr("x1", x_slider(sliderVals[0]))
        .attr("x2", x_slider(sliderVals[1]))

    handle.attr("x", d => x_slider(sliderVals[d]) - handle_offset)
    slider_selector_text.text(mapMode + " view")
    update_slider_infos(sliderVals[0], sliderVals[1]);
    updateMap(sliderVals[0], sliderVals[1], mapMode);
}

// ---------------------------//
//  Coordinates calculation  //
// --------------------------//

var calculate_coordinates = (x_perc, y_perc) => {
    var x_img = x_perc * width;
    var y_img = y_perc * height;
    return [x_img, y_img];
}

var process_coordinates = (d) => {
    var location = d.Death_Location
    var x_perc = coordinates
        .filter((d) => {
            return d.Location == location
        })
        .map((d) => {
            return d.x_percent
        })
    var y_perc = coordinates
        .filter((d) => {
            return d.Location == location
        })
        .map((d) => {
            return d.y_percent
        })
    return calculate_coordinates(x_perc, y_perc)
}


// ---------------------------//
//     Allegiance Filter      //
// --------------------------//

const g_filter = ui_side_svg.append("g")

var filter_menu = g_filter.append('rect')
    .attr('height', sidebar_height-20)
    .attr('width', sidebar_width * 0.75)
    .style("visibility", "visible")
    .attr('y', 20)
    .attr("ry", 10)
    .attr('stroke', bg_stroke_color)
    .attr('stroke-width', 2)
    .attr('opacity', 0.8)
    .attr('fill', bg_color)

var filter_button = g_filter.append("svg:image")
    .attr("xlink:href", "assets/filter_button.png")
    .style('width', sidebar_width / 4)
    .style("height", "auto")
    .style("visibility", "visible")
    .attr('x', sidebar_width * 0.75)
    .attr("y", (sidebar_height - sidebar_width/4))

g_filter.append("text")
    .attr("font-size", "25px")
    .attr("x", 30)
    .style("visibility", "visible")
    .attr("background-color", bg_color)
    .attr("y", 50)
    .html("Filter by")
g_filter.append("text")
    .attr("font-size", "25px")
    .attr("x", 25)
    .attr("y", 80)
    .html("allegiance")
    .style("visibility", "visible")

var filter_menu_open = false;
var display_filter_menu = function (d) {
    if (filter_menu_open == false) {
        filter_menu_open = true;
        ui_side_svg.transition()
            .attr("transform", "translate(0,0)");
    } else {
        filter_menu_open = false;
        ui_side_svg.transition()
            .attr("transform", "translate(" + (-sidebar_width * 0.75) + " ,0)");
    }
}

var allegiances = ["Arryn", "Baratheon", "Greyjoy", "Lannister", "Martell", "Night's Watch", "Stark", "Targaryen", "Tully", "Tyrell", "Wildling", "None"]

var emblemX = sidebar_width / 5.5;
var emblemY = 120;
var filters = g_filter.selectAll('.filters')
    .data(allegiances)
    .enter()
    .append('g')
    .attr('class', 'filters')
    .style("visibility", "visible")

filters.append("pattern")
    .attr("id", (d, i) => {
        return "pattern" + i
    })
    .attr("width", 1)
    .attr("height", 1)
    .append("svg:image")
    .attr("xlink:href", (d) => {
        return "assets/emblems/" + d + ".png"
    })
    .attr("width", sidebar_width / 4)

var selected_allegiances = [];

filters
    .append("circle")
    .attr("class", "filter_circle")
    .attr("stroke-width", "1px")
    .attr("stroke", "black")
    .attr('cx', (d, i) => {
        if (i % 2 == 0)
            return emblemX;
        else
            return emblemX + sidebar_width / 3;
    })
    .attr('cy', (d, i) => {
        return emblemY + sidebar_height / 8 * (parseInt(i / 2))
    })
    .attr("r", sidebar_width /8)
    .style("fill", (d, i) => {
        return "url(#pattern" + i + ")"
    })
    .style("cursor", "pointer")
    .on("mouseover", function (e,d) {
        d3.select(this)
            .attr("stroke-width", "4px")
            .attr("stroke", highlight_color)

        allegiance_tooltip.style("visibility", "visible");

    })
    .on("mousemove", function (e, d) {
         allegiance_tooltip
            .style('top', e.clientY - 30 + 'px')
            .style('left', e.clientX + 30 + 'px')
            .html(d)

    })
    .on("mouseleave", function (e, d) {
        allegiance_tooltip.style("visibility", "hidden");
        if (!selected_allegiances.includes(d)) {
            d3.select(this)
                .attr("stroke-width", "1px")
                .attr("stroke", "black")
        }
    })
    .on("click", function (e, d) {
        if (!selected_allegiances.includes(d))
            selected_allegiances.push(d)
        else {
            var index = selected_allegiances.indexOf(d);
            if (index > -1) {
                selected_allegiances.splice(index, 1);
            }
            d3.select(this)
                .attr("stroke-width", "1px")
                .attr("stroke", "black")
        }
        //console.log(selected_allegiances)
        updateMap(sliderVals[0], sliderVals[1], mapMode)
    })

filter_button
    .attr("cursor", "pointer")
    .on("click", display_filter_menu)

var g_reset = g_filter.append("g")
    .style("visibility", "visible")
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select("#reset_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#reset_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })

g_reset.append("rect")
    .attr("id", "reset_rect")
    .attr('width', 120)
    .attr('height', 30)
    .attr("x", sidebar_width*0.75/2 - 60)
    .attr("y", sidebar_height * 0.93)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('stroke', btn_stroke_color)
    .attr('fill', btn_color)

g_reset.append("text")
    .attr("font-size", "28px")
    .attr("text-anchor", "middle")
    .attr("x", sidebar_width*0.75/2)
    .attr("y", sidebar_height * 0.93 + 25)
    .text("Reset")
    .attr("cursor", "pointer");

g_reset.on("click", () => {
    selected_allegiances = [];
    d3.selectAll(".filter_circle")
        .attr("stroke-width", "1px")
        .attr("stroke", "black")

    d3.selectAll(".popup")
        .attr("opacity", 1)
        .attr("pointer-events", "all");
    d3.selectAll(".line_link")
        .attr("stroke-opacity", 1)
    d3.selectAll(".filters")
        .attr("stroke-width", "1px")
        .attr("stroke", "black")
    updateMap(sliderVals[0], sliderVals[1], mapMode)
});


// ---------------------------//
//           Emblems          //
// --------------------------//


var map_img = "assets/speculative_map_cut.jpg"

var selected_emblem = null;

var forceSimulation = null;

var location_to_deaths = {}
var place_to_coordinate = {}
var p = Promise.all([
    d3.csv("data/character-deaths.csv"),
    d3.csv("data/locations-coordinates.csv"),
])
    .then(function (files) {
        const data = files[0];
        const coordinates = files[1];
        place_to_coordinate = Object.fromEntries(coordinates.map(x => [x.Location, x]));

        data.forEach(person => {
            let location = person.Death_Location;
            if (location in location_to_deaths) {
                location_to_deaths[location].push(person);
            } else {
                location_to_deaths[location] = [person];
            }

        });

        emblems = create_emblems(svg);
    })
    .catch(function (err) {
        alert(err);
    });

function create_emblems(map) {
    const emblem_g = map.select("g").append("g").attr("class", "emblems")
    map_image = map.select("image")
    map_width = parseInt(map_image.style("width"));
    map_height = parseInt(map_image.style("height"));

    const emblems = emblem_g.selectAll('.emblem')
        .data(Object.values(location_to_deaths))
        .join('g')
        .attr('transform', (d) => {

            let coord = place_to_coordinate[d[0].Death_Location];
            return `translate(${coord.x_pixels},${coord.y_pixels})`
        })

    emblems
        .append("circle")
        .attr("r", (d) => {
            return Math.sqrt(d.length) * 12
        })
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .attr("opacity", 0.8)
        .attr('class', 'emblem')
        .style('width', "2%")
        .style("height", "auto")
        .attr("cursor", "pointer")
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    
    // Sort emblems to that small circles can't be obscured by bigger circles
    emblems.sort(function (a, b) {
        return d3.descending(a.length, b.length);
    });

    map_image.on("click", function (e, d) {
        deselect_emblem(selected_emblem);
        selected_location="";
        selected_emblem = null;
    });
    return emblems

    var selected_location;
    function click(e, d) {
        emblem = d3.select(this.parentNode)
        
        deselect_emblem(selected_emblem, d)
        selected_emblem = emblem;


        //sound stuff for emblems
        selected_location = d[0].Death_Location
        console.log(selected_location + ", died here")
        // function for determining which sound to play
        // function for playing music
        //let chosen_sound = choose_sound(selected_location) 
        //fetch_sound(selected_sound)
        //fetch_sound(choose_sound(selected_location))
        //playback(chosen_sound)
        playLocationSound(selected_location);

       

        select_emblem(emblem, d)
        updateMap(sliderVals[0], sliderVals[1], mapMode);
    }

    function mouseover(e, d) {
        if (selected_location != d[0].Death_Location)
            map_tooltip.style("visibility", "visible");
    }

    function mousemove(e, d) {
        var numdead;
        if (d[0].Death_Location in filtered_people_counter) {
            num_dead_shown = location_to_deaths[d[0].Death_Location].length - filtered_people_counter[d[0].Death_Location]
            numdead = num_dead_shown
        } else{
            numdead = d.length
        }

        // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, []);
        };

        // Apply time filter
        //d.filter(item => )

        // Figure out the different houses
        houses = Object.entries(groupBy(d, 'Allegiances'));

        // Apply the allegiance filter
        houses = houses.filter(function (house) {
            return selected_allegiances.length > 0 ? selected_allegiances.includes(house[0]) : true;
        });

        const tooltip_y_offset = 10;

        const tooltip_right_x_offset = 25;
        const tooltip_left_x_offset = 15;

        map_tooltip
            .style('top', e.clientY - tooltip_y_offset + 'px')
            .style('left', e.clientX + tooltip_right_x_offset + 'px')
            .style('right', null)
            .html(`<h3 style="margin:0;padding:0;"> ${d[0].Death_Location} </h3>
                   Deaths: ${numdead} <br>`)

        // Show images for each house that has died here
        map_tooltip
            .selectAll("img")
            .data(houses)
            .join("img")
            .attr("src", function (d) { return "assets/emblems/" + d[0] + ".png"})
            .attr("width", "24px")
            .attr("height", "24px")

        let width = map_tooltip.node().offsetWidth;
        if (e.clientX + width + 35 > window.innerWidth)
        {
            map_tooltip
                .style('left', null)
                .style('right', window.innerWidth - e.clientX + tooltip_left_x_offset + 'px')
        }
    }
}

function mouseleave(d) {
    map_tooltip.style("visibility", "hidden");
}

function select_emblem(emblem, data) {
    // Bring this element to the top, when we deselect we will re-sort
    emblem.raise();
    
    center = ({id: 0, data: data, x: 0, y: 0, fx: 0, fy: 0})

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    nodes = [center]
    map = d3.map(data, (d, i) => ({id: i, data: d, x: Math.random()*80-40, y: Math.random()*80-40})).map(intern);
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
        .distance((d) => Math.random() * map.length * 5 + 35)

    link = emblem.append("g")
        .attr("class", "lines")
        .attr("stroke", "black")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1)
        //.attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "line_link")

    node = emblem.selectAll(".popup")
        .data(map)
        .join("svg:image")
        .attr("class", "popup")
        .attr("xlink:href", (d) => {
            var allegiance = d.data.Allegiances;
            return "assets/emblems/" + allegiance + ".png"
        })
        .attr('width', emblem_size + "%")
        // .attr("height", "3%")
        .attr('x', 0)
        .attr('y', 0)
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    forceSimulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        //.force("center", d3.forceCenter())
        .on("tick", tick)

    emblem.select(".emblem").attr("visibility", "hidden");

    // Hide the location tooltip here too so that it doesn't stay visible
    // if the user doesn't move the mouse
    map_tooltip.attr("visibility", "hidden");

    return

    function tick() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("x", function (d) {
                return d.x - (this.width.animVal.value / 2);
            })
            .attr("y", function (d) {
                return d.y - (this.height.animVal.value / 2);
            });
    }

    //-----------------------------//
    //  Emblems mouse functions   //
    // ---------------------------//

    function click(e, d) {
        // FIXME: Make the transparent parts of the images click-through
        // FIXME: Show selection!

        d3.select(this).raise();
    }

    function mouseover(d) {
        tooltip.style("visibility", "visible");
    }

    function mousemove(e, d) {
        d = d.data
        // console.log(d)

        var firstBook = ""
        if (d.GoT == 1) {
            firstBook += "A Game of Thrones "
        } else if (d.CoK == 1) {
            firstBook += "A Clash of Kings"
        } else if (d.SoS == 1) {
            firstBook += "A Storm of Swords"
        } else if (d.FfC == 1) {
            firstBook += "A Feast for Crows"
        } else if (d.DwD == 1) {
            firstBook += "A Dance with Dragons"
        } else {
            firstBook += "Opsie whoopsie! Something went fuckywucky (•ω•`)"
        }

        var lastBook = ""
        if (d.Book_of_Death == 1) {
            lastBook += "A Game of thrones"
        } else if (d.Book_of_Death == 2) {
            lastBook += "A Clash of Kings"
        } else if (d.Book_of_Death == 3) {
            lastBook += "A Storm of Swords"
        } else if (d.Book_of_Death == 4) {
            lastBook += "A Feast for Crows"
        } else if (d.Book_of_Death == 5) {
            lastBook += "A Dance with Dragons"
        } else {
            lastBook += "(`•ω•) γʞɔυwγʞɔυʇ Ɉnǝw ϱniʜɈǝmoƧ !ǝiƨqooʜw ǝiƨqO"
        }

        const tooltip_y_offset = 10;

        const tooltip_right_x_offset = 25;
        const tooltip_left_x_offset = 15;

        tooltip
            .style('top', e.clientY - tooltip_y_offset + 'px')
            .style('left', e.clientX + tooltip_right_x_offset + 'px')
            .style('right', null)
            .html( `<h2 style="margin:0;padding:0;"> ${d.Name} </h2> 
                    <b> Allegiance: </b> ${d.Allegiances} <br> 
                    <b> Year of death: </b> ${d.Death_Year} AC <br>
                    <b> Death location: </b> ${d.Death_Location} <br> 
                    <b> First appeared in: </b> ${firstBook}, chapter ${d.Book_Intro_Chapter} <br> 
                    <b> Last appeared in: </b> ${lastBook}, chapter ${d.Death_Chapter} <br>`)

        let width = tooltip.node().offsetWidth;
        if (e.clientX + width + 35 > window.innerWidth)
        {
            tooltip
                .style('left', null)
                .style('right', window.innerWidth - e.clientX + tooltip_left_x_offset + 'px')
        }
    }

    function mouseleave(d) {
        tooltip.style("visibility", "hidden");
    }
}

function deselect_emblem(emblem) {
    if (emblem == null) return;
    forceSimulation.stop();

    emblem.select(".emblem")
        .attr("visibility", "visible")
        .attr("pointer-events", "all");
    emblem.selectAll(".popup").remove();
    // FIXME: remove the <g> tags
    emblem.selectAll(".lines").remove();

    // Sort emblems to that small circles can't be obscured by bigger circles
    emblems.sort(function (a, b) {
        return d3.descending(a.length, b.length);
    });
}

var filtered_people_counter = {}

function updateMap(min, max, mapMode) {
    var filteredvalue;
    // Hide filtered people
    d3.selectAll(".popup")
        .filter((d) => {
            return !person_filter(d.data);
        })
        .attr("visibility", "hidden")
        .attr("pointer-events", "none");

    // Show people that pass the filter
    d3.selectAll(".popup")
        .filter((d) => {
            return person_filter(d.data);
        })
        .attr("visibility", "visible")
        .attr("pointer-events", "all");

    d3.selectAll(".line_link")
        .filter((d) => {
            return !person_filter(d.target.data);
        })
        .attr("stroke-opacity", 0)

    d3.selectAll(".line_link")
        .filter((d) => {
            return person_filter(d.target.data);
        })
        .attr("stroke-opacity", 1)

    d3.selectAll(".emblem")
        .filter((d) => {
            var location = d[0].Death_Location;
            return location_to_deaths[location].length == 0
        })
        .attr("visibility", "hidden")
        .attr("pointer-events", "none");

    var filtered_counter = {}

    d3.selectAll(".emblem")
        .each(function(d) {
            for(var i = 0 ; i < d.length; i++) {
                var person = d[i];
                if (!person_filter(person))
                {
                    if (person.Death_Location in filtered_counter)
                        filtered_counter[person.Death_Location] += 1;
                    else
                        filtered_counter[person.Death_Location] = 1;
                }
            }
        })
        .attr("r", function(d) {
            if (d[0].Death_Location in filtered_counter) {
                num_dead_shown = location_to_deaths[d[0].Death_Location].length - filtered_counter[d[0].Death_Location]
                return Math. sqrt(num_dead_shown)*12
            } else {
                return Math. sqrt(location_to_deaths[d[0].Death_Location].length)*12
            }
        })
        .filter(function(d) {
            var location = d[0].Death_Location;
            if (selected_emblem != null)
                return filtered_counter[location] == location_to_deaths[location].length || selected_emblem.data()[0][0].Death_Location ==location
            else
                return filtered_counter[location] == location_to_deaths[location].length 
        })
        .attr("visibility", "hidden")
        .attr("pointer-events", "none");

    d3.selectAll(".emblem")
        .filter((d) => {
            var location = d[0].Death_Location;
            if (location in filtered_counter) {
                if (selected_emblem != null)
                    return filtered_counter[location] < location_to_deaths[location].length && selected_emblem.data()[0][0].Death_Location != location
                else
                    return filtered_counter[location] < location_to_deaths[location].length
            } else {
                if (selected_emblem != null)
                    return selected_emblem.data()[0][0].Death_Location != location;
                else
                    return true;
            }
        })
        .attr("visibility", "visible")
        .attr("pointer-events", "all");

    filtered_people_counter = filtered_counter;
}

// ---------------------------//
//      Credits     button     //
// --------------------------//

credits_button_clicked = false;
const credits_button = g_slider.append("rect")
    .attr("id", "credits_selector_rect")
    .attr('width', bottombar_width / 8)
    .attr('height', bottombar_height / 3)
    .attr('stroke', btn_stroke_color)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })

credits_button.attr("x", bottombar_width * 0.84)
    .attr("y", 40)

const credits_button_text = g_slider.append("text")
    .attr("x", bottombar_width * 0.875)
    .attr("y", credits_button.attr("y") * 1.7)
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text("About")
    .on("mouseover", function (d) {
        d3.select("#credits_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#credits_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })

credits_button.on("click", () => {
    if (credits_button_clicked == false) {
        credits_button_clicked = true;
        g_credits.attr('visibility', 'visible')
    } else {
        credits_button_clicked = false;
        g_credits.attr('visibility', 'hidden')
    }
});

const g_credits = svg.append("g")
    .attr("visibility", "hidden")


var credits_menu = g_credits.append("rect")
    .attr('height', height / 1.4)
    .attr('width', width / 1.3)
    .attr('x', width / 9)
    .attr('y', height / 9)
    .attr("rx", 10)
    .attr('stroke', bg_stroke_color)
    .attr('stroke-width', 2)
    .attr('fill', bg_color)


// ------------------TEAM -------------------//
    
    //title
g_credits.append("text")
    .attr("class", "team")
    .attr('x', width / 2.05)
    .attr('y', height / 5)
    .attr('font-size', '38px')
    .attr('font-weight', 'bold')
    .attr("text-anchor", "middle")
    .text("The team")

    //close button
g_credits.append("svg:image")
    .attr("xlink:href", "assets/close_button.png")
    .attr('x', width * 0.12)
    .attr('y', height * 0.13)
    .attr('width', "3.5%")
    .attr("cursor", "pointer")
    .on("click", () => {
        g_credits.attr('visibility', 'hidden')
    })

g_credits.selectAll("rect")
    .data([0, 1, 2, 3, 4, 5])
    .enter().append("svg:image")
    .attr("class", "team")
    .attr("xlink:href", d => "assets/photos/photo_" + d + ".png")
    .style("width", (d) => {
            if (d!=5)
             return"10%"
             else
            return "10.8%"
    })
    .style("height", "auto")
    .attr("x", (d) => {
        if(d!=5)
        return 80 + width * 0.13 * d
        else 
        return 80 + width * 0.133 * d
    })
    .attr('y', height * 0.24)

names = ["Julius Häger", "Philip Berrez", "Fabian Hugert", "Alice Anselmi", "Christoffer Eriksson"];
g_credits.selectAll("text")
    .data([0, 1, 2, 3, 4, 5])
    .enter().append("text")
    .attr("class", "team")
    .text((d) => {
        return names[d - 1]
    })
    .style("font-size", "27px")
    .attr("x", (d) => {
        return 80 + width * 0.13 * d
    })
    .attr('y', height * 0.53)

//USE THIS FUNCTION TO ADD A ROLE AND THE LINKEDIN BUTTON
function append_role(role, person_idx, y_offset){
    g_credits.append("text")
    .attr("class", "team")
    .text(role)
    .style("font-size", "20px")
    .attr("x",  80 + width * 0.13 * person_idx)
    .attr('y', height * 0.56 + y_offset)
}

function append_linkedin_button(link, person_idx){
    var linkedin_button = g_credits.append("rect")
    .attr("class","team")
    .attr('width', 100)
    .attr('height', 30)
    .attr('stroke', btn_stroke_color)
    .attr("x",  80 + width * 0.13 * person_idx)
    .attr('y', height * 0.63)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        window.open(link)
        });


    g_credits.append("text")
    .attr("class","team")
    .attr("x", linkedin_button.attr("x")*1.02)
    .attr("y", parseInt(linkedin_button.attr("y")) +25)
    .attr("font-size", "20px")
    .attr("cursor", "pointer")
    .text("Linkedin")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        window.open(link)
    });
}

button_width = width / 8.9
append_role("➢ Back-end", 1, 0)
append_role("➢ Front-end", 1, 20)
append_role("➢ Data handling", 1, 40)
append_linkedin_button("https://www.linkedin.com/in/julius-h%C3%A4ger/", 1)

append_role("➢ Front-end", 2, 0)
append_role("➢ Sonification", 2, 20)
append_role("➢ UX/UI", 2, 40)
append_linkedin_button("Put your link here Philip", 2)

append_role("➢ UI/UX", 3, 0)
append_role("➢ Data handling", 3, 20)
append_role("➢ Front-end", 3, 40)
append_linkedin_button("https://www.linkedin.com/in/fabian-hugert/", 3)

append_role("➢ Data", 4, 0)
append_role("➢ Back-end", 4, 20)
append_role("➢ Front-end", 4, 40)
append_linkedin_button("https://www.linkedin.com/in/alice-anselmi/", 4)

append_role("➢ UI/UX", 5, 0)
append_role("➢ User testing", 5, 20)
append_role("➢ Data handling", 5, 40)
append_linkedin_button("https://www.linkedin.com/in/christoffer-eriksson-696486256/", 5)

const team_button = g_credits.append("rect")
    .attr("id", "team_selector_rect")
    .attr('width', button_width)
    .attr('height', height / 16)
    .attr('stroke', btn_stroke_color)
    .attr('x', width * 0.18)
    .attr('y', height * 0.72)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_team();
    });

const team_button_text = g_credits.append("text")
    .attr("x", team_button.attr("x")*1.11)
    .attr("y", team_button.attr("y")*1.06)
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text("The team")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    }).on("click", () => {
        show_team();
    });

function show_team() {
    d3.selectAll(".team").attr("opacity", 1)
    d3.selectAll(".instructions").attr("opacity", 0)
    d3.selectAll(".references").attr("opacity", 0).attr("pointer-events", "none")
    d3.selectAll(".objectives").attr("opacity", 0)
}

// ------------------INSTRUCTIONS -------------------//
const instructions_button = g_credits.append("rect")
    .attr("id", "instructions_selector_rect")
    .attr('width',button_width)
    .attr('height', height / 16)
    .attr('stroke', btn_stroke_color)
    .attr('x', width * 0.35)
    .attr('y', height * 0.72)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_instructions();
    });

const instruction_button_text = g_credits.append("text")
    .attr("x", instructions_button.attr("x")*1.05)
    .attr("y", instructions_button.attr("y")*1.06)
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text("Instructions")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_instructions();
    });

//opacity instead of visibility because otherwise clashes with "about " button
function show_instructions() {
    d3.selectAll(".team").attr("opacity", 0)
    d3.selectAll(".references").attr("opacity", 0).attr("pointer-events", "none")
        d3.selectAll(".instructions").attr("opacity", 1)
        d3.selectAll(".objectives").attr("opacity", 0)
}
    
g_credits.append("text")
    .attr("class", "instructions")
    .attr('x', width / 2)
    .attr('y', height / 5)
    .attr('font-size', '38px')
    .attr('font-weight', 'bold')
    .attr("text-anchor", "middle")
    .text("Instructions")

text_x = 90+ width * 0.12
text_y =  height / 3.5
offset=35

function append_text_to_instructions(text, line_number) {
    g_credits.append("text")
        .attr("class","instructions")
        .text(text)
        .style("font-size", "23px")
        .attr("x", text_x )
        .attr('y', text_y+offset*line_number)
}
function append_link_to_instructions(link, line_number, start_x){
    var access_button = g_credits.append("rect")
        .attr("class","instructions")
        .attr('width', 100)
        .attr('height', 30)
        .attr('stroke', btn_stroke_color)
        .attr('x',start_x)
        .attr('y', text_y+offset*line_number - 25)
        .attr('fill', btn_color)
        .attr("cursor", "pointer")
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke", highlight_color)
                .attr("stroke-width", "3px")
        })
        .on("mouseleave", function (d) {
            d3.select(this)
                .attr("stroke-width", "1px")
                .attr("stroke", btn_stroke_color)
        })
        .on("click", () => {
            window.open(link)
        });


    g_credits.append("text")
        .attr("class","instructions")
        .attr("x", access_button.attr("x")*1.02)
        .attr("y", parseInt(access_button.attr("y")) +25)
        .attr("font-size", (bottombar_height / 5 + "px"))
        .attr("cursor", "pointer")
        .text("Demo")
        .on("mouseover", function (d) {
            d3.select("#instructions_selector_rect")
                .attr("stroke", highlight_color)
                .attr("stroke-width", "3px")
        })
        .on("mouseleave", function (d) {
            d3.select("#instructions_selector_rect")
                .attr("stroke-width", "1px")
                .attr("stroke", btn_stroke_color)
        })
        .on("click", () => {
            window.open(link)
        });
}

append_text_to_instructions("A Viz of Ice and Fire is a map of the characters' deaths in \"A Song of Ice and Fire\" by George R. R. Martin.", 0)
append_text_to_instructions("This visualization is the final project for the \"Information Visualization\" course at KTH.", 1)
append_text_to_instructions(" ➢ Zoom in and out to see the details of the map. Click on the circles to see who died in each location.", 3)
append_text_to_instructions(" ➢ Click on the \"Books/Years view\" button to choose the filtering criteria you want to apply.", 4)
append_text_to_instructions(" ➢ Select a range in the slider to see who died in the chosen range of books/chapters or time period.",5)
append_text_to_instructions(" ➢ Click on the emblems in the left pop-up menu to filter the characters by allegiance.", 6)
append_link_to_instructions("https://youtu.be/u8KiZ5eEQKc", 7, 900)
append_text_to_instructions(" Note for bigger screens: zoom in the browser to have a better positioning of elements!", 8)

d3.selectAll(".instructions").attr("opacity", 0)

// ------------------REFERENCES -------------------// 

const references_button = g_credits.append("rect")
    .attr("id", "references_selector_rect")
    .attr('width',button_width)
    .attr('height', height / 16)
    .attr('stroke', btn_stroke_color)
    .attr('x', width * 0.52)
    .attr('y', height * 0.72)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_references();
    });

// ------------------REFERENCES -------------------//    

const references_button_text = g_credits.append("text")
    .attr("x", references_button.attr("x")*1.045)
    .attr("y", references_button.attr("y")*1.06)
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text("References")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_references();
    });

g_credits.append("text")
    .attr("class", "references")
    .attr('x', width / 2)
    .attr('y', height / 5)
    .attr('font-size', '38px')
    .attr('font-weight', 'bold')
    .attr("text-anchor", "middle")
    .text("References")

function append_text_to_references(text, line_number){
    g_credits.append("text")
        .attr("class","references")
        .text(text)
        .style("font-size", "23px")
        .attr("x", text_x )
        .attr('y',text_y+offset*line_number)
}

function append_link_to_references(link, line_number, start_x){    
    var access_button = g_credits.append("rect")
    .attr("class","references")
    .attr('width', 100)
    .attr('height', 30)
    .attr('stroke', btn_stroke_color)
    .attr('x',start_x)
    .attr('y', text_y+offset*line_number - 25)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        window.open(link)
        });


    g_credits.append("text")
    .attr("class","references")
    .attr("x", access_button.attr("x")*1.02)
    .attr("y", parseInt(access_button.attr("y")) +25)
    .attr("font-size", (bottombar_height / 5 + "px"))
    .attr("cursor", "pointer")
    .text("Access")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        window.open(link)
    });
}
append_text_to_references("➢ Kaggle fan-made dataset - Data ", 0)
append_link_to_references("https://www.kaggle.com/datasets/mylesoneill/game-of-thrones", 0, text_x+1100)
append_text_to_references("➢ A Song of Ice and Fire Wiki - Data ", 1)
append_link_to_references("https://awoiaf.westeros.org/index.php/Main_Page", 1, text_x+1100)
append_text_to_references("➢ Bevan, Nigel. (2009). What is the difference between the purpose of usability and user experience evaluation methods?", 2)
append_link_to_references("https://www.researchgate.net/publication/238775905_What_is_the_difference_between_the_purpose_of_usability_and_user_experience_evaluation_methods", 2, text_x+1100)
append_text_to_references("➢ Arnold P. O. S. Vermeeren, et al. 2010. User experience evaluation methods: current state and development needs", 3)
append_link_to_references("https://dl.acm.org/doi/10.1145/1868914.1868973", 3, text_x+1100)
append_text_to_references("➢ Catherine Plaisant. 2004. The challenge of information visualization evaluation", 4)
append_link_to_references("https://doi.org/10.1145/989863.989880", 4, text_x+1100)
append_text_to_references("➢ Mazza, R. (2009). Introduction to Information Visualization.", 5)
append_link_to_references("https://link-springer-com.focus.lib.kth.se/book/10.1007/978-1-84800-219-7", 5, text_x+1100)
append_text_to_references("➢ Salvendy, G. (2012). Handbook of Human Factors and Ergonomics (4. Aufl. ed.).", 6)
append_link_to_references("https://www.wiley.com/en-us/Handbook+of+Human+Factors+and+Ergonomics%2C+5th+Edition-p-9781119636083", 6, text_x+1100)
append_text_to_references("➢ A Song of Ice and fire Speculative map - Traced asset", 7)
append_link_to_references("https://www.worldanvil.com/w/a-summer-of-ice-and-fire-jester-117/map/225236e7-5acb-495c-9486-94606aec90c3", 7, text_x+1100)
append_text_to_references("➢ Game of Thrones - The Killing Fields - Information viz", 8)
append_link_to_references("https://public.tableau.com/app/profile/harpreetghuman/viz/TheKillingFieldsofGOT/GOT", 8, text_x+1100)

//The End ;-)
d3.selectAll(".references").attr("opacity", 0).attr("pointer-events", "none")

function show_references(){
    d3.selectAll(".team").attr("opacity", 0)
    d3.selectAll(".references").attr("opacity", 1).attr("pointer-events", "all")
    d3.selectAll(".instructions").attr("opacity", 0)
    d3.selectAll(".objectives").attr("opacity", 0)
}

// ------------------LEARNING OBJECTIVES -------------------//   

const objectives_button = g_credits.append("rect")
    .attr("id", "objectives_selector_rect")
    .attr('width', button_width)
    .attr('height', height / 16)
    .attr('stroke', btn_stroke_color)
    .attr('x', width * 0.7)
    .attr('y', height * 0.72)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', btn_color)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_objectives();
    });



const objectives_button_text = g_credits.append("text")
    .attr("x", objectives_button.attr("x")*1.01)
    .attr("y", objectives_button.attr("y")*1.06)
    .attr("font-size", (bottombar_height / 5.5 + "px"))
    .attr("cursor", "pointer")
    .text("Learning objectives")
    .on("mouseover", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke", highlight_color)
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#instructions_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", btn_stroke_color)
    })
    .on("click", () => {
        show_objectives();
    });


g_credits.append("text")
    .attr("class", "objectives")
    .attr('x', width / 2)
    .attr('y', height / 5)
    .attr('font-size', '38px')
    .attr('font-weight', 'bold')
    .attr("text-anchor", "middle")
    .text("What have we learned?")

function show_objectives(){
    d3.selectAll(".team").attr("opacity", 0);
    d3.selectAll(".references").attr("opacity",0).attr("pointer-events", "none");
    d3.selectAll(".instructions").attr("opacity", 0);
    d3.selectAll(".objectives").attr("opacity", 1);
}

function append_text_to_objectives(text, line_number) {
    g_credits.append("text")
        .attr("class","objectives")
        .text(text)
        .style("font-size", "23px")
        .attr("x", text_x )
        .attr('y', text_y+offset*line_number)
}

append_text_to_objectives("Throughout this project we have worked closely together to construct this visualization. Where we attempted to visualize", 0);
append_text_to_objectives("the overall spread of character deaths and locations of GoT in a comprehensive manner.", 1);
append_text_to_objectives("We do this by keeping clutter to a minimum, both data points and UI elements. Ensuring the user can get a", 2);
append_text_to_objectives("quick overview, and then procure details. The user is able to filter by various criteria, as well as zooming and panning across the map.", 3);
append_text_to_objectives("This project was inspired by the lack of readability in an older GoT visualization (H. Ghuman 2017). (see references)",5)
append_text_to_objectives("For instance, its lack of axis to read the bars values, and nonlinear shape also made it difficult to read.",6)
append_text_to_objectives("We have written a quick explanation of how to use the Viz, as well as a quick demo video showcasing an example interaction of the viz.",7)
append_text_to_objectives("During this project we have performed a number of user evaluations to identify areas of improvements,",8)
append_text_to_objectives("which led us to improve for instance the UI to clarify what is intractable or not. And improve layout to communicate functionality.",9)


d3.selectAll(".objectives").attr("opacity", 0);



// ---------------------------//
//           Sound          //
// --------------------------//

//const ctx = new AudioContext();
//let audio


function choose_sound(locationName, callback) {

    var city = ["King's Landing", "Winterfell", "Castle Black", "The Twins", "Meereen", "Harrenhal", "Riverrun", "Dragonstone", "Storm's End", "Whispers", "Astapor", "Moat Cailin", "The Eyrie", "Burning Septry", "Stokeworth", "Yunkai", "Braavos", "Darry", "Deepwood Motte", "Dreadfort", "Duskendale", "Fairmarket", "Hornwood", "Maidenpool", "Oldstones", "Oldtown", "Pyke", "Saltpans", "Vaes Dothrak", "Volantis"]
    var horse = ["Dothraki Sea", "Red Waste", "Disputed Lands"]
    var house = ["Crossroads Inn"]
    var mountain = ["Mountains of the Moon"]
    var ocean = ["Blackwater Bay", "Old Wyk", "Summer Sea"]
    var river = ["Riverlands", "Blackwater Rush", "Gods Eye", "Green Fork", "Mummer's Ford", "Greenblood", "Red Fork"]
    var winter = ["Beyond the Wall", "Haunted Forest", "Craster's Keep", "Fist of the First Men", "The North", "Skirling Pass", "Bridge of Skulls", "The Wall"]
    var forest = [] // maybe???
    console.log("in choose sound")

    let chosen_sound;
    if (city.includes(locationName)) {
        console.log("city");
        chosen_sound = "./assets/sfx/CITY.mp3";
    } 
    
    else if (horse.includes(locationName)) {
        console.log("horse");
        chosen_sound = "./assets/sfx/HORSE.mp3";
    } 
    
    else if (house.includes(locationName)) {
        console.log("house");
        chosen_sound = "./assets/sfx/HOUSE.mp3";
    } 
    
    else if (mountain.includes(locationName)) {
        console.log("mountain");
        chosen_sound = "./assets/sfx/MOUNTAIN.mp3";
    } 
    
    else if (ocean.includes(locationName)) {
        console.log("ocean");
        chosen_sound = "./assets/sfx/OCEAN.mp3";
    } 
    
    else if (river.includes(locationName)) {
        console.log("river");
        chosen_sound = "./assets/sfx/RIVER.mp3";
    } 
    
    else if (winter.includes(locationName)) {
        console.log("winter");
        chosen_sound = "./assets/sfx/WINTER.mp3";
    } else {
        console.log("else");
        chosen_sound = "./assets/sfx/RIVER.mp3";
    }
    console.log("in fetch sound")
    /*
    fetch(chosen_sound)
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        audio = decodedAudio;
    });
    */

    fetch(chosen_sound)
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
      audio = decodedAudio;
      // call the callback function with the decoded audio
      callback(audio);
    });
    
}
/*
function fetch_sound(directory) {
    console.log("in fetch sound")
    fetch(directory)
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        audio = decodedAudio;
    });
}
*/

function playback() {
    console.log("in playback")
    const playSound = ctx.createBufferSource();
    playSound.buffer = audio;
    playSound.connect(ctx.destination);
    playSound.start(ctx.currentTime);
}

const playLocationSound = (locationName) => {
    choose_sound(locationName, (audio) => {
      playback(audio);
    });
  };