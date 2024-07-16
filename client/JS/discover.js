document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const token = localStorage.getItem("token");
    if (token=="undefined"||!token) {
        alert('You need to log in to join an event.');
        // Redirect to login page
        window.location.href = '\login.html';  // Replace with your login page URL
        return;
    }
    searchBtn.addEventListener('click', () => {
        const keyword = document.getElementById('search-keyword').value;
        const date = document.getElementById('search-date').value;
        const location = document.getElementById('search-location').value;

        searchEvents(keyword, date, location);
    });

    function loadAllEvents() {
        fetch('http://localhost:8080/api/events/get-events', {
            headers: {
                'Authorization': `${token}`
            }
        })
            .then(response => response.json())
            .then(events => {
                displayEvents(events);
            });
    }

    function searchEvents(keyword, date, location) {
        fetch(`http://localhost:8080/api/events/search?keyword=${keyword}&date=${date}&location=${location}`)
            .then(response => response.json())
            .then(events => {
                displayEvents(events);
                console.log(events);
            });
    }

    function displayEvents(events) {
        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = '';
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            const title = document.createElement('h2');
            title.textContent = event.title;
            eventCard.appendChild(title);

            const description = document.createElement('p');
            description.textContent = event.description;
            eventCard.appendChild(description);

            const date = document.createElement('p');
            date.innerHTML = `<strong>Date:</strong> ${event.date}`;
            eventCard.appendChild(date);

            const time = document.createElement('p');
            time.innerHTML = `<strong>Time:</strong> ${event.time}`;
            eventCard.appendChild(time);

            const location = document.createElement('p');
            location.innerHTML = `<strong>Location:</strong> ${event.location}`;
            eventCard.appendChild(location);

            const ticketPrice = document.createElement('p');
            ticketPrice.innerHTML = `<strong>Ticket Price:</strong> $${event.ticket_price}`;
            eventCard.appendChild(ticketPrice);

            const privacy = document.createElement('p');
            privacy.innerHTML = `<strong>Privacy:</strong> ${event.privacy}`;
            eventCard.appendChild(privacy);

            const join = document.createElement('button');
            join.textContent = 'Join';
            join.onclick = () => openRegistrationForm(event.id, event.title, event.description, event.date, event.time, event.location);
            eventCard.appendChild(join);

            eventsContainer.appendChild(eventCard);
        });
    }

    // function openRegistrationForm(eventId, title, description, date, time, location) {
    //     const registrationContainer = document.createElement('div');
    //     registrationContainer.innerHTML = `
    //         <div class="event-details">
    //             <h2>${title}</h2>
    //             <p>${description}</p>
    //             <p><strong>Date:</strong> ${date}</p>
    //             <p><strong>Time:</strong> ${time}</p>
    //             <p><strong>Location:</strong> ${location}</p>
    //         </div>

    //         <form id="registration-form">
    //             <h2>Register for Event</h2>
    //             <label for="name">Name</label>
    //             <input type="text" id="name" required>
    //             <label for="email">Email</label>
    //             <input type="email" id="email" required>
    //             <label for="ticket-type">Ticket Type</label>
    //             <select id="ticket-type" required>
    //                 <option value="general">General - $50</option>
    //                 <option value="vip">VIP - $100</option>
    //             </select>
    //             <button type="submit">Register</button>
    //         </form>
    //     `;

    //     document.body.appendChild(registrationContainer);

    //     document.getElementById('registration-form').addEventListener('submit', function (event) {
    //         event.preventDefault();

    //         const name = document.getElementById('name').value;
    //         const email = document.getElementById('email').value;
    //         const ticketType = document.getElementById('ticket-type').value;

    //         fetch('http://localhost:8080/api/events/register', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${token}`
    //             },
    //             body: JSON.stringify({ name, email, ticketType, eventId })
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 alert(data.message);
    //                 document.body.removeChild(registrationContainer);
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //             });
    //     });
    // }
    function openRegistrationForm(eventId, title, description, date, time, location) {
        const registrationPageUrl = `registerEvent.html?eventId=${eventId}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&location=${encodeURIComponent(location)}`;
        window.location.href = registrationPageUrl;
    }
    
  
    loadAllEvents();
});
