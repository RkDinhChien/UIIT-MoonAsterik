// Job Detail Module
// Handles job detail modal and application logic

function openJobDetail(jobId, isApplying = false) {
	const job = allJobs.find((j) => j.id == jobId);
	if (!job) {
		console.error('Job not found:', jobId);
		return;
	}

	const modal = document.createElement('div');
	modal.className = 'job-detail-modal';

	const content = document.createElement('div');
	content.className = 'job-detail-modal-content';

	const hasApplied = hasUserApplied(jobId);

	// Extract data from API job object
	const location = job.location?.city || job.location || 'Remote';
	const jobType = job.type || 'Full-time';
	const position = job.experienceLevel || job.position || 'Mid Level';
	const technicalRequirements = job.tags || job.technicalRequirements || [];

	// Format salary
	let salaryText = 'Negotiable';
	if (job.salary && job.salary.min && job.salary.max) {
		const minSalary = (job.salary.min / 1000000).toFixed(0);
		const maxSalary = (job.salary.max / 1000000).toFixed(0);
		salaryText = `${minSalary}-${maxSalary}M VND/${job.salary.unit || 'month'}`;
	}

	// Extract description sections
	const description =
		job.description?.summary || job.description || 'No description available';
	const responsibilities = job.description?.responsibilities || [];
	const requirementsList = job.description?.requirements || [];
	const benefitsList = job.description?.benefits || [];

	const postedAt = job.postedAt
		? new Date(job.postedAt).toLocaleDateString()
		: new Date().toLocaleDateString();

	content.innerHTML = `
    <button class="job-detail-modal-close" onclick="this.closest('.job-detail-modal').remove()">
      &times;
    </button>
    
    <div class="job-detail-header">
      <p class="job-detail-company">${job.companyName} • ${location}</p>
      <h1 class="job-detail-title">${job.title}</h1>
      <p class="job-detail-subtitle">${jobType} • ${position}</p>
      <div class="job-detail-tech-stack">
        ${technicalRequirements
					.map((tag) => `<span class="tech-stack-badge">${tag}</span>`)
					.join('')}
      </div>
    </div>
    
    <div class="job-detail-meta">
      <div class="job-detail-meta-item">
        <p class="job-detail-meta-label">SALARY</p>
        <p class="job-detail-meta-value job-detail-salary">${salaryText}</p>
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
      
      ${
				responsibilities.length > 0
					? `
        <h4 class="job-detail-section-subtitle">Key Responsibilities</h4>
        <ul class="job-detail-list">
          ${responsibilities.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `
					: ''
			}
      
      ${
				requirementsList.length > 0
					? `
        <h4 class="job-detail-section-subtitle">Requirements</h4>
        <ul class="job-detail-list">
          ${requirementsList.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `
					: ''
			}
      
      ${
				benefitsList.length > 0
					? `
        <h4 class="job-detail-section-subtitle">Benefits</h4>
        <ul class="job-detail-list">
          ${benefitsList.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `
					: ''
			}
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
      <button onclick="applyForJob('${jobId}')" class="job-detail-action-apply ${
		hasApplied ? 'applied' : ''
	}">
        ${hasApplied ? '✓ Applied' : 'Apply Now'}
      </button>
    </div>
  `;

	modal.appendChild(content);
	modal.onclick = function (e) {
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
		window.location.href = '../../index.html';
		return;
	}

	// Check if student has already applied
	if (hasUserApplied(jobId)) {
		window.notify.warning('Bạn đã ứng tuyển công việc này rồi!');
		return;
	}

	const job = allJobs.find((j) => j.id == jobId);
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
		status: 'Pending',
	};

	// Save application to localStorage
	const applicationsKey = `applications_${companyId}`;
	const existingApplications = JSON.parse(
		localStorage.getItem(applicationsKey) || '[]'
	);
	existingApplications.push(application);
	localStorage.setItem(applicationsKey, JSON.stringify(existingApplications));

	// Also save to student's applications for reference
	const studentApplicationsKey = `studentApplications_${studentId}`;
	const studentApplications = JSON.parse(
		localStorage.getItem(studentApplicationsKey) || '[]'
	);
	studentApplications.push(application);
	localStorage.setItem(
		studentApplicationsKey,
		JSON.stringify(studentApplications)
	);

	console.log('Application submitted:', application);

	window.notify.success(
		'Ứng tuyển thành công! Bạn có thể xem trong dashboard.'
	);

	// Close modal and refresh
	setTimeout(() => {
		document.querySelector('.job-detail-modal').remove();
		document.body.style.overflow = 'auto';
		renderJobsPage();
	}, 1000);
}

// Check if user has already applied for a job
function hasUserApplied(jobId) {
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const studentId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!studentId) return false;

	const studentApplicationsKey = `studentApplications_${studentId}`;
	const applications = JSON.parse(
		localStorage.getItem(studentApplicationsKey) || '[]'
	);

	return applications.some((app) => app.jobId == jobId);
}

// Save job (for future implementation)
function saveJob(jobId, event) {
	event.stopPropagation();

	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const studentId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!studentId) {
		window.location.href = '../../index.html';
		return;
	}

	// Get saved jobs
	const savedJobsKey = `savedJobs_${studentId}`;
	const savedJobs = JSON.parse(localStorage.getItem(savedJobsKey) || '[]');

	if (savedJobs.includes(jobId)) {
		window.notify.info('Công việc này đã được lưu rồi!');
		return;
	}

	savedJobs.push(jobId);
	localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
	window.notify.success('Đã lưu công việc!');
}

// Export functions to window object
window.openJobDetail = openJobDetail;
window.applyForJob = applyForJob;
window.hasUserApplied = hasUserApplied;
window.saveJob = saveJob;
