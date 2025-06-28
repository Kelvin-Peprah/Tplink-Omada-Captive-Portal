// Form validation simulation
const paymentForm = document.getElementById('paymentForm');
const errorHint = document.getElementById('oper-hint');

paymentForm.addEventListener('submit', function (e) {
	e.preventDefault();

	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const amount = document.getElementById('amount').value;

	// Reset error message
	errorHint.classList.remove('active');

	// Validate inputs
	if (!phone || !email || !amount) {
		errorHint.textContent = 'Please fill in all required fields';
		errorHint.classList.add('active');
		return;
	}

	// Validate phone format
	const phoneRegex = /^0[0-9]{9}$/;
	if (!phoneRegex.test(phone)) {
		errorHint.textContent =
			'Please enter a valid Ghanaian phone number (e.g., 0551234567)';
		errorHint.classList.add('active');
		return;
	}

	// Show loading state
	document.querySelector('.loading-overlay').style.display = 'grid';

	// Simulate payment processing
	setTimeout(() => {
		document.querySelector('.loading-overlay').style.display = 'none';

		// Show success notification
		const notificationContainer = document.querySelector(
			'.notification-container'
		);
		const notification = document.createElement('div');
		notification.className = 'notification success';
		notification.textContent =
			'Payment successful! Your voucher has been sent.';
		notificationContainer.appendChild(notification);

		// Remove notification after delay
		setTimeout(() => {
			notification.remove();
		}, 5000);

		// Reset form
		paymentForm.reset();
	}, 2000);
});

// Input validation
document.getElementById('phone').addEventListener('input', function () {
	// Allow only numbers
	this.value = this.value.replace(/\D/g, '');

	// Limit to 10 characters
	if (this.value.length > 10) {
		this.value = this.value.slice(0, 10);
	}
});
