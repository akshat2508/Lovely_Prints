// services/supabase.service.js
import supabase from '../config/supabaseClient.js';

class SupabaseService {
  async signUp(email, password, metadata) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  }

  async signIn(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getCurrentUser() {
    return await supabase.auth.getUser();
  }

  async getUserById(userId) {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  }

  async updateUser(userId, updates) {
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
  }

  async getAllShops() {
    return await supabase
      .from('shops')
      .select('*')
      .eq('is_active', true);
  }

  async getShopById(shopId) {
    return await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
  }

  async createShop(shopData) {
    return await supabase
      .from('shops')
      .insert(shopData)
      .select()
      .single();
  }

  async updateShop(shopId, updates) {
    return await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single();
  }

  async createOrder(orderData) {
    return await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
  }

  async getOrderById(orderId) {
    return await supabase
      .from('orders')
      .select('*, documents(*)')
      .eq('id', orderId)
      .single();
  }

  async getOrdersByStudentId(studentId) {
    return await supabase
      .from('orders')
      .select('*, shops(shop_name, block), documents(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
  }

  async getOrdersByShopId(shopId) {
    return await supabase
      .from('orders')
      .select('*, users(name, email), documents(*)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
  }

  async updateOrderStatus(orderId, status) {
    return await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
  }

  async deleteOrder(orderId) {
    return await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
  }

  async createDocument(documentData) {
    return await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();
  }

  async getDocumentsByOrderId(orderId) {
    return await supabase
      .from('documents')
      .select('*')
      .eq('order_id', orderId);
  }
}

export default new SupabaseService();