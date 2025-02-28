from odoo import http
from odoo.http import request

class VehicleDetailController(http.Controller):

    @http.route(['/vehicle/<int:vehicle_id>'], type='http', auth="public", website=True)
    def vehicle_detail(self, vehicle_id, **kwargs):
        vehicle = request.env['vehicle.vehicle'].sudo().browse(vehicle_id)
        if not vehicle.exists():
            return request.render("website.404")  # O bien, una página de error personalizada
        return request.render("cars_dealersheep.vehicle_detail_page", {'vehicle': vehicle})
