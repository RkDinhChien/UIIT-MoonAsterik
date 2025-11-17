// ===========================
// Signup Form Handler
// ===========================

function initializeSignupForm() {
	const signupForm = document.getElementById('signup-form');

	if (signupForm) {
		// Add real-time validation
		initializePasswordStrength();
		initializeConfirmPasswordCheck();
		initializeUsernameCheck();

		signupForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const formData = new FormData(signupForm);
			const fullname = formData.get('fullname');
			const username = formData.get('username');
			const email = formData.get('email');
			const phone = formData.get('phone');
			const password = formData.get('password');
			const confirmPassword = formData.get('confirm-password');
			const accountType = formData.get('account-type');

			// Validation
			if (password !== confirmPassword) {
				showError('Passwords do not match!');
				return;
			}

			if (!accountType) {
				showError('Please select an account type!');
				return;
			}

			// Check password strength
			const strength = checkPasswordStrength(password);
			if (strength.score < 2) {
				showError('Please use a stronger password');
				return;
			}

			// Create user object
			const newUser = {
				userid: generateUserId(),
				fullname: fullname,
				username: username,
				gmail: email,
				phone: phone || '',
				password: password, // Note: In production, NEVER store plain text passwords!
				accountType: accountType,
				createdAt: new Date().toISOString(),
			};

			// Save to localStorage
			const success = saveUserAccount(newUser, accountType);

			if (success) {
				// Show success message with better styling
				showSuccessMessage(newUser);

				// Reset form
				signupForm.reset();
				resetPasswordStrength();

				// Close modal after delay
				setTimeout(() => {
					document.getElementById('signup-modal').classList.remove('active');
					document.body.style.overflow = '';
				}, 2000);
			}
		});
	}
}

// Password Strength Indicator
function initializePasswordStrength() {
	const passwordInput = document.getElementById('signup-password');
	if (!passwordInput) return;

	passwordInput.addEventListener('input', function () {
		const password = this.value;
		const result = checkPasswordStrength(password);
		updatePasswordStrengthUI(result);
	});
}

function checkPasswordStrength(password) {
	let score = 0;
	let feedback = [];

	if (password.length === 0) {
		return { score: 0, text: '', class: '' };
	}

	// Length check
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;

	// Complexity checks
	if (/[a-z]/.test(password)) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^a-zA-Z0-9]/.test(password)) score++;

	// Determine strength
	let text, className;
	if (score <= 2) {
		text = 'Weak';
		className = 'weak';
	} else if (score <= 4) {
		text = 'Medium';
		className = 'medium';
	} else {
		text = 'Strong';
		className = 'strong';
	}

	return { score, text, class: className };
}

function updatePasswordStrengthUI(result) {
	const fill = document.getElementById('password-strength-fill');
	const text = document.getElementById('password-strength-text');

	if (!fill || !text) return;

	// Update width
	const percentage = (result.score / 6) * 100;
	fill.style.width = percentage + '%';

	// Update color and text
	fill.className = 'password-strength-fill ' + result.class;
	text.textContent = result.text;
	text.className = 'password-strength-text ' + result.class;
}

function resetPasswordStrength() {
	const fill = document.getElementById('password-strength-fill');
	const text = document.getElementById('password-strength-text');

	if (fill && text) {
		fill.style.width = '0%';
		fill.className = 'password-strength-fill';
		text.textContent = '';
		text.className = 'password-strength-text';
	}
}

// Confirm Password Check
function initializeConfirmPasswordCheck() {
	const confirmInput = document.getElementById('signup-confirm-password');
	const passwordInput = document.getElementById('signup-password');
	const helpText = document.getElementById('confirm-password-help');

	if (!confirmInput || !passwordInput || !helpText) return;

	confirmInput.addEventListener('input', function () {
		const password = passwordInput.value;
		const confirm = this.value;

		if (confirm.length === 0) {
			helpText.textContent = '';
			helpText.className = 'input-help';
			return;
		}

		if (password === confirm) {
			helpText.textContent = '✓ Passwords match';
			helpText.className = 'input-help success';
		} else {
			helpText.textContent = '✗ Passwords do not match';
			helpText.className = 'input-help error';
		}
	});
}

// Username Availability Check
function initializeUsernameCheck() {
	const usernameInput = document.getElementById('signup-username');
	const helpText = document.getElementById('username-help');

	if (!usernameInput || !helpText) return;

	let timeout;
	usernameInput.addEventListener('input', function () {
		clearTimeout(timeout);
		const username = this.value;

		if (username.length < 3) {
			helpText.textContent = '';
			return;
		}

		timeout = setTimeout(() => {
			// Check if username exists
			const studentAccounts = JSON.parse(
				localStorage.getItem('studentAccounts') || '[]'
			);
			const companyAccounts = JSON.parse(
				localStorage.getItem('companyAccounts') || '[]'
			);
			const allAccounts = [...studentAccounts, ...companyAccounts];

			const exists = allAccounts.some((acc) => acc.username === username);

			if (exists) {
				helpText.textContent = '✗ Username already taken';
				helpText.className = 'input-help error';
			} else {
				helpText.textContent = '✓ Username available';
				helpText.className = 'input-help success';
			}
		}, 500);
	});
}

// Toggle Password Visibility
function togglePassword(inputId) {
	const input = document.getElementById(inputId);
	if (!input) return;

	const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
	input.setAttribute('type', type);
}

// Show Error Message
function showError(message) {
	console.error('Error:', message);
}

// Show Success Message
function showSuccessMessage(user) {
	console.log('Account created successfully for:', user.username);
}

// Generate unique user ID
function generateUserId() {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 10000);
	return `USER${timestamp}${random}`;
}

// Save user account to localStorage
function saveUserAccount(user, accountType) {
	try {
		const storageKey =
			accountType === 'student' ? 'studentAccounts' : 'companyAccounts';

		// Get existing accounts from localStorage
		let accounts = [];
		const existingData = localStorage.getItem(storageKey);
		if (existingData) {
			accounts = JSON.parse(existingData);
		}

		// Check if email already exists
		const emailExists = accounts.some((acc) => acc.gmail === user.gmail);
		if (emailExists) {
			console.error('Email already registered!');
			return false;
		}

		// Add new user
		accounts.push(user);

		// Save to localStorage
		localStorage.setItem(storageKey, JSON.stringify(accounts, null, 2));

		console.log(`User saved to ${storageKey}:`, user);
		return true;
	} catch (error) {
		console.error('Error saving user account:', error);
		return false;
	}
}

// Download accounts as JSON file
function downloadAccountsAsJSON(accountType) {
	const storageKey =
		accountType === 'student' ? 'studentAccounts' : 'companyAccounts';
	const filename =
		accountType === 'student'
			? 'student-accounts.json'
			: 'company-accounts.json';

	const data = localStorage.getItem(storageKey);
	if (!data) return;

	// Create download link
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);

	console.log(`Downloaded ${filename}`);
}

// Export functions for global access
window.initializeSignupForm = initializeSignupForm;
window.generateUserId = generateUserId;
window.saveUserAccount = saveUserAccount;
window.downloadAccountsAsJSON = downloadAccountsAsJSON;
window.togglePassword = togglePassword;

// Utility functions for debugging
window.viewStudentAccounts = function () {
	const data = localStorage.getItem('studentAccounts');
	console.log('Student Accounts:', JSON.parse(data || '[]'));
};

window.viewCompanyAccounts = function () {
	const data = localStorage.getItem('companyAccounts');
	console.log('Company Accounts:', JSON.parse(data || '[]'));
};

window.clearAllAccounts = function () {
	localStorage.removeItem('studentAccounts');
	localStorage.removeItem('companyAccounts');
	console.log('All accounts cleared!');
};

window.downloadStudentAccounts = function () {
	downloadAccountsAsJSON('student');
};

window.downloadCompanyAccounts = function () {
	downloadAccountsAsJSON('company');
};
