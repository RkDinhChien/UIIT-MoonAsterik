// Job Detail Module
// Handles job detail modal and application logic

function openJobDetail(jobId, isApplying = false) {
  const job = allJobs.find(j => j.id == jobId);
  if (!job) {
    console.error('Job not found:', jobId);
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'job-detail-modal';
  
  const content = document.createElement('div');
  content.className = 'job-detail-modal-content';
  
  const hasApplied = hasUserApplied(jobId);
  
  // Get data from localStorage job object
  const location = job.location || 'Unknown';
  const jobType = job.type || 'Full-time';
  const position = job.position || 'Mid Level';
  const technicalRequirements = job.technicalRequirements || [];
  const description = job.description || 'No description available';
  const requirements = job.requirements || '';
  const benefits = job.benefits || '';
  const postedAt = job.postedAt ? new Date(job.postedAt).toLocaleDateString() : new Date().toLocaleDateString();
  
  content.innerHTML = `
    <button class="job-detail-modal-close" onclick="this.closest('.job-detail-modal').remove()">
      &times;
    </button>
    
    <div class="job-detail-header">
      <p class="job-detail-company">${job.companyName} • ${location}</p>
      <h1 class="job-detail-title">${job.title}</h1>
      <p class="job-detail-subtitle">${jobType} • ${position}</p>
      <div class="job-detail-tech-stack">
        ${technicalRequirements.map(tag => `<span class="tech-stack-badge">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="job-detail-meta">
      <div class="job-detail-meta-item">
        <p class="job-detail-meta-label">SALARY</p>
        <p class="job-detail-meta-value job-detail-salary">${job.salary}</p>
      </div>
      <div class="job-detail-meta-item">
        <p class="job-detail-meta-label">JOB TYPE</p>
        <p class="job-detail-meta-value">${jobType}</p>
      </div>
      <div class="job-detail-meta-item">
        <p class="job-detail-meta-label">EXPERIENCE LEVEL</p>
        <p class="job-detail-meta-value">${position}</p>
      </div>
      <div class="job-detail-meta-item">
        <p class="job-detail-meta-label">POSTED</p>
        <p class="job-detail-meta-value">${postedAt}</p>
      </div>
    </div>
    
    <hr class="job-detail-divider" />
    
    <div class="job-detail-section">
      <h3 class="job-detail-section-title">About the role</h3>
      <p class="job-detail-section-content">${description}</p>
      
      ${requirements ? `
        <h4 class="job-detail-section-subtitle">Requirements</h4>
        <p class="job-detail-section-content">${requirements}</p>
      ` : ''}
      
      ${benefits ? `
        <h4 class="job-detail-section-subtitle">Benefits</h4>
        <p class="job-detail-section-content">${benefits}</p>
      ` : ''}
    </div>
    
    <div class="job-detail-info-grid">
      <div class="job-detail-info-item">
        <p class="job-detail-meta-label">OPENINGS</p>
        <p class="job-detail-meta-value">${job.openings || 1}</p>
      </div>
      <div class="job-detail-info-item">
        <p class="job-detail-meta-label">TARGET STUDENTS</p>
        <p class="job-detail-meta-value">${job.targetStudents || 'All'}</p>
      </div>
      <div class="job-detail-info-item">
        <p class="job-detail-meta-label">DAYS OFF</p>
        <p class="job-detail-meta-value">${job.daysOff} days</p>
      </div>
      <div class="job-detail-info-item">
        <p class="job-detail-meta-label">PAID LEAVE</p>
        <p class="job-detail-meta-value">${job.paidLeave} days</p>
      </div>
    </div>
    
    <hr class="job-detail-divider" />
    
    <div class="job-detail-actions">
      <button onclick="this.closest('.job-detail-modal').remove()" class="job-detail-action-close">
        Close
      </button>
      <button onclick="applyForJob('${jobId}')" class="job-detail-action-apply ${hasApplied ? 'applied' : ''}">
        ${hasApplied ? '✓ Applied' : 'Apply Now'}
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
}

// Apply for job
function applyForJob(jobId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const studentId = currentUser.userid || currentUser.userId || currentUser.id;
  
  if (!studentId) {
    alert('Please login first to apply for jobs!');
    return;
  }
  
  // Check if student has already applied
  if (hasUserApplied(jobId)) {
    alert('You have already applied for this job!');
    return;
  }
  
  const job = allJobs.find(j => j.id == jobId);
  if (!job) return;
  
  const companyId = job.companyId;
  
  // Create application object
  const application = {
    applicantId: `APP${Date.now()}${Math.floor(Math.random() * 1000)}`,
    studentId: studentId,
    companyId: companyId,
    jobId: jobId,
    jobTitle: job.title,
    companyName: job.companyName,
    appliedAt: new Date().toISOString(),
    status: 'Pending'
  };
  
  // Save application to localStorage
  const applicationsKey = `applications_${companyId}`;
  const existingApplications = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
  existingApplications.push(application);
  localStorage.setItem(applicationsKey, JSON.stringify(existingApplications));
  
  // Also save to student's applications for reference
  const studentApplicationsKey = `studentApplications_${studentId}`;
  const studentApplications = JSON.parse(localStorage.getItem(studentApplicationsKey) || '[]');
  studentApplications.push(application);
  localStorage.setItem(studentApplicationsKey, JSON.stringify(studentApplications));
  
  console.log('Application submitted:', application);
  
  alert('Application submitted successfully! You can track it in your dashboard.');
  
  // Close modal and refresh
  document.querySelector('.job-detail-modal').remove();
  document.body.style.overflow = 'auto';
  renderJobsPage();
}

// Check if user has already applied for a job
function hasUserApplied(jobId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const studentId = currentUser.userid || currentUser.userId || currentUser.id;
  
  if (!studentId) return false;
  
  const studentApplicationsKey = `studentApplications_${studentId}`;
  const applications = JSON.parse(localStorage.getItem(studentApplicationsKey) || '[]');
  
  return applications.some(app => app.jobId == jobId);
}

// Save job (for future implementation)
function saveJob(jobId, event) {
  event.stopPropagation();
  alert('Job saved to your list! (Feature coming soon)');
}

// Export functions to window object
window.openJobDetail = openJobDetail;
window.applyForJob = applyForJob;
window.hasUserApplied = hasUserApplied;
window.saveJob = saveJob;
