const API_BASE = 'http://localhost:8000';
let accessToken = '';

// Check if we're returning from GitHub OAuth
window.onload = function() {
    // Add event listeners
    const loginBtn = document.getElementById('loginBtn');
    const testProtectedBtn = document.getElementById('testProtectedBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.addEventListener('click', login);
    if (testProtectedBtn) testProtectedBtn.addEventListener('click', testProtected);
    if (refreshBtn) refreshBtn.addEventListener('click', refreshToken);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Check for token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // We got redirected back with a token
        accessToken = token;
        showDashboard();
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
    }
};

// Login with GitHub
function login() {
    window.location.href = `${API_BASE}/auth/github`;
}

// Test protected route
async function testProtected() {
    if (!accessToken) {
        showOutput('Error: No access token. Please login first.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/protected`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('userId').textContent = data.userId;
            showOutput(`Success: Protected route accessed!\nUser ID: ${data.userId}`, 'success');
        } else {
            showOutput(`Error: ${response.status} - Token might be expired`, 'error');
        }
    } catch (error) {
        showOutput(`Error: ${error.message}`, 'error');
    }
}

// Refresh access token
async function refreshToken() {
    try {
        showOutput('Refreshing token...', 'info');
        
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            accessToken = data.accessToken;
            document.getElementById('accessToken').textContent = accessToken;
            showOutput('Success: Token refreshed successfully!', 'success');
        } else {
            showOutput(`Error: ${response.status} - ${response.statusText}`, 'error');
        }
    } catch (error) {
        showOutput(`Error: ${error.message}`, 'error');
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.status === 204 || response.ok) {
            accessToken = '';
            showLogin();
            showOutput('Success: Logged out successfully!', 'success');
        } else {
            showOutput(`Error: ${response.status}`, 'error');
        }
    } catch (error) {
        showOutput(`Error: ${error.message}`, 'error');
    }
}

// Show dashboard view
function showDashboard() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('accessToken').textContent = accessToken;
    
    // Auto-test protected route to get user ID
    testProtected();
}

// Show login view
function showLogin() {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('userId').textContent = '-';
    document.getElementById('accessToken').textContent = 'No token yet';
}

// Show output messages
function showOutput(message, type = 'info') {
    const output = document.getElementById('output');
    output.style.display = 'block';
    const color = type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#60a5fa';
    output.innerHTML = `<span style="color: ${color}">${message}</span>`;
}
