// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
	const mobileToggle = document.getElementById('mobileToggle');
	const navbarMenu = document.getElementById('navbarMenu');

	if (mobileToggle && navbarMenu) {
		mobileToggle.addEventListener('click', function () {
			this.classList.toggle('active');
			navbarMenu.classList.toggle('active');
		});
	}

	// Initialize modal handlers
	initializeModals();

	// Initialize signup form handler
	initializeSignupForm();

	// Initialize login form handler
	initializeLoginForm();

	// Setup login modal event handlers
	resetLoginModalOnClose();
	handleSignupLinkInLogin();

	// Load success stories
	loadSuccessStories();

	// Initialize stats counter animation
	initializeStatsCounter();
});

// Initialize modal functionality
function initializeModals() {
	// Get all modal triggers
	const modalTriggers = document.querySelectorAll('[data-modal-open]');
	const modalClosers = document.querySelectorAll('[data-modal-close]');

	// Open modal
	modalTriggers.forEach((trigger) => {
		trigger.addEventListener('click', function (e) {
			e.preventDefault();
			const modalId = this.getAttribute('data-modal-open');
			const modal = document.getElementById(modalId + '-modal');

			if (modal) {
				modal.classList.add('active');
				modal.setAttribute('aria-hidden', 'false');
				document.body.style.overflow = 'hidden';
			}
		});
	});

	// Close modal
	modalClosers.forEach((closer) => {
		closer.addEventListener('click', function (e) {
			e.preventDefault();
			const modal = this.closest('.modal');

			if (modal) {
				modal.classList.remove('active');
				modal.setAttribute('aria-hidden', 'true');
				document.body.style.overflow = '';
			}
		});
	});

	// Close modal when clicking outside
	document.querySelectorAll('.modal').forEach((modal) => {
		modal.addEventListener('click', function (e) {
			if (e.target === this || e.target.classList.contains('modal-overlay')) {
				this.classList.remove('active');
				this.setAttribute('aria-hidden', 'true');
				document.body.style.overflow = '';
			}
		});
	});

	// Close modal with ESC key
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			const activeModal = document.querySelector('.modal.active');
			if (activeModal) {
				activeModal.classList.remove('active');
				activeModal.setAttribute('aria-hidden', 'true');
				document.body.style.overflow = '';
			}
		}
	});
}

// Load and display success stories (first 3 posts)
async function loadSuccessStories() {
	try {
		const response = await fetch('./assets/data/blogs.json');
		const blogPosts = await response.json();

		// Get first 3 posts
		const featuredStories = blogPosts.slice(0, 3);

		renderSuccessStories(featuredStories);
	} catch (error) {
		console.error('Error loading success stories:', error);
	}
}

// Render success stories
function renderSuccessStories(stories) {
	const storiesGrid = document.getElementById('success-stories-grid');

	if (!storiesGrid) return;

	storiesGrid.innerHTML = stories
		.map((story) => {
			const categoryClass = getCategoryClass(story.category);

			return `
      <div class="success-story-card" onclick="openIndexStoryModal(${story.id})">
        <div class="success-story-image">
          <img src="${story.image}" alt="${story.title}" onerror="this.style.display='none'" />
          <div class="success-story-category ${categoryClass}">${story.category}</div>
        </div>
        <div class="success-story-content">
          <h3 class="success-story-title">${story.title}</h3>
          <p class="success-story-excerpt">${story.excerpt}</p>
          <div class="success-story-footer">
            <span class="success-story-date">${story.date}</span>
            <span class="success-story-read-more">
              Read More →
            </span>
          </div>
        </div>
      </div>
    `;
		})
		.join('');
}

// Get category class for styling
function getCategoryClass(category) {
	if (category.toLowerCase().includes('student')) return 'category-student';
	if (category.toLowerCase().includes('company')) return 'category-company';
	if (category.toLowerCase().includes('career')) return 'category-career';
	return 'category-student';
}

// Open story modal
let allStories = [];

async function openIndexStoryModal(storyId) {
	try {
		// Load stories if not already loaded
		if (allStories.length === 0) {
			const response = await fetch('./assets/data/blogs.json');
			allStories = await response.json();
		}

		const story = allStories.find((post) => post.id === storyId);
		if (!story) return;

		// Populate modal content
		document.getElementById('index-story-modal-title').textContent =
			story.title;
		document.getElementById('index-story-modal-image').src = story.image;
		document.getElementById('index-story-modal-category').textContent =
			story.category;
		document.getElementById('index-story-modal-author').textContent =
			story.author;
		document.getElementById('index-story-modal-role').textContent =
			story.authorRole;
		document.getElementById('index-story-modal-date').textContent = story.date;
		document.getElementById('index-story-modal-readtime').textContent =
			story.readTime;
		document.getElementById('index-story-modal-content').innerHTML =
			story.fullStory;

		// Show modal
		document.getElementById('index-story-modal').classList.add('active');
	} catch (error) {
		console.error('Error opening story modal:', error);
	}
}

// Close story modal
function closeIndexStoryModal() {
	document.getElementById('index-story-modal').classList.remove('active');
}

// Close modal when clicking outside or on overlay
document.addEventListener('click', function (e) {
	const modal = document.getElementById('index-story-modal');
	if (e.target.classList.contains('modal-overlay')) {
		closeIndexStoryModal();
	}
});

// Close modal with ESC key
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeIndexStoryModal();
	}
});

// Export functions for global access
window.openIndexStoryModal = openIndexStoryModal;
window.closeIndexStoryModal = closeIndexStoryModal;

// Login modal - Account type selection
function showLoginForm(accountType) {
	document.getElementById('login-step-1').style.display = 'none';
	document.getElementById('login-step-2').style.display = 'block';
	document.getElementById('login-account-type').value = accountType;

	// Update modal title and button text based on account type
	const modalTitle = document.querySelector('#login-modal .modal-title');
	const modalDescription = document.querySelector(
		'#login-modal .modal-description'
	);
	const loginBtnText = document.getElementById('login-btn-text');

	if (accountType === 'student') {
		modalTitle.textContent = 'Welcome Back to Moon*';
		modalDescription.textContent = 'Sign in to access your account';
		loginBtnText.textContent = 'Sign In as Student';
	} else {
		modalTitle.textContent = 'Welcome Back to Moon*';
		modalDescription.textContent = 'Sign in to access your account';
		loginBtnText.textContent = 'Sign In as Company';
	}
}

function backToAccountTypeSelection() {
	document.getElementById('login-step-1').style.display = 'block';
	document.getElementById('login-step-2').style.display = 'none';

	// Reset modal title
	const modalTitle = document.querySelector('#login-modal .modal-title');
	const modalDescription = document.querySelector(
		'#login-modal .modal-description'
	);
	modalTitle.textContent = 'Welcome Back to Moon*';
	modalDescription.textContent = 'Sign in to access your account';
}

// Reset login modal when closed
document.addEventListener('click', function (e) {
	if (
		e.target.hasAttribute('data-modal-close') ||
		e.target.classList.contains('modal-overlay')
	) {
		const loginModal = document.getElementById('login-modal');
		if (loginModal && loginModal.classList.contains('active')) {
			// Reset to step 1 when modal is closed
			setTimeout(() => {
				backToAccountTypeSelection();
			}, 300);
		}
	}
});

// Handle signup link in login modal
document.addEventListener('click', function (e) {
	if (e.target.classList.contains('link-signup')) {
		e.preventDefault();
		// Close login modal
		document.getElementById('login-modal').classList.remove('active');
		document.body.style.overflow = '';
		// Open signup modal
		setTimeout(() => {
			document.getElementById('signup-modal').classList.add('active');
			document.body.style.overflow = 'hidden';
		}, 150);
	}
});

// Stats Counter Animation
function initializeStatsCounter() {
	const statNumbers = document.querySelectorAll('.stat-number');
	let animated = false;

	function animateCounter(element) {
		const target = parseInt(element.getAttribute('data-target'));
		const duration = 2000; // 2 seconds
		const increment = target / (duration / 16); // 60fps
		let current = 0;

		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				element.textContent = target.toLocaleString();
				clearInterval(timer);
			} else {
				element.textContent = Math.floor(current).toLocaleString();
			}
		}, 16);
	}

	function checkScroll() {
		if (animated) return;

		const statsSection = document.querySelector('.stats-section');
		if (!statsSection) return;

		const sectionTop = statsSection.getBoundingClientRect().top;
		const windowHeight = window.innerHeight;

		if (sectionTop < windowHeight * 0.75) {
			animated = true;
			statNumbers.forEach((element) => {
				animateCounter(element);
			});
		}
	}

	// Check on scroll
	window.addEventListener('scroll', checkScroll);
	// Check on load
	checkScroll();
}

// Export functions for global access
window.showLoginForm = showLoginForm;
window.backToAccountTypeSelection = backToAccountTypeSelection;

// ===========================
// Signup Form Handler
// ===========================

function initializeSignupForm() {
	const signupForm = document.getElementById('signup-form');

	if (signupForm) {
		signupForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const formData = new FormData(signupForm);
			const username = formData.get('username');
			const email = formData.get('email');
			const password = formData.get('password');
			const confirmPassword = formData.get('confirm-password');
			const accountType = formData.get('account-type');

			// Validation
			if (password !== confirmPassword) {
				console.error('Passwords do not match!');
				return;
			}

			if (!accountType) {
				console.error('Please select an account type!');
				return;
			}

			// Create user object
			const newUser = {
				userid: generateUserId(),
				username: username,
				gmail: email,
				password: password, // Note: In production, NEVER store plain text passwords!
				accountType: accountType,
				createdAt: new Date().toISOString(),
			};

			// Save to localStorage
			const success = saveUserAccount(newUser, accountType);

			if (success) {
				// Reset form
				signupForm.reset();

				// Close modal
				document.getElementById('signup-modal').classList.remove('active');
				document.body.style.overflow = '';
			}
		});
	}
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

// Export signup functions for debugging
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

// Initialize login form handler
function initializeLoginForm() {
	const loginForm = document.getElementById('login-form');

	if (loginForm) {
		loginForm.addEventListener('submit', function (e) {
			e.preventDefault();

			// Get form data
			const formData = new FormData(loginForm);
			const email = formData.get('email');
			const password = formData.get('password');
			const accountType = document.getElementById('login-account-type').value;

			// Validate account type
			if (!accountType) {
				console.error('Please select an account type first!');
				return;
			}

			// Get accounts from localStorage
			const storageKey =
				accountType === 'student' ? 'studentAccounts' : 'companyAccounts';
			const accountsData = localStorage.getItem(storageKey);

			if (!accountsData) {
				console.error('No accounts found');
				return;
			}

			const accounts = JSON.parse(accountsData);

			// Find matching account
			const user = accounts.find(
				(acc) => acc.gmail === email && acc.password === password
			);

			if (user) {
				// Login successful
				const userSession = {
					isLoggedIn: true,
					userid: user.userid,
					username: user.username,
					email: user.gmail,
					accountType: user.accountType,
					loginTime: new Date().toISOString(),
				};

				// Save session to localStorage
				localStorage.setItem('currentUser', JSON.stringify(userSession));
				localStorage.setItem('isLoggedIn', 'true');

				// Close modal
				document.getElementById('login-modal').classList.remove('active');
				document.body.style.overflow = '';

				// Redirect based on account type
				if (accountType === 'student') {
					window.location.href = './pages/html/student-dashboard.html';
				} else {
					window.location.href = './pages/html/company-dashboard.html';
				}
			} else {
				console.error('Invalid email or password!');
			}
		});
	}
}

// Show login form for selected account type
function showLoginForm(accountType) {
	// Hide step 1, show step 2
	document.getElementById('login-step-1').style.display = 'none';
	document.getElementById('login-step-2').style.display = 'block';

	// Set account type
	document.getElementById('login-account-type').value = accountType;

	// Update button text
	const btnText =
		accountType === 'student' ? 'Sign In as Student' : 'Sign In as Company';
	document.getElementById('login-btn-text').textContent = btnText;
}

// Back to account type selection
function backToAccountTypeSelection() {
	// Show step 1, hide step 2
	document.getElementById('login-step-1').style.display = 'block';
	document.getElementById('login-step-2').style.display = 'none';

	// Clear form
	document.getElementById('login-form').reset();
	document.getElementById('login-account-type').value = '';
}

// Logout function
window.logout = function () {
	localStorage.removeItem('currentUser');
	localStorage.removeItem('isLoggedIn');
	window.location.href = 'index.html';
};
