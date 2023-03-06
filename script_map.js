map_img = "assets/speculative_map_cut.jpg"
slider_bg_img = "assets/slider_bg.png"
range_button_high_img = "assets/range_button_high.png"
range_button_low_img ="assets/range_button_low.png"
slider_books_bar_img = "assets/slider_bar_6.png"
slider_years_bar_img = "assets/slider_bar_4.png"
slider_info_bg_img = "assets/slider_info_bg.png"
back_button_img = "assets/back_button.png"
forward_button_img = "assets/forward_button.png"



    const width = window.innerWidth;
    const height = window.innerHeight;


     
    const svg = create_mapview();
    var g;
 
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
        const g_slider=svg.append("g").style("position", "sticky")
          var v1 = 0, v2 = 343;
         var sliderVals = [v1, v2];
        var views = ["Book", "Years"];
        var currview = 0; // 0 -> BOOKS, 1 -> YEARS
        const slider_imgs = []
        slider_imgs[0] = slider_books_bar_img;
        slider_imgs[1] = slider_years_bar_img;



   // ---------------------------//
    //      Slider - infos        // 
    // --------------------------// 

    function calculate_book_and_chapter(chapter_tot){
        var book, chapter;
        if(chapter_tot >=0 && chapter_tot <=72){ 
            book=1;
            chapter=chapter_tot;
        }
        else if(chapter_tot >=73 && chapter_tot <=142){
            book=2;
            chapter=chapter_tot-73;
        }
        else if(chapter_tot >=143 && chapter_tot <=224){
            book=3;
            chapter=chapter_tot-143;
        }
        else if(chapter_tot >=225 && chapter_tot <=271){ 
             book=4;
            chapter=chapter_tot-225;
        }
        else if(chapter_tot >=272 && chapter_tot <=343){ 
                book=5;
                chapter=chapter_tot-272;
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
      .attr("transform", "translate(" + width/3 +"," + (height- 140)+")")
    slider_infos.append("svg:image")
        .attr("xlink:href", d => slider_info_bg_img)
        .style("width", "40%")
        .style("height", "auto")
  

   var slider_infos_text = slider_infos.append("text")
            .attr("text-anchor", "middle")
              .attr("font-size","38px")
              .attr("x",width/5)
              .attr('y', 40)
   update_slider_infos(sliderVals[0], sliderVals[1]);
             
            
   
            
        //brown slider background
        g_slider.append("svg:image")
        .attr("xlink:href", d => slider_bg_img)
        .style("width", "100%")
        .style("height", "auto")
        .attr('y', height-80)
    // ---------------------------//
    //      Slider - buttons      // 
    // --------------------------// 

var slider_button = g_slider.selectAll("rect")
        .data([0, 1])
        .enter().append("svg:image")
    .attr("xlink:href", d => d==0?back_button_img:forward_button_img)
    .style("width", "3%")
    .style("height", "auto")
    .attr("x",d => width/1.2+ d*60)
    .attr('y', height-60)
    .attr("cursor", "pointer")
    .on("click", (e,d) => {move_handle_one_tick(e,d)})

    var move_handle_one_tick= function(e,d){
            if(clickedhandle!=null){
           //positioning of button
           var x_handle = x_slider(sliderVals[clickedhandle==0?0:1]);
           
           var curr_value= Math.round(x_slider.invert(x_handle));
           var new_value = curr_value + (d==0?-1:1);
           if(new_value >= x_slider.domain()[0] && new_value <= x_slider.domain()[1]){
           x_handle= x_slider(new_value)       
           var x_other_handle=x_slider(sliderVals[clickedhandle==0?1:0])
         //handle overlap
         if(clickedhandle==0){ //if lower handle
         if(x_handle >= x_other_handle-40){
            x_handle = x_other_handle
         }
         }else{ //otherwise
           if(x_handle <= x_other_handle+40 ){
            x_handle = x_other_handle
           }
         }
   

         if(x_handle < xMin && x_handle <= x_other_handle+40 )
             x_handle= xMin;
         else if(x_handle > xMax && x_handle >= x_other_handle-40)
             x_handle= xMax;

         d3.selectAll(".handle"+clickedhandle).attr("x", x_handle-30)
   
        selRange
        .attr("x1",x_handle)
            .attr("x2", x_other_handle)
         sliderVals[clickedhandle] = new_value
         if(clickedhandle==0){ //if moving lower handle
           update_slider_infos(new_value, sliderVals[1]);
           v1 = Math.min(new_value, sliderVals[1]);
           v2 = Math.max(new_value, sliderVals[1]);
   
         }
       else{ //otherwise
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
    const slider = g_slider.append("g")
    .attr("transform", "translate(" + width/3 +"," + (height-50) + ")")
        

   var slider_image= slider.append("svg:image")
        .attr("xlink:href", d => slider_imgs[currview] )
        .attr("transform", "translate(-70,0)")
        .style("height", "3%")



    var x_slider = d3.scaleLinear()
        .domain([0, 343]) 
        .range([-width/30+30,width/2.61+30])
        .clamp(true);
    var xMin = x_slider(0),
        xMax = x_slider(343)

    var range_button_imgs = []
    range_button_imgs[0] = range_button_low_img;
    range_button_imgs[1] = range_button_high_img;

    // 1 -> GOT -> #0066cc
    // 2 -> COK -> #ffcc00
    // 3 -> SOS -> #34933f
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
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });


    var selRange = slider.append("line")
            .data(x_slider.range())
            .attr("class", "sel-range")
            .style("stroke", "url(#linear-gradient)")
            .attr("transform", "translate(0,12)")
            .style("opacity", 0.6)
            .style("stroke-width",  height/32+"px")
            .attr("x1", x_slider(sliderVals[0]))
            .attr("x2", x_slider(sliderVals[1]))
            

    var clickedhandle;
    var clickedhandle_node;
    var handle = slider.selectAll("rect")
        .data([0, 1])
        .enter().append("svg:image").attr("xlink:href", d => range_button_imgs[d])
        .attr("class", d=> "handle"+d)
        .attr("x", d => x_slider(sliderVals[d])-30)
        .attr('y',-25)
        .style("width", "4.5%")
        .style("height", "auto")
        .style("cursor", "pointer")
        .on("click", (e,d)=> {
            clickedhandle == d ? clickedhandle = null : clickedhandle = d;

        })
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

        d3.select(this).attr("x", x_cursor-30)

            selRange
             .attr("x1",x_cursor)
              .attr("x2", x_other_handle)
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
            .attr("x", x_slider(v)-30)
            .style("cursor", "pointer")

      selRange
             .attr("x1", x_slider(v1))
              .attr("x2", x_slider(v2))
      slider_infos_text.text(  views[currview] +" " + sliderVals[0]  + " - " +sliderVals[1])
      update_slider_infos(sliderVals[0], sliderVals[1]);
        updateMap(v1, v2, currview);

    }

   
    // ---------------------------//
    //      View     selector     // 
    // --------------------------// 

    //ATTENTION: cannot append "select" element on observable, gotta use the Observable Inputs -> gotta change when hosting on webpage
   const view_selector = slider.append("rect")
                            .attr("id", "view_selector_rect")
                            .attr('width', 200)
                              .attr('height', 40)
                              .attr('stroke', 'black')
                              .attr('fill', 'white')
                              .attr("cursor", "pointer")
                              .on("mouseover", function(d){
                                d3.select(this)
                                .attr("stroke", "#493521")
                                .attr("stroke-width", "3px")})
                            .on("mouseleave", function(d){
                                d3.select(this)
                                .attr("stroke-width", "1px")
                                .attr("stroke", "black")})    
    view_selector.attr("x", -width/5)
                    .attr("y", -15)        
  
    var slider_selector_text = slider.append("text")
          .attr("x",view_selector.attr("x")*0.9)
          .attr("y", -view_selector.attr("y"))
          .attr("font-size","25px")
          .attr("cursor", "pointer")
          .text(views[currview] + " view");
        slider_selector_text.on("click",updateView)
        .on("mouseover", function(d){
            d3.select("#view_selector_rect")
            .attr("stroke", "#493521")
            .attr("stroke-width", "3px")})
        .on("mouseleave", function(d){
            d3.select("#view_selector_rect")
            .attr("stroke-width", "1px")
            .attr("stroke", "black")})    
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
         .range([-width/30+30,width/2.61+30])
         .clamp(true);
        xMin = x_slider(0);
        xMax = x_slider(343);
       
          slider_image.attr("transform", "translate(-85,0)")
          selRange.style("stroke", "url(#linear-gradient)")
        
      }
      else{
        v1=297;
        v2=300;
        sliderVals=[v1,v2];
        x_slider = d3.scaleLinear()
        .domain([297, 300]) 
        .range([width/15+10,width/3.22+10])
        .clamp(true);

        xMin = x_slider(297);
        xMax = x_slider(300);
        slider_image.attr("transform", "translate(80,0)")
        selRange.style("stroke", "#94C2ED")
      }
      selRange
        .attr("x1", x_slider(sliderVals[0]))
        .attr("x2", x_slider(sliderVals[1]))
     
       handle.attr("x", d => x_slider(sliderVals[d])-30)
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


        const g_filter = svg.append("g").style("position", "sticky")


        var filter_menu = g_filter.append("svg:image")
            .attr("xlink:href", "assets/menu_rect.png")
            .style('width', "12%")
            .style("height", "auto")
            .attr('x',-200)
            .attr("y",20)

        
        var filter_button=g_filter.append("svg:image")
            .attr("xlink:href", "assets/allegiance_button.png")
            .style('width', "5%")
            .style("height", "auto")
            .attr('x',0)
            .attr("y",20)
            

        g_filter.append("text")
        .attr("font-size","33px")
        .attr("x",-140)
        .attr("y",80)
        .html("Filter by")
        g_filter.append("text")
        .attr("font-size","33px")
        .attr("x",-120)
        .attr("y",120)
        .html("house")

         var filter_menu_open = false;
        var display_filter_menu = function(d) {
        if(filter_menu_open == false){
         filter_menu_open = true;

        g_filter.transition()
        .attr("transform","translate(150,0)");
        }

        else{
            filter_menu_open = false;
            g_filter.transition()
            .attr("transform","translate(0,0)");
            }
         
        }

        var allegiances = ["Arryn", "Baratheon", "Greyjoy", "Lannister", "Martell", "Night's Watch", "Stark", "Targaryen", "Tully", "Tyrell", "Wildling", "None"]
    
        var emblemX=-115;
        var emblemY=height/20 + 150;
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
                                .attr("width", "3.7%")
                                .attr("x", -1.2)
                                .attr("y", -1.5)
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
                                return emblemX +80
                        })
                    .attr('cy',(d,i)=>{
                        return emblemY + 65*(parseInt(i/2))})
                    .attr("r", 30)
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

                    .on("click", (e,d) => {
                        if(!selected_allegiances.includes(d))
                            selected_allegiances.push(d)
                        console.log(selected_allegiances)
                        updateMap(v1,v2,currview)})
       
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
                        .attr("x",-140)
                        .attr("y",height/20 + 550)
                        .attr('stroke', 'black')
                        .attr('fill', 'white')
                         
            g_reset.append("text")
                        .attr("font-size","28px")
                        .attr("x",-110)
                        .attr("y",height/20 + 575)
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
    
        console.log(location_to_deaths)
        // FIXME: Make a parent element to all emblems
        const emblems = emblem_g.selectAll('.emblem')
            .data(Object.values(location_to_deaths))
            .join('g')
            .attr('transform', (d) => {
               
                let coord = place_to_coordinate[d[0].Death_Location];
                return `translate(${coord.x_pixels},${coord.y_pixels})`
            })
            .on("click", click)
            
    
        
        emblems
            .append('svg:image')
            .attr('class', 'emblem')
            .attr("xlink:href", (d) => {
                // console.log(d[0].Allegiances)
                // FIXME: We want to display all allegiances here...
                var allegiance = d[0].Allegiances;
                //var allegiance = d.Allegiances
                return "assets/emblems/" + allegiance +".PNG"
            })
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
            .attr('width', "3%")
            .attr("height", "3%")
            .attr('x', 0)
            .attr('y', 0)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);
        
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



    var mouseclick = function(e,d) {

        //tooltip's position is now fixed
       
    }

        function mouseover(d)
        {
            // What odes this do?
            d3.select(this.parentNode).raise();
            tooltip.style("visibility", "visible");
        }
    
        function mousemove(e, d)
        {
            d = d.data
            // console.log(d)
            
            var firstBook = ""
            if (d.GoT == 1) {
              firstBook += "Game of thrones, chapter "
            }
            else if (d.CoK == 1) {
              firstBook += "A Clash of Kings, chapter "
            }
            else if (d.SoS == 1) {
              firstBook += "A Storm of Swords, chapter "
            }
            else if (d.FfC == 1) {
              firstBook += "A Feast for Crows, chapter "
            }
            else if (d.DwD == 1) {
              firstBook += "A Dance with Dragons, chapter "
            } else { 
              firstBook += "Opsie whoopsie! Something went fuckywucky (•ω•`)"}
            
            var lastBook = ""
            if (d.Book_of_Death == 1) {
              lastBook += "Game of thrones"
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
                  .style('top', e.clientY - 20 + 'px')
                  .style('left', e.clientX + 20 + 'px')
                  .html("Name: " + d.Name + "<br> Allegiance: " + d.Allegiances + "<br> Year of death: " + d.Death_Year + " AC <br> Death location: " + d.Death_Location + "<br> First appeared in " + firstBook + d.Book_Intro_Chapter + "<br> Last appeared in " + lastBook + ", chapter " + d.Death_Chapter + "<br>")
         
        
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
    
        emblem.select(".emblem").attr("visibility", "visible")
    
        emblem.selectAll(".popup").remove();
        // FIXME: remove the <g> tags
        emblem.selectAll(".lines").remove();
    }
    
    // This function takes care of filtering the elements that are visible
    function update_timeperiod(emblems)
    {
    
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
   
       }


     // ---------------------------//
    //     Credits Menu           //
    // --------------------------// 
   var g_credits = svg.append("g")
    var credits_button = g_credits.style("position", "sticky").append("svg:image")
    .attr("xlink:href", "assets/credits_menu_button.png")
    .style("position", "sticky")
            .style('width', "4%")
            .style("height", "auto")
            .attr('x',width-150)
            .attr('y',  height/20)
            .style("position", "sticky")
            .style("cursor", "pointer")
            .on("click", ()=> {display_credits_menu()})

    var credits_rect = g_credits.append("svg:image")
    .attr("xlink:href", "assets/menu_rect.png")
    .attr("class", "credits_menu")
    .style('width', "12%")
    .style("height", "auto")
    .attr('x',width)
    .attr('y', height/20)
    
    g_credits.append("svg:image")
    .attr("xlink:href", "assets/credits_menu_close_button.png")
    .attr("class", "credits_menu")
    .style('width', "4%")
    .style("height", "auto")
    .attr('x',width)
    .attr('y', height/20)
    .style("cursor", "pointer")
    .on("click", ()=> {display_credits_menu()})

    g_credits.append("text")
    .attr("class", "credits_menu")
        .attr("font-size","33px")
        .attr("x",width+20)
        .attr("y",height/20+120)
        .text("Instructions")
    
    g_credits.append("text")
    .attr("class", "credits_menu")
        .attr("font-size","33px")
        .attr("x",width+20)
        .attr("y",height/20+600)
        .text("Credits")

    var credits_menu_open = false;
    var display_credits_menu = function(d) {
    if(credits_menu_open == false){
        credits_menu_open = true;
    d3.selectAll(".credits_menu")
        .transition()
        .attr("transform","translate(-200,0)");
    }

    else{
        credits_menu_open = false;
        d3.selectAll(".credits_menu")
            .transition()
            .attr("transform","translate(0,0)");

        }
     
    }

