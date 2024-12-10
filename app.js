var express = require('express');
var path = require('path');
var app = express();
var bcrypt = require('bcrypt');
var session = require('express-session');
const { MongoClient } = require('mongodb');
var flash = require('connect-flash');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'aRandomSecretKey!1234$%@!UseThisForSessions',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



// Connect to MongoDB
let db;
async function connectToDatabase() {
    try {
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        db = client.db('myDB'); // Must be myDB to match project requirements.
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}

// Initialize the database connection
connectToDatabase();





// WARNING : when handling the get of any page, check first if there is a user logged in or not through this:
// if (req.session.user)
//     return res.redirect('/home');       session exists --> allow to go to the target page (there is a user logged in, so he can do whatever he wants)
// res.redirect('/');                      no session exists --> there is no logged-in user --> you must force him go to the login page






// Routes
app.get('/', function(req, res) {
  if (req.session.user) {
    // If session exists, automatically log in and redirect to the home page
    return res.redirect('/home');
  }
  // if no session exists, go to login page
  res.render('login', { successMessage: req.flash('successMessage') });
});


app.get('/registration', function(req, res) {
  res.render('registration');
});


// Verify first that there is a user logged in (available session)
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home', { successMessage: req.flash('successMessage') });
  }
  else{
    res.redirect('/');
  }
});






// login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    const user = await db.collection('myCollection').findOne({ username }); // Must be myCollection to match project requirements.

    // Check if the username or password is empty
    if (!username || !password) {
        return res.render('login', { errorMessage: "Error: Username and password are required." });
    }

    // Check if this username exists in the database
    if (!user) {
        return res.render('login', { errorMessage: "Error: User not found. " });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', { errorMessage: "Error: Invalid password. " });
    }

    // Create session & Redirect to the login page after successful registration
    req.session.user = username;
    req.flash('successMessage', 'Success: Login successful!');
    res.redirect('/home');
});


// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.render('registration', { errorMessage: "Error: Username and password are required." });
    }

    try {
        // Check if username is already taken
        const user = await db.collection('Users').findOne({ username });
        if (user) {
            return res.render('registration', { errorMessage: "Error: Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        await db.collection('Users').insertOne({ username, password: hashedPassword });

        // Redirect to the login page after successful registration
        req.flash('successMessage', 'Success: User registered successfully');
        res.redirect('/'); 

    } catch (err) {
        console.error('Error processing registration:', err);
    }
});


app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.error("Error during logout:", err);
        return res.send("Error during logout.");
    }
    console.log("Logged out successfully!");
    res.redirect('/');
  });
});
