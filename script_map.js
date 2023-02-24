map_img = "https://static.observableusercontent.com/files/ff39fb0c36250ff304094b5054737ce4090a69ebbe50b6e63f4241d091303d68954886aca98b556b93c77ca16dcdb6838b30255b4eb18237d0ccee2b66fe2b02"
slider_bg_img = "https://static.observableusercontent.com/files/87f1a6ba97f3bf7363485948ba3a49c537049241fd269d6208296969f3c5f4bc9996501240cb749e4f989496a6da0025e7dc5fb09fd58aca3ca561442b67ada2"
img_url = "https://static.observableusercontent.com/files/011fa531b2a084ac483f14c59d1206bb2100b5e1a32f497c304a7abd6b2764f7ccc1aca4ab4f5df7e8fd1d3fefc11bfa45d9d2bb9dcaf8bdb50c10d32f9232ae"
range_button_high_img = "https://static.observableusercontent.com/files/f0d26a3e7acd3cf496dd4654302f2349d123375919c97745370673add5c9bdd0dbe9264b3291719643c83a7d4924bad32bbe8a553d90817be375c91223d64411"
range_button_low_img = "https://static.observableusercontent.com/files/400f43d492aaa54f21fdcc5fbf3ee54461f1015db6fdee2746c292d7551d6cad85b80e3485c8323773477afb73a1365d6514c11599dae2ed9cd5272c51545d09"
slider_books_bar_img = "https://static.observableusercontent.com/files/dcbc61b413efeb432ca3f2ad113073a5449a43ba0381a2249b0be1aaa1fc6fb682c7b1c724d72ebc616afffbd852877f21e92e50d5943583e291b74c4bc4b9fd"
slider_years_bar_img = "https://static.observableusercontent.com/files/4fa24e56387b03eef4e3b04db5219bc0211bf2b822d3da0c6e1542cc3c98edd00576e12e1b1ada68c10e27f1dd754a9df0e8596d2c52cff9479c0140aaba6262"
slider_info_bg_img = "https://static.observableusercontent.com/files/b1350498da5c2eee490ca98d9e4e6d09e0ca93468d0cec7f4b82aa9d73afebc254ed325e86a879ab9c7c07c881f5d987d75278444d98ddad9cd52224e69427e5"







    const width = 1800;
    const height = 1800;
    const svg = d3.select("#main_svg")
    const g = svg.append("g")


    //APPEND MAP
    g.append("svg:image")
        .attr("xlink:href", d => map_img)
        .style("width", "100%")
        .style("height", "auto")





    // ---------------------------//
    //       Tooltip              //
    // ---------------------------//
    const tooltip = d3.select("body").append("div")
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
          var v1 = 1, v2 = 5;
         var sliderVals = [v1, v2];
        var views = ["Books", "Years"];
        var currview = 0; // 0 -> BOOKS, 1 -> YEARS
        const slider_imgs = []
        slider_imgs[0] = slider_books_bar_img;
        slider_imgs[1] = slider_years_bar_img;
      
  
   // ---------------------------//
    //      Slider - infos        // 
    // --------------------------// 

    const slider_infos =g.append('g')
      .attr("transform", "translate(530," + (height - 370) + ")")
    slider_infos.append("svg:image")
        .attr("xlink:href", d => slider_info_bg_img)
        .style("width", "40%")
        .style("height", "auto")
  //WIP
   var slider_infos_text = slider_infos.append("text")
            .attr("text-anchor", "middle")
              .attr("font-size","40px")
              .attr("x", 380) //use getBBox later, now static
              .attr("y", 45)
             .text( views[currview] +" "+sliderVals[0]  + " - " +sliderVals[1])

    

    //brown slider background
    g.append("svg:image")
        .attr("xlink:href", d => slider_bg_img)
        .style("width", "100%")
        .style("height", "auto")
        .attr('y', height - 305)

  // ----------------------------//
    //  Slider - handles+bar     // 
    // --------------------------// 
    const slider = g.append("g")
        .attr("transform", "translate(530," + (height - 280) + ")")

   var slider_image= slider.append("svg:image")
        .attr("xlink:href", d => slider_imgs[currview] )
        .attr("transform", "translate(10,0)")
        .style("height", "1.5%")


      
    var x_slider = d3.scaleLinear()
        .domain([1, 5]) //TODO: find a way to make the domain dynamic
        .range([10, 615]) //<- OBSERVABLE doesn't allow to compute getBBox for an element before it is rendered, so i just used numbers
        .clamp(true);
    var xMin = x_slider(1),
        xMax = x_slider(5)

    var range_button_imgs = []
    range_button_imgs[0] = range_button_low_img;
    range_button_imgs[1] = range_button_high_img;

    var selRange = slider.append("line")
            .attr("class", "sel-range")
            .style("stroke" , "#94C2ED")
             .attr("transform", "translate(0, 14)")
            .style("opacity", 0.6)
            .style("stroke-width",  "29px")
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
      if(d==0){
        slider_infos_text.text(  views[currview] +" "+ v  + " - " +sliderVals[1])
      }else{
        slider_infos_text.text( views[currview] +" "+ sliderVals[0]  + " - " +v)
      }
      
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
        updateMap(v1, v2, currview);
    }

   
    // ---------------------------//
    //      Slider - selector     // 
    // --------------------------// 

    //ATTENTION: cannot append "select" element on observable, gotta use the Observable Inputs -> gotta change when hosting on webpage
   const slider_selector = slider.append("rect")
                            .attr("x", -450)
                            .attr('width', 200)
                              .attr('height', 40)
                              .attr('stroke', 'black')
                              .attr('fill', 'white')
                              .attr("cursor", "pointer");              
  
    var slider_selector_text = slider.append("text")
          .attr("x", -360)
          .attr("y", 25)
          .attr("text-anchor", "middle")
          .attr("font-size","25px")
          .attr("cursor", "pointer")
          .text(views[currview] + " view");
        slider_selector_text.on("click", () => {updateView()});
        slider_selector.on("click", () => {updateView()});
  
    function updateView() {
        currview = 1-currview;
      slider_image.attr("xlink:href", d => slider_imgs[currview] )
       
     
      if(currview == 0){
        v1=1;
        v2=5;
        sliderVals=[v1,v2];
         x_slider = d3.scaleLinear()
        .domain([1, 5]) //TODO: find a way to make the domain dynamic
        .range([10, 615]) //<- OBSERVABLE doesn't allow to compute getBBox for an element before it is rendered, so i just used numbers
        .clamp(true);
        xMin = x_slider(1);
        xMax = x_slider(5);
       
          slider_image.attr("transform", "translate(10,0)")
        selRange
            .attr("x1", 20+x_slider(sliderVals[0]))
            .attr("x2", 20+x_slider(sliderVals[1]))
      }
      else{
        v1=297;
        v2=300;
        sliderVals=[v1,v2];
        x_slider = d3.scaleLinear()
        .domain([297, 300]) //TODO: find a way to make the domain dynamic
        .range([100, 550]) //<- OBSERVABLE doesn't allow to compute getBBox for an element before it is rendered, so i just used numbers
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
      slider_infos_text.text( views[currview] +" "+ sliderVals[0]  + " - " +sliderVals[1])
      

      
    }

    //-----------------------------//
    //Circles mouse hover functions//
    // ---------------------------//
    var mouseover = function(d) {
        d3.select(this).attr('stroke', 'red')
        tooltip
            .style("visibility", "visible")
    }
    var mousemove = function(e, d) {
        tooltip
            .style('top', e.clientY - 20 + 'px')
            .style('left', e.clientX + 20 + 'px')
            .html("Name: " + d.Name + "<br> Year of death: " + d.Death_Year + " AC <br> Death location: " + d.Death_Location)
    }
    var mouseleave = function(d) {
        d3.select(this).attr('stroke', 'black')
        tooltip
            .style("visibility", "hidden")
    }

    // ---------------------------//
    //            Zoom           //
    // --------------------------// 
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    function zoomed(event) {
        const {
            transform
        } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }

    svg.call(zoom);


    function updateMap(v1, v2, currview) {
     var filteredvalue;
        d3.selectAll(".circles")
            .filter((d) => {
              if(currview==0)
                filteredvalue= d.Book_of_Death 
              else
                filteredvalue = d.Death_Year
                  return filteredvalue< v1 || filteredvalue > v2
            })
            .attr("opacity", 0);

        d3.selectAll(".circles")
            .filter((d) => {
                if(currview==0)
                    filteredvalue= d.Book_of_Death 
                 else
                    filteredvalue = d.Death_Year
                return filteredvalue >= v1 && filteredvalue <= v2
            })
            .attr("opacity", 1);

    }



    //CSV FUNCTIONS
    Promise.all([
        d3.csv("data/character-deaths.csv"),
        d3.csv("data/locations-coordinates.csv"),
    ]).then(function(files) {
        // files[0] will contain file1.csv
        // files[1] will contain file2.csv
        const data = files[0];
        const coordinates = files[1];


        
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
    //           Circles         //
    // --------------------------// 
    
    var circles = g.selectAll('.circles')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'circles')

//CREATE THE CIRCLE
var cxdef = 450
var cydef = 980
circles.append('circle')
    .attr('cx', (d, i) => {
        var coords = process_coordinates(d)
        var ranNum = Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1)
        return coords[0] + ranNum;
    })
    .attr('cy', (d, i) => {
        var coords = process_coordinates(d)
        var ranNum = Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1)
        return coords[1] + ranNum;
    })
    .attr('r', 5)
    .attr('stroke', 'black')
    .style("fill", "red")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    }).catch(function(err) {
        // handle error here
        console.log(err)
    })


   