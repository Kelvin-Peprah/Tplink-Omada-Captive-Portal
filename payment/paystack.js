document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('paymentForm');
  const payButton = document.getElementById('pay-button');
  const publicKey = document.querySelector('meta[name="paystack-public-key"]').content;

  // Notification system
  const showNotification = (message, type = 'info') => {
    const container = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    container.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  };

  // Loading state management
  const setLoading = (isLoading) => {
    const loader = document.querySelector('.loading-overlay');
    loader.style.display = isLoading ? 'grid' : 'none';
    payButton.disabled = isLoading;
  };

  // Enhanced validation
  const validateEmail = (email) => 
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validatePhone = (phone) => 
    /^0\d{9}$/.test(phone);

  // Error logging
  const logError = (error) => {
    console.error(error);
    // Send to error tracking service
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }).catch(() => { /* Fallback silent error */ });
  };

  // Accessible error handling
  const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    field.focus();
  };

  const clearErrors = () => {
    document.querySelectorAll('[aria-invalid="true"]').forEach(field => {
      field.removeAttribute('aria-invalid');
    });
    document.querySelectorAll('.error-message').forEach(error => {
      error.style.display = 'none';
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);

    try {
      const formData = {
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        amount: document.getElementById('amount').value
      };

      // Validation
      if (!validateEmail(formData.email)) {
        showFieldError('email', 'Please enter a valid email address');
        return;
      }

      if (!validatePhone(formData.phone)) {
        showFieldError('phone', 'Valid 10-digit number starting with 0');
        return;
      }

      if (!formData.amount || Number(formData.amount) <= 0) {
        showNotification('Please select a valid package', 'error');
        return;
      }

      const paymentHandler = PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: Number(formData.amount) * 100,
        currency: 'GHS',
        ref: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          phone: formData.phone
        },
        callback: (response) => {
          showNotification('Payment successful! Redirecting...', 'success');
          window.location.href = `verify_payment.php?reference=${response.reference}`;
        },
        onClose: () => {
          showNotification('Payment cancelled', 'error');
        }
      });

      paymentHandler.openIframe();
    } catch (error) {
      logError(error);
      showNotification('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Event listeners
  paymentForm.addEventListener('submit', handlePayment);
  payButton.addEventListener('click', handlePayment);

  // Accessibility improvements
  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePayment(e);
      }
    });
  });
});