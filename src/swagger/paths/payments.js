export const paymentPaths = {
  '/api/payment/create-order': {
    post: {
      summary: 'Create a Razorpay order for a plan purchase',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['planId'],
              properties: {
                planId: { type: 'integer', example: 2 },
                couponCode: { type: 'string', example: 'WELCOME10' },
                userCurrency: { type: 'string', example: 'USD' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Razorpay order created and pricing info returned',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'order_JcWjTtqvYzvYpm' },
                  entity: { type: 'string', example: 'order' },
                  amount: { type: 'integer', example: 49900 },
                  currency: { type: 'string', example: 'INR' },
                  receipt: { type: 'string', example: 'receipt_12_1717710408000' },
                  status: { type: 'string', example: 'created' },
                  planId: { type: 'integer', example: 2 },
                  originalPrice: { type: 'number', example: 499 },
                  discount: { type: 'number', example: 50 },
                  finalPrice: { type: 'number', example: 449 },
                  localPrice: { type: 'number', example: 5.42 },
                  localCurrency: { type: 'string', example: 'USD' },
                  couponCode: { type: 'string', example: 'WELCOME10' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid input (e.g., missing planId or invalid coupon)' },
        401: { description: 'Unauthorized' },
        500: { description: 'Order creation failed' },
      },
    },
  },

  '/api/payment/verify': {
    post: {
      summary: 'Verify Razorpay payment and activate subscription',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'razorpay_order_id',
                'razorpay_payment_id',
                'razorpay_signature',
                'plan_id',
                'final_price',
                'currency',
              ],
              properties: {
                razorpay_order_id: {
                  type: 'string',
                  example: 'order_LztJ7VGcZ0BipD',
                },
                razorpay_payment_id: {
                  type: 'string',
                  example: 'pay_LztJHMEt5U8Rqq',
                },
                razorpay_signature: {
                  type: 'string',
                  example: 'd24a6dc1b8893e17c987e5f6c84e9f3f2e1b30d0d7fae7df69fc6bd264da2c58',
                },
                plan_id: { type: 'integer', example: 2 },
                coupon_code: { type: 'string', nullable: true, example: 'SAVE20' },
                final_price: {
                  type: 'number',
                  description: 'Final amount paid by the user (in local currency)',
                  example: 9.99,
                },
                currency: {
                  type: 'string',
                  description: 'Currency in which payment was made (e.g., INR, USD)',
                  example: 'USD',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Subscription verified and activated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Subscription activated' },
                  plan: { type: 'string', example: 'Premium' },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid request or signature',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Invalid signature' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Server or database error' },
      },
    },
  },
};
