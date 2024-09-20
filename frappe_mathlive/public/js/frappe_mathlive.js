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

frappe.ui.form.on('Quiz', {
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

            // Apply MathLive to textareas in child tables
            $.each(frm.fields_dict, function(fieldname, field) {
                if (field.df.fieldtype === 'Table' && field.grid) {
                    const rows = field.grid.get_data();
                    rows.forEach(row => {
                        const $row_wrapper = $(field.grid.get_row(row.name).wrapper);

                        $row_wrapper.find('textarea').each(function() {
                            const $textarea = $(this);
                            const child_fieldname = $textarea.attr('data-fieldname');
                            const fieldnameParts = [field.df.fieldname, child_fieldname, row.name].join('.'); // Construct the full fieldname
                            replaceWithMathFieldForTextarea($textarea, fieldnameParts, frm, true);
                        });
                    });
                }
            });
        }

        applyMathLiveToAllTextareas();
    },
    refresh: function (frm) {
        frm.trigger('onload');
    }
});

frappe.ui.form.on('Quiz Question', {
    form_render: function (frm, cdt, cdn) {
        const row = locals[cdt][cdn];

        // Access the row wrapper
        let row_wrapper = null;
        if(row.parentfield == "set_1") {
            row_wrapper = frm.fields_dict.set_1.grid.grid_rows.find(r => r.doc.name === row.name).wrapper;
        } else if(row.parentfield == "set_2") {
            row_wrapper = frm.fields_dict.set_2.grid.grid_rows.find(r => r.doc.name === row.name).wrapper;
        } else if(row.parentfield == "set_3") {
            row_wrapper = frm.fields_dict.set_3.grid.grid_rows.find(r => r.doc.name === row.name).wrapper;
        }
        else {
            console.error('Could not find row wrapper for row:', row.name);
            return;
        }
        $(row_wrapper).find('textarea').each(function() {
            const $textarea = $(this);
            const fieldname = $textarea.attr('data-fieldname');
            replaceWithMathFieldForTextarea($textarea, fieldname, frm, true);
        });
    }
});
