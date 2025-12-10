import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Scenarios: CollectionConfig = {
    slug: 'scenarios',
    access: {
        create: authenticated,
        read: authenticated,
        update: authenticated,
        delete: authenticated,
    },

    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'updatedAt', 'author'],
        description: 'Saved iMessage mockup scenarios created by users.',
    },

    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },

        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
            defaultValue: ({user}) => user?.id,
            admin: {
                readOnly: true,
                position: 'sidebar'
            },
        },

        {
            name: 'uiSettings',
            type: 'group',
            label: 'UI Customization',
            fields: [
                {
                    name: 'recipientName',
                    type: 'text',
                    label: 'Recipient Name (Displayed at Top)',
                    defaultValue: 'Customer Support',
                    required: true,
                },

                {
                    name: 'deviceFrame',
                    type: 'select',
                    label: 'Device Frame',
                    defaultValue: 'iPhone15Pro',
                    options: [
                        {label: 'iPhone 15 Pro (Minimal)', value: 'iPhone15Pro'},
                        {label: 'Screen Only (No Frame)', value: 'none'},
                    ],
                },

                {
                    name: 'chatType',
                    type: 'select',
                    label: 'Chat Type',
                    defaultValue: 'iMessage',
                    options: [
                        {label: 'iMessage (Blue/Gray)', value: 'iMessage'},
                        {label: 'SMS/Text (Green/Gray)', value: 'SMS'},
                    ],
                },

                {
                    name: 'darkTheme',
                    type: 'checkbox',
                    label: 'Enable Dark Mode UI',
                    defaultValue: false,
                },
            ],
        },

        {
            name: 'messages',
            type: 'array',
            label: 'Conversation Messages',
            minRows: 1,
            labels: {
                singular: 'Message',
                plural: 'Messages'
            },

            fields: [
                {
                    name: 'text',
                    type: 'textarea',
                    label: 'Message Content',
                    required: true,
                },

                {
                    name: 'isUserMessage',
                    type: 'checkbox',
                    label: 'Is Sent by Current User (Blue/Green Bubble)',
                    defaultValue: true,
                },

                {
                    name: 'timestamp',
                    type: 'text',
                    label: 'Time Label (e.g., "10:30AM" or "Delivered")',
                    defaultValue: 'Delivered',
                },

                {
                    name: 'status',
                    type: 'select',
                    label: 'Status Indicator',
                    defaultValue: 'sent',
                    options: [
                        {label: 'Sent', value: 'sent'},
                        {label: 'Delivered', value: 'delivered'},
                        {label: 'Read', value: 'read'},
                        {label: 'None', value: 'none'},
                    ],
                    admin: {
                        condition: (data) => data.isUserMessage, //Only show status for user's messages
                    },
                },
            ],
        },

        {
            name: 'previewImage',
            type: 'upload',
            relationTo: 'media',
            required: false,
            admin: {
                description: 'Auto generated screenshot of scenario.',
                readOnly: true,
            }
        },
    ],
};