// Job Display Module
// Handles rendering job listings and pagination

function renderJobsPage() {
	const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
	const endIndex = startIndex + JOBS_PER_PAGE;
	const pageJobs = filteredJobs.slice(startIndex, endIndex);

	const jobList = document.getElementById('job-list');

	if (pageJobs.length === 0) {
		jobList.innerHTML =
			'<p style="text-align: center; color: #666; padding: 2rem;">No jobs found.</p>';
		return;
	}

	jobList.innerHTML = pageJobs
		.map((job) => {
			// Extract location from job object
			const location = job.location?.city || job.location || 'Remote';
			const jobType = job.type || 'Full-time';

			// Format salary
			let salaryText = 'Negotiable';
			if (job.salary && job.salary.min && job.salary.max) {
				const minSalary = (job.salary.min / 1000000).toFixed(0);
				const maxSalary = (job.salary.max / 1000000).toFixed(0);
				salaryText = `${minSalary}-${maxSalary}M VND/${
					job.salary.unit || 'month'
				}`;
			}

			// Get tags/skills
			const tags = job.tags || job.technicalRequirements || [];

			// Map company names to logo filenames (case-insensitive matching)
			const companyLogoMap = {
				vng: 'vng.png',
				zingplay: 'vng.png',
				zing: 'vng.png',
				fpt: 'fpt.png',
				fsoft: 'fpt.png',
				grab: 'grab.png',
				shopee: 'Shopee.png',
				tiki: 'tiki.png',
				momo: 'momo.png',
				m_service: 'momo.png',
				viettel: 'viettel.png',
				vnpt: 'vnpt.png',
				vingroup: 'vingroup.png',
				vin: 'vingroup.png',
				cmc: 'cmc.png',
				tma: 'tma.png',
				nashtech: 'nashtech.png',
				nash: 'nashtech.png',
				luxoft: 'luxoft.png',
				kms: 'kms.png',
				gameloft: 'gameloft.png',
				'game loft': 'gameloft.png',
			};

			// Try to find matching logo
			const companyNameLower = job.companyName.toLowerCase();
			let logoFile = null;

			for (const [key, file] of Object.entries(companyLogoMap)) {
				if (companyNameLower.includes(key)) {
					logoFile = file;
					break;
				}
			}

			const companyLogo = logoFile
				? `../../assets/logos/${logoFile}`
				: `../../assets/logos/${job.companyId}.png`;

			return `
      <article class="card job-row job-card-hover" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; transition: all 0.3s ease; cursor: pointer; position: relative;" 
        onmouseover="this.style.boxShadow='0 8px 20px rgba(0,188,212,0.15)'; this.style.transform='translateY(-4px)'; this.style.borderColor='#00bcd4'; this.querySelector('.job-hover-actions').style.opacity='1'; this.querySelector('.job-hover-actions').style.visibility='visible';" 
        onmouseout="this.style.boxShadow=''; this.style.transform='translateY(0)'; this.style.borderColor=''; this.querySelector('.job-hover-actions').style.opacity='0'; this.querySelector('.job-hover-actions').style.visibility='hidden';"
        onclick="openJobDetail('${job.id}')">
        
        <!-- Company Logo -->
        <div style="flex-shrink: 0; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 0.875rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <img src="${companyLogo}" alt="${
				job.companyName
			}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%); color: white; font-weight: 700; font-size: 1.75rem; border-radius: 8px;">
            ${job.companyName.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <!-- Job Info -->
        <div style="flex: 1; min-width: 0;">
          <h3 style="margin: 0 0 0.5rem 0; color: #263238; font-size: 1.25rem; font-weight: 600;">${
						job.title
					}</h3>
          <p style="margin: 0 0 0.5rem 0; color: #546E7A; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <strong style="color: #1f2937;">${job.companyName}</strong>
            <span style="color: #d1d5db;">•</span>
            <span>${location}</span>
            <span style="color: #d1d5db;">•</span>
            <span>${jobType}</span>
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            ${tags
							.slice(0, 4)
							.map(
								(tag) =>
									`<span class="badge" style="background: #E3F2FD; color: #1976D2; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500;">${tag}</span>`
							)
							.join('')}
          </div>
          <p style="margin: 0; color: #00BCD4; font-weight: 600; font-size: 1rem;">${salaryText}</p>
        </div>
        
        <!-- Hover Actions Overlay -->
        <div class="job-hover-actions" style="position: absolute; top: 50%; right: 1.5rem; transform: translateY(-50%); display: flex; gap: 0.75rem; opacity: 0; visibility: hidden; transition: all 0.3s ease;" onclick="event.stopPropagation();">
          <button class="btn btn-ghost" onclick="saveJob('${
						job.id
					}', event)" style="padding: 0.625rem 1.25rem; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 18px; height: 18px; margin-right: 0.5rem;">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Lưu
          </button>
          <button class="btn btn-primary" onclick="openJobDetail('${
						job.id
					}', true)" style="padding: 0.625rem 1.5rem; background: linear-gradient(135deg, #00bcd4 0%, #00acc1 100%); box-shadow: 0 4px 12px rgba(0,188,212,0.3); font-weight: 600;">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 18px; height: 18px; margin-right: 0.5rem;">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            Ứng tuyển
          </button>
        </div>
      </article>
    `;
		})
		.join('');
}

// Setup pagination buttons
function setupPagination() {
	const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
	const paginationContainer = document.getElementById('pagination-container');

	if (!paginationContainer) {
		console.error('Pagination container not found');
		return;
	}

	let paginationHTML = '';

	// Previous button
	paginationHTML += `
    <button class="btn btn-outline" id="prevBtn" onclick="previousPage()" ${
			currentPage === 1 ? 'disabled' : ''
		}>
      Previous
    </button>
  `;

	// Page buttons
	for (let i = 1; i <= totalPages; i++) {
		if (
			i <= 3 ||
			i === totalPages ||
			(i >= currentPage - 1 && i <= currentPage + 1)
		) {
			paginationHTML += `
        <button class="btn ${
					i === currentPage ? 'btn-primary' : 'btn-outline'
				}" 
          onclick="goToPage(${i})">
          ${i}
        </button>
      `;
		} else if (i === 4 || i === totalPages - 1) {
			paginationHTML += '<span style="padding: 0.75rem 0;">...</span>';
		}
	}

	// Next button
	paginationHTML += `
    <button class="btn btn-outline" id="nextBtn" onclick="nextPage()" ${
			currentPage === totalPages ? 'disabled' : ''
		}>
      Next
    </button>
  `;

	paginationContainer.innerHTML = paginationHTML;
}

// Pagination functions
function goToPage(page) {
	const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
	if (page >= 1 && page <= totalPages) {
		currentPage = page;
		renderJobsPage();
		setupPagination();
		window.scrollTo(0, 0);
	}
}

function previousPage() {
	if (currentPage > 1) {
		goToPage(currentPage - 1);
	}
}

function nextPage() {
	const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
	if (currentPage < totalPages) {
		goToPage(currentPage + 1);
	}
}

// Export functions to window object
window.renderJobsPage = renderJobsPage;
window.setupPagination = setupPagination;
window.goToPage = goToPage;
window.previousPage = previousPage;
window.nextPage = nextPage;
