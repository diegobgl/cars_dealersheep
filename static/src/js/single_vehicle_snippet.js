/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.SingleVehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_single_vehicle_snippet',
    start() {
        const self = this;
        // Llamada RPC para obtener vehículos
        self._rpc({
            route: '/vehicles/json',
            params: {},
        }).then(function(vehicles) {
            if (vehicles.length > 0) {
                const vehicle = vehicles[0]; // Se muestra el primer vehículo
                // Actualiza el contenido de la card mediante jQuery
                const $card = self.$el.find('.vehicle-card');
                $card.find('.card-img-top').attr('src', '/web/image/vehicle.vehicle/' + vehicle.id + '/image');
                $card.find('.card-title').text(vehicle.name);
                // Actualizamos los campos utilizando jQuery para cada párrafo
                $card.find('p.card-text').each(function() {
                    const $p = $(this);
                    // El contenido se renderiza ya en el template, pero si se requiere
                    // se puede actualizar dinámicamente aquí.
                });
            }
        }).catch(function(err) {
            console.error("Error RPC /vehicles/json:", err);
        });
    },
});

export default publicWidget.registry.SingleVehicleSnippet;
