// Load blog data using fetch
let blogPosts = [];
let currentPage = 1;
const POSTS_PER_PAGE = 6;

async function loadBlogData() {
    try {
    // fetch path should be relative to the HTML page (pages/html/blogs.html)
    // from that HTML the assets folder is two levels up: ../../assets/data/blogs.json
    const response = await fetch('../../assets/data/blogs.json');
        blogPosts = await response.json();
        renderBlogPosts();
        renderPagination();
    } catch (error) {
        console.error('Error loading blog data:', error);
        blogPosts = [];
        renderBlogPosts();
        renderPagination();
    }
}

// Function to render blog posts
function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = blogPosts.slice(startIndex, endIndex);
    
    blogGrid.innerHTML = currentPosts.map(post => `
        <div class="blog-card" onclick="openStoryModal(${post.id})">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">
                <div class="blog-category">${post.category}</div>
            </div>
            <div class="blog-content">
                <h2 class="blog-card-title">${post.title}</h2>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-author">
                    <div class="author-avatar">${post.author.charAt(0)}</div>
                    <div>
                        <div class="author-name">${post.author}</div>
                        <div class="author-role">${post.authorRole}</div>
                    </div>
                </div>
                <div class="blog-meta">
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to render pagination
function renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ←
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            →
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Function to go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderBlogPosts();
    renderPagination();
    
    // Scroll to top of blog grid
    document.getElementById('blog-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Function to open story modal
function openStoryModal(storyId) {
    const story = blogPosts.find(post => post.id === storyId);
    if (!story) return;

    // Populate modal content like index.html
    document.getElementById('story-modal-title').textContent = story.title;
    document.getElementById('story-modal-image').src = story.image;
    document.getElementById('story-modal-category').textContent = story.category;
    document.getElementById('story-modal-author').textContent = story.author;
    document.getElementById('story-modal-role').textContent = story.authorRole;
    document.getElementById('story-modal-date').textContent = story.date;
    document.getElementById('story-modal-readtime').textContent = story.readTime;
    document.getElementById('story-modal-content').innerHTML = story.fullStory;
    
    // Show modal
    document.getElementById('story-modal').classList.add('active');
}

// Function to close story modal
function closeStoryModal() {
    document.getElementById('story-modal').classList.remove('active');
}

// Close modal when clicking outside or overlay
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
        closeStoryModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeStoryModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBlogData(); // Load data first, then render
});

// Export functions for global access
window.openStoryModal = openStoryModal;
window.closeStoryModal = closeStoryModal;