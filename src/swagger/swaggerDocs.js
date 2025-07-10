// src/swagger/swaggerDocs.js
import {authPaths} from './paths/auth'
import {clientPaths} from './paths/clients'
import {couponPaths} from './paths/coupons'
import {incomePaths} from './paths/income'
import {notificationPaths} from './paths/notifications'
import {paymentPaths} from './paths/payments'
import {planPaths} from './paths/plans'
import {servicePaths} from './paths/services'
import {subscriptionPaths} from './paths/subscriptions'
import {transactionPaths} from './paths/transactions'
import {userPaths} from './paths/users'
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
        ...clientPaths,
        ...couponPaths,
        ...incomePaths,
        ...notificationPaths,
        ...paymentPaths,
        ...planPaths,
        ...servicePaths,
        ...subscriptionPaths,
        ...transactionPaths,
        ...userPaths

        // Add more paths here
    },
};
