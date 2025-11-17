// Company Job Edit Module
// Handles job editing functionality and form management

// Global variable to store current editing job
let currentEditingJob = null;

// Modal Functions for Edit Job
function openEditJobModal(jobId) {
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const companyId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!companyId) return;

	// Get job data
	const companyJobsKey = `companyJobs_${companyId}`;
	const jobs = JSON.parse(localStorage.getItem(companyJobsKey) || '[]');
	const job = jobs.find((j) => j.id === jobId);

	if (!job) {
		window.notify.error('Job not found!');
		return;
	}

	// Store current editing job
	currentEditingJob = job;

	// Populate form fields with existing data
	document.getElementById('editJobTitle').value = job.title || '';
	document.getElementById('editJobPosition').value = job.position || '';
	document.getElementById('editJobLocation').value = job.location || '';
	document.getElementById('editJobOpenings').value = job.openings || 1;
	document.getElementById('editJobTarget').value = job.targetStudents || '';
	document.getElementById('editJobDescription').value = job.description || '';
	document.getElementById('editJobRequirements').value = job.requirements || '';
	document.getElementById('editJobStartDate').value = job.startDate || '';
	document.getElementById('editJobEndDate').value = job.endDate || '';
	document.getElementById('editJobBenefits').value = job.benefits || '';
	document.getElementById('editJobDaysOff').value = job.daysOff || 0;
	document.getElementById('editJobPaidLeave').value = job.paidLeave || 0;
	document.getElementById('editJobSalaryIncrease').value =
		job.salaryIncrease || 0;
	document.getElementById('editJobSalary').value = job.salary || '';
	document.getElementById('editJobBonus').value =
		job.bonus === 'N/A' ? '' : job.bonus || '';

	// Populate technical requirements
	const editTechList = document.getElementById('edit-tech-requirements-list');
	editTechList.innerHTML = ''; // Clear existing

	if (job.technicalRequirements && job.technicalRequirements.length > 0) {
		const colors = [
			{ bg: '#E3F2FD', text: '#1976D2' },
			{ bg: '#E8F5E9', text: '#388E3C' },
			{ bg: '#FFF3E0', text: '#F57C00' },
			{ bg: '#F3E5F5', text: '#7B1FA2' },
			{ bg: '#FCE4EC', text: '#C2185B' },
			{ bg: '#E0F2F1', text: '#00796B' },
		];

		job.technicalRequirements.forEach((tech) => {
			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			const techBadge = document.createElement('span');
			techBadge.className = 'badge tech-badge';
			techBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;`;
			techBadge.setAttribute('data-tech', tech);
			techBadge.innerHTML = `
        ${tech}
        <span onclick="this.parentElement.remove(); checkEditNoTechRequirements();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
      `;
			editTechList.appendChild(techBadge);
		});
	} else {
		editTechList.innerHTML =
			'<p id="edit-no-tech-requirements" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 1rem 0; margin: 0;">No technical requirements added yet.</p>';
	}

	// Show modal
	document.getElementById('editJobModal').style.display = 'flex';
	document.body.style.overflow = 'hidden';
}

function closeEditJobModal() {
	document.getElementById('editJobModal').style.display = 'none';
	document.body.style.overflow = 'auto';
	document.getElementById('editJobForm').reset();
	currentEditingJob = null;

	// Clear technical requirements
	const editTechList = document.getElementById('edit-tech-requirements-list');
	editTechList.innerHTML =
		'<p id="edit-no-tech-requirements" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 1rem 0; margin: 0;">No technical requirements added yet.</p>';
}

// Technical Requirements Functions for Edit Job Modal
function addEditTechRequirement() {
	const techName = prompt(
		'Enter technical requirement (e.g., JavaScript, React, Node.js):'
	);

	if (techName && techName.trim()) {
		const techList = document.getElementById('edit-tech-requirements-list');
		const noTech = document.getElementById('edit-no-tech-requirements');

		if (noTech) {
			noTech.remove();
		}

		const colors = [
			{ bg: '#E3F2FD', text: '#1976D2' },
			{ bg: '#E8F5E9', text: '#388E3C' },
			{ bg: '#FFF3E0', text: '#F57C00' },
			{ bg: '#F3E5F5', text: '#7B1FA2' },
			{ bg: '#FCE4EC', text: '#C2185B' },
			{ bg: '#E0F2F1', text: '#00796B' },
		];

		const randomColor = colors[Math.floor(Math.random() * colors.length)];

		const techBadge = document.createElement('span');
		techBadge.className = 'badge tech-badge';
		techBadge.style.cssText = `background: ${randomColor.bg}; color: ${randomColor.text}; padding: 0.5rem 1rem; border-radius: 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;`;
		techBadge.setAttribute('data-tech', techName.trim());
		techBadge.innerHTML = `
      ${techName.trim()}
      <span onclick="this.parentElement.remove(); checkEditNoTechRequirements();" style="cursor: pointer; font-weight: bold; margin-left: 0.25rem;">&times;</span>
    `;

		techList.appendChild(techBadge);
	}
}

function checkEditNoTechRequirements() {
	const techList = document.getElementById('edit-tech-requirements-list');
	if (techList.children.length === 0) {
		techList.innerHTML =
			'<p id="edit-no-tech-requirements" style="width: 100%; text-align: center; color: #999; font-style: italic; padding: 1rem 0; margin: 0;">No technical requirements added yet.</p>';
	}
}

// Helper function to get technical requirements from edit badges
function getEditTechRequirements() {
	const techBadges = document.querySelectorAll(
		'#edit-tech-requirements-list .tech-badge'
	);
	return Array.from(techBadges).map((badge) => badge.getAttribute('data-tech'));
}

// Update Job (Edit Existing Job)
function submitJobUpdate() {
	const form = document.getElementById('editJobForm');

	// Validate form
	if (!form.checkValidity()) {
		window.notify.warning('Please fill in all required fields!');
		form.reportValidity();
		return;
	}

	if (!currentEditingJob) {
		window.notify.warning('No job selected for editing!');
		return;
	}

	// Get current user
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
	const companyId = currentUser.userid || currentUser.userId || currentUser.id;

	if (!companyId) {
		window.notify.warning('Please login first!');
		setTimeout(() => {
			window.location.href = '../../index.html';
		}, 2000);
		return;
	}

	// Update job data (keep original id, companyId, postedAt)
	const updatedJobData = {
		...currentEditingJob, // Keep original data
		title: document.getElementById('editJobTitle').value.trim(),
		position: document.getElementById('editJobPosition').value,
		location: document.getElementById('editJobLocation').value.trim(),
		openings: parseInt(document.getElementById('editJobOpenings').value) || 1,
		targetStudents: document.getElementById('editJobTarget').value,
		description: document.getElementById('editJobDescription').value.trim(),
		requirements: document.getElementById('editJobRequirements').value.trim(),
		technicalRequirements: getEditTechRequirements(), // Add technical requirements array
		startDate: document.getElementById('editJobStartDate').value,
		endDate: document.getElementById('editJobEndDate').value || null,
		benefits: document.getElementById('editJobBenefits').value.trim(),
		daysOff: parseInt(document.getElementById('editJobDaysOff').value) || 0,
		paidLeave: parseInt(document.getElementById('editJobPaidLeave').value) || 0,
		salaryIncrease:
			parseFloat(document.getElementById('editJobSalaryIncrease').value) || 0,
		salary: document.getElementById('editJobSalary').value.trim(),
		bonus: document.getElementById('editJobBonus').value.trim() || 'N/A',
		updatedAt: new Date().toISOString(),
	};

	// Get existing jobs for this company
	const companyJobsKey = `companyJobs_${companyId}`;
	const existingJobs = JSON.parse(localStorage.getItem(companyJobsKey) || '[]');

	// Find and update the job
	const jobIndex = existingJobs.findIndex((j) => j.id === currentEditingJob.id);

	if (jobIndex !== -1) {
		existingJobs[jobIndex] = updatedJobData;

		// Save to localStorage
		localStorage.setItem(companyJobsKey, JSON.stringify(existingJobs));

		// Also update in global jobs list
		const allJobs = JSON.parse(localStorage.getItem('allJobs') || '[]');
		const globalIndex = allJobs.findIndex((j) => j.id === currentEditingJob.id);
		if (globalIndex !== -1) {
			allJobs[globalIndex] = updatedJobData;
			localStorage.setItem('allJobs', JSON.stringify(allJobs));
		}

		console.log('Job updated successfully:', updatedJobData);

		window.notify.success('Job updated successfully!');
		closeEditJobModal();

		// Reload dashboard
		loadCompanyDashboard();
	} else {
		window.notify.error('Failed to update job!');
	}
}

// Export functions to window object
window.openEditJobModal = openEditJobModal;
window.closeEditJobModal = closeEditJobModal;
window.addEditTechRequirement = addEditTechRequirement;
window.checkEditNoTechRequirements = checkEditNoTechRequirements;
window.submitJobUpdate = submitJobUpdate;
