import type { CollectionConfig } from "payload";
import { auth } from "node_modules/payload/dist/auth/operations/auth";
import { authenticated } from '@/access/authenticated'

export const Transactions: CollectionConfig = {
    slug: 'transactions',
    access: {
        //Only users and admins can read, only admins can create/update
        create: () => false,
        read: authenticated,
        update: () => false,
        delete: () => false,
    },

    admin: {
        useAsTitle: 'type',
        defaultColumns: ['author', 'type', 'amount', 'referenceID', 'createdAt'],
        description: 'Logs all token purchases and consumption events'
    },

    fields: [
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },

        {
            name: 'type',
            type: 'select',
            options: [
                {label: 'Purchase', value: 'purchase'},
                {label: 'Consumption (Save)', value: 'consumption'},
                {label: 'Bonus', value: 'bonus'},
            ],
            required: true,
        },

        {
            name: 'amount',
            type: 'number',
            label: 'Token Change',
            required: true,
            admin: {
                description: 'Positive for addition, negative for subtraction.',
            },
        },

        {
            name: 'referenceID',
            type: 'text',
            label: 'Reference ID (Scenario ID)',
            admin: {
                description: 'ID of the saved scenario (for consumption)'
            },
        },
    ],
};