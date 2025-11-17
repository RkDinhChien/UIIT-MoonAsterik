// Dashboard Recommended Jobs Module - Manages recommended jobs and job applications

// Load recommended jobs (random 3)
function loadRecommendedJobs(jobs) {
  if (jobs.length === 0) {
    document.getElementById('recommended-jobs').innerHTML = `
      <p style="text-align: center; color: #999; padding: 2rem;">No jobs available</p>
    `;
    return;
  }

  // Get random 3 jobs
  const shuffled = [...jobs].sort(() => Math.random() - 0.5);
  const recommendedJobs = shuffled.slice(0, Math.min(3, jobs.length));

  document.getElementById('recommended-jobs').innerHTML = recommendedJobs.map((job, idx) => {
    const matchScore = [95, 88, 82][idx] || 75;
    const matchLevel = matchScore >= 90 ? 'match-badge-primary' : matchScore >= 80 ? 'match-badge-info' : 'match-badge-warning';

    const location = job.location || 'Unknown';
    const salary = job.salary || 'Negotiable';

    return `
      <article class="job-card">
        <div class="job-card-header">
          <h4 class="job-card-title">${job.title}</h4>
          <span class="match-badge ${matchLevel}">${matchScore}% Match</span>
        </div>
        <p class="job-card-company">${job.companyName}</p>
        <p class="job-card-meta">${location} • ${job.type || 'Full-time'} • ${salary}</p>
        <p class="job-card-posted">Posted ${formatDate(job.postedAt)}</p>
        <div class="job-card-actions">
          <button class="btn btn-primary btn-sm" onclick="applyJob('${job.id}')">Apply Now</button>
          <button class="btn btn-ghost btn-sm" onclick="saveJob('${job.id}')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// Format date utility function
function formatDate(dateString) {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const today = new Date();
  const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) return 'today';
  if (daysAgo === 1) return '1 day ago';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Apply for job
function applyJob(jobId) {
  // Find the job
  let allJobs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('companyJobs_')) {
      const jobs = JSON.parse(localStorage.getItem(key) || '[]');
      allJobs = [...allJobs, ...jobs];
    }
  }

  const job = allJobs.find(j => j.id == jobId);
  if (!job) {
    alert('Job not found');
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const studentId = currentUser.userid || currentUser.userId || currentUser.id;

  if (!studentId) {
    alert('Please login first!');
    return;
  }

  // Check if already applied
  const studentApplicationsKey = `studentApplications_${studentId}`;
  const studentApplications = JSON.parse(localStorage.getItem(studentApplicationsKey) || '[]');
  
  if (studentApplications.some(app => app.jobId == jobId)) {
    alert('You have already applied for this job!');
    return;
  }

  // Create application
  const application = {
    applicantId: `APP${Date.now()}${Math.floor(Math.random() * 1000)}`,
    studentId: studentId,
    companyId: job.companyId,
    jobId: jobId,
    jobTitle: job.title,
    companyName: job.companyName,
    appliedAt: new Date().toISOString(),
    status: 'Pending'
  };

  // Save to company applications
  const applicationsKey = `applications_${job.companyId}`;
  const existingApplications = JSON.parse(localStorage.getItem(applicationsKey) || '[]');
  existingApplications.push(application);
  localStorage.setItem(applicationsKey, JSON.stringify(existingApplications));

  // Save to student applications
  studentApplications.push(application);
  localStorage.setItem(studentApplicationsKey, JSON.stringify(studentApplications));

  alert('Application submitted successfully!');
  loadDashboard(); // Reload to show updated applications
}

// Save job
function saveJob(jobId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const studentId = currentUser.userid || currentUser.userId || currentUser.id;

  if (!studentId) {
    alert('Please login first!');
    return;
  }

  // Get saved jobs
  const savedJobsKey = `savedJobs_${studentId}`;
  const savedJobs = JSON.parse(localStorage.getItem(savedJobsKey) || '[]');

  if (savedJobs.includes(jobId)) {
    alert('Job already saved!');
    return;
  }

  savedJobs.push(jobId);
  localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
  alert('Job saved successfully!');
}

// Export functions to window object
window.loadRecommendedJobs = loadRecommendedJobs;
window.formatDate = formatDate;
window.applyJob = applyJob;
window.saveJob = saveJob;
