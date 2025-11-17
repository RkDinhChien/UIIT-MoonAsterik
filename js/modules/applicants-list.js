// Applicants List Module
// Handles applicants list rendering, filtering, and tab management

// Global variables for applicants data
let allApplicantsData = [];
let allJobsData = [];
let currentFilter = 'all';

// Update tab counts
function updateTabCounts(applicants) {
  const counts = {
    all: applicants.length,
    Pending: applicants.filter(a => a.status === 'Pending').length,
    Reviewing: applicants.filter(a => a.status === 'Reviewing').length,
    Interview: applicants.filter(a => a.status === 'Interview').length,
    Rejected: applicants.filter(a => a.status === 'Rejected').length,
    Accepted: applicants.filter(a => a.status === 'Accepted').length
  };
  
  document.getElementById('count-all').textContent = `(${counts.all})`;
  document.getElementById('count-Pending').textContent = `(${counts.Pending})`;
  document.getElementById('count-Reviewing').textContent = `(${counts.Reviewing})`;
  document.getElementById('count-Interview').textContent = `(${counts.Interview})`;
  document.getElementById('count-Rejected').textContent = `(${counts.Rejected})`;
  document.getElementById('count-Accepted').textContent = `(${counts.Accepted})`;
}

// Filter applicants by status
function filterApplicants(status) {
  currentFilter = status;
  
  // Update active tab styling
  document.querySelectorAll('.tab').forEach(btn => {
    btn.style.borderBottomColor = 'transparent';
    btn.style.color = '#666';
  });
  
  event.target.style.borderBottomColor = '#00BCD4';
  event.target.style.color = '#00BCD4';
  
  // Filter and display
  let filtered = allApplicantsData;
  if (status !== 'all') {
    filtered = allApplicantsData.filter(a => a.status === status);
  }
  
  renderApplicants(filtered);
}

// Render applicants to DOM
function renderApplicants(applicants) {
  const appsList = document.getElementById('applicants-list');
  
  if (applicants.length === 0) {
    appsList.innerHTML = `<p style="text-align: center; color: #666; padding: 2rem;">No applicants found in this category.</p>`;
    return;
  }
  
  appsList.innerHTML = applicants.map(app => {
    const job = allJobsData.find(j => j.id == app.jobId);
    if (!job) return '';
    
    const statusConfig = {
      'Pending': { text: 'Pending', bg: '#FFF3E0', color: '#F57C00' },
      'Reviewing': { text: 'Under Review', bg: '#E3F2FD', color: '#1976D2' },
      'Interview': { text: 'Interview Scheduled', bg: '#E3F2FD', color: '#1976D2' },
      'Rejected': { text: 'Rejected', bg: '#F5F5F5', color: '#666' },
      'Accepted': { text: 'Accepted', bg: '#E8F5E9', color: '#388E3C' }
    };
    
    const status = statusConfig[app.status] || statusConfig['Pending'];
    const date = new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `
      <article class="card" style="padding: 1.5rem; ${app.status === 'Rejected' ? 'opacity: 0.8;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 200px;">
            <h3 style="margin: 0 0 0.5rem 0; color: #263238; font-size: 1.25rem;">${job.title}</h3>
            <p style="margin: 0 0 0.5rem 0; color: #546E7A;">
              <strong>Applicant:</strong> ${app.studentName || app.studentId}
            </p>
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Applied on ${date}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="badge" style="background: ${status.bg}; color: ${status.color}; padding: 0.5rem 1rem; border-radius: 16px; font-weight: 600; white-space: nowrap;">${status.text}</span>
            <select class="form-input status-select-${app.applicantId}" value="${app.status}" style="padding: 0.5rem; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 0.9rem;">
              <option value="Pending">Pending</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button class="btn btn-outline" onclick="updateApplicantStatus('${app.applicantId}', '${app.companyId}', document.querySelector('.status-select-${app.applicantId}').value)" style="padding: 0.5rem 1rem; white-space: nowrap;">Update</button>
          </div>
        </div>
        
        <!-- Applicant Details -->
        <div style="padding: 1rem; background: #F5F5F5; border-radius: 8px; margin-bottom: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <p style="margin: 0 0 0.25rem 0; color: #78909C; font-size: 0.875rem; font-weight: 600;">STUDENT ID</p>
              <p style="margin: 0; color: #263238;">${app.studentId}</p>
            </div>
            <div>
              <p style="margin: 0 0 0.25rem 0; color: #78909C; font-size: 0.875rem; font-weight: 600;">JOB POSITION</p>
              <p style="margin: 0; color: #263238;">${job.position || 'Mid Level'}</p>
            </div>
            <div>
              <p style="margin: 0 0 0.25rem 0; color: #78909C; font-size: 0.875rem; font-weight: 600;">APPLICATION ID</p>
              <p style="margin: 0; color: #263238; font-family: monospace; font-size: 0.875rem;">${app.applicantId}</p>
            </div>
            <div>
              <p style="margin: 0 0 0.25rem 0; color: #78909C; font-size: 0.875rem; font-weight: 600;">LOCATION</p>
              <p style="margin: 0; color: #263238;">${job.location || 'Unknown'}</p>
            </div>
          </div>
        </div>
        
        ${app.status === 'Interview' ? `
          <div style="padding: 1rem; background: #E3F2FD; border-radius: 8px; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1976D2;">
              <svg style="width: 16px; height: 16px; display: inline; vertical-align: middle; margin-right: 0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Interview Scheduled
            </p>
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Send interview details and schedule to applicant</p>
          </div>
        ` : app.status === 'Accepted' ? `
          <div style="padding: 1rem; background: #E8F5E9; border-radius: 8px; margin-bottom: 1rem;">
            <p style="margin: 0; color: #388E3C; font-size: 0.9rem;"><strong>✓ Accepted</strong> - This applicant has been selected for the position.</p>
          </div>
        ` : app.status === 'Rejected' ? `
          <div style="padding: 1rem; background: #F5F5F5; border-radius: 8px; margin-bottom: 1rem;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">This applicant was not selected for this position.</p>
          </div>
        ` : `
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-size: 0.9rem; color: #666;">Review Progress</span>
              <span style="font-size: 0.9rem; color: #666;">${app.status}</span>
            </div>
            <div style="height: 8px; background: #E0E0E0; border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: 33%; background: #F57C00; border-radius: 4px;"></div>
            </div>
          </div>
        `}

        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary" onclick="viewApplicantProfile('${app.studentId}')">View Profile</button>
          <button class="btn btn-outline" onclick="contactApplicant('${app.applicantId}')">Send Message</button>
        </div>
      </article>
    `;
  }).join('');
}

// Load applicants from localStorage
function loadApplicants() {
  try {
    // Check login status
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const companyId = currentUser.userid;
    
    console.log('Current user:', currentUser);
    console.log('Company ID:', companyId);
    
    if (!companyId) {
      alert('Please login as a company first!');
      window.location.href = '../../index.html';
      return;
    }

    // Get all jobs from this company
    allJobsData = [];
    const companyJobsKey = `companyJobs_${companyId}`;
    const companyJobs = JSON.parse(localStorage.getItem(companyJobsKey) || '[]');
    allJobsData = companyJobs;
    
    console.log('Company jobs key:', companyJobsKey);
    console.log('Company jobs:', companyJobs);

    // Get all applicants for this company
    const applicationsKey = `applications_${companyId}`;
    allApplicantsData = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
    
    console.log('Applications key:', applicationsKey);
    console.log('All applicants:', allApplicantsData);

    // Sort applicants by appliedAt (most recent first)
    allApplicantsData = allApplicantsData.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    // Update tab counts
    updateTabCounts(allApplicantsData);
    
    // Render all applicants
    renderApplicants(allApplicantsData);
  } catch (error) {
    console.error('Error loading applicants:', error);
    document.getElementById('applicants-list').innerHTML = '<p style="text-align: center; color: #666;">Unable to load applicants. Please try again later.</p>';
  }
}

// Export functions to window object
window.updateTabCounts = updateTabCounts;
window.filterApplicants = filterApplicants;
window.renderApplicants = renderApplicants;
window.loadApplicants = loadApplicants;
