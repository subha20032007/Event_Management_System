
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);
//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



