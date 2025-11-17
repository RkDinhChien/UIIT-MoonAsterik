// Job Filter Module
// Handles filtering and searching of jobs

function applyFilters() {
  const searchInput = document.querySelector('input[placeholder*="e.g. React"]') || document.querySelector('input[placeholder*="Search"]');
  const locationSelect = document.querySelector('select');
  
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedLocation = locationSelect ? locationSelect.value : '';
  
  filteredJobs = allJobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm) ||
      job.companyName.toLowerCase().includes(searchTerm) ||
      (job.technicalRequirements && job.technicalRequirements.some(tag => tag.toLowerCase().includes(searchTerm)));
    
    const matchesLocation = !selectedLocation || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });
  
  currentPage = 1;
  renderJobsPage();
  setupPagination();
}

// Export functions to window object
window.applyFilters = applyFilters;
