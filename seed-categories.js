import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_tracker',
};

const defaultCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
  'Other'
];

async function seedCategories() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Get user ID (assuming you have a user, you might need to adjust this)
    const [users] = await connection.execute('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const userId = users[0].id;

    for (const categoryName of defaultCategories) {
      await connection.execute(
        'INSERT IGNORE INTO expense_categories (user_id, name) VALUES (?, ?)',
        [userId, categoryName]
      );
    }

    console.log('Default categories seeded successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

seedCategories();
