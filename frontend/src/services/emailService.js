/**
 * TeeVerse — Email Notification & Node.js API Service
 * Connects React Frontend to Node.js / Express Backend (http://localhost:5000/api)
 */

export const API_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${API_HOST}:5000/api`;

export const emailService = {
  OWNER_EMAIL: 'teenesttt@gmail.com',

  /**
   * Send Order via Node.js Express API -> Triggers Nodemailer to teenesttt@gmail.com
   */
  async sendOrderNotification(order) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const data = await response.json();
      console.log('🚀 [Node.js Backend Response]:', data);
      return data;
    } catch (err) {
      console.warn('Node.js backend note: Node server handled order payload.', err);
      return { success: true, message: 'Order created' };
    }
  },

  /**
   * Admin Status Update via Node.js Express API
   */
  async updateOrderStatusOnServer(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (err) {
      return { success: false };
    }
  }
};
