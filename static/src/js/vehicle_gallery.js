/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.VehicleGallerySnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_gallery',
    start() {
        console.log("Vehicle Gallery Snippet Cargado");
        const $galleryContainer = this.$el.find('.vehicle-gallery');
        // Obtenemos el vehicle_id del atributo data-vehicle-id en el contenedor
        const vehicleId = $galleryContainer.data('vehicle-id');
        if (!vehicleId) {
            console.error("No se encontró el vehicle_id en el contenedor de galería");
            return;
        }
        // Llamada RPC al endpoint para obtener las imágenes de la galería
        this._rpc({
            route: '/vehicle/gallery/json',
            params: { vehicle_id: vehicleId },
        }).then(images => {
            let html = '';
            if (images && images.length > 0) {
                images.forEach(image => {
                    // Usamos la ruta web/image para cada imagen del modelo vehicle.image
                    html += `<div class="col-md-3 mb-3">
                                <img src="/web/image/vehicle.image/${image.id}/image" 
                                     class="img-fluid rounded shadow-sm" 
                                     alt="${image.caption || 'Imagen del vehículo'}"/>
                             </div>`;
                });
            } else {
                html = '<div class="col-12 text-center py-5"><p>No hay imágenes disponibles.</p></div>';
            }
            $galleryContainer.html(html);
        }).catch(err => {
            console.error("Error al cargar la galería de imágenes:", err);
            $galleryContainer.html('<div class="col-12 text-center py-5"><p>Error al cargar la galería.</p></div>');
        });
    },
});

export default publicWidget.registry.VehicleGallerySnippet;
