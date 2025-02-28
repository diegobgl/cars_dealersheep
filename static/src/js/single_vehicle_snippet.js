/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.SingleVehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_single_vehicle_snippet',
    start() {
        console.log("Single Vehicle Snippet Cargado");
        const imgEl = this.el.querySelector('img');
        const titleEl = this.el.querySelector('h2');
        const pEl = this.el.querySelector('p');

        this._rpc({
            route: '/vehicles/json',
            params: {},
        }).then(vehicles => {
            if (vehicles.length > 0) {
                const vehicle = vehicles[0]; // Puedes personalizar la lógica
                if (imgEl) {
                    imgEl.setAttribute('src', '/web/image/vehicle.vehicle/' + vehicle.id + '/image');
                }
                if (titleEl) {
                    titleEl.textContent = vehicle.name;
                }
                if (pEl) {
                    pEl.textContent = `Modelo: ${vehicle.model || ''} - Año: ${vehicle.year || ''}`;
                }
            }
        }).catch(err => {
            console.error("Error en RPC /vehicles/json:", err);
        });
    },
});

export default publicWidget.registry.SingleVehicleSnippet;
