# models/vehicle_purchase.py
from odoo import models, fields

class VehiclePurchase(models.Model):
    _name = 'vehicle.purchase'
    _description = 'Compra de Vehículo'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    buyer_id = fields.Many2one('vehicle.buyer', string='Comprador', required=True)
    seller_id = fields.Many2one('vehicle.seller', string='Vendedor', required=True)
    vehicle_id = fields.Many2one('vehicle.vehicle', string='Vehículo', required=True)
    product_id = fields.Many2one('product.product', string='Producto Vehículo', help='Producto representativo de la marca y/o modelo, con detalles en la descripción')
    purchase_order_id = fields.Many2one('purchase.order', string='Orden de Compra')
    purchase_date = fields.Date(string='Fecha de Compra', default=fields.Date.context_today)
    price = fields.Float(string='Precio de Compra')
    description = fields.Text(string='Detalles de la Compra')
