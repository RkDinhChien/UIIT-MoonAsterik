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
    resume: null
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
  
  // Set visibility
  if (profile.visibility) {
    const visibilityRadio = document.querySelector(`input[name="visibility"][value="${profile.visibility}"]`);
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
      educationForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      educationForm.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">School/University *</label>
            <input type="text" class="form-input edu-school" value="${edu.school || ''}" placeholder="Institution name" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Degree *</label>
            <input type="text" class="form-input edu-degree" value="${edu.degree || ''}" placeholder="Bachelor's, Master's, etc." />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Field of Study *</label>
            <input type="text" class="form-input edu-field" value="${edu.field || ''}" placeholder="Computer Science, IT, etc." />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">GPA</label>
            <input type="text" class="form-input edu-gpa" value="${edu.gpa || ''}" placeholder="3.5/4.0" />
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
            <input type="month" class="form-input edu-start" value="${edu.startDate || ''}" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
            <input type="month" class="form-input edu-end" value="${edu.endDate || ''}" ${edu.current ? 'disabled' : ''} />
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" class="edu-current" ${edu.current ? 'checked' : ''} /> Currently studying
            </label>
          </div>
        </div>
        
        <div style="margin-top: 1rem; text-align: right;">
          <button class="btn" onclick="removeEducation('${educationId}')" style="background: #f44336; color: white; padding: 0.5rem 1rem;">
            Remove Education
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
      experienceForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      experienceForm.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Job Title *</label>
            <input type="text" class="form-input exp-title" value="${exp.title || ''}" placeholder="e.g. Frontend Developer Intern" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Company *</label>
            <input type="text" class="form-input exp-company" value="${exp.company || ''}" placeholder="Company name" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Location</label>
            <input type="text" class="form-input exp-location" value="${exp.location || ''}" placeholder="City, Country" />
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end; margin-bottom: 1rem;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
            <input type="month" class="form-input exp-start" value="${exp.startDate || ''}" />
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
            <input type="month" class="form-input exp-end" value="${exp.endDate || ''}" ${exp.current ? 'disabled' : ''} />
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" class="exp-current" ${exp.current ? 'checked' : ''} /> Currently working
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
          <textarea class="form-input exp-description" rows="3" placeholder="Describe your responsibilities and achievements...">${exp.description || ''}</textarea>
        </div>
        
        <div style="margin-top: 1rem; text-align: right;">
          <button class="btn" onclick="removeExperience('${experienceId}')" style="background: #f44336; color: white; padding: 0.5rem 1rem;">
            Remove Experience
          </button>
        </div>
      `;
      
      experienceList.appendChild(experienceForm);
    });
  }
  
  // Load Skills
  if (profile.skills && profile.skills.length > 0) {
    const skillsList = document.getElementById('skills-list');
    const noSkills = document.getElementById('no-skills');
    if (noSkills) noSkills.remove();
    
    const colors = [
      { bg: '#E3F2FD', text: '#1976D2' },
      { bg: '#E8F5E9', text: '#388E3C' },
      { bg: '#FFF3E0', text: '#F57C00' },
      { bg: '#F3E5F5', text: '#7B1FA2' },
      { bg: '#FCE4EC', text: '#C2185B' },
      { bg: '#E0F2F1', text: '#00796B' }
    ];
    
    profile.skills.forEach((skill, index) => {
      const randomColor = colors[index % colors.length];
      
      const skillBadge = document.createElement('span');
      skillBadge.className = 'badge skill-badge';
      skillBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;`;
      skillBadge.innerHTML = `
        ${skill}
        <span onclick="this.parentElement.remove(); checkNoSkills();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
      `;
      
      skillsList.appendChild(skillBadge);
    });
    
    console.log(`Loaded ${profile.skills.length} skills:`, profile.skills);
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
      linkForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      linkForm.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr auto; gap: 1rem; align-items: end;">
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Platform/Type *</label>
            <select class="form-input link-platform">
              <option value="">Select type</option>
              <option value="GitHub" ${link.platform === 'GitHub' ? 'selected' : ''}>GitHub</option>
              <option value="LinkedIn" ${link.platform === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
              <option value="Portfolio" ${link.platform === 'Portfolio' ? 'selected' : ''}>Portfolio</option>
              <option value="Behance" ${link.platform === 'Behance' ? 'selected' : ''}>Behance</option>
              <option value="Dribbble" ${link.platform === 'Dribbble' ? 'selected' : ''}>Dribbble</option>
              <option value="Medium" ${link.platform === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Dev.to" ${link.platform === 'Dev.to' ? 'selected' : ''}>Dev.to</option>
              <option value="Twitter" ${link.platform === 'Twitter' ? 'selected' : ''}>Twitter</option>
              <option value="YouTube" ${link.platform === 'YouTube' ? 'selected' : ''}>YouTube</option>
              <option value="Other" ${link.platform === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">URL *</label>
            <input type="url" class="form-input link-url" value="${link.url || ''}" placeholder="https://..." />
          </div>
          
          <div class="form-group">
            <button class="btn" onclick="removeLink('${linkId}')" style="background: #f44336; color: white; padding: 0.5rem 1rem;">
              Remove
            </button>
          </div>
        </div>
      `;
      
      linksList.appendChild(linkForm);
    });
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
      alert('Please login first to save your profile!');
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
    const visibilityRadio = document.querySelector('input[name="visibility"]:checked');
    const visibility = visibilityRadio ? visibilityRadio.value : 'public';
    
    // Validate required fields
    if (!fullName || !email) {
      alert('Please fill in required fields: Full Name and Email');
      return;
    }
    
    // Collect Education data
    const education = [];
    const educationForms = document.querySelectorAll('.education-form');
    educationForms.forEach(form => {
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
          current
        });
      }
    });
    
    // Collect Experience data
    const experience = [];
    const experienceForms = document.querySelectorAll('.experience-form');
    experienceForms.forEach(form => {
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
          description
        });
      }
    });
    
    // Collect Skills data
    const skills = [];
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => {
      const skillText = badge.childNodes[0]?.textContent?.trim();
      if (skillText) {
        skills.push(skillText);
      }
    });
    
    // Collect Links data
    const links = [];
    const linkForms = document.querySelectorAll('.link-form');
    linkForms.forEach(form => {
      const platform = form.querySelector('.link-platform')?.value;
      const url = form.querySelector('.link-url')?.value.trim();
      
      if (platform && url) {
        links.push({
          platform,
          url
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
      profilePicture: null, // TODO: Implement later
      resume: null, // TODO: Implement later
      lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage with userId-specific key
    const profileKey = `userProfile_${userId}`;
    localStorage.setItem(profileKey, JSON.stringify(profileData));
    
    // Also keep a reference in currentUser
    currentUser.profileKey = profileKey;
    currentUser.fullName = fullName;
    currentUser.email = email;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('Profile saved successfully!');
    
    console.log('Profile saved with key:', profileKey);
    console.log('Saved Profile:', profileData);
    
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Failed to save profile. Please try again.');
  }
}

// Export functions to window object
window.loadProfile = loadProfile;
window.saveProfile = saveProfile;
