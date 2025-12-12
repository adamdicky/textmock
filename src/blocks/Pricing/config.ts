import type { Block } from 'payload'

export const Pricing: Block = {
  slug: 'pricing',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Simple Pricing',
    },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Plan Name (e.g. Starter)',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price String (e.g. $5)',
          required: true,
        },
        {
          name: 'tokens',
          type: 'number',
          label: 'Number of Tokens',
          required: true,
        },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'text', type: 'text' }],
        },
        {
          name: 'isPopular',
          type: 'checkbox',
          label: 'Mark as Popular',
        },
      ],
    },
  ],
}