// Company Job Post Module
// Handles job posting functionality and form management

// Modal Functions for Post Job
function openPostJobModal() {
  const modal = document.getElementById('postJobModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePostJobModal() {
  document.getElementById('postJobModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  document.getElementById('postJobForm').reset();
  
  // Clear technical requirements
  const techList = document.getElementById('tech-requirements-list');
  techList.innerHTML = '<p id="no-tech-requirements" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 1rem 0; margin: 0;">No technical requirements added yet.</p>';
}

// Technical Requirements Functions for Post Job Modal
function addTechRequirement() {
  const techName = prompt('Enter technical requirement (e.g., JavaScript, React, Node.js):');
  
  if (techName && techName.trim()) {
    const techList = document.getElementById('tech-requirements-list');
    const noTech = document.getElementById('no-tech-requirements');
    
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
    techBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;`;
    techBadge.setAttribute('data-tech', techName.trim());
    techBadge.innerHTML = `
      ${techName.trim()}
      <span onclick="this.parentElement.remove(); checkNoTechRequirements();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
    `;
    
    techList.appendChild(techBadge);
  }
}

function checkNoTechRequirements() {
  const techList = document.getElementById('tech-requirements-list');
  if (techList.children.length === 0) {
    techList.innerHTML = '<p id="no-tech-requirements" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 1rem 0; margin: 0;">No technical requirements added yet.</p>';
  }
}

// Helper function to get technical requirements from badges
function getTechRequirements() {
  const techBadges = document.querySelectorAll('#tech-requirements-list .tech-badge');
  return Array.from(techBadges).map(badge => badge.getAttribute('data-tech'));
}

// Submit Job Posting (Create New Job)
function submitJobPosting() {
  const form = document.getElementById('postJobForm');
  
  // Validate form
  if (!form.checkValidity()) {
    alert('Please fill in all required fields!');
    form.reportValidity();
    return;
  }

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const companyId = currentUser.userid || currentUser.userId || currentUser.id;
  
  if (!companyId) {
    alert('Please login first to post a job!');
    return;
  }

  // Collect form data
  const jobData = {
    id: `JOB${Date.now()}${Math.floor(Math.random() * 1000)}`,
    companyId: companyId,
    companyName: currentUser.username || currentUser.companyName || 'Company',
    title: document.getElementById('jobTitle').value.trim(),
    position: document.getElementById('jobPosition').value,
    location: document.getElementById('jobLocation').value.trim(),
    openings: parseInt(document.getElementById('jobOpenings').value) || 1,
    targetStudents: document.getElementById('jobTarget').value,
    description: document.getElementById('jobDescription').value.trim(),
    requirements: document.getElementById('jobRequirements').value.trim(),
    technicalRequirements: getTechRequirements(), // Add technical requirements array
    startDate: document.getElementById('jobStartDate').value,
    endDate: document.getElementById('jobEndDate').value || null,
    benefits: document.getElementById('jobBenefits').value.trim(),
    daysOff: parseInt(document.getElementById('jobDaysOff').value) || 0,
    paidLeave: parseInt(document.getElementById('jobPaidLeave').value) || 0,
    salaryIncrease: parseFloat(document.getElementById('jobSalaryIncrease').value) || 0,
    salary: document.getElementById('jobSalary').value.trim(),
    bonus: document.getElementById('jobBonus').value.trim() || 'N/A',
    postedAt: new Date().toISOString(),
    status: 'Active'
  };

  // Get existing jobs for this company
  const companyJobsKey = `companyJobs_${companyId}`;
  const existingJobs = JSON.parse(localStorage.getItem(companyJobsKey) || '[]');
  
  // Add new job
  existingJobs.push(jobData);
  
  // Save to localStorage
  localStorage.setItem(companyJobsKey, JSON.stringify(existingJobs));
  
  // Also save to global jobs list (for job listing page)
  const allJobs = JSON.parse(localStorage.getItem('allJobs') || '[]');
  allJobs.push(jobData);
  localStorage.setItem('allJobs', JSON.stringify(allJobs));

  console.log('Job posted successfully:', jobData);
  console.log('Job ID:', jobData.id);
  
  alert('Job posted successfully!');
  closePostJobModal();
  
  // Reload dashboard to show new job
  loadCompanyDashboard();
}

// Export functions to window object
window.openPostJobModal = openPostJobModal;
window.closePostJobModal = closePostJobModal;
window.addTechRequirement = addTechRequirement;
window.checkNoTechRequirements = checkNoTechRequirements;
window.submitJobPosting = submitJobPosting;
