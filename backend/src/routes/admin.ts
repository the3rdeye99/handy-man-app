import express from 'express';
import { admin } from '../firebase';
import { db } from '../firebase';

const router = express.Router();

// Delete user from both Firestore and Auth
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete from Firestore
    await db.collection('users').doc(userId).delete();

    // Delete from Auth
    await admin.auth().deleteUser(userId);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete user' 
    });
  }
});

// Delete multiple users (for clearing all handymen)
router.post('/users/delete-multiple', async (req, res) => {
  try {
    const { userIds } = req.body;

    // Delete from Firestore
    const batch = db.batch();
    userIds.forEach((userId: string) => {
      const userRef = db.collection('users').doc(userId);
      batch.delete(userRef);
    });
    await batch.commit();

    // Delete from Auth
    await Promise.all(userIds.map((userId: string) => 
      admin.auth().deleteUser(userId)
    ));

    res.json({ 
      success: true, 
      message: `Successfully deleted ${userIds.length} users` 
    });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete users' 
    });
  }
});

export default router; 