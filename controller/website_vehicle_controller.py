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
    
    @http.route('/vehicle/gallery/json', type='json', auth='public')
    def vehicle_gallery(self, vehicle_id, **kwargs):
        vehicle = request.env['vehicle.vehicle'].sudo().browse(vehicle_id)
        images = []
        for img in vehicle.images:
            images.append({
                'id': img.id,
                'caption': img.caption or ''
            })
        return images

