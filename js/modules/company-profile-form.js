// Company Profile Form Module
// Handles all form management: tech stack, offices, benefits, social links
// Global counters (must be declared here for both add and load functions)
let officeCounter = 0;
let benefitCounter = 0;
let socialLinkCounter = 0;

// Tech Stack Management
function addTechStack() {
  const techName = prompt('Enter technology/tool name:');
  
  if (techName && techName.trim()) {
    const techList = document.getElementById('techstack-list');
    const noTech = document.getElementById('no-techstack');
    
    if (noTech) {
      noTech.remove();
    }
    
    const colors = [
      { bg: '#E3F2FD', text: '#1976D2' },
      { bg: '#E8F5E9', text: '#388E3C' },
      { bg: '#FFF3E0', text: '#F57C00' },
      { bg: '#F3E5F5', text: '#7B1FA2' },
      { bg: '#FCE4EC', text: '#C2185B' },
      { bg: '#E0F2F1', text: '#00796B' }
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const techBadge = document.createElement('span');
    techBadge.className = 'badge tech-badge';
    techBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;`;
    techBadge.innerHTML = `
      ${techName.trim()}
      <span onclick="this.parentElement.remove(); checkNoTech();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
    `;
    
    techList.appendChild(techBadge);
  }
}

function checkNoTech() {
  const techList = document.getElementById('techstack-list');
  if (techList.children.length === 0) {
    techList.innerHTML = '<p id="no-techstack" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No technologies added yet. Add the tools and technologies your company uses.</p>';
  }
}

// Office Locations Management
function addOffice() {
  const officesList = document.getElementById('offices-list');
  const noOffices = document.getElementById('no-offices');
  
  if (noOffices) {
    noOffices.remove();
  }
  
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
        <input type="text" class="form-input office-name" placeholder="e.g. Headquarters, Branch Office" />
      </div>
      
      <div class="form-group">
        <label class="form-label">City *</label>
        <input type="text" class="form-input office-city" placeholder="City name" />
      </div>
      
      <div class="form-group">
        <label class="form-label">Country *</label>
        <input type="text" class="form-input office-country" placeholder="Country name" />
      </div>
    </div>
    
    <div class="form-group" style="margin-bottom: 1rem;">
      <label class="form-label">Full Address</label>
      <input type="text" class="form-input office-address" placeholder="Street address" />
    </div>
    
    <div style="text-align: right;">
      <button class="btn btn-ghost" onclick="removeOffice('${officeId}')" style="color: #f44336;">
        Remove Office
      </button>
    </div>
  `;
  
  officesList.appendChild(officeForm);
}

function removeOffice(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const officesList = document.getElementById('offices-list');
    if (officesList.children.length === 0) {
      officesList.innerHTML = '<p id="no-offices" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No office locations added yet. Add your office addresses.</p>';
    }
  }
}

// Benefits Management
function addBenefit() {
  const benefitsList = document.getElementById('benefits-list');
  const noBenefits = document.getElementById('no-benefits');
  
  if (noBenefits) {
    noBenefits.remove();
  }
  
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
          <option value="Health Insurance">Health Insurance</option>
          <option value="Flexible Hours">Flexible Hours</option>
          <option value="Remote Work">Remote Work</option>
          <option value="Learning Budget">Learning Budget</option>
          <option value="Gym Membership">Gym Membership</option>
          <option value="Free Lunch">Free Lunch</option>
          <option value="Stock Options">Stock Options</option>
          <option value="Paid Time Off">Paid Time Off</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Description</label>
        <input type="text" class="form-input benefit-description" placeholder="Brief description of the benefit" />
      </div>
      
      <div class="form-group">
        <button class="btn btn-ghost" onclick="removeBenefit('${benefitId}')" style="color: #f44336;">
          Remove
        </button>
      </div>
    </div>
  `;
  
  benefitsList.appendChild(benefitForm);
}

function removeBenefit(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const benefitsList = document.getElementById('benefits-list');
    if (benefitsList.children.length === 0) {
      benefitsList.innerHTML = '<p id="no-benefits" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No benefits added yet. Highlight what makes your company a great place to work.</p>';
    }
  }
}

// Social Links Management
function addSocialLink() {
  const linksList = document.getElementById('social-links-list');
  const noLinks = document.getElementById('no-social-links');
  
  if (noLinks) {
    noLinks.remove();
  }
  
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
          <option value="LinkedIn">LinkedIn</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
          <option value="GitHub">GitHub</option>
          <option value="Glassdoor">Glassdoor</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">URL *</label>
        <input type="url" class="form-input social-url" placeholder="https://..." />
      </div>
      
      <div class="form-group">
        <button class="btn btn-ghost" onclick="removeSocialLink('${linkId}')" style="color: #f44336;">
          Remove
        </button>
      </div>
    </div>
  `;
  
  linksList.appendChild(linkForm);
}

function removeSocialLink(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const linksList = document.getElementById('social-links-list');
    if (linksList.children.length === 0) {
      linksList.innerHTML = '<p id="no-social-links" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No social links added yet. Add your company\'s social media profiles.</p>';
    }
  }
}

// Export functions to window object
window.addTechStack = addTechStack;
window.checkNoTech = checkNoTech;
window.addOffice = addOffice;
window.removeOffice = removeOffice;
window.addBenefit = addBenefit;
window.removeBenefit = removeBenefit;
window.addSocialLink = addSocialLink;
window.removeSocialLink = removeSocialLink;
