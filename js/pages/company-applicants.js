// Company Applicants Main Module
// Entry point that loads dependent modules and initializes the page

// Initialize page on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navbarMenu = document.getElementById('navbarMenu');
  
  if (mobileToggle && navbarMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  }

  // Load applicants from applicants-list module
  loadApplicants();
});

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    alert('Logged out successfully!');
    window.location.href = '../../index.html';
  }
}
