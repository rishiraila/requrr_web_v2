// swagger.config.js
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Next.js API',
      version: '1.0.0',
      description: 'Swagger documentation for all API routes',
    },
    servers: [], // leave empty to inject dynamically
  },
  apis: ['./src/app/api/**/*.js'], // adjust as needed
};

export default swaggerOptions;
