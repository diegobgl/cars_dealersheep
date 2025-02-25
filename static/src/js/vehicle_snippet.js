odoo.define('cars_dealersheep.vehicle_snippet', function(require) {
    "use strict";

    var PublicWidget = require('web.public.widget');
    var rpc = require('web.rpc');

    var VehicleSnippet = PublicWidget.Widget.extend({
        selector: '.vehicle_snippet',
        start: function() {
            console.log("Snippet de Vehículos Cargado!");
            var self = this;

            // Llamada al endpoint que devuelve el JSON de vehículos
            rpc.query({
                route: '/vehicles/json',
                type: 'json',
            }).then(function(vehicles) {
                var html = '';
                if (vehicles.length > 0) {
                    vehicles.forEach(function(vehicle) {
                        // ID, brand, model, year, price, status, name, etc.
                        html += '<div class="vehicle-item">' +
                                    '<div class="card">' +
                                        '<img src="/web/image/vehicle.vehicle/' + vehicle.id + '/image" ' +
                                             'class="card-img-top" alt="' + (vehicle.name || '') + '"/>' +
                                        '<div class="card-body">' +
                                            '<h5>' + (vehicle.name || '') + '</h5>' +
                                            '<p>Marca: ' + (vehicle.brand || '') + '</p>' +
                                            '<p>Modelo: ' + (vehicle.model || '') + '</p>' +
                                            '<p>Año: ' + (vehicle.year || '') + '</p>' +
                                            '<p>Precio: ' + (vehicle.price || '') + ' USD</p>' +
                                            '<p>Estado: ' + (vehicle.status || '') + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                    });
                } else {
                    html = '<p>No hay vehículos disponibles.</p>';
                }
                // Rellenar el contenido del snippet
                self.$el.find('.vehicle-list').html(html);
            })
            .catch(function(err) {
                console.error("Error RPC /vehicles/json:", err);
                self.$el.find('.vehicle-list').html(
                    '<div class="alert alert-danger">Error al cargar los vehículos.</div>'
                );
            });
        },
    });

    PublicWidget.registry.vehicle_snippet = VehicleSnippet;
    return VehicleSnippet;
});
