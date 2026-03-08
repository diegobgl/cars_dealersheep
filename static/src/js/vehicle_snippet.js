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

function renderVehicleCard(vehicle) {
    const description = vehicle.description
        ? `<p class="card-text vehicle-description">${escapeHtml(vehicle.description)}</p>`
        : '';
    const year = vehicle.year ? `<span>${vehicle.year}</span>` : '';
    const mileage = vehicle.mileage ? `<span>${escapeHtml(vehicle.mileage.toLocaleString('es-CL'))} km</span>` : '';
    const type = vehicle.vehicle_type_label || vehicle.vehicle_type || 'Sin tipo';
    const status = vehicle.status_label || vehicle.status || 'Sin estado';

    return `
        <div class="vehicle-item col-lg-4 col-md-6 mb-4">
            <a href="${escapeHtml(vehicle.website_url || '#')}" class="text-decoration-none">
                <article class="card vehicle-card h-100">
                    <div class="vehicle-image-wrap">
                        <img src="${escapeHtml(vehicle.image_url)}" class="card-img-top" alt="${escapeHtml(vehicle.name || 'Vehículo')}">
                        <span class="vehicle-badge">${escapeHtml(status)}</span>
                    </div>
                    <div class="card-body">
                        <div class="vehicle-meta">${year}${mileage}</div>
                        <h5 class="card-title">${escapeHtml(vehicle.name || '')}</h5>
                        <p class="card-text vehicle-subtitle">${escapeHtml(vehicle.brand || '')} ${escapeHtml(vehicle.model || '')}</p>
                        <p class="card-text vehicle-price">${currencyFormatter.format(vehicle.price || 0)}</p>
                        <p class="card-text vehicle-type">${escapeHtml(type)}</p>
                        ${description}
                    </div>
                </article>
            </a>
        </div>
    `;
}

publicWidget.registry.VehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_snippet',
    start() {
        return this._rpc({
            route: '/vehicles/json',
            params: { status: 'available', limit: 50, offset: 0 },
        }).then((result) => {
            const vehicles = (result && result.vehicles) ? result.vehicles : (result || []);
            const html = vehicles.length
                ? vehicles.map(renderVehicleCard).join('')
                : '<div class="col-12"><div class="vehicle-empty-state"><p>No hay vehículos disponibles.</p></div></div>';
            this.$el.find('.vehicle-list').html(html);
        }).catch((err) => {
            console.error('Error RPC /vehicles/json:', err);
            this.$el.find('.vehicle-list').html(
                '<div class="col-12"><div class="vehicle-empty-state"><p>Error al cargar los vehículos.</p></div></div>'
            );
        });
    },
});

export default publicWidget.registry.VehicleSnippet;
