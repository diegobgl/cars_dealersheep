/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.VehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_snippet',
    start() {
        const self = this;
        self._rpc({
            route: '/vehicles/json',
            params: {},
        }).then(function(vehicles) {
            let html = '';
            if (vehicles.length > 0) {
                vehicles.forEach(function(vehicle) {
                    html += `<div class="vehicle-item col-md-4 mb-3">
                        <div class="card vehicle-card">
                            <img src="/web/image/vehicle.vehicle/${vehicle.id}/image" class="card-img-top" alt="${vehicle.name || ''}">
                            <div class="card-body">
                                <h5 class="card-title">${vehicle.name || ''}</h5>
                                <p class="card-text"><i class="fa fa-car"></i> <strong>Marca:</strong> ${vehicle.brand || ''}</p>
                                <p class="card-text"><i class="fa fa-cogs"></i> <strong>Modelo:</strong> ${vehicle.model || ''}</p>
                                <p class="card-text"><i class="fa fa-calendar"></i> <strong>Año:</strong> ${vehicle.year || ''}</p>
                                <p class="card-text"><i class="fa fa-money"></i> <strong>Precio:</strong> ${vehicle.price || ''} USD</p>
                                <p class="card-text"><i class="fa fa-info-circle"></i> <strong>Estado:</strong> ${vehicle.status || ''}</p>
                                <p class="card-text"><i class="fa fa-tag"></i> <strong>Tipo:</strong> ${vehicle.vehicle_type || ''}</p>`;
                    if (vehicle.description) {
                        html += `<p class="card-text"><i class="fa fa-align-left"></i> <strong>Descripción:</strong> ${vehicle.description}</p>`;
                    }
                    html += `</div></div></div>`;
                });
            } else {
                html = '<p>No hay vehículos disponibles.</p>';
            }
            self.$el.find('.vehicle-list').html(html);
        }).catch(function(err) {
            console.error("Error RPC /vehicles/json:", err);
            self.$el.find('.vehicle-list').html('<div class="alert alert-danger">Error al cargar los vehículos.</div>');
        });
    },
});

export default publicWidget.registry.VehicleSnippet;
