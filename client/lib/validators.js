export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateProductData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = 'Valid price is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateOrderData = (data) => {
  const errors = {};

  if (!data.shippingAddress?.trim()) {
    errors.shippingAddress = 'Shipping address is required';
  }

  if (!data.items?.length) {
    errors.items = 'Order must contain at least one item';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};