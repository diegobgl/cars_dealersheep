from odoo import http
from odoo.http import request

class VehicleWebsiteController(http.Controller):

    @http.route('/vehicles/json', type='json', auth='public', website=True)
    def get_vehicles(self):
        vehicles = request.env['vehicle.vehicle'].sudo().search([])
        return [{
            'id': vehicle.id,
            'name': vehicle.name,
            'brand': vehicle.brand,
            'model': vehicle.model,  # Nuevo campo
            'year': vehicle.year,     # Nuevo campo
            'price': vehicle.price,
            'status': vehicle.status, # Nuevo campo
            'fuel_type': vehicle.fuel_type,
            'image_url': f'/web/image/vehicle.vehicle/{vehicle.id}/image'
        } for vehicle in vehicles]
