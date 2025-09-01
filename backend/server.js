const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http'); // ✅ Needed for socket.io
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Schemas & Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model('User', userSchema);

const employeeSchema = new mongoose.Schema({
  EmpId: String,
  EmpName: String,
  EmpRole: String,
  EmpDivision: String,
  EmpSection: String,
  EmpGroup: String,
  EmpDesignation: String,
});
const Employee = mongoose.model('Employee', employeeSchema);

const responsibilitySchema = new mongoose.Schema({
  EmpRole: String,
  Division: String,
  Section: String,
  Responsibilities: String,
});
const Responsibility = mongoose.model('Responsibility', responsibilitySchema);

// ✅ Test Route
app.get('/add-user', async (req, res) => {
  const user = new User({ name: 'John Doe', email: 'john@example.com' });
  await user.save();
  res.send('User added!');
});

// ✅ Insert Sample Employees
app.get('/insert-five-employees', async (req, res) => {
  const data = [
    { EmpId: 'E001', EmpName: 'Alice Johnson', EmpRole: 'Admin', EmpDivision: 'HR', EmpSection: 'Recruitment', EmpGroup: 'A1', EmpDesignation: 'Manager' },
    { EmpId: 'E002', EmpName: 'Bob Smith', EmpRole: 'ValueEngineer', EmpDivision: 'Engineering', EmpSection: 'Design', EmpGroup: 'B2', EmpDesignation: 'Engineer' },
    { EmpId: 'E003', EmpName: 'Carol Lee', EmpRole: 'Receiver', EmpDivision: 'Logistics', EmpSection: 'Warehouse', EmpGroup: 'C3', EmpDesignation: 'Supervisor' },
    { EmpId: 'E004', EmpName: 'David Kim', EmpRole: 'Approve', EmpDivision: 'Finance', EmpSection: 'Audit', EmpGroup: 'D4', EmpDesignation: 'Auditor' },
    { EmpId: 'E005', EmpName: 'Ella Brown', EmpRole: 'Admin', EmpDivision: 'Operations', EmpSection: 'Control', EmpGroup: 'A2', EmpDesignation: 'Admin Officer' }
  ];

  await Employee.insertMany(data);
  res.send('5 Employees inserted!');
});

// ✅ Insert Responsibilities
app.get('/insert-five-responsibilities', async (req, res) => {
  const data = [
    { EmpRole: 'Admin', Division: 'HR', Section: 'Recruitment', Responsibilities: 'https://example.com/admin-responsibility' },
    { EmpRole: 'ValueEngineer', Division: 'Engineering', Section: 'Design', Responsibilities: 'https://example.com/value-engineer-responsibility' },
    { EmpRole: 'Receiver', Division: 'Logistics', Section: 'Warehouse', Responsibilities: 'https://example.com/receiver-responsibility' },
    { EmpRole: 'Approve', Division: 'Finance', Section: 'Audit', Responsibilities: 'https://example.com/approve-responsibility' }
  ];

  await Responsibility.insertMany(data);
  res.send('Responsibilities inserted!');
});

// ✅ Fetch Employees by Role
app.get('/api/employees', async (req, res) => {
  try {
    const { role } = req.query;
    const employees = await Employee.find({ EmpRole: role });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// ✅ Fetch Responsibilities by Role
app.get('/api/responsibilities', async (req, res) => {
  try {
    const { role } = req.query;
    const responsibilities = await Responsibility.find({ EmpRole: role });
    res.json(responsibilities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch responsibilities' });
  }
});

// ✅ Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const users = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'valueengineer', password: 've123', role: 'ValueEngineer' },
    { username: 'receiver', password: 'receiver123', role: 'Receiver' },
    { username: 'approver', password: 'approver123', role: 'Approve' }
  ];

  const matched = users.find(u => u.username === username && u.password === password);

  if (matched) {
    res.json({ success: true, role: matched.role });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Excel Upload with Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(__dirname, 'excel-backend');
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, 'data.xlsx'); // overwrite with same name
    }
  })
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// ✅ Setup HTTP server & Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ✅ Socket.io Chat Logic
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('💬 Message received:', msg);
    io.emit('chat message', msg); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

// ✅ Start the HTTP+Socket server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
