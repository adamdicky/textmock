import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
    slug: 'users',
    access: {
        admin: authenticated,
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },

    admin: {
        defaultColumns: ['name', 'email', 'tokens'],
        useAsTitle: 'name',
    },

    auth: true,
    fields: [
        {
            name: 'name',
            type: 'text',
        },

        {
            name: 'tokens',
            type: 'number',
            label: 'Token Balance (1USD = 10 Tokens)',
            defaultValue: 100, //Give new users 100 free tokens to start with
            min: 0,
            admin: {
                readOnly: true,
                description: 'Used to track available usage balance. 2 tokens consumed per saved scenario.'
            },
        },
    ],
    timestamps: true,
}