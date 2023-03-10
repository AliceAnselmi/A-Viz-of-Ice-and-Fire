map_img = "assets/speculative_map_cut.jpg"
slider_bg_img = "assets/slider_bg.png"
range_button_high_img = "assets/range_button_high.png"
range_button_low_img ="assets/range_button_low.png"
slider_books_bar_img = "assets/slider_bar_6.png"
slider_years_bar_img = "assets/slider_bar_4.png"
slider_info_bg_img = "assets/slider_info_bg.png"
back_button_img = "assets/back_button.png"
forward_button_img = "assets/forward_button.png"



   
     
const svg = create_mapview();
var width = window.innerWidth;
var height = window.innerHeight;
var g;

const bottombar_width = 1200;
const bottombar_height = 120;
const sidebar_width = 200;
const sidebar_height = height-bottombar_height;
const sidebar_limit = 500;
var Ytranslation_rescale = 0;

var slider_length = bottombar_width*0.4
const emblem_size = 2 //Determines the size of the emblems


var ui_side_svg = d3.select("#sidebar_svg")
    .attr('width', sidebar_width+ 100)
    .attr('height', sidebar_height)
    .attr('transform', "translate(" +  (-sidebar_width*0.75) + " ,0)")


var ui_bottom_svg = d3.select('#bottombar_svg')
    .attr('width', bottombar_width)
    .attr('height', bottombar_height)
    .attr("transform", "translate(" + ((width-bottombar_width)/2) + ","+ (-Ytranslation_rescale) + ")");


    window.onresize = function(){
        var height_diff = height-window.innerHeight;
        Ytranslation_rescale = Ytranslation_rescale + height_diff
    
        width = window.innerWidth
        height = window.innerHeight;
        if (window.innerHeight > sidebar_limit) {
            ui_side_svg.attr('height', height - bottombar_height)
        }
    
        if(window.innerWidth < sidebar_limit || window.innerWidth < bottombar_width){
            window.resizeTo(bottombar_width + "px", sidebar_limit + "px");
            console.log("Resize" + " to " + bottombar_width + " x " + sidebar_limit)
        };
     //       .attr("preserveAspectRatio", "xMinYMin slice")
    /*    ui_bottom_svg.attr('width', width)
            .attr("preserveAspectRatio", "xMinYMin slice")*/
        //create_mapview();
    
        ui_bottom_svg.attr("transform", "translate(" + ((width-bottombar_width)/2) + ",0)");

        console.log(Ytranslation_rescale)
    };


    function create_mapview()
    {
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
                //.attr("preserveAspectRatio", "xMinYMin slice")
        
                document.addEventListener('DOMContentLoaded', function(event) {
                    //the event occurred
                    map_width = parseInt(map_image.style("width"));
                    map_height = parseInt(map_image.style("height"));
                
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
                        
                    map_svg.call(zoom).on("dblclick.zoom", null);
                
                    zoom.scaleBy(map_svg, min_scale);
                    
                map_svg.call(zoom).on("dblclick.zoom", null);
            
                  })
           
    
        return map_svg
    }
    
        




    // ---------------------------//
    //       Tooltip              //
    // ---------------------------//
    const tooltip = d3.select("body").append("g")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

  

    // ---------------------------//
//          Slider           //
// --------------------------//
const g_slider = ui_bottom_svg.append("g")
var v1 = 0, v2 = 343;
var sliderVals = [v1, v2];
var views = ["Books", "Years"];
var currview = 0; // 0 -> BOOKS, 1 -> YEARS
const slider_imgs = []
slider_imgs[0] = slider_books_bar_img;
slider_imgs[1] = slider_years_bar_img;


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
    } else if (chapter_tot >= 272 && chapter_tot <= 343) {
        book = 5;
        chapter = chapter_tot - 272;
    }
    return [book, chapter];

}

function update_slider_infos(v1, v2) {
    slider_infos_text.text(
        () => {
            if (currview == 0)
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
     .attr("fill", "rgba(0,162,162,0)")

var slider_infos = g_slider.append('g')
    //.attr("transform", "translate(" + width / 3 + "," + (height - 140) + ")")


slider_infos.append("rect")
    .attr("height", bottombar_height/2)
    .attr("width", bottombar_width/3)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("x",  (bottombar_width/3) +25 )
    .attr("fill", "#fdfdfd")
    .attr('stroke', '#000000')
    slider_background.raise();

var slider_infos_text = slider_infos.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("x", bottombar_width/2 +10)
    .attr('y', 25)
update_slider_infos(sliderVals[0], sliderVals[1]);



// ---------------------------//
//      Slider - buttons      //
// --------------------------//
var clickedhandle;

var slider_button_upper = g_slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image")
    .attr("xlink:href", d => d == 0 ? back_button_img : forward_button_img)
    .style("width", "3%")
    .style("height", "auto")
    .attr("x", d => bottombar_width*0.75+ d * 30)
    .attr('y', bottombar_height/2.5)
    .attr('object-position', 'center')
    .attr("cursor", "pointer")
    .on("click", (e, d) => {
        clickedhandle = 1;
        move_handle_one_tick(e, d)
    })

var slider_button_lower = g_slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image")
    .attr("xlink:href", d => d == 0 ? back_button_img : forward_button_img)
    .style("width", "3%")
    .style("height", "auto")
    .attr("x", d => bottombar_width*0.25 + d * 30)
    //.attr('y', g_slider.attr('height')/3)
    .attr('y', bottombar_height/2.5)
    .attr('object-position', 'center')
    .attr("cursor", "pointer")
    .on("click", (e, d) => {
        clickedhandle = 0;
        move_handle_one_tick(e, d)
    })

var move_handle_one_tick = function (e, d,) {
    if (clickedhandle != null) {
        //positioning of button
        var x_handle = x_slider(sliderVals[clickedhandle == 0 ? 0 : 1]);

        var curr_value = Math.round(x_slider.invert(x_handle));
        var new_value = curr_value + (d == 0 ? -1 : 1);
        if (new_value >= x_slider.domain()[0] && new_value <= x_slider.domain()[1]) {
            x_handle = x_slider(new_value)
            var x_other_handle = x_slider(sliderVals[clickedhandle == 0 ? 1 : 0])
            //handle overlap
            if (clickedhandle == 0) { //if lower handle
                if (x_handle >= x_other_handle - 40) {
                    x_handle = x_other_handle
                }
            } else { //otherwise
                if (x_handle <= x_other_handle + 40) {
                    x_handle = x_other_handle
                }
            }


            if (x_handle < xMin && x_handle <= x_other_handle + 40)
                x_handle = xMin;
            else if (x_handle > xMax && x_handle >= x_other_handle - 40)
                x_handle = xMax;

            d3.selectAll(".handle" + clickedhandle).attr("x", x_handle - handle_offset)

            selRange
                .attr("x1", x_handle)
                .attr("x2", x_other_handle)
            sliderVals[clickedhandle] = new_value
            if (clickedhandle == 0) { //if moving lower handle
                update_slider_infos(new_value, sliderVals[1]);
                v1 = Math.min(new_value, sliderVals[1]);
                v2 = Math.max(new_value, sliderVals[1]);

            } else { //otherwise
                update_slider_infos(sliderVals[0], new_value);
                v1 = Math.min(sliderVals[0], new_value);
                v2 = Math.max(sliderVals[0], new_value);
            }
            updateMap(v1, v2, currview);
        }
    }
}

// ----------------------------//
//  Slider - handles+bar     //
// --------------------------//
var handle_offset = 20;

const slider = g_slider.append("g")
    //.attr("transform", "translate(" + width / 3 + "," + (height - 55) + ")")
    .attr("transform", "translate(" + (bottombar_width/3.2)  + "," + bottombar_height/2.5 + ")")



var slider_image = slider.append("svg:image")
    .attr("xlink:href", d => slider_imgs[currview])
    .attr('object-position', 'center')
    .attr('width', slider_length)
    .attr('y', 5)

    //.attr("transform", "translate(-20,0)")
    //.style("height", "17px")

var x_slider = d3.scaleLinear()
    .domain([0, 343])
    .range([slider_length*0.04+handle_offset,slider_length*0.87+handle_offset])
    .clamp(true);
var xMin = x_slider(0),
    xMax = x_slider(343)

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


var selRange = slider.append("line")
    .data(x_slider.range())
    .attr("class", "sel-range")
    .style("stroke", "url(#linear-gradient)")
    .attr("transform", "translate(0,12)")
    .style("opacity", 0.6)
    .style("stroke-width", bottombar_height / 8.4 + "px")
    .attr("x1", x_slider(sliderVals[0]))
    .attr("x2", x_slider(sliderVals[1]))


var clickedhandle;
var clickedhandle_node;
var handle = slider.selectAll("circle")
    .data([0, 1])
    .enter().append("svg:image").attr("xlink:href", d => range_button_imgs[d])
    .attr("class", d => "handle" + d)
    .attr("x", d => x_slider(sliderVals[d]) - handle_offset)
    .attr("y", -3)
    .style("width", "3%")
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
    //handle overlap
    if (d == 0) { //if lower handle
        if (x_cursor >= x_other_handle - 40) {
            x_cursor = x_other_handle
        }
    } else { //otherwise
        if (x_cursor <= x_other_handle + 40) {
            x_cursor = x_other_handle
        }
    }

    if (x_cursor < xMin && x_cursor <= x_other_handle + 40)
        x_cursor = xMin;
    else if (x_cursor > xMax && x_cursor >= x_other_handle - 40)
        x_cursor = xMax;

    d3.select(this).attr("x", x_cursor - handle_offset)

    selRange
        .attr("x1", x_cursor)
        .attr("x2", x_other_handle)
    var v = Math.round(x_slider.invert(x_cursor))
    if (d == 0) { //if moving lower handle
        update_slider_infos(v, sliderVals[1]);
        v1 = Math.min(v, sliderVals[1]);
        v2 = Math.max(v, sliderVals[1]);

    } else { //otherwise
        update_slider_infos(sliderVals[0], v);
        v1 = Math.min(sliderVals[0], v);
        v2 = Math.max(sliderVals[0], v);
    }
    updateMap(v1, v2, currview);
}

function endDrag(event, d) {
    var v;
    var x_cursor = event.x;
    var x_other_handle = x_slider(sliderVals[d == 0 ? 1 : 0])

    //handle overlap
    if (d == 0) { //if lower handle
        if (x_cursor >= x_other_handle - 40) {
            v = sliderVals[1] //value of the other handle
        } else {
            v = Math.round(x_slider.invert(x_cursor))
        }
    } else { //otherwise
        if (x_cursor <= x_other_handle + 40) {
            v = sliderVals[0] //value of the other handle
        } else {
            v = Math.round(x_slider.invert(x_cursor))
        }

    }
    sliderVals[d] = v
    v1 = Math.min(sliderVals[0], sliderVals[1]);
    v2 = Math.max(sliderVals[0], sliderVals[1]);


    d3.select(this)
        .classed("active", false)
        .attr("x", x_slider(v) - handle_offset)
        .style("cursor", "pointer")

    selRange
        .attr("x1", x_slider(v1))
        .attr("x2", x_slider(v2))
    slider_infos_text.text(views[currview] + " " + sliderVals[0] + " - " + sliderVals[1])
    update_slider_infos(sliderVals[0], sliderVals[1]);
    updateMap(v1, v2, currview);

}


// ---------------------------//
//      View     selector     //
// --------------------------//

const view_selector = g_slider.append("rect")
    .attr("id", "view_selector_rect")
    .attr('width', bottombar_width/8)
    .attr('height', bottombar_height/3)
    .attr('stroke', 'black')
    .attr('fill', 'white')
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", "#493521")
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    })
view_selector.attr("x", bottombar_width*0.1)
    .attr("y", 40)

    

var slider_selector_text = g_slider.append("text")
.attr("x", bottombar_width*0.12)
.attr("y", view_selector.attr("y")*1.7)
    //.attr("font-size", "25px")
    .attr("font-size", (bottombar_height/5 + "px"))
    .attr("cursor", "pointer")
    .text(views[currview] + " view");
slider_selector_text.on("click", updateView)
    .on("mouseover", function (d) {
        d3.select("#view_selector_rect")
            .attr("stroke", "#493521")
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#view_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    })
view_selector.on("click", updateView);

function updateView() {



    currview = 1 - currview;
    slider_image.attr("xlink:href", d => slider_imgs[currview])
        // .attr('object-position', 'center')
        // .attr('width', slider_length)
        // .attr('y', 5)


    if (currview == 0) {
        v1 = 0;
        v2 = 343;
        sliderVals = [v1, v2];
        x_slider = d3.scaleLinear()
            .domain([0, 343])
            .range([slider_length*0.04+handle_offset,slider_length*0.87+handle_offset])
            .clamp(true);
        xMin = x_slider(0);
        xMax = x_slider(343);

        selRange.style("stroke", "url(#linear-gradient)")
        .attr("transform", "translate(0,12)")
        .style("stroke-width", bottombar_height / 8.4 + "px")
        handle.style("width", "3%")

    } else {
        v1 = 297;
        v2 = 300;
        sliderVals = [v1, v2];
        x_slider = d3.scaleLinear()
            .domain([297, 300])
            .range([slider_length*0.04+handle_offset,slider_length*0.87+handle_offset])
            .clamp(true);

        xMin = x_slider(297);
        xMax = x_slider(300);
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
    slider_selector_text.text(views[currview] + " view")
    update_slider_infos(sliderVals[0], sliderVals[1]);
    updateMap(v1, v2, currview);

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
    .attr('height', sidebar_height)
    .attr('width', sidebar_width*0.75)
    .attr('y', 20)
    .attr('stroke', '#000000')
    .attr('stroke-width', 2)
    .attr('fill', 'rgba(194,176,149,0.32)')


        
        var filter_button=g_filter.append("svg:image")
            .attr("xlink:href", "assets/allegiance_button.png")
            .style('width', sidebar_width/2.5)
            .style("height", "auto")
            .attr('x', sidebar_width*0.75)
            .attr("y", 20)

        g_filter.append("text")
        .attr("font-size","33px")
        .attr("x", 25)
        .attr("y", 80)
        .html("Filter by")
        g_filter.append("text")
        .attr("font-size","33px")
        .attr("x", 40)
         .attr("y", 120)
        .html("house")

        var filter_menu_open = false;
var display_filter_menu = function (d) {
    if (filter_menu_open == false) {
        filter_menu_open = true;

        ui_side_svg.transition()
            .attr("transform", "translate(0,0)");
    } else {
        filter_menu_open = false;
        ui_side_svg.transition()
            .attr("transform", "translate(" +  (-sidebar_width*0.75) + " ,0)");
    }

}

        var allegiances = ["Arryn", "Baratheon", "Greyjoy", "Lannister", "Martell", "Night's Watch", "Stark", "Targaryen", "Tully", "Tyrell", "Wildling", "None"]
    
        var emblemX = sidebar_width/6;
        var emblemY = 170;
        var filters = g_filter.selectAll('.filters')
                                .data(allegiances)
                                .enter()
                                .append('g')
                                .attr('class', 'filters')
             filters.append("pattern")
                                .attr("id", (d,i) =>{
                                    return "pattern"+i})
                                .attr("width", 1)
                                .attr("height", 1)
                                .append("svg:image")
                                .attr("xlink:href",(d) => {
                                    return "assets/emblems/" + d +".PNG"
                                })
                                .attr("width", sidebar_width/10+"%")
            var selected_allegiances=[];
                filters
                    .append("circle")
                    .attr("class", "filter_circle")
                    .attr("stroke-width", "1px")
                    .attr("stroke", "black")
                    .attr('cx',(d,i)=>{
                            if(i%2 == 0)
                                return emblemX
                            else
                            return emblemX + 80
                        })
                    .attr('cy',(d,i)=>{
                        return emblemY + 70*(parseInt(i/2))})
                        .attr("r", sidebar_width*0.15)
                    .style("fill",  (d,i) =>{
                        return "url(#pattern"+i+")"})
                    .style("cursor", "pointer")
                    .on("mouseover",function(d){
                        d3.select(this)
                        .attr("stroke-width", "4px")
                        .attr("stroke", "#493521")
                    })
                    .on("mouseleave", function(e,d){
                        if(!selected_allegiances.includes(d)){
                        d3.select(this)
                        .attr("stroke-width", "1px")
                        .attr("stroke", "black")
                        }
                    })

                    .on("click", function(e,d){
                        if(!selected_allegiances.includes(d))
                            selected_allegiances.push(d)
                        else{
                            var index = selected_allegiances.indexOf(d);
                            if (index > -1) {
                                selected_allegiances.splice(index, 1);
                            }
                            d3.select(this)
                            .attr("stroke-width", "1px")
                            .attr("stroke", "black")
                        }
                        console.log(selected_allegiances)
                        updateMap(v1,v2,currview)
                    })
       
            filter_button
            .attr("cursor", "pointer")
            .on("click", display_filter_menu)

            var g_reset = g_filter.append("g")
                        .attr("cursor", "pointer")
                        .on("mouseover", function(d){
                            d3.select("#reset_rect")
                            .attr("stroke", "#493521")
                            .attr("stroke-width", "3px")})
                        .on("mouseleave", function(d){
                            d3.select("#reset_rect")
                            .attr("stroke-width", "1px")
                            .attr("stroke", "black")})
                            
            g_reset.append("rect")
                        .attr("id", "reset_rect")
                        .attr('width', 120)
                        .attr('height', 30)
                        .attr("x", sidebar_width/10)
                        .attr("y", sidebar_height*0.95)
                        .attr('stroke', 'black')
                        .attr('fill', 'white')
                         
            g_reset.append("text")
                        .attr("font-size","28px")
                        .attr("x", sidebar_width/4)
                        .attr("y", sidebar_height*0.95 +22)
                        .text("Reset")    
                        .attr("cursor", "pointer");     

            g_reset.on("click", ()=>{

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
                updateMap(v1,v2,currview)

            })
            

    

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
    
        emblems = create_emblems(svg);
    })
    .catch(function(err) {
        alert(err);
    });
   
    function create_emblems(map)
    {
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
            .on("click", click)
            
    
        
        emblems
            .append("circle")
            .attr("r", (d) => {
                if(d.length < 10)
                    return 10;
                return d.length*1.5
            })
            .attr("fill", "blue")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("opacity", 0.6)
            .attr('class', 'emblem')
            .style('width', "2%")
            .style("height", "auto")
            .attr("cursor", "pointer");
    
        map_image.on("click", function (e, d) { deselect_emblem(selected_emblem); 
        selected_emblem = null;  });
        return emblems
    
        function click(e, d)
        {
            emblem = d3.select(this)
            deselect_emblem(selected_emblem, d)
            selected_emblem = emblem;
            select_emblem(emblem, d)
            updateMap(v1, v2, currview);
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
            .join("line")
            .attr("class", "line_link")
    
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
            .attr('width', emblem_size + "%")
            // .attr("height", "3%")
            .attr('x', 0)
            .attr('y', 0)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        
        forceSimulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", tick)
    
        emblem.select(".emblem").attr("visibility", "hidden");
    
        return
    
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
        
         
    

    //-----------------------------//
    //  Emblems mouse functions   //
    // ---------------------------//



        function mouseover(d)
        {
            tooltip.style("visibility", "visible");
        }
    
        function mousemove(e, d)
        {
            d = d.data
            // console.log(d)
            
            var firstBook = ""
            if (d.GoT == 1) {
              firstBook += "A Game of Thrones "
            }
            else if (d.CoK == 1) {
              firstBook += "A Clash of Kings"
            }
            else if (d.SoS == 1) {
              firstBook += "A Storm of Swords"
            }
            else if (d.FfC == 1) {
              firstBook += "A Feast for Crows"
            }
            else if (d.DwD == 1) {
              firstBook += "A Dance with Dragons,"
            } else { 
              firstBook += "Opsie whoopsie! Something went fuckywucky (•ω•`)"}
            
            var lastBook = ""
            if (d.Book_of_Death == 1) {
              lastBook += "A Game of thrones"
            }
            else if (d.Book_of_Death == 2) {
              lastBook += "A Clash of Kings"
            }
            else if (d.Book_of_Death == 3) {
              lastBook += "A Storm of Swords"
            }
            else if (d.Book_of_Death == 4) {
              lastBook += "A Feast for Crows"
            }
            else if (d.Book_of_Death == 5) {
              lastBook += "A Dance with Dragons"
            } else { 
              lastBook += "(`•ω•) γʞɔυwγʞɔυʇ Ɉnǝw ϱniʜɈǝmoƧ !ǝiƨqooʜw ǝiƨqO"
            }
              tooltip
                  .style('top', e.clientY - 30 + 'px')
                  .style('left', e.clientX + 30 + 'px')
                  .html("<b>Name: </b>" + d.Name + "<br> <b> Allegiance: </b>" + d.Allegiances + "<br> <b> Year of death: </b>" + d.Death_Year + 
                  " AC <br><b> Death location: </b>" + d.Death_Location + "<br> <b>First appeared in: </b> " + firstBook+", chapter " + d.Book_Intro_Chapter + 
                  "<br> <b> Last appeared in: </b>" + lastBook + ", chapter " + d.Death_Chapter + "<br>")
        
        }
    
        function mouseleave(d)
        {
            tooltip.style("visibility", "hidden");
        }
    }
    
    function deselect_emblem(emblem)
    {
        if (emblem == null) return;
        forceSimulation.stop();
    
        emblem.select(".emblem")
        .attr("visibility", "visible")
        .attr("pointer-events", "all");
    
        emblem.selectAll(".popup").remove();
        // FIXME: remove the <g> tags
        emblem.selectAll(".lines").remove();
    }
    
    
    function updateMap(min, max, currview) {
        var filteredvalue;
           d3.selectAll(".popup")
               .filter((d) => {
               
                 if(currview==0)
                   filteredvalue= d.data.Timeline_Chapter_Death;
                 else
                   filteredvalue = d.data.Death_Year;
                if(selected_allegiances.length > 0)
                   return !selected_allegiances.includes(d.data.Allegiances) || filteredvalue < min || filteredvalue > max
               else
                   return filteredvalue < min || filteredvalue > max
               })
               .attr("visibility", "hidden")
               .attr("pointer-events", "none");
           d3.selectAll(".popup")
               .filter((d) => {
                   if(currview==0)
                       filteredvalue= d.data.Timeline_Chapter_Death
                    else
                       filteredvalue = d.data.Death_Year;
                       if(selected_allegiances.length > 0)
                        return selected_allegiances.includes(d.data.Allegiances)  && filteredvalue >= min && filteredvalue <= max;
                    else
                          return filteredvalue >= min && filteredvalue <= max;
               })
               .attr("visibility", "visible")
               .attr("pointer-events", "all");

               d3.selectAll(".line_link")
               .filter((d) => {
                 if(currview==0)
                   filteredvalue= d.target.data.Timeline_Chapter_Death;
                 else
                   filteredvalue = d.target.data.Death_Year;
                   if(selected_allegiances.length > 0)
                return !selected_allegiances.includes(d.target.data.Allegiances) || filteredvalue < min || filteredvalue > max
                    else   
                     return filteredvalue < min || filteredvalue > max

               })
               .attr("stroke-opacity", 0)

               d3.selectAll(".line_link")
               .filter((d) => {
                   if(currview==0)
                       filteredvalue= d.target.data.Timeline_Chapter_Death;
                    else
                       filteredvalue =  d.target.data.Death_Year;   
                    if(selected_allegiances.length > 0)
                        return selected_allegiances.includes(d.target.data.Allegiances) && filteredvalue >= min && filteredvalue <= max;
                    else
                        return filteredvalue >= min && filteredvalue <= max;
               
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
                    for(var i = 0 ; i<d.length; i++){
                        var person = d[i]; 
                        if(currview==0)
                        filteredvalue= d[i].Timeline_Chapter_Death;
                    else
                        filteredvalue = d[i].Death_Year;
                    if(((selected_allegiances.length > 0)&& (!selected_allegiances.includes(d[i].Allegiances) || filteredvalue < min || filteredvalue > max)) ||
                          (filteredvalue < min || filteredvalue > max)){
                            if(d[0].Death_Location in filtered_counter)
                                filtered_counter[d[i].Death_Location] += 1;
                            else
                                filtered_counter[d[i].Death_Location] = 1;
                          }
                    }
                    })
                    .attr("r", function(d){
                        if(d[0].Death_Location in filtered_counter){
                        num_dead_not_filtered = location_to_deaths[d[0].Death_Location].length - filtered_counter[d[0].Death_Location]
                        if(num_dead_not_filtered< 8)
                            return 8;
                        return num_dead_not_filtered*1.5
                        }
                        else
                            return d3.select(this).attr("r")
                    })
                    .filter(function(d) {
                        var location = d[0].Death_Location;
                        if(selected_emblem != null)
                            return filtered_counter[location] == location_to_deaths[location].length || selected_emblem.data()[0][0].Death_Location ==location
                        else
                             return filtered_counter[location] == location_to_deaths[location].length 
                        })
                .attr("visibility", "hidden")
                .attr("pointer-events", "none");

                d3.selectAll(".emblem")
                    .filter((d) => {
                        var location = d[0].Death_Location;
                        if(location in filtered_counter){
                            if(selected_emblem!=null )
                                return filtered_counter[location] < location_to_deaths[location].length && selected_emblem.data()[0][0].Death_Location !=location
                            else 
                            return filtered_counter[location] < location_to_deaths[location].length 
                            }    
                            else{
                                if(selected_emblem!=null)
                                    return selected_emblem.data()[0][0].Death_Location !=location;
                                else
                                  return true;
                            }
                    })

                .attr("visibility", "visible")
                .attr("pointer-events", "all");

    }


// ---------------------------//
//      Credits     button     //
// --------------------------//

const credits_button = g_slider.append("rect")
    .attr("id", "credits_selector_rect")
    .attr('width', bottombar_width/8)
    .attr('height', bottombar_height/3)
    .attr('stroke', 'black')
    .attr('fill', 'white')
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
        d3.select(this)
            .attr("stroke", "#493521")
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select(this)
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    })
    credits_button.attr("x", bottombar_width*0.82)
    .attr("y",40)

const credits_buttons_text = g_slider.append("text")
    .attr("x", bottombar_width*0.84)
    .attr("y",credits_button.attr("y")*1.7)
    .attr("font-size", (bottombar_height/5 + "px"))
    .attr("cursor", "pointer")
    .text("Credits");
    credits_buttons_text.on("click",  () => { g_credits.attr('visibility', 'visible')})
    .on("mouseover", function (d) {
        d3.select("#credits_selector_rect")
            .attr("stroke", "#493521")
            .attr("stroke-width", "3px")
    })
    .on("mouseleave", function (d) {
        d3.select("#credits_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    })
    credits_button.on("click", () => { g_credits.attr('visibility', 'visible')});

const g_credits = svg.append("g")
.attr("visibility", "hidden")
var credits_menu = g_credits.append("rect")
    .attr('height', height/1.5 )
    .attr('width', width/1.5)
    .attr('x', width/6)
    .attr('y', height/6)
    .attr('stroke', '#000000')
    .attr('stroke-width', 2)
    .attr('fill', 'rgba(194,176,149,0.8)')

g_credits.append("text")
    .attr('x',width/2)
    .attr('y', height/4.2)
    .attr('font-size', '40px')
    .attr('font-weight', 'bold')
    .attr("text-anchor", "middle")
    .text("Credits")

    g_credits.append("svg:image")
    .attr("xlink:href", "assets/close_button.png")
    .attr('x',width*0.18)
    .attr('y', height*0.18)
    .attr('width', "3.5%")
    .attr("cursor", "pointer")
    .on("click", () => { g_credits.attr('visibility', 'hidden')})
    
function showcredits() {
   
}