import { db } from '../../../../db';
import { authenticate } from '../../../../middleware/auth';

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categoryId = params.id;

  // 🔍 Check if category exists and belongs to user
  const [[category]] = await db.query(
    'SELECT id FROM expense_categories WHERE id = ? AND user_id = ?',
    [categoryId, user.id]
  );

  if (!category) {
    return Response.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }

  // 🚫 OPTIONAL: Prevent delete if category is used in expenses
  const [[used]] = await db.query(
    'SELECT id FROM recurring_expenses WHERE category_id = ? LIMIT 1',
    [categoryId]
  );

  if (used) {
    return Response.json(
      { error: 'Category is used in expenses and cannot be deleted' },
      { status: 400 }
    );
  }

  // 🗑️ Delete category
  await db.query(
    'DELETE FROM expense_categories WHERE id = ? AND user_id = ?',
    [categoryId, user.id]
  );

  return Response.json({ message: 'Category deleted successfully' });
}
