(function() {
    "use strict";

    angular
        .module("spa-demo.foos")
        .directive("fooForm", FoosFormDirective);

    FoosFormDirective.$inject = ["spa-demo.APP_CONFIG"];

    function FoosFormDirective(APP_CONFIG) {
        var directive = {
            templateUrl: APP_CONFIG.foos_form_html,
            replace: true,
            bindToController: true,
            controller: "spa-demo.foos.FoosFormController",
            controllerAs: "foosFormVM",
            restrict: "E",
            scope: {
                foo:'=',
                create: "&",
                update:"&",
                remove:"&"
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log("FoosFormDirective", scope);

        }
    }

})();