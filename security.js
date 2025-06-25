// Security event tracking
const securityEvents = {
	devToolsAttempts: 0,
	blockedShortcuts: 0,
	blockedRightClicks: 0,
};

// Security modal elements
const securityModal = document.getElementById('security-modal');
const modalCloseBtn = document.getElementById('modal-close');

// Enhanced security event handling
document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	securityEvents.blockedRightClicks++;
	showSecurityAlert('Right-click menu disabled for security');
});

document.addEventListener('keydown', (e) => {
	// Block common developer shortcuts
	const blockedShortcuts = [
		{ key: 'F12', name: 'Developer Tools' },
		{ key: 'I', ctrl: true, shift: true, name: 'DevTools' },
		{ key: 'J', ctrl: true, shift: true, name: 'DevTools Console' },
		{ key: 'C', ctrl: true, shift: true, name: 'Element Inspection' },
		{ key: 'U', ctrl: true, name: 'View Source' },
	];

	for (const shortcut of blockedShortcuts) {
		if (
			e.key === shortcut.key &&
			(shortcut.ctrl ? e.ctrlKey : true) &&
			(shortcut.shift ? e.shiftKey : true)
		) {
			e.preventDefault();
			securityEvents.blockedShortcuts++;
			showSecurityAlert(`${shortcut.name} shortcut disabled`);
			return;
		}
	}
});

// Detect developer tools opening
const devToolsCheck = () => {
	const threshold = 160;
	const widthThreshold = window.outerWidth - window.innerWidth > threshold;
	const heightThreshold = window.outerHeight - window.innerHeight > threshold;
	const orientation = widthThreshold ? 'vertical' : 'horizontal';

	if (!(heightThreshold && widthThreshold)) {
		securityEvents.devToolsAttempts++;

		// Only show alert on first attempt
		if (securityEvents.devToolsAttempts === 1) {
			showSecurityAlert('Developer tools access restricted');
		}
	}
};

// one-time Check
/* setTimeout(devToolsCheck, 3000); */

// Show security alert modal
function showSecurityAlert(message) {
	if (securityModal.classList.contains('show')) return;

	// Update modal content
	document.querySelector('.security-alert p').textContent = message;

	// Show modal
	securityModal.classList.add('show');

	// Log security event
	console.log(`[SECURITY] ${message} - ${new Date().toLocaleTimeString()}`);
}

// Close modal
modalCloseBtn.addEventListener('click', () => {
	securityModal.classList.remove('show');
});

// Close modal when clicking outside
securityModal.addEventListener('click', (e) => {
	if (e.target === securityModal) {
		securityModal.classList.remove('show');
	}
});
