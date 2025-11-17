// Job Filter Module
// Handles filtering and searching of jobs

function applyFilters() {
	const searchInput =
		document.querySelector('input[placeholder*="Search"]') ||
		document.querySelector('input[type="text"]');
	const locationSelect = document.querySelector('select');

	const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
	const selectedLocation = locationSelect ? locationSelect.value : '';

	filteredJobs = allJobs.filter((job) => {
		// Handle search - check title, company name, and tags
		const matchesSearch =
			!searchTerm ||
			job.title.toLowerCase().includes(searchTerm) ||
			job.companyName.toLowerCase().includes(searchTerm) ||
			(job.tags &&
				job.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) ||
			(job.technicalRequirements &&
				job.technicalRequirements.some((tag) =>
					tag.toLowerCase().includes(searchTerm)
				));

		// Handle location - check city from location object
		const jobLocation = job.location?.city || job.location || '';
		const matchesLocation =
			!selectedLocation ||
			jobLocation.toLowerCase().includes(selectedLocation.toLowerCase());

		return matchesSearch && matchesLocation;
	});

	currentPage = 1;
	renderJobsPage();
	setupPagination();
}

// Export functions to window object
window.applyFilters = applyFilters;
