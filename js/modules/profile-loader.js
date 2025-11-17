// Profile Loader Module - Handles profile loading and saving

// Counter variables for dynamic form elements
let educationCounter = 0;
let experienceCounter = 0;
let linkCounter = 0;

// Load profile from localStorage or use default
function loadProfile() {
	// Get current logged in user
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const userId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!userId) {
		console.warn('No userId found - user not logged in');
		// Show empty profile
		return;
	}

	console.log('Loading profile for userId:', userId);

	const defaultProfile = {
		userId: userId,
		fullName: currentUser.fullName || currentUser.username || '',
		email: currentUser.email || '',
		phone: '',
		location: '',
		bio: '',
		visibility: 'public',
		profilePicture: null,
		education: [],
		experience: [],
		skills: [],
		links: [],
		resume: null,
	};

	// Load profile data for this specific user
	const profileKey = `userProfile_${userId}`;
	const profileData = localStorage.getItem(profileKey);

	console.log('Looking for profile with key:', profileKey);
	console.log('Found profile data:', profileData ? 'Yes' : 'No');

	const profile = profileData ? JSON.parse(profileData) : defaultProfile;

	console.log('Loaded profile:', profile);

	// Populate form fields
	document.getElementById('fullName').value = profile.fullName || '';
	document.getElementById('email').value = profile.email || '';
	document.getElementById('phone').value = profile.phone || '';
	document.getElementById('location').value = profile.location || '';
	document.getElementById('bio').value = profile.bio || '';

	// Load profile picture
	if (profile.profilePicture) {
		const imgPreview = document.getElementById('profileImagePreview');
		const imgPlaceholder = document.getElementById('profileImagePlaceholder');
		if (imgPreview && imgPlaceholder) {
			imgPreview.src = profile.profilePicture;
			imgPreview.style.display = 'block';
			imgPlaceholder.style.display = 'none';
		}
		// Store in memory for editing
		window.currentProfilePicture = profile.profilePicture;
	}

	// Set visibility
	if (profile.visibility) {
		const visibilityRadio = document.querySelector(
			`input[name="visibility"][value="${profile.visibility}"]`
		);
		if (visibilityRadio) {
			visibilityRadio.checked = true;
		}
	}

	// Load Education
	if (profile.education && profile.education.length > 0) {
		const educationList = document.getElementById('education-list');
		const noEducation = document.getElementById('no-education');
		if (noEducation) noEducation.remove();

		profile.education.forEach((edu, index) => {
			educationCounter++;
			const educationId = `education-${educationCounter}`;

			const educationForm = document.createElement('div');
			educationForm.id = educationId;
			educationForm.className = 'education-form';
			educationForm.style.cssText =
				'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';

			educationForm.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">School/University *</label>
            <input type="text" class="form-input edu-school" value="${
							edu.school || ''
						}" placeholder="Institution name" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Degree *</label>
            <input type="text" class="form-input edu-degree" value="${
							edu.degree || ''
						}" placeholder="Bachelor's, Master's, etc." />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Field of Study *</label>
            <input type="text" class="form-input edu-field" value="${
							edu.field || ''
						}" placeholder="Computer Science, IT, etc." />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">GPA</label>
            <input type="text" class="form-input edu-gpa" value="${
							edu.gpa || ''
						}" placeholder="3.5/4.0" />
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
            <input type="month" class="form-input edu-start" value="${
							edu.startDate || ''
						}" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
            <input type="month" class="form-input edu-end" value="${
							edu.endDate || ''
						}" ${edu.current ? 'disabled' : ''} />
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" class="edu-current" ${
								edu.current ? 'checked' : ''
							} /> Currently studying
            </label>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd; display: flex; justify-content: flex-end;">
          <button class="btn" onclick="removeEducation('${educationId}')" style="background: #ff5252; color: white; padding: 0.5rem 1.25rem; border-radius: 6px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Remove
          </button>
        </div>
      `;

			educationList.appendChild(educationForm);
		});
	}

	// Load Experience
	if (profile.experience && profile.experience.length > 0) {
		const experienceList = document.getElementById('experience-list');
		const noExperience = document.getElementById('no-experience');
		if (noExperience) noExperience.remove();

		profile.experience.forEach((exp, index) => {
			experienceCounter++;
			const experienceId = `experience-${experienceCounter}`;

			const experienceForm = document.createElement('div');
			experienceForm.id = experienceId;
			experienceForm.className = 'experience-form';
			experienceForm.style.cssText =
				'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';

			experienceForm.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Job Title *</label>
            <input type="text" class="form-input exp-title" value="${
							exp.title || ''
						}" placeholder="e.g. Frontend Developer Intern" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Company *</label>
            <input type="text" class="form-input exp-company" value="${
							exp.company || ''
						}" placeholder="Company name" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Location</label>
            <input type="text" class="form-input exp-location" value="${
							exp.location || ''
						}" placeholder="City, Country" />
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
            <input type="month" class="form-input exp-start" value="${
							exp.startDate || ''
						}" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
            <input type="month" class="form-input exp-end" value="${
							exp.endDate || ''
						}" ${exp.current ? 'disabled' : ''} />
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" class="exp-current" ${
								exp.current ? 'checked' : ''
							} /> Currently working
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
          <textarea class="form-input exp-description" rows="3" placeholder="Describe your responsibilities and achievements...">${
						exp.description || ''
					}</textarea>
        </div>
        
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd; display: flex; justify-content: flex-end;">
          <button class="btn" onclick="removeExperience('${experienceId}')" style="background: #ff5252; color: white; padding: 0.5rem 1.25rem; border-radius: 6px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Remove
          </button>
        </div>
      `;

			experienceList.appendChild(experienceForm);
		});
	}

	// Load Skills
	if (profile.skills && profile.skills.length > 0) {
		displaySkills(profile.skills);
		console.log(`Loaded ${profile.skills.length} skills:`, profile.skills);
	} else {
		displaySkills([]);
	}

	// Load Links
	if (profile.links && profile.links.length > 0) {
		const linksList = document.getElementById('links-list');
		const noLinks = document.getElementById('no-links');
		if (noLinks) noLinks.remove();

		profile.links.forEach((link, index) => {
			linkCounter++;
			const linkId = `link-${linkCounter}`;

			const linkForm = document.createElement('div');
			linkForm.id = linkId;
			linkForm.className = 'link-form';
			linkForm.style.cssText =
				'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';

			linkForm.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Platform/Type *</label>
            <select class="form-input link-platform link-title">
              <option value="">Select type</option>
              <option value="GitHub" ${
								link.platform === 'GitHub' ? 'selected' : ''
							}>GitHub</option>
              <option value="LinkedIn" ${
								link.platform === 'LinkedIn' ? 'selected' : ''
							}>LinkedIn</option>
              <option value="Portfolio" ${
								link.platform === 'Portfolio' ? 'selected' : ''
							}>Portfolio</option>
              <option value="Behance" ${
								link.platform === 'Behance' ? 'selected' : ''
							}>Behance</option>
              <option value="Dribbble" ${
								link.platform === 'Dribbble' ? 'selected' : ''
							}>Dribbble</option>
              <option value="Medium" ${
								link.platform === 'Medium' ? 'selected' : ''
							}>Medium</option>
              <option value="Dev.to" ${
								link.platform === 'Dev.to' ? 'selected' : ''
							}>Dev.to</option>
              <option value="Twitter" ${
								link.platform === 'Twitter' ? 'selected' : ''
							}>Twitter</option>
              <option value="YouTube" ${
								link.platform === 'YouTube' ? 'selected' : ''
							}>YouTube</option>
              <option value="Other" ${
								link.platform === 'Other' ? 'selected' : ''
							}>Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">URL *</label>
            <input type="url" class="form-input link-url" value="${
							link.url || ''
						}" placeholder="https://..." />
          </div>
        </div>
        
        <div style="padding-top: 1rem; border-top: 1px solid #ddd; display: flex; justify-content: flex-end;">
          <button class="btn" onclick="removeLink('${linkId}')" style="background: #ff5252; color: white; padding: 0.5rem 1.25rem; border-radius: 6px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Remove
          </button>
        </div>
      `;

			linksList.appendChild(linkForm);
		});
	}

	// Load Resume if exists
	if (profile.resume && profile.resume.name) {
		updateResumeUI(profile.resume.name);
	}

	return profile;
}

// Save Profile Function
function saveProfile() {
	try {
		// Get current user from localStorage
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

		// Get userId from logged in user
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = 'index.html';
			console.error('No userId found in currentUser:', currentUser);
			return;
		}

		console.log('Saving profile for userId:', userId);

		// Collect basic information
		const fullName = document.getElementById('fullName').value.trim();
		const email = document.getElementById('email').value.trim();
		const phone = document.getElementById('phone').value.trim();
		const location = document.getElementById('location').value.trim();
		const bio = document.getElementById('bio').value.trim();

		// Get visibility setting
		const visibilityRadio = document.querySelector(
			'input[name="visibility"]:checked'
		);
		const visibility = visibilityRadio ? visibilityRadio.value : 'public';

		// Validate required fields
		if (!fullName || !email) {
			window.notify.warning('Vui lòng điền đầy đủ Họ tên và Email!');
			return;
		}

		// Collect Education data
		const education = [];
		const educationForms = document.querySelectorAll('.education-form');
		educationForms.forEach((form) => {
			const school = form.querySelector('.edu-school')?.value.trim();
			const degree = form.querySelector('.edu-degree')?.value.trim();
			const field = form.querySelector('.edu-field')?.value.trim();
			const gpa = form.querySelector('.edu-gpa')?.value.trim();
			const startDate = form.querySelector('.edu-start')?.value;
			const endDate = form.querySelector('.edu-end')?.value;
			const current = form.querySelector('.edu-current')?.checked;

			if (school && degree && field) {
				education.push({
					school,
					degree,
					field,
					gpa,
					startDate,
					endDate: current ? null : endDate,
					current,
				});
			}
		});

		// Collect Experience data
		const experience = [];
		const experienceForms = document.querySelectorAll('.experience-form');
		experienceForms.forEach((form) => {
			const title = form.querySelector('.exp-title')?.value.trim();
			const company = form.querySelector('.exp-company')?.value.trim();
			const expLocation = form.querySelector('.exp-location')?.value.trim();
			const startDate = form.querySelector('.exp-start')?.value;
			const endDate = form.querySelector('.exp-end')?.value;
			const current = form.querySelector('.exp-current')?.checked;
			const description = form.querySelector('.exp-description')?.value.trim();

			if (title && company) {
				experience.push({
					title,
					company,
					location: expLocation,
					startDate,
					endDate: current ? null : endDate,
					current,
					description,
				});
			}
		});

		// Collect Skills data
		const skills = [];
		const skillBadges = document.querySelectorAll('.skill-badge');
		skillBadges.forEach((badge) => {
			const skillText = badge.childNodes[0]?.textContent?.trim();
			if (skillText) {
				skills.push(skillText);
			}
		});

		// Collect Links data
		const links = [];
		const linkForms = document.querySelectorAll('.link-form');
		linkForms.forEach((form) => {
			const platform = form.querySelector('.link-platform')?.value;
			const url = form.querySelector('.link-url')?.value.trim();

			if (platform && url) {
				links.push({
					platform,
					url,
				});
			}
		});

		// Build profile object
		const profileData = {
			userId,
			fullName,
			email,
			phone,
			location,
			bio,
			visibility,
		education,
		experience,
		skills,
		links,
		profilePicture: window.currentProfilePicture || null,
		photo: window.currentProfilePicture || null,
		resume: null, // TODO: Implement later
		lastUpdated: new Date().toISOString(),
	};		// Save to localStorage with userId-specific key
		const profileKey = `userProfile_${userId}`;
		localStorage.setItem(profileKey, JSON.stringify(profileData));

		// Mark profile as updated with timestamp
		localStorage.setItem('profileLastUpdated', Date.now().toString());

		// Dispatch custom event for other pages to listen
		window.dispatchEvent(new Event('profileUpdated'));

		// Also keep a reference in currentUser
		currentUser.profileKey = profileKey;
		currentUser.fullName = fullName;
		currentUser.email = email;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));

		window.notify.success('Profile saved successfully!');

		console.log('Profile saved with key:', profileKey);
		console.log('Saved Profile:', profileData);
	} catch (error) {
		console.error('Error saving profile:', error);
		window.notify.error('Failed to save profile. Please try again.');
	}
}

// Export functions to window object
window.loadProfile = loadProfile;
window.saveProfile = saveProfile;

// Handle profile picture upload
window.currentProfilePicture = null;

// Skills Modal Functions
function openSkillModal() {
	const modal = document.getElementById('skillModal');
	const input = document.getElementById('skillInput');
	const levelSelect = document.getElementById('skillLevel');
	const monthsInput = document.getElementById('skillMonths');

	if (modal) {
		modal.classList.add('active');

		// Reset form fields
		if (input) {
			input.value = '';
			input.focus();
		}
		if (levelSelect) {
			levelSelect.value = '';
		}
		if (monthsInput) {
			monthsInput.value = '';
		}
	}
}

function closeSkillModal() {
	const modal = document.getElementById('skillModal');
	const input = document.getElementById('skillInput');
	const levelSelect = document.getElementById('skillLevel');
	const monthsInput = document.getElementById('skillMonths');

	if (modal) {
		modal.classList.remove('active');

		// Reset form fields
		if (input) input.value = '';
		if (levelSelect) levelSelect.value = '';
		if (monthsInput) monthsInput.value = '';
	}
}

function addSkillFromModal() {
	const input = document.getElementById('skillInput');
	const levelSelect = document.getElementById('skillLevel');
	const monthsInput = document.getElementById('skillMonths');

	const skillName = input ? input.value.trim() : '';
	const level = levelSelect ? levelSelect.value : '';
	const months = monthsInput ? parseInt(monthsInput.value) || null : null;

	if (!skillName) {
		showSaveSuccess('Please enter a skill name', true);
		return;
	}

	if (!level) {
		showSaveSuccess('Please select a proficiency level', true);
		return;
	}

	// Get current user
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const userId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!userId) {
		showSaveSuccess('Please login to add skills', true);
		return;
	}

	// Load current profile
	const profileKey = `userProfile_${userId}`;
	const profileData = localStorage.getItem(profileKey);
	const profile = profileData ? JSON.parse(profileData) : { skills: [] };

	// Initialize skills array if needed
	if (!profile.skills) {
		profile.skills = [];
	}

	// Create skill object
	const newSkill = {
		name: skillName,
		level: level,
		months: months,
	};

	// Check if skill already exists
	const existingSkill = profile.skills.find(
		(s) =>
			(typeof s === 'string' && s === skillName) ||
			(typeof s === 'object' && s.name === skillName)
	);

	if (existingSkill) {
		showSaveSuccess('This skill already exists', true);
		return;
	}

	profile.skills.push(newSkill);

	// Save to localStorage
	localStorage.setItem(profileKey, JSON.stringify(profile));
	localStorage.setItem('profileLastUpdated', Date.now().toString());
	window.dispatchEvent(new Event('profileUpdated'));

	// Refresh display
	displaySkills(profile.skills);

	// Trigger profile completion update
	triggerProfileCompletionUpdate();

	// Close modal
	closeSkillModal();

	console.log('Skill added:', newSkill);
}

function removeSkill(skillName) {
	if (!confirm(`Remove "${skillName}" from your skills?`)) {
		return;
	}

	// Get current user
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const userId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!userId) return;

	// Load current profile
	const profileKey = `userProfile_${userId}`;
	const profileData = localStorage.getItem(profileKey);
	const profile = profileData ? JSON.parse(profileData) : { skills: [] };

	// Remove skill (handle both string and object format)
	if (profile.skills) {
		profile.skills = profile.skills.filter((skill) => {
			if (typeof skill === 'string') {
				return skill !== skillName;
			} else if (typeof skill === 'object') {
				return skill.name !== skillName;
			}
			return true;
		});

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));
		localStorage.setItem('profileLastUpdated', Date.now().toString());
		window.dispatchEvent(new Event('profileUpdated'));

		// Refresh display
		displaySkills(profile.skills);

		// Trigger profile completion update
		triggerProfileCompletionUpdate();

		console.log('Skill removed:', skillName);
	}
}

function displaySkills(skills) {
	const skillsList = document.getElementById('skills-list');
	const noSkillsMsg = document.getElementById('no-skills');

	if (!skillsList) return;

	if (!skills || skills.length === 0) {
		skillsList.innerHTML = '';
		if (noSkillsMsg) {
			noSkillsMsg.style.display = 'block';
		}
		return;
	}

	if (noSkillsMsg) {
		noSkillsMsg.style.display = 'none';
	}

	skillsList.innerHTML = skills
		.map((skill) => {
			// Handle both old string format and new object format
			const skillName = typeof skill === 'string' ? skill : skill.name;
			const skillLevel = typeof skill === 'object' ? skill.level : null;
			const skillMonths = typeof skill === 'object' ? skill.months : null;

			// Format months display
			let monthsDisplay = '';
			if (skillMonths) {
				if (skillMonths < 12) {
					monthsDisplay = `${skillMonths} month${skillMonths > 1 ? 's' : ''}`;
				} else {
					const years = Math.floor(skillMonths / 12);
					const remainingMonths = skillMonths % 12;
					monthsDisplay = `${years} year${years > 1 ? 's' : ''}`;
					if (remainingMonths > 0) {
						monthsDisplay += ` ${remainingMonths} month${
							remainingMonths > 1 ? 's' : ''
						}`;
					}
				}
			}

			// Build skill details
			let detailsHTML = '';
			if (skillLevel || skillMonths) {
				detailsHTML = '<div class="skill-details">';
				if (skillLevel) {
					detailsHTML += `<span class="skill-detail-item">📊 ${skillLevel}</span>`;
				}
				if (skillMonths) {
					detailsHTML += `<span class="skill-detail-item">⏱️ ${monthsDisplay}</span>`;
				}
				detailsHTML += '</div>';
			}

			return `
      <div class="skill-tag">
        <div class="skill-name">
          <span>${skillName}</span>
          <button onclick="removeSkill('${skillName.replace(
						/'/g,
						"\\'"
					)}')">×</button>
        </div>
        ${detailsHTML}
      </div>
    `;
		})
		.join('');
}

// Individual Save Functions
function saveBasicInfo() {
	try {
		// Get current user
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = '../../index.html';
			return;
		}

		// Collect basic information
		const fullName = document.getElementById('fullName').value.trim();
		const email = document.getElementById('email').value.trim();
		const phone = document.getElementById('phone').value.trim();
		const location = document.getElementById('location').value.trim();
		const bio = document.getElementById('bio').value.trim();

		// Validate required fields
		if (!fullName || !email) {
			window.notify.warning('Vui lòng điền đầy đủ Họ tên và Email!');
			return;
		}

		// Load existing profile
		const profileKey = `userProfile_${userId}`;
		const profileData = localStorage.getItem(profileKey);
		const profile = profileData ? JSON.parse(profileData) : {};

		// Update basic info fields only
		profile.userId = userId;
		profile.fullName = fullName;
		profile.email = email;
		profile.phone = phone;
		profile.location = location;
		profile.bio = bio;

		// Save profile picture if updated
		if (window.currentProfilePicture) {
			profile.profilePicture = window.currentProfilePicture;
		}

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Update currentUser name if changed
		if (currentUser.fullName !== fullName) {
			currentUser.fullName = fullName;
			localStorage.setItem('currentUser', JSON.stringify(currentUser));
		}

		// Trigger profile completion update if on dashboard
		triggerProfileCompletionUpdate();

		showSaveSuccess('Basic information saved successfully!');
		console.log('Basic info saved for userId:', userId);
	} catch (error) {
		console.error('Error saving basic info:', error);
		showSaveSuccess(
			'Failed to save basic information. Please try again.',
			true
		);
	}
}

// Make functions globally available
window.openSkillModal = openSkillModal;
window.closeSkillModal = closeSkillModal;
window.addSkillFromModal = addSkillFromModal;
window.removeSkill = removeSkill;
window.saveBasicInfo = saveBasicInfo;

// Save Education Section
function saveEducation() {
	try {
		// Get current user
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = 'index.html';
			return;
		}

		// Load existing profile
		const profileKey = `userProfile_${userId}`;
		const profileData = localStorage.getItem(profileKey);
		const profile = profileData ? JSON.parse(profileData) : {};

		// Collect Education data
		const education = [];
		const educationForms = document.querySelectorAll('.education-form');
		educationForms.forEach((form) => {
			const school = form.querySelector('.edu-school')?.value.trim();
			const degree = form.querySelector('.edu-degree')?.value.trim();
			const field = form.querySelector('.edu-field')?.value.trim();
			const gpa = form.querySelector('.edu-gpa')?.value.trim();
			const startDate = form.querySelector('.edu-start')?.value;
			const endDate = form.querySelector('.edu-end')?.value;
			const current = form.querySelector('.edu-current')?.checked;

			if (school && degree && field) {
				education.push({
					school,
					degree,
					field,
					gpa,
					startDate,
					endDate: current ? null : endDate,
					current,
				});
			}
		});

		// Update only education field
		profile.education = education;

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Trigger profile completion update
		triggerProfileCompletionUpdate();

		showSaveSuccess('Education section saved successfully!');
		console.log('Education saved:', education);
	} catch (error) {
		console.error('Error saving education:', error);
		window.notify.error('Failed to save education. Please try again.');
	}
}

// Save Experience Section
function saveExperience() {
	try {
		// Get current user
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = 'index.html';
			return;
		}

		// Load existing profile
		const profileKey = `userProfile_${userId}`;
		const profileData = localStorage.getItem(profileKey);
		const profile = profileData ? JSON.parse(profileData) : {};

		// Collect Experience data
		const experience = [];
		const experienceForms = document.querySelectorAll('.experience-form');
		experienceForms.forEach((form) => {
			const company = form.querySelector('.exp-company')?.value.trim();
			const position = form.querySelector('.exp-position')?.value.trim();
			const location = form.querySelector('.exp-location')?.value.trim();
			const startDate = form.querySelector('.exp-start')?.value;
			const endDate = form.querySelector('.exp-end')?.value;
			const current = form.querySelector('.exp-current')?.checked;
			const description = form.querySelector('.exp-description')?.value.trim();

			if (company && position) {
				experience.push({
					company,
					position,
					location,
					startDate,
					endDate: current ? null : endDate,
					current,
					description,
				});
			}
		});

		// Update only experience field
		profile.experience = experience;

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Trigger profile completion update
		triggerProfileCompletionUpdate();

		showSaveSuccess('Experience section saved successfully!');
		console.log('Experience saved:', experience);
	} catch (error) {
		console.error('Error saving experience:', error);
		window.notify.error('Failed to save experience. Please try again.');
	}
}

// Save Links Section
function saveLinks() {
	try {
		// Get current user
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const userId = currentUser.userid || currentUser.userId || currentUser.id;

		if (!userId) {
			window.location.href = 'index.html';
			return;
		}

		// Load existing profile
		const profileKey = `userProfile_${userId}`;
		const profileData = localStorage.getItem(profileKey);
		const profile = profileData ? JSON.parse(profileData) : {};

		// Collect Links data
		const links = [];
		const linkForms = document.querySelectorAll('.link-item');
		linkForms.forEach((form) => {
			const title = form.querySelector('.link-title')?.value.trim();
			const url = form.querySelector('.link-url')?.value.trim();

			if (title && url) {
				links.push({ title, url });
			}
		});

		// Update only links field
		profile.links = links;

		// Save to localStorage
		localStorage.setItem(profileKey, JSON.stringify(profile));

		// Trigger profile completion update
		triggerProfileCompletionUpdate();

		showSaveSuccess('Links section saved successfully!');
		console.log('Links saved:', links);
	} catch (error) {
		console.error('Error saving links:', error);
		window.notify.error('Failed to save links. Please try again.');
	}
}

window.saveEducation = saveEducation;
window.saveExperience = saveExperience;
window.saveLinks = saveLinks;

// Show save success notification
function showSaveSuccess(message, isError = false) {
	// Remove existing notification if any
	const existing = document.querySelector('.save-success-notification');
	if (existing) existing.remove();

	// Create notification element
	const notification = document.createElement('div');
	notification.className = `save-success-notification ${
		isError ? 'error' : 'success'
	}`;

	const iconSvg = isError
		? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <circle cx="12" cy="12" r="10"></circle>
         <line x1="15" y1="9" x2="9" y2="15"></line>
         <line x1="9" y1="9" x2="15" y2="15"></line>
       </svg>`
		: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <polyline points="20 6 9 17 4 12"></polyline>
       </svg>`;

	notification.innerHTML = `
    ${iconSvg}
    <span class="message">${message}</span>
  `;

	document.body.appendChild(notification);

	// Trigger animation
	setTimeout(() => {
		notification.classList.add('show');
	}, 10);

	// Remove after 3 seconds
	setTimeout(() => {
		notification.classList.remove('show');
		setTimeout(() => {
			notification.remove();
		}, 300);
	}, 3000);
}

window.showSaveSuccess = showSaveSuccess;

document.addEventListener('DOMContentLoaded', function () {
	const profilePictureInput = document.getElementById('profilePictureInput');

	if (profilePictureInput) {
		profilePictureInput.addEventListener('change', function (e) {
			const file = e.target.files[0];

			if (!file) return;

			// Check file type
			if (!file.type.startsWith('image/')) {
				showSaveSuccess('Please select an image file (JPG, PNG, or GIF)', true);
				return;
			}

			// Check file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				showSaveSuccess('File size must be less than 5MB', true);
				return;
			}

			// Read and preview image
			const reader = new FileReader();

			reader.onload = function (event) {
				const imageData = event.target.result;

				// Update preview
				const imgPreview = document.getElementById('profileImagePreview');
				const imgPlaceholder = document.getElementById(
					'profileImagePlaceholder'
				);

				if (imgPreview && imgPlaceholder) {
					imgPreview.src = imageData;
					imgPreview.style.display = 'block';
					imgPlaceholder.style.display = 'none';
				}

				// Store in memory for saving later
				window.currentProfilePicture = imageData;

				// Immediately save to localStorage to update across pages
				const currentUser = JSON.parse(
					localStorage.getItem('currentUser') || '{}'
				);
				const userId =
					currentUser.userid || currentUser.userId || currentUser.id;
				if (userId) {
					const profileKey = `userProfile_${userId}`;
					const profileData = localStorage.getItem(profileKey);
					const profile = profileData ? JSON.parse(profileData) : {};
					profile.profilePicture = imageData;
					profile.photo = imageData;
					localStorage.setItem(profileKey, JSON.stringify(profile));
					localStorage.setItem('profileLastUpdated', Date.now().toString());
					window.dispatchEvent(new Event('profileUpdated'));
				}

				console.log('Profile picture loaded and saved successfully');
			};

			reader.onerror = function () {
				window.notify.error('Failed to read image file');
			};

			reader.readAsDataURL(file);
		});
	}

	// Skills modal event listeners
	const skillModal = document.getElementById('skillModal');
	const skillInput = document.getElementById('skillInput');

	if (skillModal) {
		// Close modal on background click
		skillModal.addEventListener('click', function (e) {
			if (e.target === skillModal) {
				closeSkillModal();
			}
		});
	}

	if (skillInput) {
		// Add skill on Enter key
		skillInput.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				addSkillFromModal();
			}
		});
	}

	// Resume file upload handler
	const resumeFileInput = document.getElementById('resumeFileInput');

	if (resumeFileInput) {
		resumeFileInput.addEventListener('change', function (e) {
			const file = e.target.files[0];

			if (!file) return;

			// Check file type
			const allowedTypes = [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			];

			if (!allowedTypes.includes(file.type)) {
				showSaveSuccess('Please select a PDF, DOC, or DOCX file', true);
				resumeFileInput.value = '';
				return;
			}

			// Check file size (10MB max)
			if (file.size > 10 * 1024 * 1024) {
				showSaveSuccess('File size must be less than 10MB', true);
				resumeFileInput.value = '';
				return;
			}

			// Read file as base64
			const reader = new FileReader();

			reader.onload = function (event) {
				const fileData = event.target.result;

				// Get current user
				const currentUser = JSON.parse(
					localStorage.getItem('currentUser') || '{}'
				);
				const userId =
					currentUser.userid || currentUser.userId || currentUser.id;

				if (!userId) {
					window.location.href = 'index.html';
					return;
				}

				// Load existing profile
				const profileKey = `userProfile_${userId}`;
				const profileData = localStorage.getItem(profileKey);
				const profile = profileData ? JSON.parse(profileData) : {};

				// Save resume data
				profile.resume = {
					name: file.name,
					type: file.type,
					size: file.size,
					data: fileData,
					uploadDate: new Date().toISOString(),
				};

				// Save to localStorage
				localStorage.setItem(profileKey, JSON.stringify(profile));

				// Update UI
				updateResumeUI(file.name);

				// Trigger profile completion update
				triggerProfileCompletionUpdate();

				showSaveSuccess(`Resume "${file.name}" uploaded successfully!`);
				console.log('Resume uploaded:', file.name);
			};

			reader.onerror = function () {
				window.notify.error('Failed to read resume file');
			};

			reader.readAsDataURL(file);
		});
	}
});

// Update Resume UI
function updateResumeUI(fileName) {
	const resumeTitle = document.getElementById('resumeTitle');
	const resumeSubtitle = document.getElementById('resumeSubtitle');
	const resumeFileName = document.getElementById('resumeFileName');
	const resumeUploadArea = document.getElementById('resumeUploadArea');

	if (fileName) {
		if (resumeTitle) resumeTitle.textContent = 'Resume Uploaded';
		if (resumeSubtitle)
			resumeSubtitle.textContent = 'Click to change your resume';
		if (resumeFileName) {
			resumeFileName.textContent = `📄 ${fileName}`;
			resumeFileName.style.display = 'block';
		}
		if (resumeUploadArea) {
			resumeUploadArea.style.borderColor = '#00bcd4';
			resumeUploadArea.style.backgroundColor = 'rgba(0, 188, 212, 0.05)';
		}
	} else {
		if (resumeTitle) resumeTitle.textContent = 'Upload your resume';
		if (resumeSubtitle)
			resumeSubtitle.textContent = 'PDF, DOC or DOCX. Max size 10MB';
		if (resumeFileName) {
			resumeFileName.style.display = 'none';
		}
		if (resumeUploadArea) {
			resumeUploadArea.style.borderColor = '#e0e0e0';
			resumeUploadArea.style.backgroundColor = 'transparent';
		}
	}
}

window.updateResumeUI = updateResumeUI;

// Trigger profile completion update (for dashboard)
function triggerProfileCompletionUpdate() {
	// Dispatch custom event that dashboard can listen to
	window.dispatchEvent(new CustomEvent('profileUpdated'));

	// Also update localStorage timestamp
	localStorage.setItem('profileLastUpdated', new Date().toISOString());
}

window.triggerProfileCompletionUpdate = triggerProfileCompletionUpdate;
