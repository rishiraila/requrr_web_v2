// swagger.config.js
import path from 'path';
import { fileURLToPath } from 'url';

// Required to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Next.js API',
      version: '1.0.0',
      description: 'Swagger documentation for all API routes',
    },
    servers: [], // Use empty array so Swagger picks up current domain
  },
  apis: [path.resolve(__dirname, 'src/app/api/**/*.js')], // 👈 FIXED: absolute path
};
