/** @odoo-module **/
import { Component, onWillStart, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class VehicleSnippet extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({ vehicles: [] });

        onWillStart(async () => {
            this.state.vehicles = await this.orm.call("vehicle.vehicle", "search_read", [], 
                ["name", "brand", "model", "year", "price", "status", "image"]);
        });
    }
}

VehicleSnippet.template = "cars_dealersheep.vehicle_snippet";
