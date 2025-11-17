// Job Display Module
// Handles rendering job listings and pagination

function renderJobsPage() {
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const pageJobs = filteredJobs.slice(startIndex, endIndex);
  
  const jobList = document.getElementById('job-list');
  
  if (pageJobs.length === 0) {
    jobList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No jobs found.</p>';
    return;
  }
  
  jobList.innerHTML = pageJobs.map(job => {
    const location = job.location || 'Unknown';
    const jobType = job.type || 'Full-time';
    
    return `
      <article class="card job-row" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: all 0.3s ease; cursor: pointer;" 
        onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)'" 
        onmouseout="this.style.boxShadow=''; this.style.transform='translateY(0)'"
        onclick="openJobDetail('${job.id}')">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 0.5rem 0; color: #263238; font-size: 1.25rem;">${job.title}</h3>
          <p style="margin: 0 0 0.5rem 0; color: #546E7A;">
            <strong>${job.companyName}</strong> • ${location} • ${jobType}
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
            ${(job.technicalRequirements || []).slice(0, 4).map(tag => `<span class="badge" style="background: #E3F2FD; color: #1976D2; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">${tag}</span>`).join('')}
          </div>
          <p style="margin: 0; color: #00BCD4; font-weight: 600;">${job.salary}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-shrink: 0;" onclick="event.stopPropagation();">
          <button class="btn btn-ghost" onclick="saveJob('${job.id}', event)">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Save
          </button>
          <button class="btn btn-primary" onclick="openJobDetail('${job.id}', true)">Apply</button>
        </div>
      </article>
    `;
  }).join('');
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
    <button class="btn btn-outline" id="prevBtn" onclick="previousPage()" ${currentPage === 1 ? 'disabled' : ''}>
      Previous
    </button>
  `;
  
  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 3 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationHTML += `
        <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline'}" 
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
    <button class="btn btn-outline" id="nextBtn" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>
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
