document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-form');
    const token = localStorage.getItem('token');
   // console.log(token)
    if (token=="undefined"||!token) {
        alert('You need to log in to create an event.');
    
        window.location.href = '\login.html'; 
        return;
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            alert('You need to log in to create an event.');
            return;
        }

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const location = document.getElementById('location').value;
        const ticket_price = document.getElementById('ticket_price').value;
        const privacy = document.getElementById('privacy').value;

        const eventData = {
            title,
            description,
            date,
            time,
            location,
            ticket_price,
            privacy
        };

        try {
            const response = await fetch('http://localhost:8080/api/events/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(eventData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Event created successfully!');
                // Redirect to the manage events page or any other page
                window.location.href = 'manageEvent.html';
            } else {
                alert('Error creating event: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the event. Please try again.');
        }
    });
});
