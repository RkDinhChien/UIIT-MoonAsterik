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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Company profile page loaded - DOMContentLoaded fired');
  
  // Check if company is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn || !currentUser.userid) {
    console.warn('Company not logged in, redirecting to login page');
    alert('Please login first to access your company profile');
    window.location.href = '../../index.html';
    return;
  }
  
  // Check if this is a company account
  if (currentUser.accountType !== 'company') {
    console.warn('Not a company account, redirecting');
    alert('This page is for company accounts only');
    window.location.href = '../../index.html';
    return;
  }
  
  console.log('Current logged in company:', currentUser);
  console.log('Company ID:', currentUser.userid);
  
  // Small delay to ensure DOM is fully ready
  setTimeout(() => {
    const profileKey = `companyProfile_${currentUser.userid}`;
    const savedProfile = localStorage.getItem(profileKey);
    console.log('Company profile key:', profileKey);
    console.log('Saved profile data exists:', !!savedProfile);
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      console.log('Parsed company profile:', profile);
      console.log('Tech Stack count:', profile.techStack?.length || 0);
      console.log('Offices count:', profile.offices?.length || 0);
      console.log('Benefits count:', profile.benefits?.length || 0);
      console.log('Social Links count:', profile.socialLinks?.length || 0);
    }
    
    loadCompanyProfile();
    console.log('loadCompanyProfile() completed');
  }, 100);
});
