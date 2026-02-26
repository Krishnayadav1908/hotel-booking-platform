// Firestore audit log utility
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Log an admin action to Firestore
 * @param {Object} param0
 * @param {string} param0.action - Action performed (e.g. 'ban', 'unban', 'role_change')
 * @param {string} param0.targetId - ID of the affected user/hotel/booking
 * @param {string} param0.targetType - 'user' | 'hotel' | 'booking' | ...
 * @param {string} param0.performedBy - Admin user id/email
 * @param {Object} [param0.details] - Extra details (optional)
 */
export async function logAdminAction({ action, targetId, targetType, performedBy, details }) {
  try {
    await addDoc(collection(db, "audit_logs"), {
      action,
      targetId,
      targetType,
      performedBy,
      details: details || {},
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    // Optionally handle/log error
    // console.error("Failed to log admin action", err);
  }
}
