// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (mobileToggle && navbarMenu) {
  mobileToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    alert('Logged out successfully!');
    window.location.href = '../../index.html';
  }
}

// Update applicant status
function updateApplicantStatus(applicantId, companyId, newStatus) {
  try {
    // Get existing applications
    const applicationsKey = `applications_${companyId}`;
    const applications = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
    
    // Find and update the applicant
    const applicantIndex = applications.findIndex(app => app.applicantId === applicantId);
    if (applicantIndex !== -1) {
      applications[applicantIndex].status = newStatus;
      localStorage.setItem(applicationsKey, JSON.stringify(applications));
      
      // Also update in student's applications
      const studentId = applications[applicantIndex].studentId;
      const studentAppsKey = `studentApplications_${studentId}`;
      const studentApps = JSON.parse(localStorage.getItem(studentAppsKey) || '[]');
      const studentAppIndex = studentApps.findIndex(app => app.applicantId === applicantId);
      if (studentAppIndex !== -1) {
        studentApps[studentAppIndex].status = newStatus;
        localStorage.setItem(studentAppsKey, JSON.stringify(studentApps));
      }
      
      console.log('Applicant status updated:', applicantId, newStatus);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating applicant status:', error);
    return false;
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const postModal = document.getElementById('postJobModal');
  const editModal = document.getElementById('editJobModal');
  
  if (event.target === postModal) {
    closePostJobModal();
  }
  
  if (event.target === editModal) {
    closeEditJobModal();
  }
}

// Load Company Dashboard Data
async function loadCompanyDashboard() {
  try {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const companyId = currentUser.userid || currentUser.userId || currentUser.id;
    
    if (!companyId) {
      console.warn('No company logged in');
      return;
    }

    console.log('Loading dashboard for company:', companyId);

    // Get company's jobs from localStorage
    const companyJobsKey = `companyJobs_${companyId}`;
    const companyJobs = JSON.parse(localStorage.getItem(companyJobsKey) || '[]');
    
    console.log('Company jobs loaded:', companyJobs.length);

    // Get recent applicants from localStorage (applications created from jobs.js)
    const applicationsKey = `applications_${companyId}`;
    const applications = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
    
    console.log('Applications for this company:', applications.length);
    
    // Update stats
    const activeJobsCount = companyJobs.filter(job => job.status === 'Active').length;
    document.querySelector('.card:nth-child(1) h2').textContent = activeJobsCount;
    
    // Update total applicants count
    const totalApplicantsCount = applications.length;
    document.querySelector('.card:nth-child(2) h2').textContent = totalApplicantsCount;
    
    // Update new applicants count (last 7 days)
    const newApplicantsCount = applications.filter(app => {
      const submittedDate = new Date(app.appliedAt);
      const daysSince = Math.floor((new Date() - submittedDate) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length;
    document.querySelector('.card:nth-child(3) h2').textContent = newApplicantsCount;

    // Display jobs (limit to 10 most recent)
    const recentJobs = companyJobs
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
      .slice(0, 10);

    if (recentJobs.length === 0) {
      document.getElementById('active-jobs').innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: #999;">
          <svg style="width: 64px; height: 64px; margin-bottom: 1rem; opacity: 0.3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
          </svg>
          <p style="font-size: 1.1rem; margin: 0;">No jobs posted yet</p>
          <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0;">Click "Post New Job" to create your first job listing</p>
        </div>
      `;
    } else {
      document.getElementById('active-jobs').innerHTML = recentJobs.map((job, idx) => {
        // Count applicants for this job
        const applicants = applications.filter(app => app.jobId === job.id);
        const newApplicants = applicants.filter(app => {
          const submittedDate = new Date(app.submittedAt);
          const daysSince = Math.floor((new Date() - submittedDate) / (1000 * 60 * 60 * 24));
          return daysSince <= 7;
        });
        
        const daysAgo = Math.floor((new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24));
        const postedText = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : daysAgo < 7 ? `${daysAgo} days ago` : `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`;
        
        // Mock views (in production would be tracked)
        const views = Math.floor(Math.random() * 300) + 100;
        
        return `
          <div class="card" style="border: 1px solid #ECEFF1; padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
              <div>
                <h4 style="color: #263238; margin: 0 0 0.25rem 0;">${job.title}</h4>
                <p style="color: #78909C; margin: 0; font-size: 0.875rem;">${job.position} • ${job.location}</p>
                <p style="color: #78909C; margin: 0.25rem 0 0 0; font-size: 0.875rem;">Posted ${postedText}</p>
              </div>
              ${newApplicants.length > 0 ? `<span class="badge badge-primary">${newApplicants.length} New</span>` : ''}
            </div>
            <div class="grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
              <div>
                <p style="color: #78909C; margin: 0; font-size: 0.875rem;">Applicants</p>
                <p style="color: #263238; margin: 0; font-weight: 600;">${applicants.length}</p>
              </div>
              <div>
                <p style="color: #78909C; margin: 0; font-size: 0.875rem;">Views</p>
                <p style="color: #263238; margin: 0; font-weight: 600;">${views}</p>
              </div>
              <div>
                <p style="color: #78909C; margin: 0; font-size: 0.875rem;">Status</p>
                <span class="badge badge-secondary">${job.status}</span>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline" style="flex: 1;">View Applicants</button>
              <button class="btn btn-outline" onclick="openEditJobModal('${job.id}')" style="flex: 1;">Edit Job</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Get recent applicants (first 5 most recent)
    const recentApps = applications
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 5);
    
    if (recentApps.length === 0) {
      document.getElementById('recent-applicants').innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #999;">
          <p style="font-size: 0.9rem; margin: 0;">No applicants yet</p>
        </div>
      `;
    } else {
      document.getElementById('recent-applicants').innerHTML = recentApps.map(app => {
        const appliedDate = new Date(app.appliedAt);
        const hoursAgo = Math.floor((new Date() - appliedDate) / (1000 * 60 * 60));
        const timeText = hoursAgo < 1 ? 'just now' : hoursAgo < 24 ? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago` : `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) > 1 ? 's' : ''} ago`;
        
        // Mock match score (in production would be calculated)
        const matchScore = Math.floor(Math.random() * 20) + 80;
        
        // Status badge configuration
        const statusConfig = {
          'Pending': { bg: '#FFF3E0', color: '#F57C00', text: 'Under Review' },
          'Reviewing': { bg: '#E3F2FD', color: '#1976D2', text: 'Reviewing' },
          'Interview': { bg: '#E8F5E9', color: '#388E3C', text: 'Interview' },
          'Rejected': { bg: '#FFEBEE', color: '#C62828', text: 'Rejected' },
          'Accepted': { bg: '#E8F5E9', color: '#388E3C', text: 'Accepted' }
        };
        
        const statusInfo = statusConfig[app.status] || statusConfig['Pending'];
        
        return `
          <div style="padding: 1rem; border: 1px solid #ECEFF1; border-radius: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <h4 style="color: #263238; margin: 0; font-size: 1rem;">Applicant #${app.applicantId.slice(-4)}</h4>
              <span class="badge" style="background: ${statusInfo.bg}; color: ${statusInfo.color}; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${statusInfo.text}</span>
            </div>
            <p style="color: #78909C; margin: 0 0 0.5rem 0; font-size: 0.875rem;"><strong>${app.jobTitle}</strong></p>
            <p style="color: #78909C; margin: 0; font-size: 0.75rem;">Applied ${timeText}</p>
          </div>
        `;
      }).join('');
    }
    
  } catch (error) {
    console.error('Error loading company dashboard:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Company dashboard loaded');
  
  // Check if company is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn || !currentUser.userid) {
    console.warn('Company not logged in, redirecting to login page');
    alert('Please login first to access company dashboard');
    window.location.href = '../../index.html';
    return;
  }
  
  // Check if this is a company account
  if (currentUser.accountType !== 'company') {
    console.warn('Not a company account, redirecting');
    alert('This page is for company accounts only');
    window.location.href = '../../index.html';
    return;
  }
  
  console.log('Current logged in company:', currentUser);
  
  // Load dashboard data
  setTimeout(() => {
    loadCompanyDashboard();
  }, 100);
});
