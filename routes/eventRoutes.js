const express = require('express');
const auth = require('../middleware/auth');
const { createEvent, getEvents, deleteEvent, editEvent ,searchEvents,registerForEvent,getUserRegistration} = require('../controllers/eventConroller');

const router = express.Router();

router.get('/get-events', auth,getEvents);
router.post('/create-event', auth, createEvent);
router.delete('/delete-event/:id', auth, deleteEvent);
router.put('/edit-event/:id', auth, editEvent);
router.get('/search', searchEvents);
router.post('/register',registerForEvent);
router.get('/registrations/:eventId', getUserRegistration);
module.exports = router;
