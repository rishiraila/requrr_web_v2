// src/swagger/swaggerDocs.js
import {authPaths} from './paths/auth'
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'My Next.js API',
        version: '1.0.0',
        description: 'Swagger documentation for all API routes',
    },
    servers: [
        { url: 'https://www.requrr.com' },
        { url: 'http://localhost:3000' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        ...authPaths,
        // Add more paths here
    },
};
