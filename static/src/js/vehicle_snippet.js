odoo.define('cars_dealersheep.vehicle_snippet', function(require) {
    "use strict";
    var PublicWidget = require('web.public.widget');
    var rpc = require('web.rpc');

    var VehicleSnippet = PublicWidget.Widget.extend({
        selector: '.vehicle_snippet',
        start: function() {
            console.log("Snippet de Vehículos Cargado!");
            var self = this;
            rpc.query({
                route: '/vehicles/json',
                type: 'json',
            }).then(function(vehicles) {
                var html = '';
                if (vehicles.length > 0) {
                    vehicles.forEach(function(vehicle) {
                        html += '<div class="vehicle-item">' +
                                    '<div class="card">' +
                                        '<img src="/web/image/vehicle.vehicle/' + (vehicle.id|string) + '/image" ' +
                                             'class="card-img-top" alt="' + vehicle.name + '"/>' +
                                        '<div class="card-body">' +
                                            '<h5>' + vehicle.name + '</h5>' +
                                            '<p>Marca: ' + vehicle.brand + '</p>' +
                                            '<p>Modelo: ' + (vehicle.model || '') + '</p>' +
                                            '<p>Año: ' + (vehicle.year || '') + '</p>' +
                                            '<p>Precio: ' + vehicle.price + ' USD</p>' +
                                            '<p>Estado: ' + vehicle.status + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                    });
                } else {
                    html = '<p>No hay vehículos disponibles.</p>';
                }
                // Sustitución del contenido de .vehicle-list
                self.$el.find('.vehicle-list').html(html);
            });
        }
    });

    PublicWidget.registry.vehicle_snippet = VehicleSnippet;
    return VehicleSnippet;
});
