from odoo import models, fields, api
import requests

class Vehicle(models.Model):
    _name = 'vehicle.vehicle'
    _description = 'Vehicle'
    _inherit = ['mail.thread', 'mail.activity.mixin']  # Para notificaciones y actividades

    name = fields.Char(string="Nombre del Vehículo", required=True, tracking=True)
    vin = fields.Char(string="VIN", required=True, unique=True, tracking=True)
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


    def fetch_vehicle_data(self):
        """ Consulta la API de la NHTSA con el VIN y completa la información del vehículo. """
        api_url = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
        response = requests.get(api_url.format(vin=self.vin))

        if response.status_code == 200:
            data = response.json()
            results = data.get('Results', [])
            self.brand = next((item['Value'] for item in results if item['Variable'] == 'Make'), '')
            self.model = next((item['Value'] for item in results if item['Variable'] == 'Model'), '')
            self.year = next((item['Value'] for item in results if item['Variable'] == 'Model Year'), 0)
            self.fuel_type = next((item['Value'] for item in results if item['Variable'] == 'Fuel Type - Primary'), '')
            self.transmission = next((item['Value'] for item in results if item['Variable'] == 'Transmission Style'), '')
        else:
            raise ValueError("No se pudo obtener información del VIN")

# class SaleOrder(models.Model):
#     _inherit = 'sale.order'

#     vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo Vendido")

# class PurchaseOrder(models.Model):
#     _inherit = 'purchase.order'

#     vehicle_id = fields.Many2one('vehicle.vehicle', string="Vehículo Comprado")
