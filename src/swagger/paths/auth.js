// src/swagger/paths/auth.js

export const authPaths = {
  '/api/auth/login': {
    post: {
      summary: 'Login a user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  example: 'yourpassword',
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Auth success' },
        401: { description: 'Invalid credentials' },
      },
    },
  },

  '/api/auth/signup': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      description: 'Creates a new user and assigns a free subscription plan.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                username: {
                  type: 'string',
                  example: 'johndoe123',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'john@example.com',
                },
                password: {
                  type: 'string',
                  example: 'strongpassword123',
                },
                first_name: {
                  type: 'string',
                  example: 'John',
                },
                last_name: {
                  type: 'string',
                  example: 'Doe',
                },
                country_code: {
                  type: 'string',
                  example: 'IN',
                },
                phone_code: {
                  type: 'string',
                  example: '+91',
                },
                phone: {
                  type: 'string',
                  example: '9876543210',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User created and subscribed to Free plan',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'User created and subscribed to Free plan',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'User already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'User already exists',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/me': {
    get: {
      summary: 'Get current authenticated user profile',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved user data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'johndoe' },
                  email: { type: 'string', example: 'johndoe@example.com' },
                  first_name: { type: 'string', example: 'John' },
                  last_name: { type: 'string', example: 'Doe' },
                  country_code: { type: 'string', example: 'AU' },
                  phone_code: { type: 'string', example: '+61' },
                  phone: { type: 'string', example: '412345678' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
        },
      },
    },
  },
};
