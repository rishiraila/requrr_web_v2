// swagger.config.js

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Next.js API',
            version: '1.0.0',
            description: 'Swagger documentation for all API routes',
        },
        servers: [], // Injected dynamically
    },
    //   apis: [path.resolve(__dirname, './src/swagger/swaggerDocs.js')],
    apis: ['./swaggerDocs.js']
};

export default swaggerOptions;
