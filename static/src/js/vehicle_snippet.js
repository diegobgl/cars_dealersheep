/** @odoo-module **/
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class VehicleSnippet extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({ vehicles: [] });

        onWillStart(async () => {
            try {
                this.state.vehicles = await this.orm.call(
                    "vehicle.vehicle", 
                    "search_read", 
                    [["status", "=", "available"]],  // Filtra vehículos disponibles
                    ["id", "name", "brand", "model", "year", "price", "status"]
                );
            } catch (error) {
                console.error("Error al cargar los vehículos:", error);
            }
        });
    }
}

VehicleSnippet.template = "cars_dealersheep.vehicle_snippet";
