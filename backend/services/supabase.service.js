// services/supabase.service.js
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Anon client (no user context)
const supabaseAnon = createClient(
  config.supabase.url,
  config.supabase.key
);
const supabaseAdmin = createClient(
  config.supabase.url,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


// User client (RLS-aware, per request)
const getUserSupabase = (token) => {
  return createClient(
    config.supabase.url,
    config.supabase.key,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
};

class SupabaseService {
 async getUserFromToken(token) {
  return await supabaseAnon.auth.getUser(token);
}

async signUp(email, password, metadata) {
  return await supabaseAnon.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
}

async signIn(email, password) {
  return await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });
}

async getCurrentUser(token) {
 return await supabaseAnon.auth.getUser(token);
}
 async signOut() {
  return await supabaseAnon.auth.signOut();
}

async getUserById(userId) {
  return await supabaseAnon
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

  
  async getShopById(shopId) {
    return await supabaseAnon
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
  
  async getAllShops() {
  return await supabaseAnon
    .from('shops')
    .select('*')
    // .eq('is_active', true);
}


async createOrder(orderData, token) {
  const supabaseUser = getUserSupabase(token);

  // 1️⃣ Authenticated user
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();

  if (userError || !userData?.user) {
    return { error: { message: "Invalid user" } };
  }

  // 2️⃣ Fetch shop (trusted source)
  const { data: shop, error: shopError } = await supabaseUser
    .from("shops")
    .select("organisation_id, is_active, is_accepting_orders")
    .eq("id", orderData.shop_id)
    .single();

  if (shopError || !shop) {
    return { error: { message: "Invalid shop" } };
  }

  // 3️⃣ Determine order type (default = online)
  const orderType = orderData.order_type || "online";

  // ===============================
  // 🟣 WALK-IN ORDER RULES
  // ===============================
  if (orderType === "walk_in") {

    // shop must be physically open
    if (!shop.is_active) {
      return {
        error: { message: "Shop is currently closed for walk-in orders" },
      };
    }

    // walk-in specific adjustments
    orderData.pickup_at = null;
    orderData.is_urgent = false;
  }

  // ===============================
  // 🟢 ONLINE ORDER RULES
  // ===============================
  if (orderType === "online") {

    // shop must accept online orders
    if (!shop.is_accepting_orders) {
      return {
        error: { message: "Shop is not accepting online orders right now" },
      };
    }

    if (!orderData.pickup_at) {
      return {
        error: { message: "Pickup time required for online orders" },
      };
    }
  }

  // 4️⃣ Insert order (secure values)
  return await supabaseUser
    .from("orders")
    .insert({
      ...orderData,
      order_type: orderType,
      student_id: userData.user.id,
      organisation_id: shop.organisation_id,
    })
    .select()
    .single();
}


  async getOrderById(orderId ,token) {
      const supabaseUser = getUserSupabase(token);

    return await supabaseUser
      .from('orders')
      .select('*, documents(*)')
      .eq('id', orderId)
      .single();
  }


async getOrdersByStudentId(studentId, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('orders')
    .select(`
      id,
      order_no,
      status,
      orientation,
      is_urgent,
      is_expired,
      urgency_fee,
      delivery_otp,
      otp_verified,
      pickup_at,

      total_price,
      notes,
      is_paid,
      paid_at,
      created_at,
      updated_at,

      shops (
        shop_name,
        block
      ),

      documents (
        id,
        file_name,
        file_url,
        page_count,
        copies,
        total_price,

        paper_type_id,
        color_mode_id,
        finish_type_id,

        paper_types ( name ),
        color_modes ( name ),
        finish_types ( name )
      )
    `)
    .eq('student_id', studentId)
    .eq('is_paid' , true)
    .order('created_at', { ascending: false });
}


async updateOrderStatus(orderId, status, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
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

async createDocument(documentData, token) {
  const supabaseUser = getUserSupabase(token);

  // 1️⃣ Get order to check type
  const { data: order, error: orderError } = await supabaseUser
    .from("orders")
    .select("order_type")
    .eq("id", documentData.order_id)
    .single();

  if (orderError || !order) {
    return { error: { message: "Invalid order" } };
  }

  // 🟣 WALK-IN VALIDATION
  if (order.order_type === "walk_in") {
    if (
      !documentData.manual_price ||
      Number(documentData.manual_price) <= 0
    ) {
      return { error: { message: "Valid manual amount required" } };
    }

    // Force null specs
    documentData.paper_type_id = null;
    documentData.color_mode_id = null;
    documentData.finish_type_id = null;
    documentData.copies = 1;
  }

  // 🟢 ONLINE VALIDATION
  if (order.order_type === "online") {
    if (
      !documentData.paper_type_id ||
      !documentData.color_mode_id ||
      !documentData.finish_type_id
    ) {
      return { error: { message: "Print configuration required" } };
    }

    // Prevent manual price misuse
    documentData.manual_price = null;
  }

  return await supabaseUser
    .from("documents")
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

  async getDocumentForDownload(documentId, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('documents')
    .select(`
      id,
      file_url,
      orders (
        student_id,
        shop_id,
        shops (
          owner_id
        )
      )
    `)
    .eq('id', documentId)
    .single();
}
async getPrintOptionsByShop(shopId, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('print_options')
    .select(
      `
      id,
      paper_type,
      color_mode,
      finish_type,
      price_per_page
      `
    )
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('paper_type', { ascending: true });
}

async createPrintOption(printOptionData, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('print_options')
    .insert(printOptionData)
    .select()
    .single();
}

async getShopOptions(shopId, token) {
  const supabaseUser = getUserSupabase(token);

  const paper = await supabaseUser
    .from('paper_types')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at');

  const color = await supabaseUser
    .from('color_modes')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at');

  const finish = await supabaseUser
    .from('finish_types')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at');

  return {
    paper_types: paper.data,
    color_modes: color.data,
    finish_types: finish.data
  };
}


async getShopOptionsStudent(shopId) {
  const paper = await supabaseAnon
    .from('paper_types')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true);

  const color = await supabaseAnon
    .from('color_modes')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true);

  const finish = await supabaseAnon
    .from('finish_types')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true);

  return {
    paper_types: paper.data,
    color_modes: color.data,
    finish_types: finish.data
  };
}
async getPrintOptionsByShop(shopId) {
  return await supabaseAnon
    .from('print_options')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true);
}

async getPaperTypesByShop(shopId) {
  return await supabaseAnon
    .from('paper_types')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('created_at');
}
async createPaperType(data, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('paper_types')
    .insert(data)
    .select()
    .single();
}

async getColorModesByShop(shopId) {
  return await supabaseAnon
    .from('color_modes')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('created_at');
}

async createColorMode(colorData, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('color_modes')
    .insert(colorData)
    .select()
    .single();
}


// async getFinishTypesByShop(shopId) {
//   return await supabaseAnon
//     .from('finish_types')
//     .select('*')
//     .eq('shop_id', shopId)
//     .eq('is_active', true);
// }

// async createFinishType(finishData, token) {
//   const supabaseUser = getUserSupabase(token);

//   return await supabaseUser
//     .from('finish_types')
//     .insert(finishData)
//     .select()
//     .single();
// }

async getFinishTypesByShop(shopId) {
  return await supabaseAnon
    .from('finish_types')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('created_at');
}


async createFinishType(data, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('finish_types')
    .insert(data)
    .select()
    .single();
}

//Functions for payments
async createPayment(data, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('payments')
    .insert(data)
    .select()
    .single();
}


async markPaymentSuccess(orderId, paymentId, signature) {
  return await supabaseAdmin
    .from('payments')
    .update({
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      status: 'success',
      updated_at: new Date()
    })
    .eq('order_id', orderId);
}




// supabase.service.js
async getOrderForPayment(orderId) {
  return await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
}

async markOrderPaid(orderId) {
  return await supabaseAdmin
    .from('orders')
    .update({
      is_paid: true,
      status: 'confirmed',
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId);
}
//webhook helper functions

async markPaymentWebhookSuccess(razorpayOrderId, razorpayPaymentId, payload) {
  return await supabaseAdmin
    .from('payments')
    .update({
      status: 'success',
      razorpay_payment_id: razorpayPaymentId,
      webhook_payload: payload,
      updated_at: new Date()
    })
    .eq('razorpay_order_id', razorpayOrderId);
}


async markOrderPaidByRazorpayOrder(razorpayOrderId) {
  const { data: payment } = await supabaseAdmin
    .from('payments')
    .select('order_id')
    .eq('razorpay_order_id', razorpayOrderId)
    .single();

  if (!payment) return;

  return await supabaseAdmin
    .from('orders')
    .update({
      is_paid: true,
      status: 'confirmed',
      updated_at: new Date()
    })
    .eq('id', payment.order_id);
}



async getOrdersForOwner(token) {
  // 1️⃣ Get user from token
  const { data: userData, error: userError } =
    await this.getUserFromToken(token);

  if (userError || !userData?.user) {
    return { error: userError || new Error('Invalid user') };
  }

  const userId = userData.user.id;

  // 2️⃣ Get shop owned by user
  const { data: shop, error: shopError } = await supabaseAnon
    .from('shops')
    .select('id ,shop_name, is_active')
    .eq('owner_id', userId)
    .single();

  if (shopError || !shop) {
    return { error: shopError || new Error('Shop not found for owner') };
  }

  // 3️⃣ Fetch orders + documents + print options
  const supabaseUser = getUserSupabase(token);
return await supabaseAdmin
  .from('orders')
  .select(`
    id,
    order_no,
    status,
    orientation,
    is_urgent,
    urgency_fee,
    is_paid,
    is_expired,
    notes,
    created_at,
    pickup_at,
    student_id,
    total_price,
    order_type,

    student:users!fk_order_student (
      name
    ),

    documents (
      id,
      file_name,
      file_url,
      page_count,
      copies,
      total_price,

      paper_types ( name ),
      color_modes ( name ),
      finish_types ( name )
    )
  `)
  .eq('shop_id', shop.id)
  .eq('is_paid',true)
  .order('created_at', { ascending: false });

    
}

async getPaymentByRazorpayOrder(razorpayOrderId) {
  return await supabaseAnon
    .from('payments')
    .select('status')
    .eq('razorpay_order_id', razorpayOrderId)
    .single();
}


async getShopByOwner(ownerId) {
  return await supabaseAnon
    .from('shops')
    .select('id , shop_name , is_active,is_accepting_orders, close_time ,open_time')
    .eq('owner_id', ownerId)
    .single();
}

// paper type
async updatePaperType(id, is_active, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('paper_types')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();
}

// color mode
async updateColorMode(id, is_active, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('color_modes')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();
}

// finish type
async updateFinishType(id, is_active, token) {
  const supabaseUser = getUserSupabase(token);

  return await supabaseUser
    .from('finish_types')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();
}

//NEW OTP SERVICE
async getOrderOtpData(orderId) {
  return await supabaseAdmin
    .from("orders")
    .select("delivery_otp, otp_verified")
    .eq("id", orderId)
    .single();
}

async markOrderDelivered(orderId) {
  return await supabaseAdmin
    .from("orders")
    .update({
      otp_verified: true,
      otp_verified_at: new Date(),
      status: "completed",
    })
    .eq("id", orderId)
    .select()
    .single();
}

//Updating status of shop to isactive or not 
async updateShopByOwner(ownerId, updates) {
  return await supabaseAdmin
    .from("shops")
    .update(updates)
    .eq("owner_id", ownerId)
    .select()
    .single();
}

async updateShopById(shopId, updates) {
  return await supabaseAdmin
    .from("shops")
    .update(updates)
    .eq("id", shopId)
    .select()
    .single();
}

//to fetch student email , name and shop anme (email context helper)
async getOrderEmailContext(orderId) {
  return await supabaseAdmin
    .from("orders")
    .select(`
      order_no,
      student:users!fk_order_student (
        id,
        email,
        name
      ),
      shop:shops!fk_order_shop (
        shop_name
      )
    `)
    .eq("id", orderId)
    .single();
}
// 🔐 Send password reset email (FORGOT PASSWORD)
async sendPasswordResetEmail(email) {
  if (!email) {
    return {
      error: { message: "Email is required" },
    };
  }

  return await supabaseAnon.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/update-password`,
  });
}

async getShopByIdAndOwner(shopId, ownerId) {
  return await supabaseAdmin
    .from("shops")
    .select("id")
    .eq("id", shopId)
    .eq("owner_id", ownerId)
    .single();
}

async updateShopById(shopId, updates) {
  return await supabaseAdmin
    .from("shops")
    .update(updates)
    .eq("id", shopId)
    .select()
    .single();
}
// Register device token
async registerDeviceToken(userId, token, platform = "android") {
  return await supabaseAdmin
    .from("user_device_tokens")
    .upsert(
      {
        user_id: userId,
        fcm_token: token,
        platform,
      },
      { onConflict: "user_id,fcm_token" }
    );
}

// Get tokens by user
async getUserDeviceTokens(userId) {
  return await supabaseAdmin
    .from("user_device_tokens")
    .select("fcm_token")
    .eq("user_id", userId);
}


}
export { supabaseAdmin};
export default new SupabaseService();