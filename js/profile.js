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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Profile page loaded - DOMContentLoaded fired');
  
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn || !currentUser.userid) {
    console.warn('User not logged in, redirecting to login page');
    alert('Please login first to access your profile');
    window.location.href = '../../index.html';
    return;
  }
  
  console.log('Current logged in user:', currentUser);
  console.log('User ID:', currentUser.userid);
  
  // Small delay to ensure DOM is fully ready
  setTimeout(() => {
    const profileKey = `userProfile_${currentUser.userid}`;
    const savedProfile = localStorage.getItem(profileKey);
    console.log('Profile key:', profileKey);
    console.log('Saved profile data exists:', !!savedProfile);
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      console.log('Parsed profile:', profile);
      console.log('Skills count:', profile.skills?.length || 0);
      console.log('Education count:', profile.education?.length || 0);
      console.log('Experience count:', profile.experience?.length || 0);
      console.log('Links count:', profile.links?.length || 0);
    }
    
    loadProfile();
    console.log('loadProfile() completed');
  }, 100);
});
