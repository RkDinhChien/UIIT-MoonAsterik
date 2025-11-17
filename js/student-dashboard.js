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

window.logout = logout;

// Load dashboard data
function loadDashboard() {
  try {
    // Check login status
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const studentId = currentUser.userid || currentUser.userId || currentUser.id;
    
    if (!studentId) {
      alert('Please login first!');
      window.location.href = '../../index.html';
      return;
    }

    // Get all jobs from localStorage
    let allJobs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('companyJobs_')) {
        const jobs = JSON.parse(localStorage.getItem(key) || '[]');
        allJobs = [...allJobs, ...jobs];
      }
    }

    // Get student applications
    const studentApplicationsKey = `studentApplications_${studentId}`;
    const studentApplications = JSON.parse(localStorage.getItem(studentApplicationsKey) || '[]');

    // Load recommended jobs (module function)
    loadRecommendedJobs(allJobs);

    // Load recent applications (module function)
    loadRecentApplications(studentApplications, allJobs);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load dashboard when page loads
document.addEventListener('DOMContentLoaded', loadDashboard);
