    $( document ).ready(function() {
    var smoothTiny = 0.08;
    //var totalPoints = 1000; var tickTime = 2;//seconds
    var totalPoints = 2000; var tickTime = 2;//seconds


    var lastA;
    var totalColors = 1000;
    var divColorsHeigth =1250;
    var countPoints =0;

    var video = document.getElementById('trackingvideo');
    var trkcanvas = document.getElementById('trackingcanvas');
    var context = trkcanvas.getContext('2d');



    var numAreas = 5;
    var unitSize = 16; // width (and height) of one square
    //var unitsTall = 2; // number of squares along y-axis
    var unitsTall = divColorsHeigth/totalColors; // number of squares along y-axis
    var unitsWide = 150/numAreas; // number of squares along x-axis

    var scale =1;
    var ax=50*scale; ay=80*scale; aw=20*scale;ah=20*scale;dx=110*scale;dy=0*scale;
    var areas = new Array(numAreas);
    var counts= new Array(numAreas);

    for (var i=0; i<numAreas; i++){
      areas[i] = new Array(4);
      areas[i]=[ax,ay,aw,ah];
      //console.log(areas[i]);
      ax = ax + dx;

      counts[i] = {};

      $("#divLabel").append("<div class=aLabel id=label" + i + ">L"+i+"</div>");
      $("#divLabel").append("<div class=aCor id=cor" + i + ">L"+i+"</div><p>");
    }
    //teste de área de controle branca
    //areas[3]=[50,ay,aw,ah];

    var now;
    var timeStart = ((new Date()).getTime());
    var dataToPlot=new Array(1);
    var dataToPlotLabel =new Array(1);
    for (var j=0; j<numAreas; j++){
      dataToPlot[j] = new Array();
      dataToPlotLabel[j]="";
    }
    var incomingData;


        //plot.draw();
    function drawAreas(){
      context.strokeStyle = "#000000";
      for (var i=0;i<numAreas;i++){
        context.strokeRect(areas[i][0], areas[i][1], areas[i][2], areas[i][3]);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText('i: ' + i , areas[i][0], areas[i][1]);
      }
    }
      
    var divImage = document.getElementById('divImage');

    var colorThief = new ColorThief();
    var newImage = new Image();

    $( "#start").click( function(){
      console.log("Start");
      timeStart = ((new Date()).getTime());
      counts= new Array(numAreas);
      for (var i=0; i<numAreas; i++){
        counts[i] = {};
      }
      for (var j=0; j<numAreas; j++){
        dataToPlot[j] = new Array();
        dataToPlotLabel[j]="";
      }
      $("#divColors").text("");
    });
    var refreshColors = setInterval( function()  {
      context.drawImage( video, 0, 0, trkcanvas.width, trkcanvas.height);
      newImage.src = trkcanvas.toDataURL("image/png");  
      var dataURL = trkcanvas.toDataURL();
      divImage.setAttribute('src',dataURL);
    }, tickTime * 1000);

    divImage.onload = function() {
          var colorThief = new ColorThief();
          var dominantColor = colorThief.getColor(divImage);
          console.log("full:"+dominantColor);
          now = ((new Date()).getTime());

          for (var i=0;i<numAreas;i++){
            var area = {
              'startx': areas[i][0],
              'starty': areas[i][1],
              'width':  areas[i][2],
              'height': areas[i][3]
            };
            console.log("passing: "+area.startx);

            var dominantColor = colorThief.getColor(divImage,8,area);
            console.log("area :"+i+" "+dominantColor);
            var myColor = one.color('rgb('+dominantColor[0]+','+dominantColor[1]+','+dominantColor[2]+')');
            $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',
                width: unitsWide/2 -2,
                height: unitsTall,
                'background-color': myColor.css()
            }).appendTo(divColors);
            //looking for color name

            var myColor2 = one.color('hsv('+360 * myColor.hue()+','+75+','+100+')')
            $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',
                width: unitsWide/2 -2,
                height: unitsTall,
                'background-color': myColor2.css()
            }).appendTo(divColors);
                        $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',
                width: 4,
                height: unitsTall,
                'background-color': '#ffffff'
            }).appendTo(divColors);
            //console.log(myColor.css());

            //http://stackoverflow.com/questions/3760506/smoothing-values-over-time-moving-average-or-something-better
            //a(i+1) = tiny*data(i+1) + (1.0-tiny)*a(i)
            var newData = myColor.hue();
            var length = dataToPlot[i].length;
            //console.log("length:"+length);
            if (length <= 0){
              dataToPlot[i].push([(now-timeStart)/1000, myColor.hue() ]);
              lastA = myColor.hue();
            }else{
        //console.log("d:"+ dataToPlot[i][length -1]);
        var lastA = dataToPlot[i][length -1];

        //console.log("length:"+length+ " lastA:"+ lastA[1]);
        var nextA = (smoothTiny * newData) + ((1.0 - smoothTiny) * lastA[1]);
        //console.log ("lastA:"+ lastA[1] +" newData:"+ newData +" nextA:"+nextA);
        //lastA = nextA;
        dataToPlot[i].push([(now-timeStart)/1000, nextA ]);
        //dataToPlot[i].push([now, myColor.hue() ]);
        var angulo = nextA * 360;
        var angulo_cor = "";
        var faixaCor =0;
        if (angulo < 10)  { angulo_cor = "Red";       } else{faixaCor++;
        if (angulo < 20)  {   angulo_cor = "Red-Orange";    } else{faixaCor++;
        if (angulo < 40)  {   angulo_cor = "Orange-Brown";    } else{faixaCor++;
        if (angulo < 50)  {   angulo_cor = "Orange-Yellow";   } else{faixaCor++;
        if (angulo < 60)  {   angulo_cor = "Yellow";      } else{faixaCor++;
        if (angulo < 80)  { angulo_cor = "Yellow-Green";    } else{faixaCor++;
        if (angulo < 140)   { angulo_cor = "Green";       } else{faixaCor++;
        if (angulo < 169)   { angulo_cor = "Green-Cyan";    } else{faixaCor++;
        if (angulo < 200)   { angulo_cor = "Cyan";        } else{faixaCor++;
        if (angulo < 220)   { angulo_cor = "Cyan-Blue";     } else{faixaCor++;
        if (angulo < 240)   { angulo_cor = "Blue";        } else{faixaCor++;
        if (angulo < 280)   { angulo_cor = "Blue-Magenta";    } else{faixaCor++;
        if (angulo < 320)   { angulo_cor = "Magenta";     } else{faixaCor++;
        if (angulo < 330)   { angulo_cor = "Magenta-Pink";    } else{faixaCor++;
        if (angulo < 345)   { angulo_cor = "Pink";        } else{faixaCor++;
        if (angulo < 355)   { angulo_cor = "Pink-Red";      } else{faixaCor++;
                  { angulo_cor = "Red"; faixaCor=0; }
        }}}}}}}}}}}}}}}};

        //counts[i][angulo_cor] = counts[i][angulo_cor] ? counts[i][angulo_cor]+1 : 1;
        //counts[i][angulo_cor] = now;
        var seconds = (now - timeStart)/1000;

        counts[i][angulo_cor] = seconds;

        var strLabel = 'label'+i;
        var strCor = 'cor'+i;
        var h1 = myColor.hue() *360;
        var s1 = myColor.saturation() *100;
        var v1 = myColor.value() *100;

        var n1 ="-";
        $.each( colorName, function(key, value){
          //console.log(key + value);
          if(myColor.equals(one.color(value),0.1) ){
            n1 = key;
          }
        });


        var origColor = "["+ h1.toFixed(0) +","+s1.toFixed(0)+","+v1.toFixed(0)+"] "+n1;
        //var origColor = n1;
        $('#'+strLabel).html("</br>"+origColor+"</br>"+"["+angulo.toFixed(0) + "] "+ angulo_cor);

        var str="";
        $.each( counts[i], function(i, n){
            //alert( "Name: " + i + ", Value: " + n );
            var hrs  = Math.floor(n/3600);
          var mins = Math.floor((n - (hrs * 3600))/60);
          var secs = n - ( hrs *3600) - (mins *60);
          ret = "";
          if (hrs > 0)
              ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
          ret += "" + mins + ":" + (secs < 10 ? "0" : "");
          ret += "" + secs.toFixed(0);
            str = str + ret + "s " + i +"</br>";
        });
  
        $('#'+strCor).html(str);

            }
            dataToPlotLabel[i] = "A:"+ i;
            if(dataToPlot[i].length>totalPoints){//dataToPlot[i].push([now, nextA ]);
        dataToPlot[i] = dataToPlot[i].splice(1,totalPoints);
            }
          }
      countPoints++;
            if(countPoints>totalColors){
              $("#divColors").empty();
        countPoints =0;
      }
          var gradiente=0, tickAxis=0;
          var gradienteNum = 20;
          var gradienteStep =gradienteNum / gradienteNum;
          var gAngle = 360/gradienteNum;
          var gSat = 75;
          var gLigth =50;
          var faixaNames = [
            [0,10],  //1-red
            [10,20], //2-red-orange
            [20,40], //3-orange-brown
            [40,50], //4-orange-yellow
            [50,60], //5-yellow
            [60,80], //6-yellow-green
            [80,140],//7-green
            [140,169],
            [169,200],
            [200,220],
            [220,240],
            [240,280],
            [280,320],
            [320,330],
            [330,345],
            [345,355],
            [355,360],
          ];
  
          incomingData=[
              { data: dataToPlot[0], label:dataToPlotLabel[0], points: { symbol: "circle" }},
              { data: dataToPlot[1], label:dataToPlotLabel[1], points: { symbol: "diamond" }},
              { data: dataToPlot[2], label:dataToPlotLabel[2], points: { symbol: "triangle" }},
              { data: dataToPlot[3], label:dataToPlotLabel[3], points: { symbol: "square" }},
              { data: dataToPlot[4], label:dataToPlotLabel[4], points: { symbol: "square" }},
              { data: [0], yaxis:2,},
          ];
          plot = $.plot("#flot1", incomingData , {
            series: {
              lines: {
                lineWidth: 2,
                shadowSize: 0,
                show:true,
              },
        yaxis: {tickLength:0}, 
          xaxis: {tickLength:0},
              points: {
                radius: 3,
                //show: true,
                show: false,
                fill: true
            },
              shadowSize: 0, // Drawing is faster without shadows
            },
            //colors: ["#000","#333", "#666", "#999", "#ccc", "#cb4b4b", "#aaaaff", "#ff6666"],
            colors: ["#fff","#ccc", "#888", "#444","#000"],
            xaxes: [{  
                      //mode: "time",
                      //timeformat: "%H:%M:%S",
                      //timezone: "browser",
                      show: true,
                      //rotateTicks: 135,
            }],
            yaxes: [  { position: "left" , min: 0, max: 1,
              ticks: [
                  [0.0, "0"], //red
                  [0.05, "3"], //red
                  [0.165, "6"], //orange/yellow
                  [0.3, "7"], //green
                  [0.47, "8"], //blue
                  [0.66, "11"], //Violet/Purple
                  [1.0, "14"], 
                ]
                  }, 
                      { position: "right", min: 0, max: 360,
                       ticks:[  faixaNames[tickAxis++][0],//1-red
                            faixaNames[tickAxis++][0],//2-red-orange
                            faixaNames[tickAxis++][0],//3-orange-brown
                            faixaNames[tickAxis++][0],//4-orange-yellow
                            faixaNames[tickAxis++][0],//5-yellow
                            faixaNames[tickAxis++][0],//6-yellow-green
                            faixaNames[tickAxis++][0],//7-green
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],
                            faixaNames[tickAxis++][0],

                       ] 
                     } 
                  ],
            grid: {
              markings: [
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },
                { color: one.color('hsl(' + faixaNames[gradiente][1] + ',' + gSat + ',' + gLigth + ')').css(), lineWidth: 1, yaxis: { from: faixaNames[gradiente][0]/360, to: faixaNames[gradiente++][1]/360}  },

              ]
            }
          });
          plot.draw();
      }


      var delta = 30;
      tracking.ColorTracker.registerColor('223329', function(r, g, b) { 
        //if (one.color('#223329').equals(one.color('rgb('+r+','+g+','+b+')'), 0.1)) {
        if ((r < (34+delta)) && (r > (34-delta)) &&
            (g < (51+delta)) && (g > (51-delta)) &&
            (b < (41+delta)) && (b > (41-delta)))
            {//34,51,41
          return true;}return false;});

      var tracker = new tracking.ColorTracker([]);

      tracking.track('#trackingvideo', tracker, { camera: true });

      tracker.on('track', function(event) {
        context.clearRect(0, 0, trkcanvas.width, trkcanvas.height);

        event.data.forEach(function(rect) {
          if (rect.color === 'custom') {
            rect.color = tracker.customColor;
          }

          context.strokeStyle = rect.color;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
        drawAreas();

      });

    });