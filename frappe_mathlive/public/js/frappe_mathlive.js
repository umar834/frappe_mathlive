function replaceWithMathFieldForTextarea($textarea, fieldname, frm, is_child_table = false) {
    console.log('Replacing textarea for field:', fieldname);
    const currentValue = $textarea.val();
    $textarea.css({
        'visibility': 'hidden',
        'position': 'absolute',
        'width': '0',
        'height': '0',
        'padding': '0',
        'border': 'none'
    });

    if (!$textarea.siblings('math-field').length) {
        const $mathField = $('<math-field class="input-with-feedback form-control">' + currentValue + '</math-field>').insertAfter($textarea);
        $mathField.css({
            'width': '100%',
            'height': '200px'
        });

        $mathField.on('input', function() {
            const newValue = $mathField.val();
            $textarea.val(newValue);
            $textarea.trigger('change');
        });
    }
}

// the following two handles will watch the page changes everywhere
$(window).on('hashchange', page_changed);
$(window).on('load', page_changed);

function page_changed(event) {
    // waiting for page to load completely
    frappe.after_ajax(function () {
        var route = frappe.get_route();
        if (route[0] == "Form") {
            // Add a flag to track if child handlers are already set
            let childHandlersSet = false;

            frappe.ui.form.on(route[1], {
                onload: function (frm) {
                    if (typeof MathLive === 'undefined') {
                        console.error('MathLive is not loaded.');
                        return;
                    } else {
                        console.log('MathLive is loaded.');
                    }
            
                    function applyMathLiveToAllTextareas() {
                        // Apply MathLive to top-level text areas
                        $.each(frm.fields_dict, function(fieldname, field) {
                            if (field.df.fieldtype === 'Long Text') {
                                const $textarea = field.$wrapper.find('textarea');
                                if ($textarea.length) {
                                    replaceWithMathFieldForTextarea($textarea, fieldname, frm);
                                }
                            }
                        });
                    }
                    applyMathLiveToAllTextareas();

                    // Childtable code
                    if (!childHandlersSet) {
                        childHandlersSet = true; // Mark handlers as set
                        frm.meta.fields.forEach(field => {
                            if (field.fieldtype === 'Table') {
                                // Bind events dynamically to each child doctype
                                frappe.ui.form.on(field.options, {
                                    form_render: function (frm, cdt, cdn) {
                                        console.log('form_render called');
                                        const row = locals[cdt][cdn];
                                    
                                        // Find the parentfield dynamically
                                        const child_table_field = frm.meta.fields.find(field => field.fieldtype === 'Table' && field.fieldname === row.parentfield);
                                    
                                        if (!child_table_field) {
                                            console.error(`Child table for parentfield "${row.parentfield}" not found.`);
                                            return;
                                        }
                                    
                                        // Access the row wrapper dynamically
                                        let row_wrapper = null;
                                        try {
                                            row_wrapper = frm.fields_dict[row.parentfield].grid.grid_rows.find(r => r.doc.name === row.name).wrapper;
                                        } catch (e) {
                                            console.error('Could not find row wrapper for row:', row.name, e);
                                            return;
                                        }
                                    
                                        // Process the row wrapper to replace textareas with MathField
                                        $(row_wrapper).find('textarea').each(function () {
                                            const $textarea = $(this);
                                            const fieldname = $textarea.attr('data-fieldname');
                                            replaceWithMathFieldForTextarea($textarea, fieldname, frm, true);
                                        });
                                    }
                                });
                            }
                        });
                    }
                },
                refresh: function (frm) {
                    frm.trigger('onload');
                }
            });
        }
    });
}
