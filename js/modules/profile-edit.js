// Profile Edit Module - Manages education, experience, skills, and links

// Reference counters from profile-loader module (loaded before this script)
// These are declared in profile-loader.js as global variables

// Education Management
function addEducation() {
  const educationList = document.getElementById('education-list');
  const noEducation = document.getElementById('no-education');
  
  if (noEducation) {
    noEducation.remove();
  }
  
  educationCounter++;
  const educationId = `education-${educationCounter}`;
  
  const educationForm = document.createElement('div');
  educationForm.id = educationId;
  educationForm.className = 'form-item-box education-form';
  educationForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
  
  educationForm.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">School/University *</label>
        <input type="text" class="form-input edu-school" placeholder="Institution name" />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Degree *</label>
        <input type="text" class="form-input edu-degree" placeholder="Bachelor's, Master's, etc." />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Field of Study *</label>
        <input type="text" class="form-input edu-field" placeholder="Computer Science, IT, etc." />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">GPA</label>
        <input type="text" class="form-input edu-gpa" placeholder="3.5/4.0" />
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end;">
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
        <input type="month" class="form-input edu-start" />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
        <input type="month" class="form-input edu-end" />
      </div>
      
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" class="edu-current" /> Currently studying
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
}

function removeEducation(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const educationList = document.getElementById('education-list');
    if (educationList.children.length === 0) {
      educationList.innerHTML = '<p id="no-education" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No education added yet. Add your academic background.</p>';
    }
  }
}

// Experience Management
function addExperience() {
  const experienceList = document.getElementById('experience-list');
  const noExperience = document.getElementById('no-experience');
  
  if (noExperience) {
    noExperience.remove();
  }
  
  experienceCounter++;
  const experienceId = `experience-${experienceCounter}`;
  
  const experienceForm = document.createElement('div');
  experienceForm.id = experienceId;
  experienceForm.className = 'form-item-box experience-form';
  experienceForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
  
  experienceForm.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Job Title *</label>
        <input type="text" class="form-input exp-title" placeholder="e.g. Frontend Developer Intern" />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Company *</label>
        <input type="text" class="form-input exp-company" placeholder="Company name" />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Location</label>
        <input type="text" class="form-input exp-location" placeholder="City, Country" />
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end; margin-bottom: 1rem;">
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Start Date</label>
        <input type="month" class="form-input exp-start" />
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">End Date</label>
        <input type="month" class="form-input exp-end" />
      </div>
      
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" class="exp-current" /> Currently working
        </label>
      </div>
    </div>
    
    <div class="form-group">
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
      <textarea class="form-input exp-description" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
    </div>
    
    <div style="margin-top: 1rem; text-align: right;">
      <button class="btn" onclick="removeExperience('${experienceId}')" style="background: #f44336; color: white; padding: 0.5rem 1rem;">
        Remove Experience
      </button>
    </div>
  `;
  
  experienceList.appendChild(experienceForm);
}

function removeExperience(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const experienceList = document.getElementById('experience-list');
    if (experienceList.children.length === 0) {
      experienceList.innerHTML = '<p id="no-experience" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No experience added yet. Add your work history.</p>';
    }
  }
}

// Skills Management
function addSkill() {
  const skillName = prompt('Enter skill name:');
  
  if (skillName && skillName.trim()) {
    const skillsList = document.getElementById('skills-list');
    const noSkills = document.getElementById('no-skills');
    
    if (noSkills) {
      noSkills.remove();
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
    
    const skillBadge = document.createElement('span');
    skillBadge.className = 'skill-badge';
    skillBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;`;
    skillBadge.innerHTML = `
      ${skillName.trim()}
      <span onclick="this.parentElement.remove(); checkNoSkills();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
    `;
    
    skillsList.appendChild(skillBadge);
  }
}

function checkNoSkills() {
  const skillsList = document.getElementById('skills-list');
  if (skillsList.children.length === 0) {
    skillsList.innerHTML = '<p id="no-skills" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No skills added yet. Add your technical skills.</p>';
  }
}

// Links & Portfolio Management
function addLink() {
  const linksList = document.getElementById('links-list');
  const noLinks = document.getElementById('no-links');
  
  if (noLinks) {
    noLinks.remove();
  }
  
  linkCounter++;
  const linkId = `link-${linkCounter}`;
  
  const linkForm = document.createElement('div');
  linkForm.id = linkId;
  linkForm.className = 'link-item link-form';
  linkForm.style.cssText = 'background: #F5F5F5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #00BCD4;';
  
  linkForm.innerHTML = `
    <div style="display: grid; grid-template-columns: 200px 1fr auto; gap: 1rem; align-items: end;">
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Platform/Type *</label>
        <select class="form-input link-platform">
          <option value="">Select type</option>
          <option value="GitHub">GitHub</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Portfolio">Portfolio</option>
          <option value="Behance">Behance</option>
          <option value="Dribbble">Dribbble</option>
          <option value="Medium">Medium</option>
          <option value="Dev.to">Dev.to</option>
          <option value="Twitter">Twitter</option>
          <option value="YouTube">YouTube</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">URL *</label>
        <input type="url" class="form-input link-url" placeholder="https://..." />
      </div>
      
      <div class="form-group">
        <button class="btn" onclick="removeLink('${linkId}')" style="background: #f44336; color: white; padding: 0.5rem 1rem;">
          Remove
        </button>
      </div>
    </div>
  `;
  
  linksList.appendChild(linkForm);
}

function removeLink(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    
    const linksList = document.getElementById('links-list');
    if (linksList.children.length === 0) {
      linksList.innerHTML = '<p id="no-links" style="text-align: center; color: #999; font-style: italic; padding: 2rem 0;">No links added yet. Add your GitHub, LinkedIn, Portfolio or other professional links.</p>';
    }
  }
}

// Export functions to window object
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.addSkill = addSkill;
window.checkNoSkills = checkNoSkills;
window.addLink = addLink;
window.removeLink = removeLink;
