export const userPaths = {
  '/api/users/all': {
    get: {
      summary: 'Get all user accounts',
      description: "Returns a list of all users with role 'user'. Requires authentication.",
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved list of users',
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
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'johndoe@example.com' },
                        created_at: {
                          type: 'string',
                          format: 'date-time',
                          example: '2024-06-01T12:34:56.000Z',
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
          description: 'Unauthorized (missing or invalid token)',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    },
  },

  '/api/users/change-password': {
    put: {
      summary: 'Change user password',
      description: 'Allows an authenticated user to change their password.',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string', example: 'oldpassword123' },
                newPassword: { type: 'string', example: 'newSecurePassword!456' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Password changed successfully' },
                },
              },
            },
          },
        },
        400: {
          description: 'Incorrect current password',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Incorrect current password' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized (missing or invalid token)',
        },
      },
    },
  },

  '/api/users/delete-account': {
    delete: {
      summary: 'Delete user account',
      description: 'Allows an authenticated user to delete their account permanently.',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Account deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Account deleted successfully' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized (missing or invalid token)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Unauthorized' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/forgot-password': {
    post: {
      summary: 'Forgot password',
      description: "Generates a temporary password and sends it to the user's email.",
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Temporary password sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Temporary password sent to your email',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Email not registered',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Email not registered' },
                },
              },
            },
          },
        },
        500: {
          description: 'Failed to send email',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Failed to send email. Please try again.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/users/insights': {
    get: {
      summary: 'Get admin insights',
      description:
        'Retrieves insight data for all users including total clients, services, renewals, payments, and subscription details. Requires admin role.',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved insights',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  insights: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'johndoe@example.com' },
                        role: { type: 'string', example: 'user' },
                        created_at: { type: 'string', format: 'date-time' },
                        total_clients: { type: 'integer', example: 5 },
                        total_services: { type: 'integer', example: 3 },
                        total_renewals: { type: 'integer', example: 12 },
                        total_paid: { type: 'number', example: 2999.99 },
                        paid_transactions: {
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
                              status: { type: 'string' },
                              message: { type: 'string' },
                              created_at: { type: 'string', format: 'date-time' },
                            },
                          },
                        },
                        plan: { type: 'string', example: 'Pro' },
                        plan_start: { type: 'string', format: 'date-time' },
                        plan_end: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized access (only admin allowed)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Unauthorized' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    },
  },

  '/api/users/update-profile': {
    put: {
      summary: 'Update user profile',
      description:
        "Updates the authenticated user's profile information including name, email, and contact details.",
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email'],
              properties: {
                username: { type: 'string', example: 'johndoe' },
                email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
                first_name: { type: 'string', example: 'John' },
                last_name: { type: 'string', example: 'Doe' },
                country_code: { type: 'string', example: 'IN' },
                phone_code: { type: 'string', example: '+91' },
                phone: { type: 'string', example: '9876543210' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Account updated successfully' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized access',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Unauthorized' },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
};
