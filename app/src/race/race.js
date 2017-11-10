(() => {
    angular.module('app')
        .component('race', {
            templateUrl: 'race/race.html',
            controller: RaceController,
            controllerAs: 'vm'
        });

    RaceController.$inject = ['$rootScope', '$location', '$http', '$routeParams', '$timeout'];

    function RaceController($rootScope, $location, $http, $routeParams, $timeout) {
        const vm = this;

        vm.leaderboard = null;
        vm.markers = {};
        vm.pahts = {};

        const icons = {
            boat: {
                iconUrl: '/media/boat.png',
                iconSize:     [10, 22], // size of the icon
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [5, 11], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0],  // the same for the shadow
                popupAnchor:  [-5, -11] // point from which the popup should open relative to the iconAnchor
            },
            boatselect: {
                iconUrl: '/media/boat_selected.png',
                iconSize:     [10, 22], // size of the icon
                shadowSize:   [0, 0], // size of the shadow
                iconAnchor:   [5, 11], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0],  // the same for the shadow
                popupAnchor:  [-5, -11] // point from which the popup should open relative to the iconAnchor
            }
        };

        vm.tiles = {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
                options: {
                    maxZoom: 13,
                    attribution: 'Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                }
        };

        vm.layers = {
            baselayers: {
                OpenSeaMap: {
                    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
                    options: {
                        attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                    }
                }
            }
        };

        vm.defaults = {
            maxZoom: 13,
            minZoom: 1,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            attributionControl: true
        };

        vm.center = {
            lat: 0,
            lng: 0,
            zoom: 3
        };

        vm.overEnter = (boat) => {
            vm.markers[boat.replace ('-', '')].icon = icons.boatselect;
        };

        vm.overLeave = (boat) => {
            vm.markers[boat.replace ('-', '')].icon = icons.boat;
        };

        vm.updateRace = () => {
            $http.get ('api/race_' + $routeParams.id + '.json')
            .then (res => {
                let latlngs = [];

                res.data.mission.course.forEach (wp => {
                    latlngs.push ({
                        lat: wp.miclat,
                        lng: wp.miclon
                    });
                });

                vm.paths = {
                    course: {
                        color: '#800000',
                        weight: 1,
                        latlngs: latlngs
                    }
                };
            })
            .catch (e => {

            });
        };
            
        vm.updateLeaderboard = () => {
            $http.get ('api/leaderboard_' + $routeParams.id + '.json')
            .then (res => {
                $rootScope.racename = res.data.leaderboard[0].title;
                vm.leaderboard = res.data.leaderboard[0].results;
                
                vm.leaderboard.map (b => {
                    try {
                        b.distance = parseFloat (b.resultdescr.split (',')[3].split ('nm.')[0].replace ('nm', ''));
                        b.hdg = parseFloat (b.resultdescr.split (',')[1].replace ('Hdg: ', '').replace (String.fromCharCode(0x00B0), ''));
                        b.speed = b.resultdescr.split (',')[2].replace ('Spd: ', '');

                        let pos = b.pos.split (' ');
                        let lat = pos[0].replace ('N', '').replace ('S', '-').replace ('\'', '').split (String.fromCharCode(0x00B0));
                        let long = pos[1].replace ('W', '-').replace ('E', '').replace ('\'', '').split (String.fromCharCode(0x00B0));
                        console.log (lat[1], long[1]);
                        b.lat = parseFloat ((lat[0] + '.' + parseFloat (lat[1]) / 60.0).replace ('.0.', '.'));
                        b.lng = parseFloat ((long[0] + '.' + parseFloat (long[1]) / 60.0).replace ('.0.', '.'));
                        console.log (pos, b.lat, b.lng);

                        vm.markers [b.usrname.replace ('-', '')] = {
                            lat: b.lat,
                            lng: b.lng,
                            message: b.usrname + '<br>' + b.resultdescr,
                            icon: icons.boat,
                            iconAngle: b.hdg
                        };
                        return b;
                    } catch (e) {

                    }
                });

                vm.center = {
                    lat: vm.leaderboard[0].lat,
                    lng: vm.leaderboard[0].lng,
                    zoom: 4
                };
            })
            .catch (err => { });
        };

        vm.updateLeaderboard ();
        vm.updateRace ();

        $timeout (vm.updateLeaderboard, 120000);
    }
})();
