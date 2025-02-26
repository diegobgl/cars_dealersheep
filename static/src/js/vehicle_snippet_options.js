/** @odoo-module **/

import options from 'web_editor.snippets.options';

options.registry.VehicleSnippetOptions = options.Class.extend({
    start() {
        // Lógica de opciones personalizada (si se requiere)
        return this._super.apply(this, arguments);
    },
});

export default {
    VehicleSnippetOptions: options.registry.VehicleSnippetOptions,
};
