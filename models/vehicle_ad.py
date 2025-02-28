# models/vehicle_ad.py
from odoo import models, fields

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

    def publish_to_chileautos(self, ad_id):
        ad = self.browse(ad_id)
        vehicle = ad.vehicle_id
        # Prepara los datos según la documentación de la API
        payload = {
            'vin': vehicle.vin,
            'brand': vehicle.brand,
            'model': vehicle.model,
            'year': vehicle.year,
            'price': vehicle.price,
            'vehicle_type': vehicle.vehicle_type,
            # Agrega otros campos necesarios...
        }
        # Ejemplo: URL y headers (ajusta según la documentación de ChileAutos)
        url = "https://api.chileautos.cl/publicar_vehiculo"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        if response.status_code == 200:
            result = response.json()
            # Actualiza el estado y guarda el identificador externo
            ad.write({
                'ad_state': 'published',
                'publish_date': fields.Date.today(),
                'external_id': result.get('id')
            })
        else:
            ad.write({'ad_state': 'rejected'})
        return True
