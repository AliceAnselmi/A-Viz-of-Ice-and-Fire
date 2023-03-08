map_img = "assets/speculative_map_cut.jpg"
slider_bg_img = "assets/slider_bg.png"
range_button_high_img = "assets/range_button_high.png"
range_button_low_img ="assets/range_button_low.png"
slider_books_bar_img = "assets/slider_bar_5.png"
slider_years_bar_img = "assets/slider_bar_4.png"
slider_info_bg_img = "assets/slider_info_bg.png"


//TODO: CENTER CURSOR IN HANDLE
    const width = window.innerWidth;
    const height = width

    const map_width = map_img.width;
    const map_height = map_img.height;

    const map_svg = d3.select("#main_svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 1000 1000")
    const g = map_svg.append("g")

    const map_image = g.append("svg:image")
        .attr("xlink:href", d => map_img)
        .style('width', "1000")
        .style("height", "1000")

    console.log(map_image._groups[0][0].width)

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

    // Slider
    const g_slider=g.append("g").attr("transform", "translate(0," + (height/1.25) + ")")
    var v1 = 0, v2 = 343;
    var sliderVals = [v1, v2];
    var views = ["Book", "Years"];
    var currview = 0; // 0 -> BOOKS, 1 -> YEARS
    const slider_imgs = []
    slider_imgs[0] = slider_books_bar_img;
    slider_imgs[1] = slider_years_bar_img;
  
    // Slider - infos

    function calculate_book_and_chapter(chapter_tot){
        let book, chapter;
        if(chapter_tot >=0 && chapter_tot <=72){
            book=1;
            chapter=chapter_tot;
        }
        else if(chapter_tot >=73 && chapter_tot <=142){
            book=2;
            chapter=chapter_tot-72;
        }
        else if(chapter_tot >=143 && chapter_tot <=224){
            book=3;
            chapter=chapter_tot-142;
        }
        else if(chapter_tot >=225 && chapter_tot <=271){
             book=4;
            chapter=chapter_tot-224;
        }
        else if(chapter_tot >=272 && chapter_tot <=343){
                book=5;
                chapter=chapter_tot-271;
            }
        return [book, chapter];
    }

    function update_slider_infos(v1,v2){
        slider_infos_text.text( 
            () =>{
                if(currview == 0)
                    return "Book " + calculate_book_and_chapter(v1)[0] + " Ch " + calculate_book_and_chapter(v1)[1] + " - Book " + calculate_book_and_chapter(v2)[0] + " Ch " + calculate_book_and_chapter(v2)[1];
                else
                    return "Years " +  v1 + " - " + v2;
                }
            )  
    }

    var slider_infos =g_slider.append('g')
      .attr("transform", "translate(" + width/3 +",0)")
    slider_infos.append("svg:image")
        .attr("xlink:href", d => slider_info_bg_img)
        .style("width", "40%")
        .style("height", "auto")
  

    var slider_infos_text = slider_infos.append("text")
            .attr("text-anchor", "middle")
              .attr("font-size","38px")
              .attr("x",width/5)
              .attr("y",height/38)
    update_slider_infos(sliderVals[0], sliderVals[1]);

    //brown slider background
    g_slider.append("svg:image")
        .attr("xlink:href", d => slider_bg_img)
        .style("width", "100%")
        .style("height", "auto")
        .attr('y', 60)

    // Slider - handles+bar
    const slider = g_slider.append("g")
    .attr("transform", "translate(" + width/3 +",90)")

    var slider_image= slider.append("svg:image")
        .attr("xlink:href", d => slider_imgs[currview] )
        .attr("transform", "translate(15,0)")
        .style("height", "1.5%")

    var x_slider = d3.scaleLinear()
        .domain([0, 343]) 
        .range([width/50,width/2.95])
        .clamp(true);

    var xMin = x_slider(0),
        xMax = x_slider(343)

    var range_button_imgs = []
    range_button_imgs[0] = range_button_low_img;
    range_button_imgs[1] = range_button_high_img;

    var selRange = slider.append("line")
            .attr("class", "sel-range")
            .style("stroke" , "#94C2ED")
             .attr("transform", "translate(0,"+ height/130+")")
            .style("opacity", 0.6)
            .style("stroke-width",  height/65+"px")
            .attr("x1", 20+x_slider(sliderVals[0]))
            .attr("x2", 20+x_slider(sliderVals[1]))
            
  
    var handle = slider.selectAll("rect")
        .data([0, 1])
        .enter().append("svg:image").attr("xlink:href", d => range_button_imgs[d])
        .attr("class", "handle")
        .attr("x", d => x_slider(sliderVals[d]))
        .attr('y', -25)
        .style("width", "5%")
        .style("height", "auto")
        .style("cursor", "pointer")
        .call(
            d3.drag()
            .on("start", startDrag)
            .on("drag", onDrag)
            .on("end", endDrag)
        );

    function startDrag() {
        d3.select(this).raise().classed("active", true);
    }

    function onDrag(event, d) {
        handle.attr("x, ")
        //positioning of button
        var x_cursor = event.x;
        var x_other_handle=x_slider(sliderVals[d==0?1:0])
      //handle overlap
      if(d==0){ //if lower handle
      if(x_cursor >= x_other_handle-40){
        x_cursor = x_other_handle
      }
      }else{ //otherwise
        if(x_cursor <= x_other_handle+40 ){
         x_cursor = x_other_handle
        }
      }

      if(x_cursor < xMin && x_cursor <= x_other_handle+40 )
        x_cursor= xMin;
      else if(x_cursor > xMax && x_cursor >= x_other_handle-40)
        x_cursor= xMax;

        d3.select(this).attr("x", x_cursor);
      
            selRange
             .attr("x1", 20+x_cursor)
              .attr("x2", 20+x_other_handle)
      var v= Math.round(x_slider.invert(x_cursor))
      if(d==0){ //if moving lower handle
        update_slider_infos(v, sliderVals[1]);
        v1 = Math.min(v, sliderVals[1]);
        v2 = Math.max(v, sliderVals[1]);

      }
    else{ //otherwise
        update_slider_infos(sliderVals[0], v);
        v1 = Math.min(sliderVals[0], v);
        v2 = Math.max(sliderVals[0], v);
    }
        updateMap(v1, v2, currview);
    }

    function endDrag(event, d) {
        var v;
       var x_cursor = event.x;
       var x_other_handle=x_slider(sliderVals[d==0?1:0])

      //handle overlap
      if(d == 0){ //if lower handle
      if(x_cursor >= x_other_handle-40 ){
          v=  sliderVals[1] //value of the other handle
        }else{
         v= Math.round(x_slider.invert(x_cursor))
        }
      }
      else{ //otherwise
      if(x_cursor <= x_other_handle+40 ){
          v= sliderVals[0] //value of the other handle
        }else{
         v= Math.round(x_slider.invert(x_cursor))
        }
        
      }
      sliderVals[d] = v
        v1 = Math.min(sliderVals[0], sliderVals[1]);
        v2 = Math.max(sliderVals[0], sliderVals[1]);
        
       
        d3.select(this)
            .classed("active", false)
            .attr("x", x_slider(v));

      selRange
             .attr("x1", 20+x_slider(v1))
              .attr("x2", 20+x_slider(v2))
      slider_infos_text.text(  views[currview] +" " + sliderVals[0]  + " - " +sliderVals[1])
      update_slider_infos(sliderVals[0], sliderVals[1]);
        updateMap(v1, v2, currview);
    }

   
    // View selector

    //ATTENTION: cannot append "select" element on observable, gotta use the Observable Inputs -> gotta change when hosting on webpage
   const view_selector = slider.append("rect")
                               .attr('width', 200)
                               .attr('height', 40)
                               .attr('stroke', 'black')
                               .attr('fill', 'white')
                               .attr("cursor", "pointer");      
    view_selector.attr("x", -width/5)
                 .attr("y", -height/120)        
  
    var slider_selector_text = slider.append("text")
          .attr("x",view_selector.attr("x")*0.9)
          .attr("y", -view_selector.attr("y"))
          .attr("font-size","25px")
          .attr("cursor", "pointer")
          .text(views[currview] + " view");
    slider_selector_text.on("click",updateView);
    view_selector.on("click", updateView);
  
    function updateView() {
        currview = 1-currview;
        slider_image.attr("xlink:href", d => slider_imgs[currview] )
       
        if(currview == 0){
            v1=0;
            v2=343;
            sliderVals=[v1,v2];
            x_slider = d3.scaleLinear()
                        .domain([0, 343]) 
                        .range([width/50,width/2.95])
                        .clamp(true);
            xMin = x_slider(0);
            xMax = x_slider(343);
        
            slider_image.attr("transform", "translate(10,0)")
            selRange.attr("x1", 20+x_slider(sliderVals[0]))
                    .attr("x2", 20+x_slider(sliderVals[1]))
            updateMap(v1, v2, currview);
        } else {
            v1=297;
            v2=300;
            sliderVals=[v1,v2];
            x_slider = d3.scaleLinear()
            .domain([297, 300]) 
            .range([width/15,width/3.22])
            .clamp(true);

            xMin = x_slider(297);
            xMax = x_slider(300);
            slider_image.attr("transform", "translate(90,0)")
            selRange
                .attr("x1", 20+x_slider(sliderVals[0]))
                .attr("x2", 20+x_slider(sliderVals[1]))
        
        }
        handle.attr("x", d => x_slider(sliderVals[d]))
        slider_selector_text.text(views[currview] + " view")
        update_slider_infos(sliderVals[0], sliderVals[1]);
        updateMap(v1, v2, currview);
      
    }

    // Zoom
    function handleZoom(e) {
        g.attr("transform", e.transform);
        g.attr("scale", e.scale);
    }
    console.log(map_width, map_height)
    let zoom = d3.zoom()
        .scaleExtent([0.8, 8])
        .translateExtent([[0,0], [1000, 1000]])
        .on("zoom", handleZoom)
    map_svg.call(zoom);

    function updateMap(v1, v2, currview) {
        let filteredvalue;
        d3.selectAll(".emblems")
            .filter((d) => {
                if(currview==0)
                    filteredvalue= d.Timeline_Chapter_Death
                else
                    filteredvalue = d.Death_Year
                return filteredvalue< v1 || filteredvalue > v2
            })
            .attr("opacity", 0);

        d3.selectAll(".emblems")
            .filter((d) => {
                if(currview==0)
                    filteredvalue= d.Timeline_Chapter_Death
                 else
                    filteredvalue = d.Death_Year
                return filteredvalue >= v1 && filteredvalue <= v2
            })
            .attr("opacity", 1);
    }

    // CSV FUNCTIONS
    Promise.all([
        d3.csv("data/character-deaths.csv"),
        d3.csv("data/locations-coordinates.csv"),
    ]).then(function(files) {
        // files[0] will contain file1.csv
        // files[1] will contain file2.csv
        const data = files[0];
        const coordinates = files[1];

        // Coordinates calculation

        function calculate_coordinates(x_perc, y_perc) {
            let x_img = x_perc * width;
            let y_img = y_perc * height;
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

        // Emblems
        var emblems = g.selectAll('.emblems')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('class', 'emblems')

        emblems.append("svg:image")
            .attr("xlink:href", (d) => {
                var allegiance = d.Allegiances
                return "assets/emblems/" + allegiance +".PNG"
            })
            .style('width', "1%")
            .style("height", "auto")
            .attr('x', (d) => {
                var coords = process_coordinates(d)
                var ranNum = Math.ceil(Math.random() * 12) * (Math.round(Math.random()) ? 1 : -1)
                return coords[0] + ranNum;
            })
            .attr('y', (d) => {
                var coords = process_coordinates(d)
                var ranNum = Math.ceil(Math.random() * 12) * (Math.round(Math.random()) ? 1 : -1)
                return coords[1] + ranNum;
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    }).catch(function(err) {
        // handle error here
        alert(err)
    })

    // Emblems mouse hover functions
    var mouseover = function(d) {
        d3.select(this.parentNode).raise();
        tooltip
            .style("visibility", "visible")
    }
    var mousemove = function(e, d) {
        tooltip
            .style('top', e.pageY - 20 + 'px')
            .style('left', e.pageX + 20 + 'px')
            .html("Name: " + d.Name + "<br> Year of death: " + d.Death_Year + " AC <br> Death location: " + d.Death_Location)
    }
    var mouseleave = function(d) {
        tooltip
            .style("visibility", "hidden")
    }


   