/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.VehicleSnippet = publicWidget.Widget.extend({
    selector: '.vehicle_snippet',
    start() {
        console.log("Snippet de Vehículos Cargado!");
        const vehicleList = this.el.querySelector('.vehicle-list');
        if (vehicleList) {
            this._rpc({
                route: '/vehicles/json',
                params: {},
            }).then(vehicles => {
                let html = ``;
                if (vehicles.length > 0) {
                    vehicles.forEach(vehicle => {
                        html += `<div class="vehicle-item">
                            <div class="card">
                                <img src="/web/image/vehicle.vehicle/${vehicle.id}/image" class="card-img-top" alt="${vehicle.name || ''}"/>
                                <div class="card-body">
                                    <h5>${vehicle.name || ''}</h5>
                                    <p>Marca: ${vehicle.brand || ''}</p>
                                    <p>Modelo: ${vehicle.model || ''}</p>
                                    <p>Año: ${vehicle.year || ''}</p>
                                    <p>Precio: ${vehicle.price || ''} USD</p>
                                    <p>Estado: ${vehicle.status || ''}</p>
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
