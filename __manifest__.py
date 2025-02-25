{
    'name': 'Vehicle Management',
    'version': '1.0',
    'category': 'Website',
    'summary': 'Gestión y visualización de vehículos en Odoo Website',
    'depends': ['website'],
    'data': [
        'views/snippets/vehicle_snippet_menu.xml',    # Herencia de website.snippets
        'views/snippets/vehicle_snippet_content.xml',            # Definición del snippet
        'views/vehicle_views.xml',


    ],
    'assets': {
        'web.assets_frontend': [
            'cars_dealersheep/static/src/js/vehicle_snippet.js',
            'cars_dealersheep/static/src/scss/theme.scss',
            'cars_dealersheep/static/src/css/vehicle_snippet.css',
        ],
    },

    'installable': True,
    'application': False,
}
