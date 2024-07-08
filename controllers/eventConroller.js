const { db } = require('../config/db');
const jwt = require('jsonwebtoken');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, ticket_price, privacy } = req.body;

        if (!title || !description || !date || !time || !location || !ticket_price || !privacy) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }

       
        const token = req.headers.authorization.split(' ')[0];
      
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        db.query(
            'INSERT INTO events (userId, title, description, date, time, location, ticket_price, privacy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, date, time, location, ticket_price, privacy],
            (err, result) => {
                if (err) {
                    console.error('Error creating event:', err);
                    return res.status(500).send({
                        success: false,
                        message: 'Server error',
                        error: err
                    });
                }

                res.status(201).send({
                    success: true,
                    message: 'Event created successfully!',
                    eventId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({
            success: false,
            message: 'Server error',
            error
        });
    }
};
exports.getEvents= (req, res) => {

  const token = req.headers.authorization.split(' ')[0];
   console.log(token, process.env.JWT_SECRET)
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   const userId = decodedToken.userId;
    db.query('SELECT * FROM events WHERE userId = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send({ message: 'Server error', error: err });
        }
        res.status(200).send(results);
    });
};


exports.deleteEvent= (req, res) => {
    const eventId = req.params.id;

   const token = req.headers.authorization.split(' ')[0];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    db.query('DELETE FROM events WHERE id = ? AND userId = ?', [eventId, userId], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).send({ message: 'Server error', error: err });
        }
        res.status(200).send({ success: true, message: 'Event deleted successfully!' });
    });
};



exports.getAttendees = (req, res) => {
    const eventId = req.params.eventId;

    db.query(
        'SELECT users.id, users.username, attendances.attended FROM attendances INNER JOIN users ON attendances.userId = users.id WHERE attendances.eventId = ?',
        [eventId],
        (err, results) => {
            if (err) {
                console.error('Error fetching attendees:', err);
                return res.status(500).send({ success: false, message: 'Server error', error: err });
            }
            res.status(200).send({ success: true, attendees: results });
        }
    );
};

exports.editEvent = (req, res) => {
    const eventId = req.params.id;
    const { title, description, date, time, location, ticket_price, privacy } = req.body;


    const token = req.headers.authorization.split(' ')[0];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    db.query(
        'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, ticket_price = ?, privacy = ? WHERE id = ? AND userId = ?',
        [title, description, date, time, location, ticket_price, privacy, eventId, userId],
        (err, result) => {
            if (err) {
                console.error('Error updating event:', err);
                return res.status(500).send({ success: false, message: 'Server error', error: err });
            }
            res.status(200).send({ success: true, message: 'Event updated successfully!' });
        }
    );
};



exports.searchEvents = (req, res) => {
    const { keyword, date, location, category } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (keyword) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }
    if (location) {
        query += ' AND location LIKE ?';
        params.push(`%${location}%`);
    }
    

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching events:', err);
            return res.status(500).send({ message: 'Server error', error: err });
        }
        res.status(200).send(results);
    });
};

exports.registerForEvent = (req, res) => {
    const { name, email, ticketType, eventId } = req.body;

    if (!name || !email || !ticketType || !eventId) {
        return res.status(400).send({ message: 'Please provide all required fields.' });
    }

    const ticketPrice = ticketType === 'vip' ? 100 : 50;

    db.query(
        'INSERT INTO registrations (name, email, ticket_type, ticket_price, event_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, ticketType, ticketPrice, eventId],
        (err, result) => {
            if (err) {
                console.error('Error registering for event:', err);
                return res.status(500).send({ message: 'Server error', error: err });
            }

            res.status(201).send({ message: 'Registration successful!', registrationId: result.insertId });
        }
    );
};
exports.getUserRegistration = (req, res) => {
    const eventId = req.params.eventId;

    db.query(
        'SELECT * FROM users_db.registrations WHERE event_id= ?',
        [eventId],
        (err, results) => {
            if (err) {
                console.error('Error retrieving user registration:', err);
                return res.status(500).send({ message: 'Server error', error: err });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'User registration not found' });
            }

            const registration = results;
            res.status(200).send({ message: 'User registration found', registration });
        }
    );
};