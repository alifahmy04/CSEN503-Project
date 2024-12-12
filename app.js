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

const locations = [
    { id: 'inca', label: 'Inca Trail to Machu Picchu' },
    { id: 'annapurna', label: 'Annapurna Circuit' },
    { id: 'paris', label: 'Paris' },
    { id: 'rome', label: 'Rome' },
    { id: 'bali', label: 'Bali Island' },
    { id: 'santorini', label: 'Santorini Island' }
];


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



//back button code now handeled completely in front end


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

        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;

        // Clear session messages after using them
        req.session.errorMessage = null;
        req.session.successMessage = null;
  
    
        res.render('home', { 
            errorMessage, 
            successMessage 
        });
    }
    else{
        res.redirect('/');
    }
});

app.get('/hiking', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('hiking', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/islands', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('islands', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/cities', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('cities', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/annapurna', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('annapurna', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/inca', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('inca', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/paris', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('paris', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/rome', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('rome', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/bali', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('bali', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/santorini', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('santorini', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/search', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    if (req.session.user) {
        res.render('home');
    }
    else {
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
        await db.collection('myCollection').insertOne({ username, password: hashedPassword, destinations: [] });

        // Redirect to the login page after successful registration
        req.session.successMessage = "Success: User registered successfully";
        res.redirect('/'); 
    } catch (err) {
        console.error('Error processing registration:', err);
    }
});

app.post('/search', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    if (!req.session.user) {
        res.redirect('/');
    }
    else {
        searchQuery = req.body.Search.toLowerCase();
        if (searchQuery.length === 0) {
            return;
        }
        results = [];
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].label.toLowerCase().includes(searchQuery)) {
                results.push(locations[i]);
            }
        }

        if (results.length == 0) 
            req.session.errorMessage = "No Results Found";

        res.render('test', {locations: results , errorMessage: req.session.errorMessage })
    }
});

app.get('/test', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching

    const errorMessage = req.session.errorMessage || null;
    req.session.errorMessage = null;

    return res.render('test', {locations, errorMessage});
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



/*
app.post('/Unregister',(req,res)=>{
    const { username} = req.body;
    //db.collection('myCollection').remove({username});

    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.send("Error during logout.");
        }
        console.log("Logged out successfully!");
        res.redirect('/');
      });

      db.collection('myCollection').drop({username});

});
*/

////////////Want To Go List Part/////////////



app.post('/add-to-wanttogo', async (req, res) => {
    if (req.session.user) {
        const { destination } = req.body;
        const user = req.session.user;
        console.log(destination);
        try {
            const userDoc = await db.collection('myCollection').findOne({ username: user });

            // Avoid duplicates
            if (userDoc.destinations?.includes(destination)) {
                req.session.errorMessage = "Destination already in list.";
                return res.redirect(req.get('referrer'));  // Redirect back to the referring page
            }

            await db.collection('myCollection').updateOne(
                { username: user },
                { $push: { destinations: destination } }
            );

            req.session.successMessage = "Added to Want-to-Go List!";
            return res.redirect(req.get('referrer'));  // Redirect back to the referring page
        } catch (err) {
            req.session.errorMessage = "An error occurred.";
        }
    } else {
        res.redirect('/');
    }
});

app.get('/wanttogobutton', function(req, res) {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        const errorMessage = req.session.errorMessage || null;
        const successMessage = req.session.successMessage || null;
        req.session.errorMessage = null;
        req.session.successMessage = null;
        return res.render('wanttogo', { errorMessage, successMessage });
    }
    res.redirect('/');
});

app.get('/wanttogo',  async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (req.session.user) {
        try {
             // Fetch user-specific data from the database
            const username = req.session.user;
            const userDoc = await db.collection('myCollection').findOne({ username: username });

            const results = userDoc.destinations || [];
            if (results.length == 0) {
                req.session.errorMessage = "No destinations found.";
            }

            wantToGoList = [];
            for (let i = 0; i < locations.length; i++) {
                if (results.includes(locations[i].label)){
                    wantToGoList.push(locations[i]);
                }
            }

            return  res.render('wanttogo', {wantToGoList});

        } catch (err) {
            req.session.errorMessage = "Error fetching data.";
             return res.redirect(req.get('referrer'));  // Redirect back to the referring page
        }
    }
    res.redirect('/'); // Redirect to login if not logged in
});
