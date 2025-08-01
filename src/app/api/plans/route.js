/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of available plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Starter
 *                   price:
 *                     type: number
 *                     example: 12000
 *                   price_inr:
 *                     type: number
 *                     example: 12000
 *                   price_usd:
 *                     type: number
 *                     example: 144.30
 *                   max_renewals:
 *                     type: integer
 *                     nullable: true
 *                     example: 10
 *                   description:
 *                     type: string
 *                     example: Basic plan with 10 renewals
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium
 *               price:
 *                 type: number
 *                 example: 12000
 *               max_renewals:
 *                 type: integer
 *                 nullable: true
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: Full access plan with 50 renewals
 *     responses:
 *       200:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

// import { db } from '../../../db'
// import { authenticate } from '../../../middleware/auth';


// export async function POST(req) {
//   const user = authenticate(req);
//   if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

//   const { name, price_inr, price_usd, max_renewals = null, description = '' } = await req.json();

//   if (!name || price_inr === undefined || price_usd === undefined) {
//     return Response.json({ error: 'Name, price_inr and price_usd are required' }, { status: 400 });
//   }

//   try {
//     await db.query(
//       `INSERT INTO plans (name, price, max_renewals, description, price_inr, price_usd) VALUES (?, ?, ?, ?, ?, ?)`,
//       [name, price_inr, max_renewals, description, price_inr, price_usd]
//     );
//     return Response.json({ message: 'Plan created successfully' });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ error: 'Database error' }, { status: 500 });
//   }
// }

import Razorpay from 'razorpay';
import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export async function GET() {
  const [plans] = await db.query(
    'SELECT id, name, price, price_inr, price_usd, max_renewals, description FROM plans ORDER BY price ASC'
  );
  return Response.json(plans);
}

export async function POST(req) {
  try {
    const user = await authenticate(req);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, price_inr, price_usd, max_renewals = null, description = '' } = body;

    if (!name || !price_inr || !price_usd) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to your own DB
    const [result] = await db.query(
      `INSERT INTO plans (name, price, max_renewals, description, price_inr, price_usd) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, price_inr, max_renewals, description, price_inr, price_usd]
    );

    const planId = result.insertId;

    // Create Plan in Razorpay
    const razorpayPlan = await razorpay.plans.create({
      period: 'monthly',             // or 'yearly' — you can make this dynamic
      interval: 1,                   // every month
      item: {
        name: name,
        amount: price_inr * 100,    // Razorpay takes amount in paise
        currency: 'INR',
        description: description,
      },
      notes: {
        local_plan_id: planId.toString(),
      },
    });

    return Response.json({
      message: 'Plan created successfully',
      planId,
      razorpayPlanId: razorpayPlan.id,
    }, { status: 201 });

  } catch (err) {
    console.error('Plan creation error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

