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


import { db } from '../../../db'
import { authenticate } from '../../../middleware/auth';

export async function GET() {
  const [plans] = await db.query(
    'SELECT id, name, price, price_inr, price_usd, max_renewals, description FROM plans ORDER BY price ASC'
  );
  return Response.json(plans);
}

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, price, max_renewals = null, description = '' } = await req.json();

  if (!name || price === undefined) {
    return Response.json({ error: 'Name and price are required' }, { status: 400 });
  }

  let priceUSD = 0;

  try {
    const rateRes = await fetch('https://open.er-api.com/v6/latest/INR');
    const rateData = await rateRes.json();
    if (rateData?.result === 'success' && rateData.rates?.USD) {
      priceUSD = parseFloat((price * rateData.rates.USD).toFixed(2));
    }
  } catch (err) {
    console.error('[USD conversion failed]', err);
    priceUSD = 0; // fallback
  }

  try {
    await db.query(
      `INSERT INTO plans (name, price, max_renewals, description, price_inr, price_usd) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, price, max_renewals, description, price, priceUSD]
    );
    return Response.json({ message: 'Plan created successfully' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
