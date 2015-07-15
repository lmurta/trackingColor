var gradienteNum = 20;
var gradienteStep = gradienteNum / gradienteNum;
var gAngle = 360 / gradienteNum;
var gSat = 75;
var gLigth = 50;
var faixaCores = [
    [0, 10, "Red"],
    [10, 20, "Red-Orange"],
    [20, 40, "Orange-Brown"],
    [40, 50, "Orange-Yellow"],
    [50, 60, "Yellow"],
    [60, 80, "Yellow-Green"],
    [80, 140, "Green"],
    [140, 169, "Green-Cyan"],
    [169, 200, "Cyan"],
    [200, 220, "Cyan-Blue"],
    [220, 240, "Blue"],
    [240, 280, "Blue-Magenta"],
    [280, 320, "Magenta"],
    [320, 330, "Magenta-Pink"],
    [330, 345, "Pink"],
    [345, 355, "Pink-Red"],
    [355, 360, "Red"],
];
var ticksArray = new Array();
var gradienteArray = new Array();
var arrayLength = faixaCores.length;
for (var j = 0; j < arrayLength; j++) {
    //console.log("angulo:"+angulo +"faixa:"+faixaCores[j][1])
    ticksArray.push(faixaCores[j][0]);

    var grad = {
        color: one.color('hsl(' + faixaCores[j][1] + ',' + gSat + ',' + gLigth + ')').css(),
        lineWidth: 1,
        yaxis: {
            from: faixaCores[j][0] / 360,
            to: faixaCores[j][1] / 360
        }
    };


    gradienteArray.push(grad);

};
$(document).ready(function() {
    var smoothTiny = 0.8;
    //var totalPoints = 1000; var tickTime = 2;//seconds
    var totalPoints = 2000;
    var tickTime = 3; //seconds


    var lastA;
    var totalColors = 800;
    var divColorsHeigth = 800;
    var countPoints = 0;

    var video = document.getElementById('trackingvideo');
    var trkcanvas = document.getElementById('trackingcanvas');
    var context = trkcanvas.getContext('2d');



    var numAreas = 1;
    var unitSize = 16; // width (and height) of one square
    //var unitsTall = 2; // number of squares along y-axis
    var unitsTall = divColorsHeigth / totalColors; // number of squares along y-axis
    var unitsWide = 150 / numAreas; // number of squares along x-axis

    var scale = 1;
    var ax = 50 * scale;
    ay = 80 * scale;
    aw = 20 * scale;
    ah = 20 * scale;
    dx = 110 * scale;
    dy = 0 * scale;
    var areas = new Array(numAreas);
    var counts = new Array(numAreas);

    for (var i = 0; i < numAreas; i++) {
        areas[i] = new Array(4);
        areas[i] = [ax, ay, aw, ah];
        //console.log(areas[i]);
        ax = ax + dx;

        counts[i] = {};

        $("#divLabel").append("<div class=aLabel id=label" + i + ">L" + i + "</div>");
        $("#divLabel").append("<div class=aCor id=cor" + i + ">L" + i + "</div><p>");
    }
    //teste de área de controle branca
    //areas[3]=[50,ay,aw,ah];

    var now;
    var timeStart = ((new Date()).getTime());
    var dataToPlot = new Array(1);
    var dataToPlotLabel = new Array(1);
    for (var j = 0; j < numAreas; j++) {
        dataToPlot[j] = new Array();
        dataToPlotLabel[j] = "";
    }
    var incomingData;

    //plot.draw();
    function drawAreas() {
        context.strokeStyle = "#000000";
        for (var i = 0; i < numAreas; i++) {
            context.strokeRect(areas[i][0], areas[i][1], areas[i][2], areas[i][3]);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('i: ' + i, areas[i][0], areas[i][1]);
        }
    }
    var tracker = new tracking.ColorTracker([]);

    tracking.track('#trackingvideo', tracker, {
        camera: true
    });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, trkcanvas.width, trkcanvas.height);
        drawAreas();

    });
    var divImage = document.getElementById('divImage');

    var colorThief = new ColorThief();
    var newImage = new Image();

    $("#start").click(function() {
        console.log("Start");
        timeStart = ((new Date()).getTime());
        counts = new Array(numAreas);
        for (var i = 0; i < numAreas; i++) {
            counts[i] = {};
        }
        for (var j = 0; j < numAreas; j++) {
            dataToPlot[j] = new Array();
            dataToPlotLabel[j] = "";
        }
        $("#divColors").text("");
    });
    var refreshColors = setInterval(function() {
        context.drawImage(video, 0, 0, trkcanvas.width, trkcanvas.height);
        newImage.src = trkcanvas.toDataURL("image/png");
        var dataURL = trkcanvas.toDataURL();
        divImage.setAttribute('src', dataURL);
    }, tickTime * 1000);

    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 15,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee'
        }).appendTo("body").fadeIn(200);
    }
    var previousPoint = null;
    $("#flot1").bind("plothover", function(event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(4),
                    y = item.datapoint[1] * 360;
                y = y.toFixed(0);
                showTooltip(item.pageX, item.pageY, item.series.label + " " + y);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });

    divImage.onload = function() {
        var colorThief = new ColorThief();
        //var dominantColor = colorThief.getColor(divImage);
        //console.log("full:"+dominantColor);
        now = ((new Date()).getTime());

        for (var i = 0; i < numAreas; i++) {
            var area = {
                'startx': areas[i][0],
                'starty': areas[i][1],
                'width': areas[i][2],
                'height': areas[i][3]
            };
            //console.log("passing: "+area.startx);

            var dominantColor = colorThief.getColor(divImage, 8, area);
            //console.log("area :"+i+" "+dominantColor);
            var myColor = one.color('rgb(' + dominantColor[0] + ',' + dominantColor[1] + ',' + dominantColor[2] + ')');
            $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',
                width: unitsWide / 2 - 2,
                height: unitsTall,
                'background-color': myColor.css()
            }).appendTo(divColors);
            //looking for color name

            var myColor2 = one.color('hsv(' + 360 * myColor.hue() + ',' + 75 + ',' + 100 + ')')
            $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',
                width: unitsWide / 2 - 2,
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
            if (length <= 0) {
                dataToPlot[i].push([(now - timeStart) / 1000, myColor.hue()]);
                lastA = myColor.hue();
            } else {
                //console.log("d:"+ dataToPlot[i][length -1]);
                var lastA = dataToPlot[i][length - 1];

                //console.log("length:"+length+ " lastA:"+ lastA[1]);
                var nextA = (smoothTiny * newData) + ((1.0 - smoothTiny) * lastA[1]);
                //console.log ("lastA:"+ lastA[1] +" newData:"+ newData +" nextA:"+nextA);
                //lastA = nextA;
                dataToPlot[i].push([(now - timeStart) / 1000, nextA]);
                //dataToPlot[i].push([now, myColor.hue() ]);
                var angulo = nextA * 360.0;
                var angulo_cor = "";

                var faixaCor = 0;

                var arrayLength = faixaCores.length;
                for (var j = 0; j < arrayLength; j++) {
                    //console.log("angulo:"+angulo +"faixa:"+faixaCores[j][1])
                    if ((angulo > faixaCores[j][0]) &&
                        (angulo <= faixaCores[j][1])) {
                        break;
                    }
                    faixaCor++;
                }
                angulo_cor = faixaCores[faixaCor][2];

                //console.log("angulo:"+angulo +"angulo_cor:"+angulo_cor)

                var seconds = (now - timeStart) / 1000;

                counts[i][angulo_cor] = seconds;

                var strLabel = 'label' + i;
                var strCor = 'cor' + i;
                var h1 = myColor.hue() * 360;
                var s1 = myColor.saturation() * 100;
                var v1 = myColor.value() * 100;

                var n1 = "-";
                $.each(colorName, function(key, value) {
                    //console.log(key + value);
                    if (myColor.equals(one.color(value), 0.1)) {
                        n1 = key;
                    }
                });


                var origColor = "[" + h1.toFixed(0) + "," + s1.toFixed(0) + "," + v1.toFixed(0) + "] " + n1;
                //var origColor = n1;
                $('#' + strLabel).html("</br>" + origColor + "</br>" + "[" + angulo.toFixed(0) + "] " + angulo_cor);

                var str = "";
                $.each(counts[i], function(i, n) {
                    //alert( "Name: " + i + ", Value: " + n );
                    var hrs = Math.floor(n / 3600);
                    var mins = Math.floor((n - (hrs * 3600)) / 60);
                    var secs = n - (hrs * 3600) - (mins * 60);
                    ret = "";
                    if (hrs > 0)
                        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                    ret += "" + secs.toFixed(0);
                    str = str + ret + "s " + i + "</br>";
                });

                $('#' + strCor).html(str);

            }
            dataToPlotLabel[i] = "A:" + i;
            if (dataToPlot[i].length > totalPoints) { //dataToPlot[i].push([now, nextA ]);
                dataToPlot[i] = dataToPlot[i].splice(1, totalPoints);
            }
        }
        countPoints++;
        if (countPoints > totalColors) {
            $("#divColors").empty();
            countPoints = 0;
        }


        incomingData = [{
            data: dataToPlot[0],
            label: dataToPlotLabel[0],
            points: {
                symbol: "circle"
            }
        }, {
            data: dataToPlot[1],
            label: dataToPlotLabel[1],
            points: {
                symbol: "diamond"
            }
        }, {
            data: dataToPlot[2],
            label: dataToPlotLabel[2],
            points: {
                symbol: "triangle"
            }
        }, {
            data: dataToPlot[3],
            label: dataToPlotLabel[3],
            points: {
                symbol: "square"
            }
        }, {
            data: dataToPlot[4],
            label: dataToPlotLabel[4],
            points: {
                symbol: "square"
            }
        }, {
            data: [0],
            yaxis: 2,
        }, ];
        var gradiente = 0,
            tickAxis = 0;
        plot = $.plot("#flot1", incomingData, {
            series: {
                lines: {
                    lineWidth: 2,
                    shadowSize: 0,
                    show: true,
                },
                yaxis: {
                    tickLength: 0
                },
                xaxis: {
                    tickLength: 0
                },
                points: {
                    radius: 3,
                    //show: true,
                    show: false,
                    fill: true
                },
                shadowSize: 0, // Drawing is faster without shadows
            },
            //colors: ["#000","#333", "#666", "#999", "#ccc", "#cb4b4b", "#aaaaff", "#ff6666"],
            colors: ["#fff", "#ccc", "#888", "#444", "#000"],
            xaxes: [{
                //mode: "time",
                //timeformat: "%H:%M:%S",
                //timezone: "browser",
                show: true,
                //rotateTicks: 135,
            }],
            yaxes: [{
                position: "left",
                min: 0,
                max: 1,
                ticks: [
                    [0.0, "0"], //red
                    [0.05, "3"], //red
                    [0.165, "6"], //orange/yellow
                    [0.3, "7"], //green
                    [0.47, "8"], //blue
                    [0.66, "11"], //Violet/Purple
                    [1.0, "14"],
                ]
            }, {
                position: "right",
                min: 0,
                max: 360,
                ticks: ticksArray

            }],
            grid: {
                hoverable: true,
                markings: gradienteArray

            }
        });
        plot.draw();
    }
});
