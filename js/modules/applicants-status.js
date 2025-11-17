// Applicants Status Module
// Handles applicant status management and profile viewing

// Update applicant status
function updateApplicantStatus(applicantId, companyId, newStatus) {
  const applicationsKey = `applications_${companyId}`;
  let applications = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
  
  const applicantIndex = applications.findIndex(a => a.applicantId === applicantId);
  if (applicantIndex !== -1) {
    const oldStatus = applications[applicantIndex].status;
    applications[applicantIndex].status = newStatus;
    localStorage.setItem(applicationsKey, JSON.stringify(applications));
    
    // Also update in student's applications
    const studentId = applications[applicantIndex].studentId;
    const studentAppsKey = `studentApplications_${studentId}`;
    let studentApps = JSON.parse(localStorage.getItem(studentAppsKey) || '[]');
    const studentAppIndex = studentApps.findIndex(a => a.applicantId === applicantId);
    if (studentAppIndex !== -1) {
      studentApps[studentAppIndex].status = newStatus;
      localStorage.setItem(studentAppsKey, JSON.stringify(studentApps));
    }
    
    alert(`Applicant status updated: ${oldStatus} → ${newStatus}`);
    loadApplicants(); // Reload from applicants-list module
  } else {
    alert('Unable to update applicant status. Please try again.');
  }
}

// View applicant profile
function viewApplicantProfile(studentId) {
  try {
    // Get student profile from localStorage using userProfile key (as stored in profile.js)
    const studentProfileKey = `userProfile_${studentId}`;
    const studentProfile = JSON.parse(localStorage.getItem(studentProfileKey) || '{}');
    
    // Get student account info
    const studentAccounts = JSON.parse(localStorage.getItem('studentAccounts') || '[]');
    const studentAccount = studentAccounts.find(acc => acc.userid === studentId);
    
    // Extract basic info
    const name = studentProfile.fullName || studentAccount?.username || 'N/A';
    const email = studentProfile.email || studentAccount?.gmail || 'N/A';
    const phone = studentProfile.phone || 'N/A';
    const location = studentProfile.location || 'N/A';
    const bio = studentProfile.bio || 'No bio provided';
    const skills = studentProfile.skills || [];
    const education = studentProfile.education || [];
    const experience = studentProfile.experience || [];
    const links = studentProfile.links || [];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'applicant-profile-modal';
    
    const content = document.createElement('div');
    content.className = 'applicant-profile-modal-content';
    
    // Build education HTML
    const educationHTML = education.length > 0 ? `
      <div class="applicant-profile-section">
        <h3 class="applicant-profile-section-title">
          <span class="applicant-profile-section-icon">🎓</span> Education
        </h3>
        <div class="applicant-profile-education-list">
          ${education.map(edu => `
            <div class="applicant-profile-education-item">
              <p class="applicant-profile-education-degree">
                ${edu.degree} in ${edu.field}
              </p>
              <p class="applicant-profile-education-school">${edu.school}</p>
              <p class="applicant-profile-education-meta">
                ${edu.startDate ? edu.startDate.split('-')[0] : 'N/A'} - ${edu.current ? 'Present' : (edu.endDate ? edu.endDate.split('-')[0] : 'N/A')}
                ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';
    
    // Build experience HTML
    const experienceHTML = experience.length > 0 ? `
      <div class="applicant-profile-section">
        <h3 class="applicant-profile-section-title">
          <span class="applicant-profile-section-icon">💼</span> Work Experience
        </h3>
        <div class="applicant-profile-experience-list">
          ${experience.map(exp => `
            <div class="applicant-profile-experience-item">
              <p class="applicant-profile-experience-title">${exp.title}</p>
              <p class="applicant-profile-experience-company">${exp.company}</p>
              <p class="applicant-profile-experience-meta">
                ${exp.location ? exp.location + ' • ' : ''}
                ${exp.startDate ? exp.startDate.split('-')[0] : 'N/A'} - ${exp.current ? 'Present' : (exp.endDate ? exp.endDate.split('-')[0] : 'N/A')}
              </p>
              ${exp.description ? `<p class="applicant-profile-experience-description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';
    
    // Build links HTML
    const linksHTML = links.length > 0 ? `
      <div class="applicant-profile-section">
        <h3 class="applicant-profile-section-title">
          <span class="applicant-profile-section-icon">🔗</span> Links & Portfolio
        </h3>
        <div class="applicant-profile-links">
          ${links.map(link => {
            // Ensure URL has protocol
            let url = link.url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              url = 'https://' + url;
            }
            return `
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="applicant-profile-link">
                ${link.platform}
                <span class="applicant-profile-link-icon">↗</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';
    
    content.innerHTML = `
      <button class="applicant-profile-modal-close" onclick="this.closest('.applicant-profile-modal').remove()">&times;</button>
      
      <!-- Header Section -->
      <div class="applicant-profile-header">
        <!-- Avatar -->
        <div class="applicant-profile-avatar">
          ${name.charAt(0).toUpperCase()}
        </div>
        
        <!-- Basic Info -->
        <h1 class="applicant-profile-name">${name}</h1>
        <p class="applicant-profile-location">${location !== 'N/A' ? location : 'Location not specified'}</p>
        
        <!-- Contact Info Grid -->
        <div class="applicant-profile-info-grid">
          <div class="applicant-profile-info-item">
            <p class="applicant-profile-info-label">📧 Email</p>
            <p class="applicant-profile-info-value">${email}</p>
          </div>
          <div class="applicant-profile-info-item">
            <p class="applicant-profile-info-label">📱 Phone</p>
            <p class="applicant-profile-info-value">${phone !== 'N/A' ? phone : 'Not provided'}</p>
          </div>
          <div class="applicant-profile-info-item">
            <p class="applicant-profile-info-label">🆔 Student ID</p>
            <p class="applicant-profile-info-value applicant-profile-info-value-id">${studentId}</p>
          </div>
        </div>
      </div>
      
      <!-- Divider -->
      <hr class="applicant-profile-divider" />
      
      <!-- About Section -->
      <div class="applicant-profile-section">
        <h3 class="applicant-profile-section-title">
          <span class="applicant-profile-section-icon">ℹ️</span> About
        </h3>
        <p class="applicant-profile-about-content">${bio}</p>
      </div>
      
      <!-- Skills Section -->
      ${skills.length > 0 ? `
        <div class="applicant-profile-section">
          <h3 class="applicant-profile-section-title">
            <span class="applicant-profile-section-icon">⭐</span> Skills
          </h3>
          <div class="applicant-profile-skills">
            ${skills.map((skill, idx) => {
              const badgeClasses = [
                'applicant-profile-skill-badge-primary',
                'applicant-profile-skill-badge-success',
                'applicant-profile-skill-badge-warning',
                'applicant-profile-skill-badge-info',
                'applicant-profile-skill-badge-danger',
                'applicant-profile-skill-badge-secondary'
              ];
              const badgeClass = badgeClasses[idx % badgeClasses.length];
              return `<span class="applicant-profile-skill-badge ${badgeClass}">${skill}</span>`;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Experience Section -->
      ${experienceHTML}
      
      <!-- Education Section -->
      ${educationHTML}
      
      <!-- Links Section -->
      ${linksHTML}
      
      <!-- Divider -->
      <hr class="applicant-profile-divider" />
      
      <!-- Action Buttons -->
      <div class="applicant-profile-actions">
        <button onclick="this.closest('.applicant-profile-modal').remove()" class="applicant-profile-action-btn applicant-profile-action-btn-close">
          Close
        </button>
        <button onclick="contactApplicant('${studentId}')" class="applicant-profile-action-btn applicant-profile-action-btn-primary">
          Send Message
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
      }
    };
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error loading applicant profile:', error);
    alert('Unable to load applicant profile. Please try again later.');
  }
}

// Contact applicant (placeholder)
function contactApplicant(applicantId) {
  alert('Feature coming soon: Send message to applicant ' + applicantId);
}

// Export functions to window object
window.updateApplicantStatus = updateApplicantStatus;
window.viewApplicantProfile = viewApplicantProfile;
window.contactApplicant = contactApplicant;
