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
    return `
        <div class="col-xl-4 col-md-6 mb-4">
            <a href="${escapeHtml(vehicle.website_url || '#')}" class="text-decoration-none">
                <article class="card vehicle-card h-100">
                    <div class="vehicle-image-wrap">
                        <img src="${escapeHtml(vehicle.image_url)}" class="card-img-top" alt="${escapeHtml(vehicle.name || 'Vehículo')}">
                        <span class="vehicle-badge">${escapeHtml(vehicle.status_label || vehicle.status || '')}</span>
                    </div>
                    <div class="card-body">
                        <div class="vehicle-meta">
                            <span>${escapeHtml(vehicle.year || '-')}</span>
                            <span>${escapeHtml(vehicle.vehicle_type_label || vehicle.vehicle_type || 'Sin tipo')}</span>
                        </div>
                        <h5 class="card-title">${escapeHtml(vehicle.name || '')}</h5>
                        <p class="card-text vehicle-subtitle">${escapeHtml(vehicle.brand || '')} ${escapeHtml(vehicle.model || '')}</p>
                        <p class="card-text vehicle-price">${currencyFormatter.format(vehicle.price || 0)}</p>
                        <p class="card-text">${escapeHtml(vehicle.patente || 'Patente no informada')}</p>
                    </div>
                </article>
            </a>
        </div>
    `;
}

publicWidget.registry.HomePageVehicles = publicWidget.Widget.extend({
    selector: '.home-page',
    events: {
        'input #vehicle_search_input': '_onFilterChanged',
        'change #filter_brand': '_onFilterChanged',
        'change #filter_year': '_onFilterChanged',
        'change #filter_type': '_onFilterChanged',
    },

    start() {
        this.vehicles = [];
        this.allVehicles = [];
        return this._rpc({
            route: '/vehicles/json',
            params: { status: 'available', limit: 200, offset: 0 },
        }).then((result) => {
            this.allVehicles = (result && result.vehicles) ? result.vehicles : (result || []);
            this.vehicles = this.allVehicles;
            this._populateFilters();
            this._render();
        }).catch((err) => {
            console.error('Error fetching vehicles:', err);
            this.$('#home_vehicle_list').html('<div class="col-12"><div class="vehicle-empty-state"><p>Error al cargar el inventario.</p></div></div>');
        });
    },

    _populateFilters() {
        this._fillSelect('#filter_brand', [...new Set(this.vehicles.map((vehicle) => vehicle.brand).filter(Boolean))].sort(), 'Todas');
        this._fillSelect('#filter_year', [...new Set(this.vehicles.map((vehicle) => vehicle.year).filter(Boolean))].sort((a, b) => b - a), 'Todos');
        this._fillSelect('#filter_type', [...new Map(
            this.vehicles
                .filter((vehicle) => vehicle.vehicle_type)
                .map((vehicle) => [vehicle.vehicle_type, vehicle.vehicle_type_label || vehicle.vehicle_type])
        )], 'Todos');
    },

    _fillSelect(selector, values, placeholder) {
        const $select = this.$(selector);
        const options = [`<option value="">${placeholder}</option>`];
        values.forEach((value) => {
            if (Array.isArray(value)) {
                options.push(`<option value="${escapeHtml(value[0])}">${escapeHtml(value[1])}</option>`);
            } else {
                options.push(`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`);
            }
        });
        $select.html(options.join(''));
    },

    _filteredVehicles() {
        const query = (this.$('#vehicle_search_input').val() || '').toString().trim().toLowerCase();
        const brand = this.$('#filter_brand').val();
        const year = this.$('#filter_year').val();
        const type = this.$('#filter_type').val();

        return this.vehicles.filter((vehicle) => {
            const haystack = [
                vehicle.name,
                vehicle.brand,
                vehicle.model,
                vehicle.patente,
                vehicle.vehicle_type_label,
            ].filter(Boolean).join(' ').toLowerCase();
            return (!query || haystack.includes(query))
                && (!brand || vehicle.brand === brand)
                && (!year || String(vehicle.year) === String(year))
                && (!type || vehicle.vehicle_type === type);
        });
    },

    _render() {
        const vehicles = this._filteredVehicles();
        this.$('#filter_summary').text(`${vehicles.length} vehículo(s) encontrados`);
        const html = vehicles.length
            ? vehicles.map(renderVehicleCard).join('')
            : '<div class="col-12"><div class="vehicle-empty-state"><p>No hay resultados con esos filtros.</p></div></div>';
        this.$('#home_vehicle_list').html(html);
    },

    _onFilterChanged() {
        this._render();
    },
});

export default publicWidget.registry.HomePageVehicles;
