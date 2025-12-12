import type { Block } from "payload";

export const Features: Block = {
    slug: 'features',
    interfaceName: 'FeaturesBlock',
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Section Title',
            defaultValue: 'Why use TextMock?'
        },

        {
            name: 'items',
            type: 'array',
            label: 'Feature Items',
            minRows: 1,
            maxRows: 6,
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'icon',
                    type: 'select',
                    options: [
                        {label: 'Smartphone', value: 'smartphone'},
                        {label: 'Shield', value: 'shield'},
                        {label: 'Zap', value: 'zap'},
                        {label: 'Globe', value: 'globe'},
                    ],
                },
            ],
        },
    ],
}