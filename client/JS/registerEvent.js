document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('eventId');
    const title = params.get('title');
    const description = params.get('description');
    const date = params.get('date');
    const time = params.get('time');
    const location = params.get('location');
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
        alert('You need to log in to register for an event.');
        window.location.href = 'login.html';  
        return;
    }

    document.getElementById('event-title').textContent = `Event Name :${title}`;
    document.getElementById('event-description').textContent =  `Event Description :${description}`;
    document.getElementById('event-date').textContent = date;
    document.getElementById('event-time').textContent = time;
    document.getElementById('event-location').textContent = location;

    document.getElementById('registration-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const ticketType = document.getElementById('ticket-type').value;

        fetch('http://localhost:8080/api/events/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ name, email, ticketType, eventId })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'successBuy.html';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
