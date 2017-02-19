(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdThingsAuthz", ThingsAuthzDirective);

    ThingsAuthzDirective.$inject = [];

    function ThingsAuthzDirective() {
        var directive = {
            bindToController: true,
            controller: ThingsAuthzController,
            controllerAs: "vm",
            restrict: "A",
            scope:{
                authz:'='
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log("ThingsAuthzDirective", scope);
        }
    }

    ThingsAuthzController.$inject = ["$scope",
        "spa-demo.authn.Authn"];
    function ThingsAuthzController($scope, Authn) {
        var vm = this;
        vm.authz={};

        vm.authz.canUpdateItem = canUpdateItem;
        //vm.newItem=newItem;

        ThingsAuthzController.prototype.resetAccess=function () {
            this.authz.canCreate     = false;
            this.authz.canQuery      = false;
            this.authz.canUpdate     = false;
            this.authz.canDelete     = false;
            this.authz.canGetDetails = false;
            this.authz.canUpdateImage = false;
            this.authz.canRemoveImage = false;
        }

        activate();
        return;
        //////////
        function activate() {
            vm.resetAccess();
            $scope.$watch(Authn.getCurrentUser,newUser);
        }

        function newUser(user, prevUser) {
            console.log("newUser=",user,", prev=",prevUser);
            vm.authz.canQuery       =true;
            vm.authz.authenticated=Authn.isAuthenticated();
            if(vm.authz.authenticated){
                vm.authz.canQuery      = true;
                vm.authz.canCreate     = true;
                vm.authz.canUpdate     = true,
                vm.authz.canDelete     = true,
                vm.authz.canGetDetails = true;
                vm.authz.canUpdateImage = true;
                vm.authz.canRemoveImage = true;
            }else{
                vm.resetAccess();
            }
        }

        function canUpdateItem(item) {
            return Authn.isAuthenticated();
        }

        /*function newItem(item) {
            ThingsAuthz.getAuthorizedUser().then(
                function(user){ authzUserItem(item, user); },
                function(user){ authzUserItem(item, user); });
        }

        function authzUserItem(item, user) {
            console.log("new Item/Authz", item, user);

            vm.authz.authenticated = ThingsAuthz.isAuthenticated();
            vm.authz.canQuery      = ThingsAuthz.canQuery();
            vm.authz.canCreate = ThingsAuthz.canCreate();
            if (item && item.$promise) {
                vm.authz.canUpdate     = false;
                vm.authz.canDelete     = false;
                vm.authz.canGetDetails = false;
                item.$promise.then(function(){ checkAccess(item); });
            } else {
                checkAccess(item)
            }
        }

        function checkAccess(item) {
            vm.authz.canUpdate     = ThingsAuthz.canUpdate(item);
            vm.authz.canDelete     = ThingsAuthz.canDelete(item);
            vm.authz.canGetDetails = ThingsAuthz.canGetDetails(item);
            console.log("checkAccess", item, vm.authz);
        }*/


    }
})();