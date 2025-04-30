// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const path = require('path');


// const app = express();

// // Add request logging middleware
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

// app.use(express.json());

// app.use(cors());

// // Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// // Routes
// app.use('/auth', require('./routes/auth'));

// app.use('/jobs', require('./routes/jobs'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const path = require('path');
// const setupSocket = require('./socket'); 
// const app = express();
// const http = require('http');
// app.use(express.json()); 
// const server = http.createServer(app);
// // ✅ Now logging middleware can read the body properly
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// app.use('/auth', require('./routes/auth'));
// app.use('/jobs', require('./routes/jobs'));
// app.use('/messages', require('./routes/message'))
// const PORT = process.env.PORT || 5000;

// setupSocket(server);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const http = require('http');
const setupSocket = require('./config/socket'); // Import the Socket.IO setup function

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));
app.use('/messages', require('./routes/message'));
app.use("/users", require("./routes/users"));
app.use("/conversations", require("./routes/conversation"));
app.use("/messages", require("./routes/message"));
// Attach Socket.IO to the server
setupSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



