// Global variables
let allJobs = [];
let currentPage = 1;
const JOBS_PER_PAGE = 10;
let filteredJobs = [];

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

// Load jobs from localStorage and render
function loadJobs() {
  try {
    // Check login status
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.userid && !currentUser.userId && !currentUser.id) {
      alert('Please login first to browse jobs!');
      window.location.href = '../../index.html';
      return;
    }
    
    // Get all jobs from localStorage
    // Jobs are stored with key: companyJobs_{companyId}
    allJobs = [];
    
    // Iterate through localStorage to find all jobs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('companyJobs_')) {
        const jobs = JSON.parse(localStorage.getItem(key) || '[]');
        allJobs = [...allJobs, ...jobs];
      }
    }
    
    filteredJobs = [...allJobs]; // Initially, all jobs are shown
    
    console.log('Total jobs loaded from localStorage:', allJobs.length);
    console.log('Jobs data:', allJobs);
    
    // Reset to page 1 and render
    currentPage = 1;
    renderJobsPage();
    setupPagination();
  } catch (error) {
    console.error('Error loading jobs:', error);
    document.getElementById('job-list').innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Unable to load jobs. Please try again later.</p>';
  }
}

// Load jobs when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadJobs();
});
