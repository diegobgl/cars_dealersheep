# models/vehicle_ad.py
import json
import logging
import requests
from odoo import models, fields
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)

class VehicleAd(models.Model):
    _name = 'vehicle.ad'
    _description = 'Aviso de Publicación de Vehículo'

    vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo", required=True, ondelete="cascade")
    ad_state = fields.Selection([
        ('draft', 'Borrador'),
        ('pending', 'Pendiente de Publicación'),
        ('published', 'Publicado'),
        ('rejected', 'Rechazado'),
    ], string="Estado del Aviso", default='draft', tracking=True)
    publish_date = fields.Date(string="Fecha de Publicación")
    external_id = fields.Char(string="ID Externo", help="Identificador asignado por ChileAutos")
    notes = fields.Text(string="Observaciones")

    def publish_to_chileautos(self):
        ICP = self.env['ir.config_parameter'].sudo()
        url = ICP.get_param(
            'cars_dealersheep.chileautos_api_url',
            default='https://api.chileautos.cl/publicar_vehiculo'
        )
        api_key = ICP.get_param('cars_dealersheep.chileautos_api_key', default='')

        for ad in self:
            vehicle = ad.vehicle_id
            payload = {
                'vin': vehicle.vin,
                'brand': vehicle.brand,
                'model': vehicle.model,
                'year': vehicle.year,
                'price': vehicle.price,
                'mileage': vehicle.mileage,
                'fuel_type': vehicle.fuel_type,
                'transmission': vehicle.transmission,
                'vehicle_type': vehicle.vehicle_type,
                'patente': vehicle.patente or '',
                'description': vehicle.description or '',
            }
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
            }
            try:
                response = requests.post(
                    url,
                    data=json.dumps(payload),
                    headers=headers,
                    timeout=15,
                )
                if response.status_code == 200:
                    result = response.json()
                    ad.write({
                        'ad_state': 'published',
                        'publish_date': fields.Date.today(),
                        'external_id': result.get('id'),
                    })
                    _logger.info("Vehículo %s publicado en ChileAutos. ID externo: %s", vehicle.vin, result.get('id'))
                else:
                    _logger.warning("ChileAutos rechazó publicación de %s: %s", vehicle.vin, response.text)
                    ad.write({'ad_state': 'rejected'})
                    raise UserError(f"ChileAutos rechazó la publicación: {response.text}")
            except requests.exceptions.Timeout:
                raise UserError("La conexión con ChileAutos superó el tiempo de espera.")
            except requests.exceptions.RequestException as e:
                _logger.error("Error publicando en ChileAutos: %s", e)
                raise UserError(f"Error de conexión con ChileAutos: {e}")
        return True
