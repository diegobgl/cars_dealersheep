from odoo import http
from odoo.http import request

class VehicleHomePage(http.Controller):
    @http.route(['/home/vehicles'], type='http', auth='public', website=True)
    def home_vehicles(self, **kwargs):
        return request.render("cars_dealersheep.cars_dealersheep_home_page", {})
