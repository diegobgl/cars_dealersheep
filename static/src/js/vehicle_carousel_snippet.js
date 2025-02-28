/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.VehicleCarouselSnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_carousel',
    start() {
        console.log("Vehicle Carousel Snippet Cargado");
        const carouselInner = this.el.querySelector('.carousel-inner');
        if (!carouselInner) {
            return;
        }
        this._rpc({
            route: '/vehicles/json',
            params: {},
        }).then(vehicles => {
            let html = '';
            if (vehicles.length > 0) {
                vehicles.forEach((vehicle, index) => {
                    html += '<div class="carousel-item' + (index === 0 ? ' active' : '') + '">';
                    html += '<img class="d-block w-100" src="/web/image/vehicle.vehicle/' + vehicle.id + '/image" alt="' + vehicle.name + '">';
                    html += '<div class="carousel-caption d-none d-md-block">';
                    html += '<h5>' + vehicle.name + '</h5>';
                    html += '<p>Modelo: ' + (vehicle.model || '') + ' - Año: ' + (vehicle.year || '') + '</p>';
                    html += '</div>';
                    html += '</div>';
                });
            } else {
                html = '<div class="carousel-item active"><p>No hay vehículos disponibles.</p></div>';
            }
            carouselInner.innerHTML = html;
        }).catch(err => {
            console.error("Error RPC /vehicles/json:", err);
        });
    },
});

export default publicWidget.registry.VehicleCarouselSnippet;
