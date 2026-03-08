/** @odoo-module **/

import publicWidget from 'web.public.widget';

const currencyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
});

function escapeHtml(value) {
    return $('<div/>').text(value || '').html();
}

publicWidget.registry.VehicleCarouselSnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_carousel',
    start() {
        const carouselId = `vehicleCarousel-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const carouselEl = this.el.querySelector('#vehicleCarousel');
        const controls = this.el.querySelectorAll('.carousel-control-prev, .carousel-control-next');
        carouselEl.id = carouselId;
        controls.forEach((control) => control.setAttribute('href', `#${carouselId}`));

        return this._rpc({
            route: '/vehicles/json',
            params: { status: 'available', limit: 10, offset: 0 },
        }).then((result) => {
            const vehicles = (result && result.vehicles) ? result.vehicles : (result || []);
            const html = vehicles.length ? vehicles.map((vehicle, index) => `
                <div class="carousel-item${index === 0 ? ' active' : ''}">
                    <a href="${escapeHtml(vehicle.website_url || '#')}" class="vehicle-carousel-link">
                        <img class="d-block w-100" src="${escapeHtml(vehicle.image_url)}" alt="${escapeHtml(vehicle.name || 'Vehículo')}">
                        <div class="carousel-caption">
                            <span class="vehicle-badge">${escapeHtml(vehicle.status_label || vehicle.status || '')}</span>
                            <h5>${escapeHtml(vehicle.name || '')}</h5>
                            <p>${escapeHtml(vehicle.brand || '')} ${escapeHtml(vehicle.model || '')}</p>
                            <strong>${currencyFormatter.format(vehicle.price || 0)}</strong>
                        </div>
                    </a>
                </div>
            `).join('') : `
                <div class="carousel-item active">
                    <div class="vehicle-empty-state">
                        <p>No hay vehículos disponibles.</p>
                    </div>
                </div>
            `;
            this.el.querySelector('.carousel-inner').innerHTML = html;
            if (window.bootstrap && window.bootstrap.Carousel) {
                window.bootstrap.Carousel.getOrCreateInstance(carouselEl, {
                    interval: 5000,
                });
            }
        }).catch((err) => {
            console.error('Error en RPC /vehicles/json:', err);
        });
    },
});

export default publicWidget.registry.VehicleCarouselSnippet;
