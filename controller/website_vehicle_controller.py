from odoo import http
from odoo.http import request


class VehicleWebsiteController(http.Controller):
    def _selection_label(self, record, field_name):
        selection = dict(record._fields[field_name].selection)
        return selection.get(record[field_name], '')

    def _serialize_vehicle(self, vehicle):
        return {
            'id': vehicle.id,
            'name': vehicle.name,
            'brand': vehicle.brand,
            'model': vehicle.model,
            'year': vehicle.year,
            'price': vehicle.price,
            'status': vehicle.status,
            'status_label': self._selection_label(vehicle, 'status'),
            'fuel_type': vehicle.fuel_type,
            'fuel_type_label': self._selection_label(vehicle, 'fuel_type') if vehicle.fuel_type else '',
            'transmission': vehicle.transmission,
            'transmission_label': self._selection_label(vehicle, 'transmission') if vehicle.transmission else '',
            'vehicle_type': vehicle.vehicle_type,
            'vehicle_type_label': self._selection_label(vehicle, 'vehicle_type') if vehicle.vehicle_type else '',
            'description': vehicle.description or '',
            'mileage': vehicle.mileage,
            'patente': vehicle.patente or '',
            'image_url': f'/web/image/vehicle.vehicle/{vehicle.id}/image',
            'website_url': f'/vehicle/{vehicle.id}',
        }

    @http.route('/vehicles/json', type='json', auth='public', website=True)
    def get_vehicles(self):
        vehicles = request.env['vehicle.vehicle'].sudo().search([], order='create_date desc')
        return [self._serialize_vehicle(vehicle) for vehicle in vehicles]

    @http.route('/vehicle/gallery/json', type='json', auth='public', website=True)
    def vehicle_gallery(self, vehicle_id=None, **kwargs):
        vehicle_model = request.env['vehicle.vehicle'].sudo()
        vehicle = vehicle_model.browse(int(vehicle_id)) if vehicle_id else vehicle_model.search(
            [('images', '!=', False)],
            order='create_date desc',
            limit=1,
        )
        if not vehicle.exists():
            return []
        return [
            {
                'id': image.id,
                'caption': image.caption or '',
                'vehicle_id': vehicle.id,
            }
            for image in vehicle.images
        ]
