const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RIDES_FILE = path.join(DATA_DIR, 'rides.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Initialize data directory and files
async function initDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize users.json if it doesn't exist
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize rides.json if it doesn't exist
    try {
      await fs.access(RIDES_FILE);
    } catch {
      await fs.writeFile(RIDES_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize bookings.json if it doesn't exist
    try {
      await fs.access(BOOKINGS_FILE);
    } catch {
      await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Helper functions to read/write data
async function readUsers() {
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readRides() {
  const data = await fs.readFile(RIDES_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeRides(rides) {
  await fs.writeFile(RIDES_FILE, JSON.stringify(rides, null, 2));
}

async function readBookings() {
  const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeBookings(bookings) {
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function ensureRideDefaults(ride) {
  if (!ride.seatsTotal) {
    ride.seatsTotal = ride.seatsAvailable || 0;
  }
  if (!ride.ratings) {
    ride.ratings = [];
  }
  if (typeof ride.averageRating !== 'number') {
    ride.averageRating = 0;
  }
  if (typeof ride.ratingCount !== 'number') {
    ride.ratingCount = ride.ratings.length;
  }
  return ride;
}

function getRideDateValue(ride) {
  return new Date(`${ride.date}T${ride.time || '00:00'}`).getTime();
}

async function getUserStats(userId) {
  const [rides, bookings] = await Promise.all([readRides(), readBookings()]);

  const driverRides = rides.filter(r => r.driverId === userId);
  const passengerBookings = bookings.filter(b => b.passengerId === userId);

  const totalRidesPosted = driverRides.length;
  const totalSeatsShared = driverRides.reduce((sum, ride) => {
    ensureRideDefaults(ride);
    return sum + ride.seatsTotal;
  }, 0);
  const totalBookings = passengerBookings.length;

  let ratingSum = 0;
  let ratingCount = 0;
  driverRides.forEach(ride => {
    ensureRideDefaults(ride);
    ratingSum += ride.averageRating * ride.ratingCount;
    ratingCount += ride.ratingCount;
  });

  const averageDriverRating = ratingCount ? parseFloat((ratingSum / ratingCount).toFixed(2)) : 0;

  return {
    totalRidesPosted,
    totalSeatsShared,
    totalBookings,
    ratingsReceived: ratingCount,
    averageDriverRating
  };
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const users = await readUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await getUserStats(user.id);

    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, stats });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await getUserStats(user.id);
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, stats });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].name = name;
    users[userIndex].phone = phone || '';
    await writeUsers(users);

    const stats = await getUserStats(req.user.id);

    res.json({
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      phone: users[userIndex].phone,
      stats
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new ride
app.post('/api/rides', authenticateToken, async (req, res) => {
  try {
    const { origin, destination, date, time, seatsAvailable, price, carModel, carNumber } = req.body;

    if (!origin || !destination || !date || !time || !seatsAvailable || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const rides = await readRides();
    
    const newRide = {
      id: uuidv4(),
      driverId: req.user.id,
      origin,
      destination,
      date,
      time,
      seatsAvailable: parseInt(seatsAvailable),
      seatsTotal: parseInt(seatsAvailable),
      price: parseFloat(price),
      carModel: carModel || '',
      carNumber: carNumber || '',
      createdAt: new Date().toISOString(),
      status: 'active',
      ratings: [],
      averageRating: 0,
      ratingCount: 0
    };

    rides.push(newRide);
    await writeRides(rides);

    res.status(201).json({ message: 'Ride created successfully', ride: newRide });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all rides (with optional filters)
app.get('/api/rides', async (req, res) => {
  try {
    const { origin, destination, date, sort = 'date', order = 'asc', minRating, maxPrice } = req.query;
    let rides = (await readRides()).map(ride => ensureRideDefaults(ride));
    const users = await readUsers();

    if (origin) {
      rides = rides.filter(r => r.origin.toLowerCase().includes(origin.toLowerCase()));
    }
    if (destination) {
      rides = rides.filter(r => r.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    if (date) {
      rides = rides.filter(r => r.date === date);
    }
    if (minRating) {
      const min = parseFloat(minRating);
      if (!isNaN(min)) {
        rides = rides.filter(r => r.averageRating >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        rides = rides.filter(r => r.price <= max);
      }
    }

    rides = rides.filter(r => r.status === 'active');

    const direction = order === 'desc' ? -1 : 1;
    rides.sort((a, b) => {
      let aValue;
      let bValue;
      switch (sort) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        default:
          aValue = getRideDateValue(a);
          bValue = getRideDateValue(b);
      }
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    const ridesWithDriver = rides.map(ride => {
      const driver = users.find(u => u.id === ride.driverId);
      return {
        ...ride,
        driverName: driver ? driver.name : 'Unknown'
      };
    });

    res.json(ridesWithDriver);
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ride by ID
app.get('/api/rides/:id', async (req, res) => {
  try {
    const rides = (await readRides()).map(ride => ensureRideDefaults(ride));
    const users = await readUsers();
    const ride = rides.find(r => r.id === req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const driver = users.find(u => u.id === ride.driverId);
    const bookings = await readBookings();
    const rideBookings = bookings.filter(b => b.rideId === ride.id);

    res.json({
      ...ride,
      driverName: driver ? driver.name : 'Unknown',
      driverPhone: driver ? driver.phone : '',
      bookings: rideBookings
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's rides (as driver)
app.get('/api/rides/driver/my-rides', authenticateToken, async (req, res) => {
  try {
    const rides = (await readRides()).map(ride => ensureRideDefaults(ride));
    const userRides = rides.filter(r => r.driverId === req.user.id);
    res.json(userRides);
  } catch (error) {
    console.error('Get my rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book a ride
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { rideId, seats } = req.body;

    if (!rideId || !seats) {
      return res.status(400).json({ error: 'Ride ID and number of seats are required' });
    }

    const rides = await readRides();
    const ride = rides.find(r => r.id === rideId);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId === req.user.id) {
      return res.status(400).json({ error: 'Cannot book your own ride' });
    }

    if (ride.seatsAvailable < parseInt(seats)) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const bookings = await readBookings();
    const existingBooking = bookings.find(
      b => b.rideId === rideId && b.passengerId === req.user.id
    );

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked this ride' });
    }

    const newBooking = {
      id: uuidv4(),
      rideId,
      passengerId: req.user.id,
      seats: parseInt(seats),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);

    // Update available seats
    ride.seatsAvailable -= parseInt(seats);
    if (ride.seatsAvailable === 0) {
      ride.status = 'full';
    }

    await writeBookings(bookings);
    await writeRides(rides);

    res.status(201).json({ message: 'Ride booked successfully', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings (as passenger)
app.get('/api/bookings/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await readBookings();
    const rides = (await readRides()).map(ride => ensureRideDefaults(ride));
    const users = await readUsers();

    const userBookings = bookings
      .filter(b => b.passengerId === req.user.id)
      .map(booking => {
        const ride = rides.find(r => r.id === booking.rideId);
        const driver = ride ? users.find(u => u.id === ride.driverId) : null;
        return {
          ...booking,
          ride: ride ? {
            ...ride,
            driverName: driver ? driver.name : 'Unknown'
          } : null
        };
      });

    res.json(userBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const bookings = await readBookings();
    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.passengerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update ride seats
    const rides = await readRides();
    const ride = rides.find(r => r.id === booking.rideId);
    if (ride) {
      ride.seatsAvailable += booking.seats;
      if (ride.status === 'full') {
        ride.status = 'active';
      }
      await writeRides(rides);
    }

    // Remove booking
    const updatedBookings = bookings.filter(b => b.id !== req.params.id);
    await writeBookings(updatedBookings);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rate a ride
app.post('/api/rides/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const ratingValue = parseInt(rating, 10);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const bookings = await readBookings();
    const booking = bookings.find(
      b => b.rideId === req.params.id && b.passengerId === req.user.id
    );

    if (!booking) {
      return res.status(400).json({ error: 'You must book this ride before rating it' });
    }

    if (booking.rating) {
      return res.status(400).json({ error: 'You have already rated this ride' });
    }

    const rides = (await readRides()).map(ride => ensureRideDefaults(ride));
    const rideIndex = rides.findIndex(r => r.id === req.params.id);

    if (rideIndex === -1) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (rides[rideIndex].driverId === req.user.id) {
      return res.status(400).json({ error: 'Drivers cannot rate their own rides' });
    }

    if (getRideDateValue(rides[rideIndex]) > Date.now()) {
      return res.status(400).json({ error: 'You can rate a ride only after it happens' });
    }

    const ratingEntry = {
      id: uuidv4(),
      passengerId: req.user.id,
      rating: ratingValue,
      comment: comment ? comment.trim() : '',
      createdAt: new Date().toISOString()
    };

    rides[rideIndex].ratings.push(ratingEntry);
    rides[rideIndex].ratingCount = rides[rideIndex].ratings.length;
    const ratingSum = rides[rideIndex].ratings.reduce((sum, r) => sum + r.rating, 0);
    rides[rideIndex].averageRating = parseFloat((ratingSum / rides[rideIndex].ratingCount).toFixed(2));

    booking.rating = ratingEntry;

    await writeBookings(bookings);
    await writeRides(rides);

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: ratingEntry,
      averageRating: rides[rideIndex].averageRating,
      ratingCount: rides[rideIndex].ratingCount
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
initDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

