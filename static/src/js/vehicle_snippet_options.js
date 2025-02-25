/** @odoo-module **/

import options from 'web_editor.snippets.options';

options.registry.VehicleSnippetOptions = options.Class.extend({
    start() {
        // Aquí puedes agregar lógica para opciones personalizadas.
        return this._super.apply(this, arguments);
    },
});

export default {
    VehicleSnippetOptions: options.registry.VehicleSnippetOptions,
};
