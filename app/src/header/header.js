(() => {
  angular.module('app')
    .component('header', {
      templateUrl: 'header/header.html',
      controller: HeaderController,
      controllerAs: 'vm'
    });

  HeaderController.$inject = ['$rootScope', '$location'];

  function HeaderController($rootScope, $location) {
    const vm = this;
    vm.menu = $location.path().slice(1);

    vm.racename = null;

    $rootScope.$watch ('racename', n => {
      vm.racename = $rootScope.racename;
    });

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
      vm.menu = $location.path().slice(1);
    });
  }
})();
