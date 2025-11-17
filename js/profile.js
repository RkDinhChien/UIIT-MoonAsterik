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

window.logout = logout;

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	console.log('Profile page loaded - DOMContentLoaded fired');

	// Load user info for dropdown
	loadUserInfo();
	initUserDropdown();

	// Listen for profile updates
	window.addEventListener('profileUpdated', function () {
		loadUserInfo();
	});

	// Check if user is logged in
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

	if (!currentUser || !currentUser.userid) {
		window.location.href = '../../index.html';
		return;
	}	console.log('Current logged in user:', currentUser);
	console.log('User ID:', currentUser.userid);

	// Small delay to ensure DOM is fully ready
	setTimeout(() => {
		const profileKey = `userProfile_${currentUser.userid}`;
		const savedProfile = localStorage.getItem(profileKey);
		console.log('Profile key:', profileKey);
		console.log('Saved profile data exists:', !!savedProfile);

		if (savedProfile) {
			const profile = JSON.parse(savedProfile);
			console.log('Parsed profile:', profile);
			console.log('Skills count:', profile.skills?.length || 0);
			console.log('Education count:', profile.education?.length || 0);
			console.log('Experience count:', profile.experience?.length || 0);
			console.log('Links count:', profile.links?.length || 0);
		}

		loadProfile();
		console.log('loadProfile() completed');
	}, 100);
});
