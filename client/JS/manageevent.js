document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); 
    if (token=="undefined"||!token) {
        alert('You need to log in to manage an event.');
        // Redirect to login page
        window.location.href = '\login.html';  
        return;
    }
    loadEvents();

    function loadEvents() {
        fetch('http://localhost:8080/api/events/get-events', {
            headers: {
               'Authorization': `${token}`
            }
        })
        .then(response => response.json())
        .then(events => {
            const eventsContainer = document.getElementById('events-container');
            eventsContainer.innerHTML = '';
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                eventCard.innerHTML = `
                    <div id="card-manage">
                        <h2>${event.title}</h2>
                        <p>${event.description}</p>
                        <p><strong>Date:</strong> ${event.date}</p>
                        <p><strong>Time:</strong> ${event.time}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Ticket Price:</strong> $${event.ticket_price}</p>
                        <p><strong>Privacy:</strong> ${event.privacy}</p>
                        <button class="button" onclick="viewAttendees(${event.id})">View Attendees</button>
                        <button class="button" onclick="openEditEventModal(${event.id})">Edit Event</button>
                        <button class="button" onclick="deleteEvent(${event.id})">Delete Event</button>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });
        });
    }

    window.openEditEventModal = function(eventId) {
        fetch('http://localhost:8080/api/events/get-events', {
            headers: {
               'Authorization': `${token}`
            }
        })
        .then(response => response.json())
        .then(events =>{
            const event = events.find(event => event.id === eventId);
            document.getElementById('edit-title').value = event.title;
            document.getElementById('edit-description').value = event.description;
            document.getElementById('edit-date').value = event.date;
            document.getElementById('edit-time').value = event.time;
            document.getElementById('edit-location').value = event.location;
            document.getElementById('edit-ticket-price').value = event.ticket_price;
            document.getElementById('edit-privacy').value = event.privacy;
    
            document.getElementById('edit-event-modal').style.display = 'block';
    
            document.getElementById('edit-event-form').onsubmit = function(e) {
                e.preventDefault();
                editEvent(eventId);
            }
        })
    }

    window.closeEditEventModal = function() {
        document.getElementById('edit-event-modal').style.display = 'none';
    }

    window.editEvent = function(eventId) {
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        const date = document.getElementById('edit-date').value;
        const time = document.getElementById('edit-time').value;
        const location = document.getElementById('edit-location').value;
        const ticket_price = document.getElementById('edit-ticket-price').value;
        const privacy = document.getElementById('edit-privacy').value;

        fetch(`http://localhost:8080/api/events/edit-event/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ title, description, date, time, location, ticket_price, privacy })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Event updated successfully!');
                closeEditEventModal();
                loadEvents();
            } else {
                alert('Error updating event');
            }
        });
    }

    window.deleteEvent = function(eventId) {
        fetch(`http://localhost:8080/api/events/delete-event/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadEvents();
        });
    }

    window.viewAttendees = function(eventId) {
        fetch(`http://localhost:8080/api/events/registrations/${eventId}`, {
            headers: {
                'Authorization': `${token}`
            }
        })
        .then(response => response.json())
        .then(attendees => {
            console.log(attendees.registration)
            const attendeesList = document.getElementById('attendees-list');
            attendeesList.innerHTML = '';
            attendees.registration.forEach(attendee => {
                const attendeeItem = document.createElement('div');
                attendeeItem.classList.add('attendee-item')
                attendeeItem.style.padding = '10px';
                attendeeItem.style.border = '1px solid blue';
                attendeeItem.textContent = attendee.name;
                attendeesList.appendChild(attendeeItem);
            });
            document.getElementById('attendees-modal').style.display = 'block';
        });
    }
});
