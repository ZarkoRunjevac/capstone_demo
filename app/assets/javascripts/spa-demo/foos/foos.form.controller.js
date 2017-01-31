(function() {
    "use strict";

    angular
        .module("spa-demo.foos")
        .controller("spa-demo.foos.FoosFormController", FoosFormController);

    //FoosController.$inject = ["spa-demo.foos.Foo"];

    function FoosFormController() {
        var vm = this;
       //vm.foos;
        vm.foo;
        //vm.edit   = edit;
        //vm.create = create;
        //vm.update = update;
        //vm.remove = remove;

        activate();
        return;
        ////////////////
        function activate() {
           // vm.foo =
           //     newFoo();
            //vm.foos = Foo.query();
        }


    }
})();