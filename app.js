var express = require('express');
var path = require('path');
var app = express();
var bcrypt = require('bcrypt');
var session = require('express-session');
const { MongoClient } = require('mongodb');

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
        db = client.db('myDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}

// Initialize the database connection
connectToDatabase();





// WARNING : when handling the get of any page, check first if there is a user logged in or not through this:
// if (req.session.user)
//     return res.redirect('/home');   session exists --> allow to go to the target page (there is a user logged in, so he can do whatever he wants)
// res.redirect('/');                  no session exists --> there is no logged-in user --> you must force him go to the login page






// Routes
app.get('/', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    if (req.session.user) {
      // If session exists, automatically log in and redirect to the home page
      return res.redirect('/home');
    }

    // If no session exists, go to login page
    const errorMessage = req.session.errorMessage || null;
    const successMessage = req.session.successMessage || null;

    // Clear session messages after using them
    req.session.errorMessage = null; 
    req.session.successMessage = null;

    res.render('login', { 
      errorMessage, 
      successMessage 
    });
});


app.get('/registration', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    const errorMessage = req.session.errorMessage || null;

    // Clear session messages after using them
    req.session.errorMessage = null; 

    res.render('registration', { 
      errorMessage, 
    });
});


// Verify first that there is a user logged in (available session)
app.get('/home', (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    if (req.session.user) {
      const successMessage = req.session.successMessage || null;
  
      // Clear session messages after using them
      req.session.successMessage = null;
  
      res.render('home', { 
        successMessage 
      });
    }
    else{
        res.redirect('/');
    }
});





// login endpoint (Button Action)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    const user = await db.collection('myCollection').findOne({ username });

    // Check if the username or password is empty
    if (!username || !password) {
        req.session.errorMessage = "Error: Username and password are required.";
        return res.redirect('/');
    }

    // Check if this username exists in the database
    if (!user) {
        req.session.errorMessage = "Error: User not found.";
        return res.redirect('/');
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        req.session.errorMessage = "Error: Invalid password. ";
        return res.redirect('/');
    }

    // Create session & Redirect to the login page after successful registration
    req.session.user = username;
    req.session.successMessage = "Success: Login successful! ";
    res.redirect('/home');
});


// Register endpoint (Button Action)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        req.session.errorMessage = "Error: Username and password are required.";
        return res.redirect('/registration');
    }

    try {
        // Check if username is already taken
        const user = await db.collection('myCollection').findOne({ username });
        if (user) {
            req.session.errorMessage = "Error: Username already exists.";
            return res.redirect('/registration');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        await db.collection('myCollection').insertOne({ username, password: hashedPassword });

        // Redirect to the login page after successful registration
        req.session.successMessage = "Success: User registered successfully";
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
