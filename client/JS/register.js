document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');

    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
         
        if (!username || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }
  console.log(username,email,password)
        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = 'login.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred during registration. Please try again.');
        }
    });
});
