{
    'name': 'Vehicle Management',
    'version': '1.0',
    'category': 'Website',
    'summary': 'Gestión y visualización de vehículos en Odoo Website',
    'depends': ['website'],
    'data': [
        'views/snippets/website_snippet_templates.xml', 
        'views/snippets/vehicle_snippet.xml', 
        'static/src/js/vehicle_snippet_options.xml',  
         'views/vehicle_detail.xml',
        'views/vehicle_views.xml',


    ],
    'assets': {
        'web.assets_frontend': [
            'cars_dealersheep/static/src/js/vehicle_snippet.js',
            'cars_dealersheep/static/src/js/vehicle_snippet_options.js',
            'cars_dealersheep/static/src/scss/theme.scss',
            'cars_dealersheep/static/src/css/vehicle_snippet.css',
        ],
    },

    'installable': True,
    'application': False,
}
