/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.VehicleSnippet = publicWidget.Widget.extend({
    selector: '.s_vehicle_snippet',
    start() {
        console.log("Snippet de Vehículos Cargado!");
        const vehicleList = this.el.querySelector('.vehicle-list');
        if (vehicleList) {
            this._rpc({
                route: '/vehicles/json',
                params: {},
            }).then(vehicles => {
                let html = '';
                if (vehicles.length > 0) {
                    vehicles.forEach(vehicle => {
                        html += `<div class="vehicle-item col-md-4 mb-3">
                            <div class="card vehicle-card">
                                <img src="/web/image/vehicle.vehicle/${vehicle.id}/image" class="card-img-top" alt="${vehicle.name || ''}">
                                <div class="card-body">
                                    <h5 class="card-title">${vehicle.name || ''}</h5>
                                    <p class="card-text">Marca: ${vehicle.brand || ''}</p>
                                    <p class="card-text">Modelo: ${vehicle.model || ''}</p>
                                    <p class="card-text">Año: ${vehicle.year || ''}</p>
                                    <p class="card-text">Precio: ${vehicle.price || ''} USD</p>
                                    <p class="card-text">Estado: ${vehicle.status || ''}</p>
                                </div>
                            </div>
                        </div>`;
                    });
                } else {
                    html = '<p>No hay vehículos disponibles.</p>';
                }
                vehicleList.innerHTML = html;
            }).catch(err => {
                console.error("Error RPC /vehicles/json:", err);
                vehicleList.innerHTML = '<div class="alert alert-danger">Error al cargar los vehículos.</div>';
            });
        }
    },
});

export default publicWidget.registry.VehicleSnippet;
