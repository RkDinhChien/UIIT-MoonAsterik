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
	const userId = currentUser.userid || currentUser.userId || currentUser.id;
	const profileKey = `companyProfile_${userId}`;
	const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

	if (currentUser.username) {
		const userNameEl = document.getElementById('userName');
		const dropdownUserNameEl = document.getElementById('dropdownUserName');
		const dropdownUserEmailEl = document.getElementById('dropdownUserEmail');

		if (userNameEl) {
			userNameEl.textContent =
				profile.companyName || currentUser.fullname || currentUser.username;
		}
		if (dropdownUserNameEl) {
			dropdownUserNameEl.textContent =
				profile.companyName || currentUser.fullname || currentUser.username;
		}
		if (dropdownUserEmailEl) {
			dropdownUserEmailEl.textContent = currentUser.email || '';
		}

		// Update logo/avatar in navbar
		const navbarAvatar = document.querySelector('.user-dropdown .user-avatar');
		if (navbarAvatar && profile.logo) {
			navbarAvatar.innerHTML = `<img src="${profile.logo}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><path d=\"M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16\"></path></svg>';" />`;
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
	console.log('Company profile page loaded - DOMContentLoaded fired');

	// Load user info for dropdown
	loadUserInfo();
	initUserDropdown();

	// Check if company is logged in
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

	if (!isLoggedIn || !currentUser.userid) {
		console.warn('Company not logged in, redirecting to login page');
		window.location.href = '../../index.html';
		return;
	}

	// Check if this is a company account
	if (currentUser.accountType !== 'company') {
		console.warn('Not a company account, redirecting');
		window.location.href = '../../index.html';
		return;
	}

	console.log('Current logged in company:', currentUser);
	console.log('Company ID:', currentUser.userid);

	// Small delay to ensure DOM is fully ready
	setTimeout(() => {
		const profileKey = `companyProfile_${currentUser.userid}`;
		const savedProfile = localStorage.getItem(profileKey);
		console.log('Company profile key:', profileKey);
		console.log('Saved profile data exists:', !!savedProfile);

		if (savedProfile) {
			const profile = JSON.parse(savedProfile);
			console.log('Parsed company profile:', profile);
			console.log('Tech Stack count:', profile.techStack?.length || 0);
			console.log('Offices count:', profile.offices?.length || 0);
			console.log('Benefits count:', profile.benefits?.length || 0);
			console.log('Social Links count:', profile.socialLinks?.length || 0);
		}

		loadCompanyProfile();
		console.log('loadCompanyProfile() completed');
	}, 100);
});

// Listen for profile updates from other tabs/windows
window.addEventListener('companyProfileUpdated', function () {
	loadUserInfo();
});

// Check for profile updates when tab gets focus
window.addEventListener('focus', function () {
	loadUserInfo();
});

// Periodically check for updates
setInterval(function () {
	const lastCheck = localStorage.getItem('companyProfileLastChecked') || '0';
	const lastUpdate = localStorage.getItem('companyProfileLastUpdated') || '0';
	if (lastUpdate > lastCheck) {
		loadUserInfo();
		localStorage.setItem('companyProfileLastChecked', Date.now().toString());
	}
}, 5000);
