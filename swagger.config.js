import path from 'path';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Next.js API',
      version: '1.0.0',
      description: 'Swagger documentation for all API routes',
    },
    servers: [], // Leave empty so Swagger UI uses the current domain automatically
  },
  // Use absolute path resolution — important for Vercel and some bundlers
  apis: [path.resolve(process.cwd(), 'src/app/api/**/*.js')],
};
