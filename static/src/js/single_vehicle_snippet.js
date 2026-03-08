/** @odoo-module **/

import publicWidget from 'web.public.widget';

const currencyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
});

publicWidget.registry.SingleVehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_single_vehicle_snippet',
    start() {
        return this._rpc({
            route: '/vehicles/json',
            params: {},
        }).then((vehicles) => {
            const vehicle = vehicles && vehicles.length ? vehicles[0] : null;
            if (!vehicle) {
                this.$el.find('.description-field span').text('No hay vehículos destacados para mostrar.');
                return;
            }
            this.$el.find('img.card-img-top').attr('src', vehicle.image_url);
            this.$el.find('.card-title').text(vehicle.name || 'Vehículo destacado');
            this.$el.find('.brand-field span').text(vehicle.brand || '-');
            this.$el.find('.model-field span').text(vehicle.model || '-');
            this.$el.find('.year-field span').text(vehicle.year || '-');
            this.$el.find('.price-field span').text(currencyFormatter.format(vehicle.price || 0));
            this.$el.find('.status-field span').text(vehicle.status_label || vehicle.status || '-');
            this.$el.find('.type-field span').text(vehicle.vehicle_type_label || vehicle.vehicle_type || '-');
            this.$el.find('.description-field span').text(vehicle.description || 'Sin descripción disponible.');
            this.$el.find('.vehicle-detail-link').attr('href', vehicle.website_url || '#');
        }).catch((err) => {
            console.error('Error RPC /vehicles/json:', err);
        });
    },
});

export default publicWidget.registry.SingleVehicleSnippet;
