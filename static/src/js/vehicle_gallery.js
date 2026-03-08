/** @odoo-module **/

import publicWidget from 'web.public.widget';

function escapeHtml(value) {
    return $('<div/>').text(value || '').html();
}

publicWidget.registry.VehicleGallerySnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_gallery',
    start() {
        const $galleryContainer = this.$el.find('.vehicle-gallery');
        const vehicleId = $galleryContainer.data('vehicle-id') || this._vehicleIdFromPath();

        return this._rpc({
            route: '/vehicle/gallery/json',
            params: vehicleId ? { vehicle_id: vehicleId } : {},
        }).then((images) => {
            const html = images && images.length ? images.map((image) => `
                <div class="col-lg-3 col-md-4 col-6 mb-3">
                    <figure class="vehicle-gallery-item">
                        <img src="/web/image/vehicle.image/${image.id}/image"
                             class="img-fluid rounded shadow-sm"
                             alt="${escapeHtml(image.caption || 'Imagen del vehículo')}"/>
                        <figcaption>${escapeHtml(image.caption || 'Imagen de la publicación')}</figcaption>
                    </figure>
                </div>
            `).join('') : '<div class="col-12"><div class="vehicle-empty-state"><p>No hay imágenes disponibles.</p></div></div>';
            $galleryContainer.html(html);
        }).catch((err) => {
            console.error('Error al cargar la galería de imágenes:', err);
            $galleryContainer.html('<div class="col-12"><div class="vehicle-empty-state"><p>Error al cargar la galería.</p></div></div>');
        });
    },

    _vehicleIdFromPath() {
        const match = window.location.pathname.match(/\/vehicle\/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    },
});

export default publicWidget.registry.VehicleGallerySnippet;
