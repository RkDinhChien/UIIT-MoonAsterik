// ===========================
// Login Module
// ===========================

function initializeLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(loginForm);
      const email = formData.get('email');
      const password = formData.get('password');
      const accountType = document.getElementById('login-account-type').value;
      
      // Validate account type
      if (!accountType) {
        alert('Please select an account type first!');
        return;
      }
      
      // Get accounts from localStorage
      const storageKey = accountType === 'student' ? 'studentAccounts' : 'companyAccounts';
      const accountsData = localStorage.getItem(storageKey);
      
      if (!accountsData) {
        alert('No accounts found. Please sign up first!');
        return;
      }
      
      const accounts = JSON.parse(accountsData);
      
      // Find matching account
      const user = accounts.find(acc => acc.gmail === email && acc.password === password);
      
      if (user) {
        // Login successful
        const userSession = {
          isLoggedIn: true,
          userid: user.userid,
          username: user.username,
          email: user.gmail,
          accountType: user.accountType,
          loginTime: new Date().toISOString()
        };
        
        // Save session to localStorage
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert(`Welcome back, ${user.username}!`);
        
        // Close modal
        document.getElementById('login-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Redirect based on account type
        if (accountType === 'student') {
          window.location.href = './pages/html/student-dashboard.html';
        } else {
          window.location.href = './pages/html/company-dashboard.html';
        }
      } else {
        alert('Invalid email or password!');
      }
    });
  }
}

// Show login form for selected account type
function showLoginForm(accountType) {
  // Hide step 1, show step 2
  document.getElementById('login-step-1').style.display = 'none';
  document.getElementById('login-step-2').style.display = 'block';
  
  // Set account type
  document.getElementById('login-account-type').value = accountType;
  
  // Update button text
  const btnText = accountType === 'student' ? 'Sign In as Student' : 'Sign In as Company';
  document.getElementById('login-btn-text').textContent = btnText;
  
  // Update modal title and description
  const modalTitle = document.querySelector('#login-modal .modal-title');
  const modalDescription = document.querySelector('#login-modal .modal-description');
  
  if (accountType === 'student') {
    modalTitle.textContent = 'Welcome Back to Moon*';
    modalDescription.textContent = 'Sign in to access your account';
  } else {
    modalTitle.textContent = 'Welcome Back to Moon*';
    modalDescription.textContent = 'Sign in to access your account';
  }
}

// Back to account type selection
function backToAccountTypeSelection() {
  // Show step 1, hide step 2
  document.getElementById('login-step-1').style.display = 'block';
  document.getElementById('login-step-2').style.display = 'none';
  
  // Clear form
  document.getElementById('login-form').reset();
  document.getElementById('login-account-type').value = '';
  
  // Reset modal title
  const modalTitle = document.querySelector('#login-modal .modal-title');
  const modalDescription = document.querySelector('#login-modal .modal-description');
  modalTitle.textContent = 'Welcome Back to Moon*';
  modalDescription.textContent = 'Sign in to access your account';
}

// Check if user is logged in
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentUser = localStorage.getItem('currentUser');
  
  if (isLoggedIn === 'true' && currentUser) {
    const user = JSON.parse(currentUser);
    console.log('User is logged in:', user);
    return user;
  }
  
  return null;
}

// Reset login modal when closed
function resetLoginModalOnClose() {
  document.addEventListener('click', function(e) {
    if (e.target.hasAttribute('data-modal-close') || e.target.classList.contains('modal-overlay')) {
      const loginModal = document.getElementById('login-modal');
      if (loginModal && loginModal.classList.contains('active')) {
        // Reset to step 1 when modal is closed
        setTimeout(() => {
          backToAccountTypeSelection();
        }, 300);
      }
    }
  });
}

// Handle signup link in login modal
function handleSignupLinkInLogin() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('link-signup')) {
      e.preventDefault();
      // Close login modal
      document.getElementById('login-modal').classList.remove('active');
      document.body.style.overflow = '';
      // Open signup modal
      setTimeout(() => {
        document.getElementById('signup-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 200);
    }
  });
}

// Export functions for global access
window.initializeLoginForm = initializeLoginForm;
window.showLoginForm = showLoginForm;
window.backToAccountTypeSelection = backToAccountTypeSelection;
window.checkLoginStatus = checkLoginStatus;

// Logout function
window.logout = function() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  alert('Logged out successfully!');
  window.location.href = '../../index.html';
};
