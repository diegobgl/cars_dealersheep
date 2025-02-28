from odoo import models, fields

class VehicleImage(models.Model):
    _name = 'vehicle.image'
    _description = 'Imagen del Vehículo'

    vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo", ondelete="cascade")
    image = fields.Image(string="Imagen")
    caption = fields.Char(string="Leyenda")
