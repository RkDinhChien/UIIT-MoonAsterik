// Global variables
let allJobs = [];
let currentPage = 1;
const JOBS_PER_PAGE = 10;
let filteredJobs = [];

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (mobileToggle && navbarMenu) {
	mobileToggle.addEventListener('click', function () {
		this.classList.toggle('active');
		navbarMenu.classList.toggle('active');
	});
}

// Logout function
function logout() {
	window.notify
		.confirm('Bạn có chắc chắn muốn đăng xuất?', 'Xác nhận đăng xuất', {
			confirmText: 'Đăng xuất',
			cancelText: 'Hủy',
		})
		.then((confirmed) => {
			if (confirmed) {
				localStorage.removeItem('currentUser');
				localStorage.removeItem('isLoggedIn');
				window.notify.success('Đăng xuất thành công!');
				setTimeout(() => {
					window.location.href = '../../index.html';
				}, 1000);
			}
		});
}

// Load user info for dropdown
function loadUserInfo() {
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

	if (currentUser.username) {
		const userId = currentUser.userid || currentUser.userId || currentUser.id;
		const profileKey = `userProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		const userNameEl = document.getElementById('userName');
		const dropdownUserNameEl = document.getElementById('dropdownUserName');
		const dropdownUserEmailEl = document.getElementById('dropdownUserEmail');

		const displayName =
			profile.fullName || currentUser.fullname || currentUser.username;

		if (userNameEl) {
			userNameEl.textContent = displayName;
		}
		if (dropdownUserNameEl) {
			dropdownUserNameEl.textContent = displayName;
		}
		if (dropdownUserEmailEl) {
			dropdownUserEmailEl.textContent =
				profile.email || currentUser.email || '';
		}

		// Update navbar avatar if photo exists
		const navbarAvatar = document.querySelector('.user-dropdown .user-avatar');
		if (navbarAvatar && profile.photo) {
			navbarAvatar.innerHTML = '';
			const img = document.createElement('img');
			img.src = profile.photo;
			img.alt = displayName;
			img.style.cssText =
				'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
			img.onerror = function () {
				navbarAvatar.innerHTML = `
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				`;
			};
			navbarAvatar.appendChild(img);
		}
	}
}

// Initialize user dropdown
function initUserDropdown() {
	const dropdownToggle = document.getElementById('userDropdownToggle');
	const dropdown = dropdownToggle?.closest('.user-dropdown');

	if (!dropdownToggle || !dropdown) return;

	dropdownToggle.addEventListener('click', function (e) {
		e.stopPropagation();
		dropdown.classList.toggle('active');
	});

	// Close dropdown when clicking outside
	document.addEventListener('click', function (e) {
		if (!dropdown.contains(e.target)) {
			dropdown.classList.remove('active');
		}
	});

	// Close dropdown when clicking menu items
	const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
	dropdownItems.forEach((item) => {
		item.addEventListener('click', function () {
			dropdown.classList.remove('active');
		});
	});
}

// Load jobs from API (jobs.json) and render
async function loadJobs() {
	try {
		// Check login status
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		if (!currentUser.userid && !currentUser.userId && !currentUser.id) {
			window.location.href = '../../index.html';
			return;
		}

		// Show loading state
		const jobListEl = document.getElementById('job-list');
		if (jobListEl) {
			jobListEl.innerHTML =
				'<p style="text-align: center; color: #666; padding: 2rem;"><svg style="animation: spin 1s linear infinite; width: 24px; height: 24px; margin-bottom: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><br/>Loading jobs...</p>';
		}

		// Fetch jobs from API (jobs.json)
		const response = await fetch('../../assets/data/jobs.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		allJobs = await response.json();
		filteredJobs = [...allJobs]; // Initially, all jobs are shown

		console.log('Total jobs loaded from API:', allJobs.length);
		console.log('Jobs data sample:', allJobs.slice(0, 3));

		// Update job count display
		const jobCountDisplay = document.getElementById('job-count-display');
		if (jobCountDisplay) {
			jobCountDisplay.textContent = allJobs.length;
		}

		// Reset to page 1 and render
		currentPage = 1;
		renderJobsPage();
		setupPagination();
	} catch (error) {
		console.error('Error loading jobs from API:', error);
		const jobListEl = document.getElementById('job-list');
		if (jobListEl) {
			jobListEl.innerHTML =
				'<p style="text-align: center; color: #e53e3e; padding: 2rem;">❌ Unable to load jobs. Please check your connection and try again.</p>';
		}
	}
}

// Load jobs when page loads
document.addEventListener('DOMContentLoaded', function () {
	// Load user info for dropdown
	loadUserInfo();
	initUserDropdown();

	loadJobs();
});
