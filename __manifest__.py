{
    'name': 'Vehicle Management',
    'version': '1.0',
    'category': 'Website',
    'summary': 'Gestión y visualización de vehículos en Odoo Website',
    'depends': ['website'],
    'data': [
        'views/vehicle_snippet.xml',            # Definición del snippet
        'views/website_snippet_templates.xml',    # Herencia de website.snippets
        'views/vehicle_views.xml',


    ],
    'assets': {
        'web.assets_frontend': [
            'cars_dealersheep/static/src/js/vehicle_snippet.js',
            'cars_dealersheep/static/src/xml/vehicle_snippet.xml',
            'cars_dealersheep/static/src/scss/theme.scss',
        ],
    },

    'installable': True,
    'application': False,
}
