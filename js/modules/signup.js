// ===========================
// Signup Form Handler
// ===========================

function initializeSignupForm() {
  const signupForm = document.getElementById('signup-form');
  
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(signupForm);
      const username = formData.get('username');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirm-password');
      const accountType = formData.get('account-type');
      
      // Validation
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      
      if (!accountType) {
        alert('Please select an account type!');
        return;
      }
      
      // Create user object
      const newUser = {
        userid: generateUserId(),
        username: username,
        gmail: email,
        password: password, // Note: In production, NEVER store plain text passwords!
        accountType: accountType,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const success = saveUserAccount(newUser, accountType);
      
      if (success) {
        // Show success message
        alert(`Account created successfully!\n\nUser ID: ${newUser.userid}\nUsername: ${newUser.username}\nEmail: ${newUser.gmail}\nAccount Type: ${accountType}`);
        
        // Reset form
        signupForm.reset();
        
        // Close modal
        document.getElementById('signup-modal').classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// Generate unique user ID
function generateUserId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `USER${timestamp}${random}`;
}

// Save user account to localStorage
function saveUserAccount(user, accountType) {
  try {
    const storageKey = accountType === 'student' ? 'studentAccounts' : 'companyAccounts';
    
    // Get existing accounts from localStorage
    let accounts = [];
    const existingData = localStorage.getItem(storageKey);
    if (existingData) {
      accounts = JSON.parse(existingData);
    }
    
    // Check if email already exists
    const emailExists = accounts.some(acc => acc.gmail === user.gmail);
    if (emailExists) {
      alert('Email already registered!');
      return false;
    }
    
    // Add new user
    accounts.push(user);
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(accounts, null, 2));
    
    console.log(`User saved to ${storageKey}:`, user);
    return true;
  } catch (error) {
    console.error('Error saving user account:', error);
    alert('Error saving account. Please try again.');
    return false;
  }
}

// Download accounts as JSON file
function downloadAccountsAsJSON(accountType) {
  const storageKey = accountType === 'student' ? 'studentAccounts' : 'companyAccounts';
  const filename = accountType === 'student' ? 'student-accounts.json' : 'company-accounts.json';
  
  const data = localStorage.getItem(storageKey);
  if (!data) return;
  
  // Create download link
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log(`Downloaded ${filename}`);
}

// Export functions for global access
window.initializeSignupForm = initializeSignupForm;
window.generateUserId = generateUserId;
window.saveUserAccount = saveUserAccount;
window.downloadAccountsAsJSON = downloadAccountsAsJSON;

// Utility functions for debugging
window.viewStudentAccounts = function() {
  const data = localStorage.getItem('studentAccounts');
  console.log('Student Accounts:', JSON.parse(data || '[]'));
};

window.viewCompanyAccounts = function() {
  const data = localStorage.getItem('companyAccounts');
  console.log('Company Accounts:', JSON.parse(data || '[]'));
};

window.clearAllAccounts = function() {
  localStorage.removeItem('studentAccounts');
  localStorage.removeItem('companyAccounts');
  console.log('All accounts cleared!');
};

window.downloadStudentAccounts = function() {
  downloadAccountsAsJSON('student');
};

window.downloadCompanyAccounts = function() {
  downloadAccountsAsJSON('company');
};
