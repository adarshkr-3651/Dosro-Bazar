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
      throw new Error(error.response.data.error || error.response.data.message || 'Login failed');
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
      const err = new Error(error.response.data.message || 'Failed to fetch profile');
      (err as any).status = error.response.status;
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

export async function resetPassword(resetPasswordToken: string, newPassword: string) {
  try {
    const response = await api.put(`/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`, {
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
      } catch (refreshError) {
        // If refresh fails, it means session is truly expired
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError);

        // Reject with original error so components know it failed
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export async function getAllItems() {
  try {
    const response = await api.get('/item/getAllItems');
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
    const response = await api.get(`/item/search/semantic?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
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
    const response = await api.get('/item/recommendations/all');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch recommendations');
    } else {
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
  }
}

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  products: {
    list: '/products',
    detail: (id: string | number) => `/products/${id}`,
    create: '/products',
    update: (id: string | number) => `/products/${id}`,
    delete: (id: string | number) => `/products/${id}`,
  },
};

export default api;
