var Ftp = function (x, y, Paper) {
    var p1 = Paper.path("M61.838,54.803c-0.793,0-1.33,0.053-1.611,0.129v5.085c0.332,0.075,0.742,0.103,1.304,0.103    c2.069,0,3.349-1.047,3.349-2.785C64.879,55.75,63.805,54.803,61.838,54.803z");
    var p2 = Paper.path("M53.155,31.677c-2.188-2.187-5.734-2.187-7.922,0L20.356,56.555c-2.188,2.188-2.188,5.734,0,7.923l24.876,24.875    c2.188,2.188,5.734,2.188,7.922,0l24.877-24.877c1.051-1.05,1.641-2.476,1.641-3.961s-0.59-2.91-1.641-3.962L53.155,31.677z     M40.153,55.161h-6.618v3.937h6.184v3.168h-6.184v6.925h-3.884V51.967h10.502V55.161z M55.026,55.238h-4.703v13.951H46.44V55.238    h-4.65v-3.271h13.236V55.238z M67.178,61.293c-1.33,1.229-3.322,1.815-5.621,1.815c-0.512,0-0.971-0.024-1.33-0.103v6.184h-3.857    V52.198c1.201-0.205,2.889-0.358,5.264-0.358c2.401,0,4.139,0.461,5.289,1.405c1.1,0.845,1.814,2.274,1.814,3.962    C68.736,58.918,68.2,60.349,67.178,61.293z");
    var p3 = Paper.path("M78.445,22.433c-0.545-0.039-1.046-0.318-1.366-0.762c-3.998-5.545-10.51-8.976-17.444-8.976    c-0.502,0-1.004,0.018-1.506,0.053c-0.451,0.032-0.896-0.103-1.255-0.378c-4.198-3.229-9.314-4.979-14.675-4.979    c-9.579,0-18.069,5.614-21.936,14.088c-0.266,0.583-0.816,0.985-1.452,1.065C8.221,23.867,0,32.926,0,43.869    c0,9.697,6.46,17.908,15.301,20.574c-0.534-1.225-0.82-2.553-0.82-3.928c0-1.766,0.472-3.455,1.338-4.94    c-4.343-2.114-7.351-6.559-7.351-11.706c0-7.182,5.843-13.024,13.025-13.024c0.363,0,0.719,0.029,1.074,0.059    c2.069,0.159,3.943-1.183,4.447-3.19c1.752-6.979,7.996-11.854,15.184-11.854c4.107,0,7.994,1.586,10.944,4.466    c1.009,0.984,2.439,1.401,3.82,1.114c0.879-0.182,1.777-0.275,2.672-0.275c5.027,0,9.519,2.826,11.719,7.377    c0.772,1.6,2.464,2.553,4.232,2.371c0.44-0.045,0.879-0.066,1.307-0.066c7.183,0,13.025,5.843,13.025,13.024    c0,5.147-3.008,9.591-7.351,11.706c0.866,1.484,1.338,3.173,1.338,4.938c0,1.376-0.287,2.705-0.821,3.931    c8.842-2.666,15.301-10.877,15.301-20.575C98.387,32.542,89.575,23.229,78.445,22.433z");

    var g = Paper.g(p1, p2, p3);
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.35, 0.35);
    g.attr({
        transform: mx,
        fill: "#fff"
    });
};
var Notification = function (x, y, Paper) {
    var p = Paper.path("M305.477,241.514l-3.426-1.806c-32.237-16.999-37.745-39.859-38.587-48.266l0.174-74.866   c-4.306-47.044-38.51-84.037-83.022-93.273v-2.012C180.617,9.531,171.066,0,159.312,0c-11.768,0-21.299,9.531-21.299,21.292v1.8   C89.921,32.79,53.571,75.348,53.571,126.268c0,3.13,0.437,59.66,0.476,64.615c-1.208,11.639-7.719,33.13-37.475,48.825   l-3.426,1.806v50.785h102.2c5.534,15.199,23.117,26.324,43.966,26.324c20.842,0,38.426-11.112,43.96-26.324h102.2L305.477,241.514   L305.477,241.514z M292.623,279.445H26v-30.251c32.436-18.516,39.551-43.747,40.868-57.411l0.032-0.668   c0,0-0.476-61.582-0.476-64.86c0-50.958,41.453-92.405,92.405-92.405c48.086,0,87.636,36.055,91.987,83.266l-0.161,74.898   c1.028,10.771,7.243,37.398,41.974,57.167v30.264H292.623z");
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.1, 0.1);

    p.attr({
        transform: mx,
        fill: "#fff"
    });
};
var Api = function (x, y, Paper) {
    var p = Paper.path("M311.049,164.758c-9.275,0-17.481,4.644-22.432,11.724l-20.171-3.495c0.025-0.758,0.058-1.515,0.058-2.279  c0-8.954-1.776-17.498-4.973-25.316l34.163-20.612c4.597,3.501,10.327,5.584,16.538,5.584c15.087,0,27.361-12.274,27.361-27.361  c0-15.086-12.274-27.359-27.361-27.359c-15.086,0-27.359,12.273-27.359,27.359c0,1.603,0.146,3.171,0.412,4.699l-33.993,20.509  c-10.314-12.574-25.097-21.345-41.899-23.867V62.373c12.537-4.194,21.604-16.04,21.604-29.971c0-17.427-14.178-31.606-31.604-31.606  c-17.425,0-31.602,14.178-31.602,31.606c0,13.931,9.064,25.776,21.602,29.971v41.971c-22.896,3.436-42.029,18.486-51.227,38.937  l-62.597-19.227c0.188-1.547,0.296-3.119,0.296-4.716c0-21.468-17.464-38.934-38.931-38.934C17.465,80.404,0,97.87,0,119.338  c0,21.467,17.465,38.932,38.935,38.932c12.72,0,24.032-6.133,31.141-15.595l64.72,19.879c-0.325,2.675-0.513,5.392-0.513,8.153  c0,18,7.138,34.355,18.714,46.419l-28.195,30.008c-4.115-1.837-8.668-2.867-13.459-2.867c-18.279,0-33.148,14.87-33.148,33.148  c0,18.276,14.869,33.145,33.148,33.145c18.276,0,33.146-14.869,33.146-33.145c0-6.216-1.723-12.035-4.711-17.012l29.128-31.002  c9.633,5.353,20.707,8.414,32.488,8.414c11.254,0,21.863-2.798,31.19-7.715l29.064,44.193c-7.081,7.054-11.471,16.808-11.471,27.568  c0,21.468,17.466,38.934,38.934,38.934s38.934-17.465,38.934-38.934c0-21.467-17.466-38.932-38.934-38.932  c-3.498,0-6.888,0.471-10.115,1.341l-30.275-46.033c7.155-7.124,12.702-15.853,16.08-25.587l19.168,3.321  c1.879,13.267,13.305,23.505,27.082,23.505c15.087,0,27.361-12.274,27.361-27.361C338.41,177.031,326.136,164.758,311.049,164.758z   M154.282,170.707c0-25.977,21.134-47.111,47.11-47.111c25.978,0,47.111,21.134,47.111,47.111c0,25.976-21.134,47.109-47.111,47.109  C175.416,217.816,154.282,196.683,154.282,170.707z");
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.1, 0.1);

    p.attr({
        transform: mx,
        fill: "#fff"
    });
};
var Sms = function (x, y, Paper) {
    var p = Paper.path("M50.73,364.375h180.042l153.304,125.79v-125.79h55.358c27.933,0,50.648-23.118,50.648-51.545V51.545  C490.082,23.118,467.368,0,439.434,0H50.73C22.797,0,0.082,23.118,0.082,51.545v261.284C0.082,341.256,22.797,364.375,50.73,364.375  z M364.038,194.232c-19.709-6.639-27.32-17.361-27.126-28.681c0-17.75,15.223-31.208,38.82-31.208  c11.126,0,21.07,2.527,26.932,5.458l-5.264,20.486c-4.292-2.348-12.486-5.473-20.681-5.473c-7.223,0-11.32,2.931-11.32,7.806  c0,4.486,3.708,6.834,15.417,10.931c18.139,6.236,25.75,15.417,25.945,29.459c0,17.75-14.041,30.819-41.362,30.819  c-12.486,0-23.612-2.722-30.819-6.624l5.264-21.264c5.458,3.32,16.778,7.223,25.556,7.223c8.972,0,12.681-3.125,12.681-8  C378.08,200.274,375.149,197.941,364.038,194.232z M196.483,136.482l1.361,12.875h0.583c4.097-6.041,12.486-15.013,28.875-15.013  c12.292,0,22.042,6.236,26.139,16.18h0.389c3.514-4.875,7.806-8.778,12.292-11.499c5.279-3.125,11.125-4.68,18.154-4.68  c18.333,0,32.195,12.875,32.195,41.347v56.196h-28.875v-51.889c0-13.862-4.501-21.862-14.056-21.862  c-6.819,0-11.709,4.68-13.653,10.348c-0.778,2.138-1.166,5.264-1.166,7.611v55.792h-28.875v-53.459  c0-12.098-4.292-20.292-13.668-20.292c-7.597,0-12.098,5.862-13.847,10.737c-0.972,2.333-1.166,5.069-1.166,7.417v55.598h-28.875  v-64.973c0-11.888-0.389-22.042-0.778-30.431H196.483z M111.636,194.232c-19.709-6.639-27.32-17.361-27.126-28.681  c0-17.75,15.223-31.208,38.82-31.208c11.126,0,21.085,2.527,26.931,5.458l-5.264,20.486c-4.292-2.348-12.486-5.473-20.681-5.473  c-7.223,0-11.32,2.931-11.32,7.806c0,4.486,3.708,6.834,15.417,10.931c18.139,6.236,25.75,15.417,25.945,29.459  c0,17.75-14.041,30.819-41.362,30.819c-12.486,0-23.612-2.722-30.819-6.624l5.264-21.264c5.458,3.32,16.778,7.223,25.556,7.223  c8.972,0,12.681-3.125,12.681-8C125.678,200.274,122.747,197.941,111.636,194.232z");
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.06, 0.06);

    p.attr({
        transform: mx,
        fill: "#fff"
    });
};
var Wall = function (x, y, Paper) {
    var p = Paper.path("M31.482,1.455h-0.577H17.388V0h-3.583v1.455H0.969H0.055v1.753h0.914V20.5H14.18v3.22l-7.292,7.817h2.621l4.921-5.284v5.284h1.507V26.26l4.914,5.277h2.663l-7.333-7.817V20.5h14.724V3.208h0.577V1.455z M29.616,19.21H16.18h-2H2.258V3.208h27.357   V19.21z");
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    p.attr({
        transform: mx,
        fill: "#fff"
    });
};
var NewForm = function (x, y, Paper) {
    var p1 = Paper.path("M426.19,115.25c-0.036-0.525-0.131-1.032-0.304-1.533c-0.072-0.191-0.119-0.376-0.197-0.561" +
            "c-0.292-0.632-0.656-1.235-1.169-1.748L314.86,1.748c-0.513-0.507-1.116-0.877-1.748-1.164c-0.185-0.09-0.376-0.137-0.561-0.203" +
            "c-0.501-0.167-1.014-0.269-1.539-0.304C310.886,0.072,310.767,0,310.635,0H136.486c-3.294,0-5.967,2.673-5.967,5.967v91.854" +
            "H49.406c-3.294,0-5.967,2.673-5.967,5.967v359.951c0,3.3,2.673,5.967,5.967,5.967H333.22c3.294,0,5.967-2.667,5.967-5.967v-91.854" +
            "H420.3c3.294,0,5.967-2.667,5.967-5.967V115.626C426.267,115.495,426.202,115.375,426.19,115.25z M405.896,109.659h-89.288V20.371" +
            "L405.896,109.659z M327.253,457.766H55.373V109.755h81.114h81.108v103.692c0,3.294,2.673,5.967,5.967,5.967h103.692v146.505" +
            "V457.766z M229.528,118.192l89.288,89.288h-89.288V118.192z M339.187,359.951V213.447c0-0.131-0.066-0.251-0.078-0.376" +
            "c-0.036-0.525-0.131-1.032-0.304-1.533c-0.072-0.191-0.119-0.376-0.197-0.561c-0.292-0.632-0.656-1.235-1.169-1.748" +
            "L227.779,99.569c-0.513-0.513-1.116-0.877-1.748-1.17c-0.185-0.084-0.37-0.131-0.561-0.197c-0.501-0.173-1.008-0.274-1.539-0.304" +
            "c-0.125-0.006-0.245-0.078-0.376-0.078h-81.102V11.934h162.221v103.692c0,3.294,2.667,5.967,5.967,5.967h103.692v238.359H339.187z");
    var p2 = Paper.polyline([197.283, 235.28, 185.349, 235.28, 185.349, 277.794, 142.835, 277.794, 142.835, 289.727, 185.349, 289.727, 185.349, 332.241, 197.283, 332.241, 197.283, 289.727, 239.797, 289.727, 239.797, 277.794, 197.283, 277.794]);

    var g = Paper.g(p1, p2);
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.06, 0.06);
    g.attr({
        transform: mx,
        fill: "#fff"
    });
};
var Email = function (x, y, Paper) {
    var p1 = Paper.path("M424.3,57.75H59.1c-32.6,0-59.1,26.5-59.1,59.1v249.6c0,32.6,26.5,59.1,59.1,59.1h365.1c32.6,0,59.1-26.5,59.1-59.1v-249.5C483.4,84.35,456.9,57.75,424.3,57.75z M456.4,366.45c0,17.7-14.4,32.1-32.1,32.1H59.1c-17.7,0-32.1-14.4-32.1-32.1v-249.5c0-17.7,14.4-32.1,32.1-32.1h365.1c17.7,0,32.1,14.4,32.1,32.1v249.5H456.4z");
    var p2 = Paper.path("M304.8,238.55l118.2-106c5.5-5,6-13.5,1-19.1c-5-5.5-13.5-6-19.1-1l-163,146.3l-31.8-28.4c-0.1-0.1-0.2-0.2-0.2-0.3c-0.7-0.7-1.4-1.3-2.2-1.9L78.3,112.35c-5.6-5-14.1-4.5-19.1,1.1c-5,5.6-4.5,14.1,1.1,19.1l119.6,106.9L60.8,350.95    c-5.4,5.1-5.7,13.6-0.6,19.1c2.7,2.8,6.3,4.3,9.9,4.3c3.3,0,6.6-1.2,9.2-3.6l120.9-113.1l32.8,29.3c2.6,2.3,5.8,3.4,9,3.4c3.2,0,6.5-1.2,9-3.5l33.7-30.2l120.2,114.2c2.6,2.5,6,3.7,9.3,3.7c3.6,0,7.1-1.4,9.8-4.2c5.1-5.4,4.9-14-0.5-19.1L304.8,238.55z");

    var g = Paper.g(p1, p2);
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.06, 0.06);
    g.attr({
        transform: mx,
        fill: "#fff"
    });
};
var UserGroup = function (x, y, Paper) {
    var p1 = Paper.path("M304.4,209.55v-48.7c0-29.7-24.1-53.8-53.8-53.8h-10.5c-29.7,0-53.8,24.1-53.8,53.8v48.7" +
            "c0,8.8,3.6,17,9.8,23v37.5c-11.7,6-40.3,21.6-67,43.6c-7.8,6.4-12.2,15.8-12.2,25.9v33.4c0,5.5,4.4,9.9,9.9,9.9h237" +
            "c5.5,0,9.9-4.4,9.9-9.9v-33.4c0-10.1-4.4-19.5-12.2-25.9c-26.7-21.9-55.3-37.6-67-43.6v-37.5" +
            "C300.8,226.65,304.4,218.35,304.4,209.55z M349,328.95c3.2,2.6,5,6.5,5,10.6v23.5H136.8v-23.5c0-4.1,1.8-8,5-10.6" +
            "c29.4-24.2,61.3-40.3,67.4-43.3c4.1-2,6.8-6.3,6.8-10.8v-47c0-3.3-1.7-6.4-4.4-8.2c-3.4-2.3-5.4-6-5.4-10v-48.7" +
            "c0-18.8,15.3-34,34-34h10.5c18.8,0,34,15.3,34,34v48.7c0,4-2,7.8-5.4,10c-2.8,1.8-4.4,4.9-4.4,8.2v47c0,4.6,2.7,8.8,6.8,10.8" +
            "C287.7,288.65,319.6,304.85,349,328.95z");

    var p2 = Paper.path("M9.9,382.85h80.5c5.5,0,9.9-4.4,9.9-9.9s-4.4-9.9-9.9-9.9H19.8v-15.9c0-2.5,1.1-4.9,3-6.5" +
            "c22.5-18.5,47-30.9,51.7-33.1c4-1.9,6.5-6,6.5-10.4v-36.3c0-3.3-1.7-6.4-4.4-8.2c-2-1.3-3.2-3.5-3.2-5.9v-37.7" +
            "c0-13.2,10.8-24,24-24h8.1c13.2,0,24,10.8,24,24v37.7c0,2.4-1.2,4.6-3.2,5.9c-2.8,1.8-4.4,4.9-4.4,8.2v18.2c0,5.5,4.4,9.9,9.9,9.9" +
            "s9.9-4.4,9.9-9.9v-13.6c4.8-5,7.6-11.6,7.6-18.7v-37.7c0-24.2-19.7-43.8-43.8-43.8h-8.1c-24.2,0-43.8,19.7-43.8,43.8v37.7" +
            "c0,7.1,2.8,13.7,7.6,18.7v26.7c-9.8,5.1-31,16.9-50.9,33.3c-6.5,5.4-10.3,13.3-10.3,21.8v25.7C0,378.45,4.4,382.85,9.9,382.85z");
    var p3 = Paper.path("M340.6,209.05v37.7c0,7.1,2.8,13.7,7.6,18.7v12.8c0,5.5,4.4,9.9,9.9,9.9s9.9-4.4,9.9-9.9v-17.4" +
            "c0-3.3-1.7-6.4-4.4-8.2c-2-1.3-3.2-3.5-3.2-5.9v-37.7c0-13.2,10.8-24,24-24h8.1c13.2,0,24,10.8,24,24v37.7c0,2.4-1.2,4.6-3.2,5.9" +
            "c-2.8,1.8-4.4,4.9-4.4,8.2v36.3c0,4.4,2.6,8.5,6.5,10.4c4.7,2.3,29.1,14.6,51.7,33.1c1.9,1.6,3,3.9,3,6.5v15.9h-69.4" +
            "c-5.5,0-9.9,4.4-9.9,9.9s4.4,9.9,9.9,9.9H480c5.5,0,9.9-4.4,9.9-9.9v-25.8c0-8.5-3.7-16.4-10.3-21.8" +
            "c-19.9-16.3-41.2-28.2-50.9-33.3v-26.7c4.8-5,7.6-11.6,7.6-18.7v-37.7c0-24.2-19.7-43.8-43.8-43.8h-8.1" +
            "C360.3,165.25,340.6,184.85,340.6,209.05z");

    var g = Paper.g(p2, p3, p1);
    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.08, 0.08);
    g.attr({
        transform: mx,
        fill: "#fff"
    });
};
var User = function (x, y, Paper) {
    var g = Paper.path("M304.4,209.55v-48.7c0-29.7-24.1-53.8-53.8-53.8h-10.5c-29.7,0-53.8,24.1-53.8,53.8v48.7" +
            "c0,8.8,3.6,17,9.8,23v37.5c-11.7,6-40.3,21.6-67,43.6c-7.8,6.4-12.2,15.8-12.2,25.9v33.4c0,5.5,4.4,9.9,9.9,9.9h237" +
            "c5.5,0,9.9-4.4,9.9-9.9v-33.4c0-10.1-4.4-19.5-12.2-25.9c-26.7-21.9-55.3-37.6-67-43.6v-37.5" +
            "C300.8,226.65,304.4,218.35,304.4,209.55z M349,328.95c3.2,2.6,5,6.5,5,10.6v23.5H136.8v-23.5c0-4.1,1.8-8,5-10.6" +
            "c29.4-24.2,61.3-40.3,67.4-43.3c4.1-2,6.8-6.3,6.8-10.8v-47c0-3.3-1.7-6.4-4.4-8.2c-3.4-2.3-5.4-6-5.4-10v-48.7" +
            "c0-18.8,15.3-34,34-34h10.5c18.8,0,34,15.3,34,34v48.7c0,4-2,7.8-5.4,10c-2.8,1.8-4.4,4.9-4.4,8.2v47c0,4.6,2.7,8.8,6.8,10.8" +
            "C287.7,288.65,319.6,304.85,349,328.95z");

    var mx = new Snap.Matrix();
    mx.translate(x, y);
    mx.scale(0.08, 0.08);
    g.attr({
        transform: mx,
        fill: "#fff"
    });
};



var Block = function (x, y, Paper, node,stage) {
    this.id=Math.round(Math.random()*99999);
    this.node=node;
    var aActions = node._a || [];


    this._p1 = Paper.rect(20, 20, 100, 100).attr({
        rx: 10,
        ry: 10,
        fill: "#556080"
    });

    this._p2 = Paper.rect(0, 0, 100, 100).attr({
        rx: 10,
        ry: 10,
        fill: "#26B99A"
    });
    
    this.setSelected=function(){
        this._p2.attr({
            fill: "#F39C12"
        });
    };
    this.clearSelection=function(){
        this._p2.attr({
            fill: "#26B99A"
        });
    };

    var pGroup = Paper.g(this._p1, this._p2);

    this.shape = Paper.g(pGroup);

    var oBox = pGroup.getBBox();

    var iLength = aActions.length;
    var dotHeight = (iLength + (iLength - 1)) * 10;

    var vStart = oBox.h / 2 - dotHeight / 2;

    this.actions = [];

    for (var m in aActions) {
        var c = Paper.circle(oBox.w + 10, vStart, 8).attr({
            fill: "#26B99A"
        });
        vStart += 20;
        this.shape.add(c);
        this.actions.push(c);
    }


    var myMatrix = new Snap.Matrix();
    myMatrix.translate(x, y);
    this.shape.attr({
        transform: myMatrix
    });
    
    var bb=this.shape.getBBox();
    
    if(stage){
        Paper.text(bb.x+(bb.w/3),bb.y2+bb.h, "Stage "+stage);   
        this.myStage=stage;
    }
    
    this.click=function(cb){
      var that=this;
      this.shape.click(function(){
          cb(that);
      });  
    };

    this.getAction = function (i) {
        if (!this.actions.length) {
            return {};
        }
        var box = this.actions[i].getBBox();
        var sbox = this.shape.getBBox();
        var c = {
            cx: box.cx + sbox.x,
            cy: box.cy + sbox.y
        };
        return c;
    };

    this.getEdge = function () {
        return this.shape.getBBox();
    };
       
    var text,tx=x+5,ty=y+55;
    switch (node._t) {
        case "CREATE":
            NewForm(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "New");
            break;
        case "USER":
            User(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "User");
            break;
        case "GROUP":
            UserGroup(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "User Group");
            break;
        case "FTP":
            Ftp(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "FTP Conn");
            break;
        case "API":
            Api(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "Invoke API");
            break;
        case "NOTIF":
            Notification(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "Notification");
            break;
        case "SMS":
            Sms(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "Send SMS");
            break;
        case "EMAIL":
            Email(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "Send Email");
            break;
        case "WALL":
            Wall(x+3,y+3,Paper);
            text=Paper.text(tx,ty, "Post to Wall");
            break;
    }    
    
    text.attr({
       fill:"#fff" 
    });
};



var FunctionalDraw = function (sId) {
    this.oPaper = new Snap("#" + sId);
    this.box = {
        x: 100,
        y: 100,
        gap: 200
    };
    return this;
};

FunctionalDraw.prototype.clearSelection = function(){
    this.Selected=null;
};

FunctionalDraw.prototype.clear = function(oData){
    this.oPaper.clear();
};

FunctionalDraw.prototype.draw = function(oData){
    var that=this;
    this.clear();
    this.oBlocks = {};
    var draeStartX = this.box.x;
    
    var lastSelection=null;
    if(this.Selected){
        lastSelection=this.Selected.myStage;
    }
    
    for (var i in oData) {
        var d = oData[i];
        this.oBlocks[i] = {
            data: d,
            shape: new Block(draeStartX, this.box.y, this.oPaper, d,i)
        };
        
        if(lastSelection == i){
            this.Selected=this.oBlocks[i].shape;
        }
        
        draeStartX += this.box.gap;
    }
    for (var b in this.oBlocks) {
        var blk = this.oBlocks[b];
        for (var a in blk.data._a) {
            var acn = blk.data._a[a];
            this._drawIndicators(blk, a, this.oBlocks[acn.r]);
        }
        
        blk.shape.click(function(ref){
            if(that.Selected){
                that.Selected.clearSelection();
            }
            that.Selected=ref;
            that.Selected.setSelected();
            
            var evt = new CustomEvent("nodeClick", {'detail': ref.node});
            window.dispatchEvent(evt);
        });        
        
    }
    if(this.Selected){
        this.Selected.setSelected();
    }
};

FunctionalDraw.prototype._drawIndicators = function (sShape, a, tShape) {
    if(!sShape || !tShape){
        return ;
    }
    var src = sShape.shape.getAction(a);
    var trg = tShape.shape.getEdge();


    var dGap = trg.x - src.cx;
    var mod = Math.floor(dGap / this.box.gap);

    if (dGap > 0) {
        if (mod === 0) {
            this._forwardLine(src.cx, src.cy, src.cx + this.box.gap / 4, src.cy);
        } else {
            var aPoint = [];
            aPoint.push(src.cx);
            aPoint.push(src.cy);
            var initGap = this.box.gap / 4;

            aPoint.push(src.cx + initGap);
            aPoint.push(src.cy - (this.box.x));

            aPoint.push(src.cx + initGap + (mod / 2 * this.box.gap));
            aPoint.push(src.cy - (this.box.y));
            aPoint.push(trg.x);
            aPoint.push(trg.y);

            this._forwardCurve(aPoint);
        }
    } else {
        this._backwardCurve(sShape.shape, tShape.shape, a);
    }
};

FunctionalDraw.prototype._forwardLine = function (x1, y1, x2, y2) {

    this.shape = this.oPaper.path(Snap.format("M{x1},{y1}L{x2},{y2}", {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    })).attr({
        stroke: '#123456',
        strokeWidth: 3,
        fill: 'transparent',
        markerEnd: this._createMarker()
    }).mousemove(function (e) {
        new Snap(e.target).attr({
            stroke: '#E64C3C'
        });
    }).mouseout(function (e) {
        new Snap(e.target).attr({
            stroke: '#123456'
        });
    });
};

FunctionalDraw.prototype._backwardCurve = function (sShape, tShape, actionIndex) {
    var srcDim = sShape.getEdge();
    var trgDim = tShape.getEdge();
    var actionDim = sShape.getAction(actionIndex);



    this.oPaper.path(Snap.format("M{x},{y}L{l1.x},{l1.y}L{l2.x},{l2.y}C{c.x1},{c.y1} {c.x2},{c.y2} {c.x3},{c.y3}", {
        x: actionDim.cx,
        y: actionDim.cy,
        l1: {
            x: actionDim.cx + 30,
            y: actionDim.cy
        },
        l2: {
            x: actionDim.cx + 30,
            y: srcDim.y2
        },
        c: {
            x1: Math.floor(actionDim.cx + 29),
            y1: Math.floor(srcDim.y2),
            x2: Math.floor(actionDim.cx + 30),
            y2: Math.floor(srcDim.y2 + srcDim.h),
            x3: Math.floor(trgDim.x2 - 10),
            y3: Math.floor(trgDim.y2)
        }
    })).attr({
        stroke: '#123456',
        strokeWidth: 3,
        fill: 'transparent',
        markerEnd: this._createMarker()
    }).mousemove(function (e) {
        new Snap(e.target).attr({
            stroke: '#E64C3C'
        });
    }).mouseout(function (e) {
        new Snap(e.target).attr({
            stroke: '#123456'
        });
    });
};

FunctionalDraw.prototype._forwardCurve = function (aPoints) {
    if (aPoints.length < 6)
        return;

    aPoints = aPoints.map(function (v) {
        return Math.floor(v);
    });

    var e = aPoints.length - 2;
    var sPath = "M" + aPoints[0] + "," + aPoints[1] + "C";


    for (var i = 2; i < aPoints.length; i += 2) {
        sPath += " " + aPoints[i] + "," + aPoints[i + 1];
    }
    this.shape = this.oPaper.path(sPath).attr({
        stroke: '#123456',
        strokeWidth: 3,
        fill: 'transparent',
        markerEnd: this._createMarker()
    }).mousemove(function (e) {
        new Snap(e.target).attr({
            stroke: '#E64C3C'
        });
    }).mouseout(function (e) {
        new Snap(e.target).attr({
            stroke: '#123456'
        });
    });
};

FunctionalDraw.prototype._createMarker = function () {
    var arrPath = this.oPaper.path("M0,0 V4 L2,2 Z").attr({fill: "#353D47", stroke: "#353D47"});
    return arrPath.marker(0, 0, 4, 6, 0.1, 2);
};