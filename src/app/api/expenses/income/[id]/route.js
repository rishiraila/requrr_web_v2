import { db } from '../../../../../db';
import { authenticate } from '../../../../../middleware/auth';

export async function PUT(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { description, amount, category, account, date } = await req.json();

  if (!description || !amount || !date) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Try updating with all fields
    await db.query(
      `UPDATE expenses 
       SET description = ?, amount = ?, category = ?, account = ?, date = ?, type = 'income'
       WHERE id = ? AND user_id = ?`,
      [description, amount, category, account, date, id, user.id]
    );

    return Response.json({ message: 'Income record updated successfully' });
  } catch (err) {
    console.warn('Update with full fields failed, falling back...', err.message);

    // Fallback if DB doesn't support `category` or `account`
    try {
      await db.query(
        `UPDATE expenses 
         SET description = ?, amount = ?, date = ?, type = 'income'
         WHERE id = ? AND user_id = ?`,
        [description, amount, date, id, user.id]
      );

      return Response.json({
        message:
          'Income updated (category/account not saved — check DB schema)',
      });
    } catch (fallbackErr) {
      console.error('Fallback update failed:', fallbackErr);
      return Response.json({ error: 'Failed to update income record' }, { status: 500 });
    }
  }
}

export async function DELETE(req, { params }) {
  const user = authenticate(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  try {
    await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [
      id,
      user.id,
    ]);

    return Response.json({ message: 'Income record deleted successfully' });
  } catch (err) {
    console.error('Delete failed:', err);
    return Response.json({ error: 'Failed to delete income record' }, { status: 500 });
  }
}
