/** @odoo-module **/
import { Component, useState, mount, xml } from "@odoo/owl";

export class HomePageVehicles extends Component {
    static template = xml/* xml */ `
        <div class="vehicle-list row">
            <t t-foreach="groupedVehicles" t-as="group">
                <div class="col-12">
                    <h3 class="group-title">{{ group.type || 'Otros' }}</h3>
                </div>
                <t t-foreach="group.vehicles" t-as="vehicle">
                    <div class="col-md-4 mb-3">
                        <a t-att-href="'/vehicle/' + vehicle.id" class="text-decoration-none">
                            <div class="card vehicle-card">
                                <img t-att-src="'/web/image/vehicle.vehicle/' + vehicle.id + '/image'" class="card-img-top" alt="Imagen de vehículo"/>
                                <div class="card-body">
                                    <h5 class="card-title" t-esc="vehicle.name"/>
                                    <p class="card-text"><i class="fa fa-car"></i> <strong>Marca:</strong> <span t-esc="vehicle.brand"/></p>
                                    <p class="card-text"><i class="fa fa-cogs"></i> <strong>Modelo:</strong> <span t-esc="vehicle.model"/></p>
                                    <p class="card-text"><i class="fa fa-calendar"></i> <strong>Año:</strong> <span t-esc="vehicle.year"/></p>
                                    <p class="card-text"><i class="fa fa-money"></i> <strong>Precio:</strong> <span t-esc="vehicle.price"/> USD</p>
                                    <p class="card-text"><i class="fa fa-tag"></i> <strong>Tipo:</strong> <span t-esc="vehicle.vehicle_type"/></p>
                                </div>
                            </div>
                        </a>
                    </div>
                </t>
            </t>
        </div>
    `;

    state = useState({
        vehicles: [],
        searchQuery: "",
        filters: {
            brand: "",
            year: "",
            type: "",
        },
    });

    async willStart() {
        this.state.vehicles = await this.fetchVehicles();
    }

    async fetchVehicles() {
        try {
            const vehicles = await this.env.rpc({
                route: '/vehicles/json',
                params: {},
            });
            return vehicles;
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            return [];
        }
    }

    get filteredVehicles() {
        return this.state.vehicles.filter(vehicle => {
            const query = this.state.searchQuery.toLowerCase();
            const matchesQuery = !query || 
                (vehicle.name && vehicle.name.toLowerCase().includes(query)) ||
                (vehicle.brand && vehicle.brand.toLowerCase().includes(query)) ||
                (vehicle.vehicle_type && vehicle.vehicle_type.toLowerCase().includes(query));
            const matchesBrand = !this.state.filters.brand || vehicle.brand === this.state.filters.brand;
            const matchesYear = !this.state.filters.year || vehicle.year === parseInt(this.state.filters.year);
            const matchesType = !this.state.filters.type || vehicle.vehicle_type === this.state.filters.type;
            return matchesQuery && matchesBrand && matchesYear && matchesType;
        });
    }

    get groupedVehicles() {
        const groups = {};
        for (const vehicle of this.filteredVehicles) {
            const type = vehicle.vehicle_type || "Otros";
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(vehicle);
        }
        return Object.entries(groups).map(([type, vehicles]) => ({ type, vehicles }));
    }
}

mount(HomePageVehicles, document.getElementById("home_vehicle_list"));
