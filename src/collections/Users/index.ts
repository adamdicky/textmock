import type { CollectionConfig, Access } from 'payload'

import { authenticated } from '@/access/authenticated'

const isAdminOrSelf = ({ req: {user}, id }: { req: {user?: any}, id?: string | number }) => {
    if (user?.role === 'admin') return true
    if (user?.id === id) return true
    return false
}

const isAdmin = ({ req: {user} }: { req: {user?: any} }) => {
    return user?.role === 'admin'
}

export const Users: CollectionConfig = {
    slug: 'users',

    admin: {
        useAsTitle: 'email',
        defaultColumns: ['name', 'email', 'role', 'tokens'],
    },

    access: {
        admin: isAdmin,
        create: () => true,
        read: isAdminOrSelf,
        update: isAdminOrSelf,
        delete: isAdmin,
    },

    auth: true,

    fields: [
        {
            name: 'name',
            type: 'text',
        },

        {
            name: 'role',
            type: 'select',
            options: [
                {label: 'Admin', value: 'admin'},
                {label: 'User', value: 'user'},
            ],
            defaultValue: 'user',
            required: true,
            saveToJWT: true,
            access: {
                create: isAdmin,
                update: isAdmin,
            }
        },

        {
            name: 'tokens',
            type: 'number',
            label: 'Token Balance (1USD = 10 Tokens)',
            defaultValue: 0,
            min: 0,
            admin: {
                description: 'User token balance.'
            },
            access: {
                update: isAdmin,
                read: isAdminOrSelf,
            }
        },
    ],
    timestamps: true,
}