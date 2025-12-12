# CarPool - Car Pooling Website

A modern, full-stack car pooling website that connects drivers and passengers to share rides and save money.

## Features

- **User Authentication**: Secure registration and login system
- **Driver Profiles**: Dedicated profile page with editable contact info and live stats (rides posted, bookings made, driver rating)
- **Post Rides**: Drivers can post available rides with full details (origin, destination, date, time, seats, price, car info)
- **Smarter Ride Search**: Filter by date, rating, price caps, and sort results by date, price, or rating
- **Ride Ratings & Reviews**: Passengers can rate past rides (1–5 stars) and leave comments; ratings are shown across the app
- **Book Rides**: Passengers can book available seats on rides
- **My Rides & My Bookings**: Drivers and passengers get tailored dashboards with rating insights and management actions
- **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Modern CSS with responsive design

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- File-based JSON storage (easily replaceable with a database)

## Installation

1. **Install all dependencies** (from root directory):
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

## Running the Application

### Quick Start (Windows)

**Option 1: Use the batch file (Easiest)**
```bash
start.bat
```
This will open two separate command windows - one for the server and one for the client.

**Option 2: Use PowerShell script**
```powershell
.\start.ps1
```

**Option 3: Manual start**
Open two separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Frontend Client:**
```bash
cd client
npm start
```
Client will run on `http://localhost:3000`

### Development Mode (Cross-platform)

From the root directory:
```bash
npm run dev
```
Note: This requires `concurrently` package and may need script adjustments for Windows PowerShell.

### Access the Application

Once both servers are running:
- **Frontend**: Open your browser and go to `http://localhost:3000`
- **Backend API**: Available at `http://localhost:5000`

## Usage

1. **Register/Login**: Create an account or login to access all features
2. **Post a Ride**: As a driver, post your ride details to share with others
3. **Search Rides**: Browse available rides or search by location and date
4. **Book a Ride**: Select a ride and book the number of seats you need
5. **Manage**: View your posted rides and bookings in the respective sections

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/profile` - Get profile with stats (protected)
- `PUT /api/profile` - Update profile info (protected)

### Rides
- `POST /api/rides` - Create a new ride (protected)
- `GET /api/rides` - Get all rides (filters: origin, destination, date, minRating, maxPrice; sort by date/price/rating)
- `GET /api/rides/:id` - Get ride by ID
- `GET /api/rides/driver/my-rides` - Get current user's rides (protected)
- `POST /api/rides/:id/rate` - Submit a rating/comment for a completed ride (protected)

### Bookings
- `POST /api/bookings` - Book a ride (protected)
- `GET /api/bookings/my-bookings` - Get current user's bookings (protected)
- `DELETE /api/bookings/:id` - Cancel a booking (protected)

## Data Storage

The application currently uses JSON files for data storage:
- `server/data/users.json` - User data
- `server/data/rides.json` - Ride data
- `server/data/bookings.json` - Booking data

These files are automatically created on first run. For production, consider migrating to a proper database (MongoDB, PostgreSQL, etc.).

## Environment Variables

Create a `.env` file in the `server` directory (optional):
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

## Project Structure

```
car-pooling-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/              # JSON data files
│   ├── index.js           # Server entry point
│   └── package.json
└── package.json           # Root package.json
```

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time notifications
- Payment integration
- Email notifications
- Google Maps integration
- Mobile app version

## License

MIT

