core.createController('FormRecordsController', function ($scope, uiGmapIsReady) {
    jQuery("#recordsViewContainer").height(window.innerHeight * 0.68).css("overflow", "auto");
    $scope.DivTimeLineStyle = {
        height: (window.innerHeight * 0.6) + "px",
        overflow: "auto"
    };

    $scope.TableViewConfig = {
    };

    $scope.MapViewConfig = {
    };

    $scope.TimeViewConfig = {
    };

    $scope.ChartViewConfig = {
    };


    $scope.BaseData = {
        headers: [
            "Name",
            "Position",
            "Office",
            "Age",
            "Start date",
            "Salary"
        ],
        elements: [{"Name": "Airi Satou", "Position": "Accountant", "Office": "Tokyo", "Age": 33, "Start date": "11/28/2008", "Salary": "$162,700 "},
            {"Name": "Angelica Ramos", "Position": "Chief Executive Officer (CEO)", "Office": "London", "Age": 47, "Start date": "10/9/2009", "Salary": "$1,200,000 "},
            {"Name": "Ashton Cox", "Position": "Junior Technical Author", "Office": "San Francisco", "Age": 66, "Start date": "1/12/2009", "Salary": "$86,000 "},
            {"Name": "Bradley Greer", "Position": "Software Engineer", "Office": "London", "Age": 41, "Start date": "10/13/2012", "Salary": "$132,000 "},
            {"Name": "Brenden Wagner", "Position": "Software Engineer", "Office": "San Francisco", "Age": 28, "Start date": "6/7/2011", "Salary": "$206,850 "},
            {"Name": "Brielle Williamson", "Position": "Integration Specialist", "Office": "New York", "Age": 61, "Start date": "12/2/2012", "Salary": "$372,000 "},
            {"Name": "Bruno Nash", "Position": "Software Engineer", "Office": "London", "Age": 38, "Start date": "5/3/2011", "Salary": "$163,500 "},
            {"Name": "Caesar Vance", "Position": "Pre-Sales Support", "Office": "New York", "Age": 21, "Start date": "12/12/2011", "Salary": "$106,450 "},
            {"Name": "Cara Stevens", "Position": "Sales Assistant", "Office": "New York", "Age": 46, "Start date": "12/6/2011", "Salary": "$145,600 "},
            {"Name": "Cedric Kelly", "Position": "Senior Javascript Developer", "Office": "Edinburgh", "Age": 22, "Start date": "3/29/2012", "Salary": "$433,060 "},
            {"Name": "Charde Marshall", "Position": "Regional Director", "Office": "San Francisco", "Age": 36, "Start date": "10/16/2008", "Salary": "$470,600 "},
            {"Name": "Colleen Hurst", "Position": "Javascript Developer", "Office": "San Francisco", "Age": 39, "Start date": "9/15/2009", "Salary": "$205,500 "},
            {"Name": "Dai Rios", "Position": "Personnel Lead", "Office": "Edinburgh", "Age": 35, "Start date": "9/26/2012", "Salary": "$217,500 "},
            {"Name": "Donna Snider", "Position": "Customer Support", "Office": "New York", "Age": 27, "Start date": "1/25/2011", "Salary": "$112,000 "},
            {"Name": "Doris Wilder", "Position": "Sales Assistant", "Office": "Sidney", "Age": 23, "Start date": "9/20/2010", "Salary": "$85,600 "},
            {"Name": "Finn Camacho", "Position": "Support Engineer", "Office": "San Francisco", "Age": 47, "Start date": "7/7/2009", "Salary": "$87,500 "},
            {"Name": "Fiona Green", "Position": "Chief Operating Officer (COO)", "Office": "San Francisco", "Age": 48, "Start date": "3/11/2010", "Salary": "$850,000 "},
            {"Name": "Garrett Winters", "Position": "Accountant", "Office": "Tokyo", "Age": 63, "Start date": "7/25/2011", "Salary": "$170,750 "},
            {"Name": "Gavin Cortez", "Position": "Team Leader", "Office": "San Francisco", "Age": 22, "Start date": "10/26/2008", "Salary": "$235,500 "},
            {"Name": "Gavin Joyce", "Position": "Developer", "Office": "Edinburgh", "Age": 42, "Start date": "12/22/2010", "Salary": "$92,575 "},
            {"Name": "Gloria Little", "Position": "Systems Administrator", "Office": "New York", "Age": 59, "Start date": "4/10/2009", "Salary": "$237,500 "},
            {"Name": "Haley Kennedy", "Position": "Senior Marketing Designer", "Office": "London", "Age": 43, "Start date": "12/18/2012", "Salary": "$313,500 "},
            {"Name": "Hermione Butler", "Position": "Regional Director", "Office": "London", "Age": 47, "Start date": "3/21/2011", "Salary": "$356,250 "},
            {"Name": "Herrod Chandler", "Position": "Sales Assistant", "Office": "San Francisco", "Age": 59, "Start date": "8/6/2012", "Salary": "$137,500 "},
            {"Name": "Hope Fuentes", "Position": "Secretary", "Office": "San Francisco", "Age": 41, "Start date": "2/12/2010", "Salary": "$109,850 "},
            {"Name": "Howard Hatfield", "Position": "Office Manager", "Office": "San Francisco", "Age": 51, "Start date": "12/16/2008", "Salary": "$164,500 "},
            {"Name": "Jackson Bradshaw", "Position": "Director", "Office": "New York", "Age": 65, "Start date": "9/26/2008", "Salary": "$645,750 "},
            {"Name": "Jena Gaines", "Position": "Office Manager", "Office": "London", "Age": 30, "Start date": "12/19/2008", "Salary": "$90,560 "},
            {"Name": "Jenette Caldwell", "Position": "Development Lead", "Office": "New York", "Age": 30, "Start date": "9/3/2011", "Salary": "$345,000 "},
            {"Name": "Jennifer Acosta", "Position": "Junior Javascript Developer", "Office": "Edinburgh", "Age": 43, "Start date": "2/1/2013", "Salary": "$75,650 "},
            {"Name": "Jennifer Chang", "Position": "Regional Director", "Office": "Singapore", "Age": 28, "Start date": "11/14/2010", "Salary": "$357,650 "},
            {"Name": "Jonas Alexander", "Position": "Developer", "Office": "San Francisco", "Age": 30, "Start date": "7/14/2010", "Salary": "$86,500 "},
            {"Name": "Lael Greer", "Position": "Systems Administrator", "Office": "London", "Age": 21, "Start date": "2/27/2009", "Salary": "$103,500 "},
            {"Name": "Martena Mccray", "Position": "Post-Sales support", "Office": "Edinburgh", "Age": 46, "Start date": "3/9/2011", "Salary": "$324,050 "},
            {"Name": "Michael Bruce", "Position": "Javascript Developer", "Office": "Singapore", "Age": 29, "Start date": "6/27/2011", "Salary": "$183,000 "},
            {"Name": "Michael Silva", "Position": "Marketing Designer", "Office": "London", "Age": 66, "Start date": "11/27/2012", "Salary": "$198,500 "},
            {"Name": "Michelle House", "Position": "Integration Specialist", "Office": "Sidney", "Age": 37, "Start date": "6/2/2011", "Salary": "$95,400 "},
            {"Name": "Olivia Liang", "Position": "Support Engineer", "Office": "Singapore", "Age": 64, "Start date": "2/3/2011", "Salary": "$234,500 "},
            {"Name": "Paul Byrd", "Position": "Chief Financial Officer (CFO)", "Office": "New York", "Age": 64, "Start date": "6/9/2010", "Salary": "$725,000 "},
            {"Name": "Prescott Bartlett", "Position": "Technical Author", "Office": "London", "Age": 27, "Start date": "5/7/2011", "Salary": "$145,000 "},
            {"Name": "Quinn Flynn", "Position": "Support Lead", "Office": "Edinburgh", "Age": 22, "Start date": "3/3/2013", "Salary": "$342,000 "},
            {"Name": "Rhona Davidson", "Position": "Integration Specialist", "Office": "Tokyo", "Age": 55, "Start date": "10/14/2010", "Salary": "$327,900 "},
            {"Name": "Sakura Yamamoto", "Position": "Support Engineer", "Office": "Tokyo", "Age": 37, "Start date": "8/19/2009", "Salary": "$139,575 "},
            {"Name": "Serge Baldwin", "Position": "Data Coordinator", "Office": "Singapore", "Age": 64, "Start date": "4/9/2012", "Salary": "$138,575 "},
            {"Name": "Shad Decker", "Position": "Regional Director", "Office": "Edinburgh", "Age": 51, "Start date": "11/13/2008", "Salary": "$183,000 "},
            {"Name": "Shou Itou", "Position": "Regional Marketing", "Office": "Tokyo", "Age": 20, "Start date": "8/14/2011", "Salary": "$163,000 "},
            {"Name": "Sonya Frost", "Position": "Software Engineer", "Office": "Edinburgh", "Age": 23, "Start date": "12/13/2008", "Salary": "$103,600 "},
            {"Name": "Suki Burks", "Position": "Developer", "Office": "London", "Age": 53, "Start date": "10/22/2009", "Salary": "$114,500 "},
            {"Name": "Tatyana Fitzpatrick", "Position": "Regional Director", "Office": "London", "Age": 19, "Start date": "3/17/2010", "Salary": "$385,750 "},
            {"Name": "Thor Walton", "Position": "Developer", "Office": "New York", "Age": 61, "Start date": "8/11/2013", "Salary": "$98,540 "},
            {"Name": "Tiger Nixon", "Position": "System Architect", "Office": "Edinburgh", "Age": 61, "Start date": "4/25/2011", "Salary": "$320,800 "},
            {"Name": "Timothy Mooney", "Position": "Office Manager", "Office": "London", "Age": 37, "Start date": "12/11/2008", "Salary": "$136,200 "},
            {"Name": "Unity Butler", "Position": "Marketing Designer", "Office": "San Francisco", "Age": 47, "Start date": "12/9/2009", "Salary": "$85,675 "},
            {"Name": "Vivian Harrell", "Position": "Financial Controller", "Office": "San Francisco", "Age": 62, "Start date": "2/14/2009", "Salary": "$452,500 "},
            {"Name": "Yuri Berry", "Position": "Chief Marketing Officer (CMO)", "Office": "New York", "Age": 40, "Start date": "6/25/2009", "Salary": "$675,000 "},
            {"Name": "Zenaida Frank", "Position": "Software Engineer", "Office": "New York", "Age": 63, "Start date": "1/4/2010", "Salary": "$125,250 "},
            {"Name": "Zorita Serrano", "Position": "Software Engineer", "Office": "San Francisco", "Age": 56, "Start date": "6/1/2012", "Salary": "$115,000 "}]
    };

//    $scope.map = {
//        center: {
//            latitude: 37.7749295,
//            longitude: -122.4194155
//        },
//        zoom: 14,
//        control: {}
//    };
//
//    uiGmapIsReady.promise().then(function (map_instances) {
//
//    });


    $scope.getFilterParam = function () {
        var flterText = jQuery("#formSearchText").val();
        if (flterText.indexOf(":") > -1) {
            flterText = flterText.split(":");
            var m = {};
            m[flterText[0]] = flterText[1];
            return m;
        }
        return flterText;
    };

    $scope.map = {
        center: {
            latitude: 12.9375312,
            longitude: 77.7006514
        },
        zoom: 14,
        control: {}
    };

    $scope.loaded = true;




    uiGmapIsReady.promise().then(function (inastance) {
        var map = inastance[0].map;

        google.maps.event.addListener(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
        });

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    });


    $scope.onTableRendered = function () {
        if (!$scope.table)
        {
            $scope.table = $("#datatable-buttons").DataTable({
                dom: "Bfrtip",
                fixedHeader: true,
                key: true,
                buttons: [
                    {
                        extend: "copy",
                        text: "<i class='fa fa-copy'></i>",
                        className: "btn-sm btn-success"
                    },
                    {
                        extend: "csv",
                        text: "CSV",
                        className: "btn-sm btn-success"
                    },
                    {
                        extend: "excel",
                        text: "<i class='fa fa-file-excel-o'></i>",
                        className: "btn-sm btn-success"
                    },
                    {
                        extend: "pdfHtml5",
                        text: "<i class='fa fa-file-pdf-o'></i>",
                        className: "btn-sm btn-success"
                    },
                    {
                        extend: "print",
                        text: "<i class='fa fa-print'></i>",
                        className: "btn-sm btn-success"
                    }
                ],
                responsive: true
            });

        }
        $("#datatable-buttons").width("100%");
        return "";
    };

    setTimeout($scope.onTableRendered, 500);

    $scope.currentPage = "/_self/templates/forms/records_table_view.html";
    $scope.switchView = function (view) {
        if ($scope.table) {
            $scope.table.destroy();
            $scope.table = null;
        }
        $scope.currentPage = view;
    };

    $('[data-toggle="popover"]').popover();
});
