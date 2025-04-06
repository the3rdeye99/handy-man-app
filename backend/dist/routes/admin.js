"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const firebase_2 = require("../firebase");
const router = express_1.default.Router();
// Delete user from both Firestore and Auth
router.delete('/users/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Delete from Firestore
        yield firebase_2.db.collection('users').doc(userId).delete();
        // Delete from Auth
        yield firebase_1.admin.auth().deleteUser(userId);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete user'
        });
    }
}));
// Delete multiple users (for clearing all handymen)
router.post('/users/delete-multiple', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body;
        // Delete from Firestore
        const batch = firebase_2.db.batch();
        userIds.forEach((userId) => {
            const userRef = firebase_2.db.collection('users').doc(userId);
            batch.delete(userRef);
        });
        yield batch.commit();
        // Delete from Auth
        yield Promise.all(userIds.map((userId) => firebase_1.admin.auth().deleteUser(userId)));
        res.json({
            success: true,
            message: `Successfully deleted ${userIds.length} users`
        });
    }
    catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete users'
        });
    }
}));
exports.default = router;
