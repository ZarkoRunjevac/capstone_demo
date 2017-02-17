/**
 * Created by zarko.runjevac on 1/24/2017.
 */
(function() {
    "use strict";

    angular
        .module("spa-demo", [
            "ui.router",
            "spa-demo.config",
            "spa-demo.authn",
            "spa-demo.layout",
            "spa-demo.subjects",
            "spa-demo.foos"
        ]);
})();