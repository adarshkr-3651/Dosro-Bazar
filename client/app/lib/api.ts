import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function loginUser(identifier: string, password: string) {
  try {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data; // axios automatically parses JSON
  } catch (error: any) {
    if (error.response) {
      // Backend returns errors in 'error' field, not 'message'
      const err = new Error(error.response.data.error || error.response.data.message || 'Login failed');
      (err as any).response = error.response;
      throw err;
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
}

export async function signUpUser(username: string, phone: string, password: string, email?: string) {
  try {
    const response = await api.post('/auth/register', { username, phone, password, email });
    return response.data; // axios automatically parses JSON
  } catch (error: any) {
    if (error.response) {
      // Backend returns errors in 'error' field, not 'message'
      throw new Error(error.response.data.error || error.response.data.message || 'Registration failed');
    } else {
      throw new Error(error.message || 'Registration failed');
    }
  }
}

export async function verifyEmail(email: string, code: string) {
  try {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Verification failed');
    } else {
      throw new Error(error.message || 'Verification failed');
    }
  }
}

export async function resendVerificationCode(email: string) {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to resend code');
    } else {
      throw new Error(error.message || 'Failed to resend code');
    }
  }
}

export async function getProfile() {
  try {
    const response = await api.get('/user/profile');
    return response.data.data; // Controller returns { success: true, data: user }
  } catch (error: any) {
    if (error.response) {
      const err = new Error(error.response.data.error || error.response.data.message || 'Failed to fetch profile');
      (err as any).status = error.response.status;
      (err as any).response = error.response;
      throw err;
    } else {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }
}

export async function updateProfile(data: FormData) {
  try {
    const response = await api.post('/user/editProfile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to update profile');
    } else {
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    const response = await api.put('/user/changePassword', { oldPassword, newPassword });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to change password');
    } else {
      throw new Error(error.message || 'Failed to change password');
    }
  }
}

export async function getFavorites() {
  try {
    const response = await api.get('/user/favorites');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        return { success: false, data: [] };
      }
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch favorites');
    } else {
      throw new Error(error.message || 'Failed to fetch favorites');
    }
  }
}

export async function toggleFavorite(slug: string) {
  try {
    const response = await api.post(`/user/${slug}/favorite`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to update favorite');
    } else {
      throw new Error(error.message || 'Failed to update favorite');
    }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await api.get(`/item/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch product');
    } else {
      throw new Error(error.message || 'Failed to fetch product');
    }
  }
}

export async function addItem(data: FormData) {
  try {
    const response = await api.post('/item/additem', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to create item');
    } else {
      throw new Error(error.message || 'Failed to create item');
    }
  }
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout'); // Call backend logout to clear cookies and revoke tokens
    // Cookies are cleared by backend response headers
    // Small delay to ensure cookies are processed before redirect
    return { success: true };
  } catch (error: any) {
    // If logout fails (e.g., token expired), still try to clear cookies on client side
    // and redirect - user is effectively logged out anyway
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to send reset email');
    } else {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }
}

export async function verifyResetOTP(email: string, otp: string) {
  try {
    const response = await api.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to verify OTP');
    } else {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  try {
    const response = await api.put(`/auth/resetpassword`, {
      email,
      otp,
      newPassword
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to reset password');
    } else {
      throw new Error(error.message || 'Failed to reset password');
    }
  }
}


export async function googleLogin(tokenOrCode: string, isCode: boolean = false) {
  try {
    const payload = isCode ? { code: tokenOrCode } : { idToken: tokenOrCode };
    const response = await api.post('/auth/google', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Google login failed');
    } else {
      throw new Error(error.message || 'Google login failed');
    }
  }
}

export async function facebookLogin(accessToken: string, userID: string) {
  try {
    const response = await api.post('/auth/facebook', { accessToken, userID });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Facebook login failed');
    } else {
      throw new Error(error.message || 'Facebook login failed');
    }
  }
}

export async function completeOAuthRegistration(tempUserId: string, phone: string) {
  try {
    const response = await api.post('/auth/complete-oauth', { tempUserId, phone });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to complete registration');
    } else {
      throw new Error(error.message || 'Failed to complete registration');
    }
  }
}

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  try {
    // Token is now handled via HttpOnly cookies, so we don't need to manually attach it
    // from localStorage. The browser will automatically send the cookie.
  } catch (e) {
    // ignore
  }
  return config;
});

// Variables to handle multiple simultaneous 401s
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Avoid infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        // We use a new axios instance or specific call to avoid interceptor loop if refresh fails
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

        // If refresh successful, process the queue and retry original request
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError: any) {
        // If refresh fails, it means session is truly expired
        // Avoid logging expected 400/401 errors to keep the Next.js dev overlay clean
        if (refreshError.response?.status !== 400 && refreshError.response?.status !== 401) {
            console.error('Token refresh failed:', refreshError);
        }
        processQueue(error);

        // Reject with original error so components know it failed
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export async function getAllItems(page?: number, limit?: number, author?: string) {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (author) params.append('author', author);
    
    const url = params.toString() ? `/item/getAllItems?${params.toString()}` : '/item/getAllItems';
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch items');
    } else {
      throw new Error(error.message || 'Failed to fetch items');
    }
  }
}

export async function getMyListings() {
  try {
    const response = await api.get('/item/getmyItems/all');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch your listings');
    } else {
      throw new Error(error.message || 'Failed to fetch your listings');
    }
  }
}

export async function getEditItemData(slug: string) {
  try {
    const response = await api.get(`/item/editItem/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch item details');
    } else {
      throw new Error(error.message || 'Failed to fetch item details');
    }
  }
}

export async function updateItem(slug: string, data: FormData) {
  try {
    const response = await api.put(`/item/${slug}/edit`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to update item');
    } else {
      throw new Error(error.message || 'Failed to update item');
    }
  }
}

export async function searchSemantic(query: string) {
  try {
    console.log(`[API] searchSemantic called with query: "${query}"`);
    const response = await api.get(`/item/search/semantic?query=${encodeURIComponent(query)}`);
    console.log(`[API] searchSemantic success:`, { 
      count: response.data?.data?.length || 0,
      firstItem: response.data?.data?.[0]?.title 
    });
    return response.data;
  } catch (error: any) {
    console.error(`[API] searchSemantic failed:`, error.message);
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to perform semantic search');
    } else {
      throw new Error(error.message || 'Failed to perform semantic search');
    }
  }
}

export async function getSimilarItems(slug: string) {
  try {
    const response = await api.get(`/item/${slug}/similar`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch similar items');
    } else {
      throw new Error(error.message || 'Failed to fetch similar items');
    }
  }
}

export async function getRecommendations() {
  try {
    console.log(`[API] getRecommendations called`);
    const response = await api.get('/item/recommendations/all');
    console.log(`[API] getRecommendations success:`, { 
      count: response.data?.data?.length || 0 
    });
    return response.data;
  } catch (error: any) {
    console.error(`[API] getRecommendations failed:`, error.message);
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch recommendations');
    } else {
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
  }
}

export async function chatWithAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  username?: string
) {
  try {
    const response = await api.post('/chat', { message, history, username });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to get AI response');
    } else {
      throw new Error(error.message || 'Failed to get AI response');
    }
  }
}

export async function generateItemDescription(title: string, category?: string, condition?: string, price?: string, wordCount?: number) {
  try {
    const response = await api.post('/describe', { title, category, condition, price, wordCount });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to generate description');
    } else {
      throw new Error(error.message || 'Failed to generate description');
    }
  }
}

export async function getUnreadMessageCount() {
  try {
    const response = await api.get('/chat-system/unread-count');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { success: false, data: 0 };
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch unread count');
  }
}

export async function getConversations() {
  try {
    const response = await api.get('/chat-system/conversations');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
  }
}

export async function getMessages(conversationId: string) {
  try {
    const response = await api.get(`/chat-system/${conversationId}/messages`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
}

export async function sendChatMessage(receiverId: string, itemId: string, text?: string, image?: string, location?: any, attachment?: any) {
  try {
    const payload: any = { receiverId, itemId };
    if (text) payload.text = text;
    if (image) payload.image = image;
    if (location) payload.location = location;
    if (attachment) payload.attachment = attachment;
    
    const response = await api.post('/chat-system/message', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
}

export async function uploadChatImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/chat-system/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload chat file');
  }
}

export async function getAllAdvanceBookings() {
  try {
    const response = await api.get('/admin/advance-bookings');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch advance bookings');
  }
}

export async function toggleOnlineStatus(isOnlineVisible: boolean) {
  try {
    const response = await api.put('/user/toggleOnlineStatus', { isOnlineVisible });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update visibility settings');
  }
}

export async function deleteChatMessage(messageId: string) {
  try {
    const response = await api.delete(`/chat-system/message/${messageId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete message');
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const response = await api.delete(`/chat-system/conversation/${conversationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete conversation');
  }
}

// Bidding & Notifications
export async function placeBid(itemId: string, amount: number) {
    try {
        const response = await api.post('/bid/place', { itemId, amount });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to place bid');
    }
}

export async function getNotifications(mode?: 'buyer' | 'seller') {
    try {
        const url = mode ? `/notification/all?mode=${mode}` : '/notification/all';
        const response = await api.get(url);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 
                             error.response?.data?.message || 
                             (typeof error.response?.data === 'string' ? error.response.data : null) ||
                             error.message || 
                             'Failed to fetch notifications';
        throw new Error(errorMessage);
    }
}

export async function markSingleNotificationAsRead(notificationId: string) {
    try {
        const response = await api.put(`/notification/${notificationId}/read`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to mark notification as read');
    }
}

export async function updateBidStatus(bidId: string, status: 'accepted' | 'rejected', followUp?: string, metadata?: any) {
    try {
        const response = await api.post('/bid/status', { bidId, status, followUp, metadata });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update bid status');
    }
}

export async function respondToBidAction(bidId: string, action: string, metadata?: any) {
    try {
        const response = await api.post('/bid/respond', { bidId, action, metadata });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to send response');
    }
}

export async function markNotificationsAsRead() {
    try {
        const response = await api.post('/notification/read-all');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to mark all as read');
    }
}

export async function deleteNotificationAction(id: string) {
    try {
        const response = await api.delete(`/notification/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete notification');
    }
}

export async function getAcceptedBidders(productId: string) {
    try {
        const response = await api.get(`/item/${productId}/accepted-bidders`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch bidders');
    }
}

export async function markProductAsSold(productId: string, buyerId: string, soldPrice: number) {
    try {
        const response = await api.post(`/item/${productId}/mark-sold`, { buyerId, soldPrice });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to mark product as sold');
    }
}

export async function moveToRecycleBin(productId: string) {
    try {
        const response = await api.post(`/item/${productId}/recycle`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to move to recycle bin');
    }
}

export async function getRecycleBin() {
    try {
        const response = await api.get('/item/recycle-bin/all');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch recycle bin');
    }
}

export async function restoreProduct(productId: string) {
    try {
        const response = await api.post(`/item/${productId}/restore`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to restore product');
    }
}

export async function permanentDeleteProduct(productId: string) {
    try {
        const response = await api.delete(`/item/${productId}/permanent`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to permanently delete product');
    }
}

export async function getMyInvoices() {
    try {
        const response = await api.get('/invoice/my-invoices');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch invoices');
    }
}

export async function getInvoiceDetail(invoiceId: string) {
    try {
        const response = await api.get(`/invoice/${invoiceId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch invoice detail');
    }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        const response = await api.put(`/notification/${notificationId}/read`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to mark notification as read');
    }
}

export async function getSellerStats() {
    try {
        const response = await api.get('/bid/stats');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch seller stats');
    }
}

export async function getItemBids(itemId: string) {
    try {
        const response = await api.get(`/bid/item/${itemId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch item bids');
    }
}

export async function initiateAdvanceBookAction(itemId: string, paymentMethod: string, amount: number) {
    try {
        const response = await api.post(`/item/${itemId}/advance-book`, { paymentMethod, amount });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to initiate advance booking');
    }
}

export async function getMyBookings() {
    try {
        const response = await api.get('/item/my-bookings');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return { success: false, data: [] };
        }
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch bookings');
    }
}

export async function getMyBids() {
    try {
        const response = await api.get('/bid/my');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return { success: false, data: [] };
        }
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch your bids');
    }
}

export async function updateBidAction(bidId: string, amount: number) {
    try {
        const response = await api.put(`/bid/${bidId}/update`, { amount });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update bid');
    }
}

export async function cancelBidAction(bidId: string) {
    try {
        const response = await api.delete(`/bid/${bidId}/cancel`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to cancel bid');
    }
}

export async function addReview(reviewData: { itemId: string; sellerId: string; rating: number; comment?: string; invoiceId: string }) {
    try {
        const response = await api.post('/review/add', reviewData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit review');
    }
}

export async function initiateBoostAction(itemId: string, plan: string, paymentMethod: string) {
    try {
        const response = await api.post(`/item/${itemId}/boost/initiate`, { plan, paymentMethod });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to initiate boost');
    }
}

export async function getSellerReviews(sellerId: string) {
    try {
        const response = await api.get(`/review/seller/${sellerId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch seller reviews');
    }
}

export async function verifyBoostKhaltiAction(pidx: string, amount: number, purchase_order_id: string) {
    try {
        const response = await api.post(`/item/payment/verify/boost-khalti`, { pidx, amount, purchase_order_id });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to verify boost payment');
    }
}

export default api;
export async function verifyLoginOtp(email: string, otp: string) {
  try {
    const response = await api.post('/auth/verify-login-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'OTP verification failed');
    } else {
      throw new Error(error.message || 'OTP verification failed');
    }
  }
}

export async function getFooterLinks() {
  try {
    const response = await api.get('/footer-links');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch footer links');
    } else {
      throw new Error(error.message || 'Failed to fetch footer links');
    }
  }
}
