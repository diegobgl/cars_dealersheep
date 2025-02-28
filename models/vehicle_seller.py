# models/vehicle_seller.py
from odoo import models, fields

class VehicleSeller(models.Model):
    _name = 'vehicle.seller'
    _description = 'Vendedor de Vehículos'

    partner_id = fields.Many2one('res.partner', string='Vendedor', required=True)
    dealer_code = fields.Char("Código del Concesionario")
