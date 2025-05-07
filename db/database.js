const mongoose = require('mongoose')

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  family: 4, // Use IPv4, skip trying IPv6
}

// Connect to MongoDB with MongoDB URI fallback
const connectDB = async () => {
  // Ensure MongoDB URI is available, with fallback
  const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb+srv://jabrag08:rbmxb77jPVY9my4j@cluster0.htwvajv.mongodb.net/?retryWrites=true&w=majority'
  console.log('Using MongoDB URI:', MONGO_URI)

  try {
    const conn = await mongoose.connect(MONGO_URI, mongoOptions)
    console.log('✅ MongoDB Connected Successfully!')
    console.log('📦 Database:', conn.connection.name)
    console.log('🔌 Host:', conn.connection.host)
    console.log('🚀 Port:', conn.connection.port)
    return conn
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
    process.exit(1) // Exit process with failure
  }
}

// Connection event handlers setup
const setupConnectionHandlers = () => {
  mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB')
  })

  mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from MongoDB')
  })
}

// Close MongoDB connection
const closeConnection = async () => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed through app termination')
    process.exit(0)
  } catch (err) {
    console.error('Error during MongoDB disconnection:', err)
    process.exit(1)
  }
}

// Initialize database connection
const initDatabase = async () => {
  await connectDB()
  setupConnectionHandlers()

  // Setup termination handler
  process.on('SIGINT', closeConnection)
}

module.exports = {
  connectDB,
  closeConnection,
  initDatabase,
}
