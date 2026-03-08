import re
import logging
import requests
from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)

class Vehicle(models.Model):
    _name = 'vehicle.vehicle'
    _description = 'Vehicle'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _sql_constraints = [
        ('vehicle_vin_unique', 'unique(vin)', 'El VIN debe ser único.'),
    ]

    name = fields.Char(string="Nombre del Vehículo", required=True, tracking=True)
    vin = fields.Char(string="VIN", required=True, tracking=True)
    brand = fields.Char(string="Marca", tracking=True)
    model = fields.Char(string="Modelo", tracking=True)
    year = fields.Integer(string="Año", tracking=True)
    price = fields.Float(string="Precio", tracking=True)
    mileage = fields.Float(string="Kilometraje (KM)", tracking=True)
    fuel_type = fields.Selection([
        ('gasoline', 'Gasolina'),
        ('diesel', 'Diésel'),
        ('electric', 'Eléctrico'),
        ('hybrid', 'Híbrido')],
        string="Tipo de Combustible", tracking=True
    )
    transmission = fields.Selection([
        ('manual', 'Manual'),
        ('automatic', 'Automática')],
        string="Transmisión", tracking=True
    )
    status = fields.Selection([
        ('available', 'Disponible'),
        ('reserved', 'Reservado'),
        ('sold', 'Vendido')],
        string="Estado",
        default="available",
        tracking=True
    )
    image = fields.Image(string="Imagen del Vehículo")

    # Campos adicionales para documentación en Chile
    patente = fields.Char(string="Patente", tracking=True)
    motor_number = fields.Char(string="Número de Motor", tracking=True)
    chasis_number = fields.Char(string="Número de Chasis", tracking=True)
    matriculation_date = fields.Date(string="Fecha de Matriculación")
    review_date = fields.Date(string="Fecha de Revisión Técnica")
    registration_certificate = fields.Binary(string="Certificado de Inscripción")
    circulation_permit = fields.Binary(string="Permiso de Circulación")
    soat = fields.Binary(string="Certificado SOAP")
    certificate_of_history = fields.Binary(string="Certificado de Multas")
    description = fields.Text(string="Descripción")
    images = fields.One2many('vehicle.image', 'vehicle_id', string="Galería de Imágenes")
    vehicle_type = fields.Selection([
        ('auto', 'Auto'),
        ('camioneta', 'Camioneta'),
        ('camion', 'Camión'),
        ('moto', 'Moto'),
    ], string="Tipo de Vehículo", tracking=True)
    ad_ids = fields.One2many('vehicle.ad', 'vehicle_id', string="Avisos Publicados")

    def _normalize_fuel_type(self, value):
        normalized = (value or '').strip().lower()
        mapping = {
            'gasoline': 'gasoline',
            'gas': 'gasoline',
            'diesel': 'diesel',
            'electric': 'electric',
            'hybrid': 'hybrid',
            'hybrid electric': 'hybrid',
            'plug-in hybrid': 'hybrid',
        }
        return mapping.get(normalized)

    def _normalize_transmission(self, value):
        normalized = (value or '').strip().lower()
        mapping = {
            'manual': 'manual',
            'automatic': 'automatic',
            'auto': 'automatic',
            'continuously variable transmission (cvt)': 'automatic',
        }
        return mapping.get(normalized)


    @api.constrains('vin')
    def _check_vin(self):
        for record in self:
            if record.vin and not re.match(r'^[A-HJ-NPR-Z0-9]{17}$', record.vin.upper()):
                raise ValidationError("El VIN debe tener 17 caracteres alfanuméricos (sin I, O ni Q).")

    @api.constrains('year')
    def _check_year(self):
        for record in self:
            if record.year and not (1900 <= record.year <= 2100):
                raise ValidationError("El año debe estar entre 1900 y 2100.")

    @api.constrains('price')
    def _check_price(self):
        for record in self:
            if record.price < 0:
                raise ValidationError("El precio no puede ser negativo.")

    def fetch_vehicle_data(self):
        """Consulta la API de la NHTSA con el VIN y completa la información del vehículo."""
        ICP = self.env['ir.config_parameter'].sudo()
        api_url = ICP.get_param(
            'cars_dealersheep.nhtsa_api_url',
            default='https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json'
        )
        try:
            response = requests.get(api_url.format(vin=self.vin), timeout=10)
            response.raise_for_status()
        except requests.exceptions.Timeout:
            raise UserError("La consulta al servicio NHTSA superó el tiempo de espera.")
        except requests.exceptions.RequestException as e:
            _logger.error("Error consultando NHTSA para VIN %s: %s", self.vin, e)
            raise UserError("No se pudo conectar al servicio NHTSA. Intente nuevamente.")

        data = response.json()
        results = data.get('Results', [])
        self.brand = next((item['Value'] for item in results if item['Variable'] == 'Make'), '')
        self.model = next((item['Value'] for item in results if item['Variable'] == 'Model'), '')
        year_str = next((item['Value'] for item in results if item['Variable'] == 'Model Year'), '')
        self.year = int(year_str) if year_str and year_str.isdigit() else 0
        self.fuel_type = self._normalize_fuel_type(
            next((item['Value'] for item in results if item['Variable'] == 'Fuel Type - Primary'), '')
        )
        self.transmission = self._normalize_transmission(
            next((item['Value'] for item in results if item['Variable'] == 'Transmission Style'), '')
        )

# class SaleOrder(models.Model):
#     _inherit = 'sale.order'

#     vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo Vendido")

# class PurchaseOrder(models.Model):
#     _inherit = 'purchase.order'

#     vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo Comprado")
