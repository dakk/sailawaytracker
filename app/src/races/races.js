(() => {
    angular.module('app')
        .component('races', {
            templateUrl: 'races/races.html',
            controller: RacesController,
            controllerAs: 'vm'
        });

    RacesController.$inject = ['$rootScope', '$location', '$http'];

    function RacesController($rootScope, $location, $http) {
        const vm = this;
        $rootScope.racename = null;

        vm.races = [];
        vm.updateRaces = rtype => {
            $http.get ('api/races_' + rtype + '.json')
            .then (res => {
                console.log (res.data.missions);
                vm.races = res.data.missions;
            })
            .catch (err => { });
        };

        vm.updateRaces (1);
    }
})();
