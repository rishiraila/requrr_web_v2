import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function POST(req) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: allow only admin
  // if (user.email !== 'admin@example.com') {
  //   return Response.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS recurring_expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        frequency ENUM('daily', 'weekly', 'monthly', 'yearly') DEFAULT 'monthly',
        due_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        is_recurring BOOLEAN DEFAULT TRUE,
        recurrence_id INT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    return Response.json({ message: '✅ recurring_expenses table created successfully' });
  } catch (error) {
    return Response.json({ error: '❌ Failed to create table', details: error.message }, { status: 500 });
  }
}
