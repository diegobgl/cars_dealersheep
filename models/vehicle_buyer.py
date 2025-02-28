from odoo import models, fields

class VehicleBuyer(models.Model):
    _name = 'vehicle.buyer'
    _description = 'Comprador de Vehículos'
    _inherit = ['mail.thread', 'mail.activity.mixin']  # Para notificaciones y actividades


    partner_id = fields.Many2one('res.partner', string='Comprador', required=True)
    identification_number = fields.Char("Número de Identificación")
