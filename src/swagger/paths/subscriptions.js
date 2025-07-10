export const subscriptionPaths = {
  '/api/subscription/status': {
    get: {
      summary: 'Get current user\'s active subscription status',
      tags: ['Subscriptions'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Subscription details or unsubscribed status',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      subscribed: { type: 'boolean', example: false },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      subscribed: { type: 'boolean', example: true },
                      plan_name: { type: 'string', example: 'Premium' },
                      price_inr: { type: 'number', example: 999 },
                      price_usd: { type: 'number', example: 12.99 },
                      final_price: {
                        type: 'number',
                        description: 'Final amount paid by the user',
                        example: 9.99,
                      },
                      currency: {
                        type: 'string',
                        description: 'Payment currency',
                        example: 'USD',
                      },
                      start_date: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-07-09T12:00:00',
                      },
                      end_date: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-07-09T12:00:00',
                      },
                      max_renewals: {
                        type: 'integer',
                        nullable: true,
                        example: 10,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },

  '/api/subscription/status/{userId}': {
    get: {
      summary: 'Check subscription status for a specific user',
      description:
        'Returns whether the user with the given `userId` has an active subscription and its end date.',
      tags: ['Subscription'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the user',
        },
      ],
      responses: {
        200: {
          description: 'Subscription status found',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      subscribed: { type: 'boolean', example: false },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      subscribed: { type: 'boolean', example: true },
                      end_date: {
                        type: 'string',
                        format: 'date',
                        example: '2025-08-01',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Server error' },
      },
    },
  },
};
