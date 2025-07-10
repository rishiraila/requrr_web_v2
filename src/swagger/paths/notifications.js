export const notificationPaths = {
  '/api/notification-preferences': {
    get: {
      summary: "Get current user's notification preferences",
      tags: ['Notifications'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Fetched preferences successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  remind_30_days_before: { type: 'boolean' },
                  remind_15_days_before: { type: 'boolean' },
                  remind_7_days_before: { type: 'boolean' },
                  remind_overdue: { type: 'boolean' },
                  email_notifications: { type: 'boolean' },
                  dashboard_notifications: { type: 'boolean' },
                  payment_received_notifications: { type: 'boolean' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
        },
        500: {
          description: 'Database error',
        },
      },
    },

    put: {
      summary: 'Update notification preferences',
      tags: ['Notifications'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                remind_30_days_before: { type: 'boolean' },
                remind_15_days_before: { type: 'boolean' },
                remind_7_days_before: { type: 'boolean' },
                remind_overdue: { type: 'boolean' },
                email_notifications: { type: 'boolean' },
                dashboard_notifications: { type: 'boolean' },
                payment_received_notifications: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Preferences updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Preferences updated' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Failed to update preferences' },
      },
    },
  },
};
