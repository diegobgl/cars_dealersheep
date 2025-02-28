from odoo import models, fields

class VehicleSale(models.Model):
    _name = 'vehicle.sale'
    _description = 'Venta de Vehículos'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    buyer_id = fields.Many2one('vehicle.buyer', string='Comprador', required=True)
    seller_id = fields.Many2one('vehicle.seller', string='Vendedor', required=True)
    vehicle_id = fields.Many2one('vehicle.vehicle', string='Vehículo', required=True)
    sale_order_id = fields.Many2one('sale.order', string='Orden de Venta')
    sale_date = fields.Date(string='Fecha de Venta', default=fields.Date.context_today)
    price = fields.Float(string='Precio de Venta', required=True)
    description = fields.Text(string='Detalles de la Venta')
