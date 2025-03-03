/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.SingleVehicleSnippet = publicWidget.Widget.extend({
    // Usamos un selector único para este widget
    selector: '.s_single_vehicle_snippet',
    start() {
        const self = this;
        self._rpc({
            route: '/vehicles/json',
            params: {},
        }).then(function(vehicles) {
            if (vehicles && vehicles.length > 0) {
                const vehicle = vehicles[0];  // Mostramos el primer vehículo
                // Actualiza la imagen de la card
                self.$el.find('img.card-img-top').attr('src', '/web/image/vehicle.vehicle/' + vehicle.id + '/image');
                // Actualiza el título (nombre)
                self.$el.find('.card-title').text(vehicle.name);
                // Actualiza cada campo con icono:
                self.$el.find('.brand-field').html('<i class="fa fa-car"></i> <strong>Marca:</strong> ' + (vehicle.brand || ''));
                self.$el.find('.model-field').html('<i class="fa fa-cogs"></i> <strong>Modelo:</strong> ' + (vehicle.model || ''));
                self.$el.find('.year-field').html('<i class="fa fa-calendar"></i> <strong>Año:</strong> ' + (vehicle.year || ''));
                self.$el.find('.price-field').html('<i class="fa fa-money"></i> <strong>Precio:</strong> ' + (vehicle.price || '') + ' USD');
                self.$el.find('.status-field').html('<i class="fa fa-info-circle"></i> <strong>Estado:</strong> ' + (vehicle.status || ''));
                self.$el.find('.type-field').html('<i class="fa fa-tag"></i> <strong>Tipo:</strong> ' + (vehicle.vehicle_type || ''));
                if (vehicle.description) {
                    self.$el.find('.description-field').html('<i class="fa fa-align-left"></i> <strong>Descripción:</strong> ' + vehicle.description);
                }
            }
        }).catch(function(err) {
            console.error("Error RPC /vehicles/json:", err);
        });
    },
});

export default publicWidget.registry.SingleVehicleSnippet;
