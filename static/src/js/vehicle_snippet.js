odoo.define('cars_dealersheep.vehicle_snippet', function(require) {
    "use strict";
    var PublicWidget = require('web.public.widget');
    var rpc = require('web.rpc');

    var VehicleSnippet = PublicWidget.Widget.extend({
        selector: '.vehicle_snippet',
        start: function() {
            console.log("Snippet de Vehículos Cargado!");
        }
    });

    PublicWidget.registry.vehicle_snippet = VehicleSnippet;
    return VehicleSnippet;
});
