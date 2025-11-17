// Company Profile Loader Module
// Handles loading and saving company profile data with proper form rendering

// Load Company Profile
function loadCompanyProfile() {
  // Get current logged in company
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.userid || currentUser.userId || currentUser.id;
  
  if (!userId) {
    console.warn('No userId found - company not logged in');
    return;
  }
  
  console.log('Loading company profile for userId:', userId);
  
  const defaultProfile = {
    userId: userId,
    companyName: currentUser.username || '',
    industry: '',
    companySize: '',
    founded: '',
    email: currentUser.email || '',
    phone: '',
    website: '',
    location: '',
    description: '',
    visibility: 'public',
    logo: null,
    techStack: [],
    offices: [],
    benefits: [],
    socialLinks: []
  };
  
  // Load profile data for this specific company
  const profileKey = `companyProfile_${userId}`;
  const profileData = localStorage.getItem(profileKey);
  
  console.log('Looking for company profile with key:', profileKey);
  console.log('Found profile data:', profileData ? 'Yes' : 'No');
  
  const profile = profileData ? JSON.parse(profileData) : defaultProfile;
  
  console.log('Loaded company profile:', profile);
  
  // Populate form fields
  document.getElementById('companyName').value = profile.companyName || '';
  document.getElementById('industry').value = profile.industry || '';
  document.getElementById('companySize').value = profile.companySize || '';
  document.getElementById('founded').value = profile.founded || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('website').value = profile.website || '';
  document.getElementById('location').value = profile.location || '';
  document.getElementById('description').value = profile.description || '';
  
  // Set visibility
  if (profile.visibility) {
    const visibilityRadio = document.querySelector(`input[name="visibility"][value="${profile.visibility}"]`);
    if (visibilityRadio) {
      visibilityRadio.checked = true;
    }
  }
  
  // Load Tech Stack
  if (profile.techStack && profile.techStack.length > 0) {
    const techList = document.getElementById('techstack-list');
    const noTech = document.getElementById('no-techstack');
    if (noTech) noTech.remove();
    
    const colors = [
      { bg: '#E3F2FD', text: '#1976D2' },
      { bg: '#E8F5E9', text: '#388E3C' },
      { bg: '#FFF3E0', text: '#F57C00' },
      { bg: '#F3E5F5', text: '#7B1FA2' },
      { bg: '#FCE4EC', text: '#C2185B' },
      { bg: '#E0F2F1', text: '#00796B' }
    ];
    
    profile.techStack.forEach((tech, index) => {
      const randomColor = colors[index % colors.length];
      
      const techBadge = document.createElement('span');
      techBadge.className = 'badge tech-badge';
      techBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;`;
      techBadge.innerHTML = `
        ${tech}
        <span onclick="this.parentElement.remove(); checkNoTech();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
      `;
      
      techList.appendChild(techBadge);
    });
  }
  
  // Load Offices
  if (profile.offices && profile.offices.length > 0) {
    const officesList = document.getElementById('offices-list');
    const noOffices = document.getElementById('no-offices');
    if (noOffices) noOffices.remove();
    
    profile.offices.forEach((office, index) => {
      officeCounter++;
      const officeId = `office-${officeCounter}`;
      
      const officeForm = document.createElement('div');
      officeForm.id = officeId;
      officeForm.className = 'form-item-container office-form';
      officeForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      officeForm.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label class="form-label">Office Name *</label>
            <input type="text" class="form-input office-name" value="${office.name || ''}" placeholder="e.g. Headquarters, Branch Office" />
          </div>
          
          <div class="form-group">
            <label class="form-label">City *</label>
            <input type="text" class="form-input office-city" value="${office.city || ''}" placeholder="City name" />
          </div>
          
          <div class="form-group">
            <label class="form-label">Country *</label>
            <input type="text" class="form-input office-country" value="${office.country || ''}" placeholder="Country name" />
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label class="form-label">Full Address</label>
          <input type="text" class="form-input office-address" value="${office.address || ''}" placeholder="Street address" />
        </div>
        
        <div style="text-align: right;">
          <button class="btn btn-ghost" onclick="removeOffice('${officeId}')" style="color: #f44336;">
            Remove Office
          </button>
        </div>
      `;
      
      officesList.appendChild(officeForm);
    });
  }
  
  // Load Benefits
  if (profile.benefits && profile.benefits.length > 0) {
    const benefitsList = document.getElementById('benefits-list');
    const noBenefits = document.getElementById('no-benefits');
    if (noBenefits) noBenefits.remove();
    
    profile.benefits.forEach((benefit, index) => {
      benefitCounter++;
      const benefitId = `benefit-${benefitCounter}`;
      
      const benefitForm = document.createElement('div');
      benefitForm.id = benefitId;
      benefitForm.className = 'form-item-container benefit-form';
      benefitForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      benefitForm.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr auto; gap: 1rem; align-items: end;">
          <div class="form-group">
            <label class="form-label">Benefit Type *</label>
            <select class="form-input benefit-type">
              <option value="">Select type</option>
              <option value="Health Insurance" ${benefit.type === 'Health Insurance' ? 'selected' : ''}>Health Insurance</option>
              <option value="Flexible Hours" ${benefit.type === 'Flexible Hours' ? 'selected' : ''}>Flexible Hours</option>
              <option value="Remote Work" ${benefit.type === 'Remote Work' ? 'selected' : ''}>Remote Work</option>
              <option value="Learning Budget" ${benefit.type === 'Learning Budget' ? 'selected' : ''}>Learning Budget</option>
              <option value="Gym Membership" ${benefit.type === 'Gym Membership' ? 'selected' : ''}>Gym Membership</option>
              <option value="Free Lunch" ${benefit.type === 'Free Lunch' ? 'selected' : ''}>Free Lunch</option>
              <option value="Stock Options" ${benefit.type === 'Stock Options' ? 'selected' : ''}>Stock Options</option>
              <option value="Paid Time Off" ${benefit.type === 'Paid Time Off' ? 'selected' : ''}>Paid Time Off</option>
              <option value="Other" ${benefit.type === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input benefit-description" value="${benefit.description || ''}" placeholder="Brief description of the benefit" />
          </div>
          
          <div class="form-group">
            <button class="btn btn-ghost" onclick="removeBenefit('${benefitId}')" style="color: #f44336;">
              Remove
            </button>
          </div>
        </div>
      `;
      
      benefitsList.appendChild(benefitForm);
    });
  }
  
  // Load Social Links
  if (profile.socialLinks && profile.socialLinks.length > 0) {
    const linksList = document.getElementById('social-links-list');
    const noLinks = document.getElementById('no-social-links');
    if (noLinks) noLinks.remove();
    
    profile.socialLinks.forEach((link, index) => {
      socialLinkCounter++;
      const linkId = `social-link-${socialLinkCounter}`;
      
      const linkForm = document.createElement('div');
      linkForm.id = linkId;
      linkForm.className = 'form-item-container social-link-form';
      linkForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
      
      linkForm.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr auto; gap: 1rem; align-items: end;">
          <div class="form-group">
            <label class="form-label">Platform *</label>
            <select class="form-input social-platform">
              <option value="">Select platform</option>
              <option value="LinkedIn" ${link.platform === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
              <option value="Facebook" ${link.platform === 'Facebook' ? 'selected' : ''}>Facebook</option>
              <option value="Twitter" ${link.platform === 'Twitter' ? 'selected' : ''}>Twitter</option>
              <option value="Instagram" ${link.platform === 'Instagram' ? 'selected' : ''}>Instagram</option>
              <option value="YouTube" ${link.platform === 'YouTube' ? 'selected' : ''}>YouTube</option>
              <option value="GitHub" ${link.platform === 'GitHub' ? 'selected' : ''}>GitHub</option>
              <option value="Glassdoor" ${link.platform === 'Glassdoor' ? 'selected' : ''}>Glassdoor</option>
              <option value="Other" ${link.platform === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">URL *</label>
            <input type="url" class="form-input social-url" value="${link.url || ''}" placeholder="https://..." />
          </div>
          
          <div class="form-group">
            <button class="btn btn-ghost" onclick="removeSocialLink('${linkId}')" style="color: #f44336;">
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

// Save Company Profile
function saveCompanyProfile() {
  try {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Get userId from logged in company
    const userId = currentUser.userid || currentUser.userId || currentUser.id;
    
    if (!userId) {
      alert('Please login first to save your company profile!');
      console.error('No userId found in currentUser:', currentUser);
      return;
    }
    
    console.log('Saving company profile for userId:', userId);
    
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
    const visibilityRadio = document.querySelector('input[name="visibility"]:checked');
    const visibility = visibilityRadio ? visibilityRadio.value : 'public';
    
    // Validate required fields
    if (!companyName || !industry || !email) {
      alert('Please fill in required fields: Company Name, Industry, and Email');
      return;
    }
    
    // Collect Tech Stack
    const techStack = [];
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
      const techText = badge.childNodes[0]?.textContent?.trim();
      if (techText) {
        techStack.push(techText);
      }
    });
    
    // Collect Offices
    const offices = [];
    const officeForms = document.querySelectorAll('.office-form');
    officeForms.forEach(form => {
      const name = form.querySelector('.office-name')?.value.trim();
      const city = form.querySelector('.office-city')?.value.trim();
      const country = form.querySelector('.office-country')?.value.trim();
      const address = form.querySelector('.office-address')?.value.trim();
      
      if (name && city && country) {
        offices.push({ name, city, country, address });
      }
    });
    
    // Collect Benefits
    const benefits = [];
    const benefitForms = document.querySelectorAll('.benefit-form');
    benefitForms.forEach(form => {
      const type = form.querySelector('.benefit-type')?.value;
      const benefitDescription = form.querySelector('.benefit-description')?.value.trim();
      
      if (type) {
        benefits.push({ type, description: benefitDescription });
      }
    });
    
    // Collect Social Links
    const socialLinks = [];
    const socialLinkForms = document.querySelectorAll('.social-link-form');
    socialLinkForms.forEach(form => {
      const platform = form.querySelector('.social-platform')?.value;
      const url = form.querySelector('.social-url')?.value.trim();
      
      if (platform && url) {
        socialLinks.push({ platform, url });
      }
    });
    
    // Build profile object
    const profileData = {
      userId,
      companyName,
      industry,
      companySize,
      founded,
      email,
      phone,
      website,
      location,
      description,
      visibility,
      techStack,
      offices,
      benefits,
      socialLinks,
      logo: null, // TODO: Implement later
      lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage with userId-specific key
    const profileKey = `companyProfile_${userId}`;
    localStorage.setItem(profileKey, JSON.stringify(profileData));
    
    // Also keep a reference in currentUser
    currentUser.profileKey = profileKey;
    currentUser.companyName = companyName;
    currentUser.email = email;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('Company profile saved successfully!');
    
    console.log('Company profile saved with key:', profileKey);
    console.log('Saved Company Profile:', profileData);
    
  } catch (error) {
    console.error('Error saving company profile:', error);
    alert('Failed to save company profile. Please try again.');
  }
}

// Export functions to window object
window.loadCompanyProfile = loadCompanyProfile;
window.saveCompanyProfile = saveCompanyProfile;
