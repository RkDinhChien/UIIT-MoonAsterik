// Company Profile Save Module
// Individual save functions for each section

// Save Basic Information
function saveBasicInfo() {
	try {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		const profileKey = `companyProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		// Collect basic information
		const companyName = document.getElementById('companyName').value.trim();
		const industry = document.getElementById('industry').value;
		const companySize = document.getElementById('companySize').value;
		const founded = document.getElementById('founded').value;
		const email = document.getElementById('email').value.trim();
		const phone = document.getElementById('phone').value.trim();
		const website = document.getElementById('website').value.trim();
		const location = document.getElementById('location').value.trim();
		const description = document.getElementById('description').value.trim();

		// Get visibility setting
		const visibilityRadio = document.querySelector(
			'input[name="visibility"]:checked'
		);
		const visibility = visibilityRadio ? visibilityRadio.value : 'public';

		// Validate required fields
		if (!companyName || !industry || !email) {
			window.notify.warning(
				'Vui lòng điền đầy đủ các trường bắt buộc: Tên công ty, Ngành nghề, và Email',
				'Thiếu thông tin'
			);
			return;
		}

		// Update profile with basic info
		profile.userId = userId;
		profile.companyName = companyName;
		profile.industry = industry;
		profile.companySize = companySize;
		profile.founded = founded;
		profile.email = email;
		profile.phone = phone;
		profile.website = website;
		profile.location = location;
		profile.description = description;
		profile.visibility = visibility;
		profile.lastUpdated = new Date().toISOString();

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Update currentUser
		currentUser.companyName = companyName;
		currentUser.email = email;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));

		// Dispatch event
		window.dispatchEvent(
			new CustomEvent('companyProfileUpdated', { detail: profile })
		);
		localStorage.setItem('companyProfileLastUpdated', Date.now().toString());

		window.notify.success('Lưu thông tin cơ bản thành công!');
	} catch (error) {
		console.error('Error saving basic info:', error);
		window.notify.error('Lưu thất bại. Vui lòng thử lại!', 'Lỗi');
	}
}

// Save Tech Stack
function saveTechStack() {
	try {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		const profileKey = `companyProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		// Collect Tech Stack
		const techStack = [];
		const techBadges = document.querySelectorAll('.tech-badge');
		techBadges.forEach((badge) => {
			const techText = badge.childNodes[0]?.textContent?.trim();
			if (techText) {
				techStack.push(techText);
			}
		});

		// Update profile
		profile.techStack = techStack;
		profile.lastUpdated = new Date().toISOString();

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Dispatch event
		window.dispatchEvent(
			new CustomEvent('companyProfileUpdated', { detail: profile })
		);
		localStorage.setItem('companyProfileLastUpdated', Date.now().toString());

		window.notify.success(
			`Lưu tech stack thành công! (${techStack.length} công nghệ)`
		);
	} catch (error) {
		console.error('Error saving tech stack:', error);
		window.notify.error('Lưu thất bại. Vui lòng thử lại!', 'Lỗi');
	}
}

// Save Offices
function saveOffices() {
	try {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		const profileKey = `companyProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		// Collect Offices
		const offices = [];
		const officeForms = document.querySelectorAll('.office-form');
		officeForms.forEach((form) => {
			const name = form.querySelector('.office-name')?.value.trim();
			const city = form.querySelector('.office-city')?.value.trim();
			const country = form.querySelector('.office-country')?.value.trim();
			const address = form.querySelector('.office-address')?.value.trim();

			if (name && city && country) {
				offices.push({ name, city, country, address });
			}
		});

		// Update profile
		profile.offices = offices;
		profile.lastUpdated = new Date().toISOString();

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Dispatch event
		window.dispatchEvent(
			new CustomEvent('companyProfileUpdated', { detail: profile })
		);
		localStorage.setItem('companyProfileLastUpdated', Date.now().toString());

		window.notify.success(
			`Lưu địa điểm văn phòng thành công! (${offices.length} văn phòng)`
		);
	} catch (error) {
		console.error('Error saving offices:', error);
		window.notify.error('Lưu thất bại. Vui lòng thử lại!', 'Lỗi');
	}
}

// Save Benefits
function saveBenefits() {
	try {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		const profileKey = `companyProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		// Collect Benefits
		const benefits = [];
		const benefitForms = document.querySelectorAll('.benefit-form');
		benefitForms.forEach((form) => {
			const type = form.querySelector('.benefit-type')?.value;
			const benefitDescription = form
				.querySelector('.benefit-description')
				?.value.trim();

			if (type) {
				benefits.push({ type, description: benefitDescription });
			}
		});

		// Update profile
		profile.benefits = benefits;
		profile.lastUpdated = new Date().toISOString();

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Dispatch event
		window.dispatchEvent(
			new CustomEvent('companyProfileUpdated', { detail: profile })
		);
		localStorage.setItem('companyProfileLastUpdated', Date.now().toString());

		window.notify.success(
			`Lưu phúc lợi thành công! (${benefits.length} phúc lợi)`
		);
	} catch (error) {
		console.error('Error saving benefits:', error);
		window.notify.error('Lưu thất bại. Vui lòng thử lại!', 'Lỗi');
	}
}

// Save Social Links
function saveSocialLinks() {
	try {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		const profileKey = `companyProfile_${userId}`;
		const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

		// Collect Social Links
		const socialLinks = [];
		const socialLinkForms = document.querySelectorAll('.social-link-form');
		socialLinkForms.forEach((form) => {
			const platform = form.querySelector('.social-platform')?.value;
			const url = form.querySelector('.social-url')?.value.trim();

			if (platform && url) {
				socialLinks.push({ platform, url });
			}
		});

		// Update profile
		profile.socialLinks = socialLinks;
		profile.lastUpdated = new Date().toISOString();

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Dispatch event
		window.dispatchEvent(
			new CustomEvent('companyProfileUpdated', { detail: profile })
		);
		localStorage.setItem('companyProfileLastUpdated', Date.now().toString());

		window.notify.success(
			`Lưu liên kết xã hội thành công! (${socialLinks.length} liên kết)`
		);
	} catch (error) {
		console.error('Error saving social links:', error);
		window.notify.error('Lưu thất bại. Vui lòng thử lại!', 'Lỗi');
	}
}

// Export functions to window object
window.saveBasicInfo = saveBasicInfo;
window.saveTechStack = saveTechStack;
window.saveOffices = saveOffices;
window.saveBenefits = saveBenefits;
window.saveSocialLinks = saveSocialLinks;
