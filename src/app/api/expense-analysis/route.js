import { db } from '../../../db';
import { authenticate } from '../../../middleware/auth';

export async function GET(req) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total expenses
    const [totalResult] = await db.query(
      'SELECT SUM(amount) as total FROM recurring_expenses WHERE user_id = ? AND status = "active"',
      [user.id]
    );
    const totalExpenses = totalResult[0]?.total || 0;

    // Expenses by category
    const [categoryResult] = await db.query(
      `SELECT ec.name as category, SUM(re.amount) as total
       FROM recurring_expenses re
       LEFT JOIN expense_categories ec ON re.category_id = ec.id
       WHERE re.user_id = ? AND re.status = "active"
       GROUP BY ec.name
       ORDER BY total DESC`,
      [user.id]
    );

    // Monthly expenses for the last 12 months
    const [monthlyResult] = await db.query(
      `SELECT
         DATE_FORMAT(next_run_date, '%Y-%m') as month,
         SUM(amount) as total
       FROM recurring_expenses
       WHERE user_id = ? AND status = "active"
         AND next_run_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(next_run_date, '%Y-%m')
       ORDER BY month`,
      [user.id]
    );

    // Top 5 expenses by amount
    const [topExpenses] = await db.query(
      `SELECT title, amount, next_run_date
       FROM recurring_expenses
       WHERE user_id = ? AND status = "active"
       ORDER BY amount DESC
       LIMIT 5`,
      [user.id]
    );

    // Expense frequency distribution
    const [frequencyResult] = await db.query(
      `SELECT frequency, COUNT(*) as count, SUM(amount) as total
       FROM recurring_expenses
       WHERE user_id = ? AND status = "active"
       GROUP BY frequency`,
      [user.id]
    );

    return Response.json({
      totalExpenses,
      expensesByCategory: categoryResult,
      monthlyExpenses: monthlyResult,
      topExpenses,
      frequencyDistribution: frequencyResult,
    });
  } catch (error) {
    console.error('Error fetching expense analysis:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
