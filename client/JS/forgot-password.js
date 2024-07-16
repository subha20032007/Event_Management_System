document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordBtn = document.getElementById('reset-password-btn');

    resetPasswordBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('password').value;

        if (!username || !email || !newPassword) {
            alert('Please provide all required fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while resetting the password.');
        }
    });
});
