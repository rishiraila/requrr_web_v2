export const transactionPaths = {
  '/api/transactions/users': {
    get: {
      summary: 'Get all user transactions and subscription details (Admin only)',
      description:
        "Returns all users (with role 'user') along with their subscription info, total payments, and all transaction history. Requires admin authentication.",
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved all user transaction and subscription data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        plan: { type: 'string', example: 'Pro' },
                        plan_start: {
                          type: 'string',
                          format: 'date',
                          example: '2024-07-01',
                        },
                        plan_end: {
                          type: 'string',
                          format: 'date',
                          example: '2025-07-01',
                        },
                        total_paid: {
                          type: 'number',
                          format: 'float',
                          example: 199.99,
                        },
                        transactions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer' },
                              plan_id: { type: 'integer' },
                              coupon_code: { type: 'string', nullable: true },
                              original_price: { type: 'number' },
                              discount: { type: 'number' },
                              final_price: { type: 'number' },
                              razorpay_order_id: { type: 'string' },
                              razorpay_payment_id: { type: 'string' },
                              status: { type: 'string', example: 'success' },
                              message: { type: 'string' },
                              created_at: {
                                type: 'string',
                                format: 'date-time',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized (if user is not admin)',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
};
