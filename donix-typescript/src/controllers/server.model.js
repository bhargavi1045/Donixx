/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const http = require("http");
const { Server } = require("socket.io");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const { HfInference } = require("@huggingface/inference");





const app = express();
app.use(express.json());
app.use(bodyParser.json());


const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


const secret_key = "My Secret"; 
const otpStore = {}; // Temporary in-memory OTP store

// Import models
const User = require("./models/user");
const Admin = require("./models/admin");
const Hospital = require("./models/hospital");
const Chat = require("./models/chat");
const Webinar = require("./models/Webinar");
const Article = require("./models/article");
const Organ = require("./models/organ");
const Appointment = require("./models/appointment");
const OrganRequest = require("./models/OrganRequest");


app.use(
  cors({
    origin: "http://localhost:4000", // Allow requests from the frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies if needed
  })
);

////////////////////////////////////
// Connect to MongoDB using Mongoose
////////////////////////////////////
mongoose
  .connect("mongodb+srv://amanmug23cs:T2MeQhO7LuKe81v5@cluster0.q7qv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB using Mongoose"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));


/////////////////////////////
// Nodemailer configuration
////////////////////////////

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hellocollege143@gmail.com",
    pass: "bnnv adcu kdoq bhvp",
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

///////////////////////
// Route to send emails
///////////////////////
app.post("/sendMail", async (req, res) => {
  try {
    const { msg, userEmail } = req.body;
    if (!msg || !userEmail) {
      return res.status(400).json({ error: "Message and user email are required" });
    }

    const mailOptions = {
      from: userEmail,
      to: ["hellocollege143@gmail.com", userEmail], 
      subject: "Your Mail",
      text: msg,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully to both addresses" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});








//////////////////////
////Get details///////
/////////////////////
  app.post("/getDetails", async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
      }
  
      // Verify the token and extract payload
      const decoded = jwt.verify(token, secret_key);
  
      const { id, role } = decoded; // Extract user details from payload
  
      // Fetch user details from the database based on role
      let userDetails;
      if (role === "user") {
        userDetails = await User.findById(id);
      } else if (role === "admin") {
        userDetails = await Admin.findById(id); 
      } else if (role === "hospital") {
        userDetails = await Hospital.findById(id);
      } else {
        return res.status(400).json({ error: "Invalid role specified in the token" });
      }
  
      if (!userDetails) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Respond with user details
      res.json({ success: true, user: userDetails });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      res.status(500).json({ error: "Failed to retrieve user details", details: error.message });
    }
  });


/////////////////////////////
////Hospital Registration //
////////////////////////////

app.post("/hospitalRegistration", async (req, res) => {
    try {
        console.log("request comes");
        const {
            hospitalName,
            city,
            state,
            country,
            pincode,
            contactNumber,
            email,
            website,
            authorisedPersonName,
            authorisedPersonDesignation,
            password,
        } = req.body;

        if (!hospitalName || !city || !state || !country || !pincode || !contactNumber || !email || !authorisedPersonName || !authorisedPersonDesignation || !password) {
            return res.status(400).json({ error: "All fields are required, including a password" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            return res.status(400).json({ error: "Hospital already registered with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const hospital = new Hospital({
            hospitalName,
            city,
            state,
            country,
            pincode,
            contactNumber,
            email,
            website,
            authorisedPersonName,
            authorisedPersonDesignation,
            password: hashedPassword,
            createdAt: new Date(),
            isVerified: false
        });

        await hospital.save();

        res.json({
            success: true,
            message: "Hospital registration successful",
            hospital: {
                hospitalName,
                city,
                state,
                country,
                pincode,
                contactNumber,
                email,
                website,
                authorisedPersonName,
                authorisedPersonDesignation,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to register hospital", details: error.message });
    }
});


///////////////////
///Get All Hospital
///////////////////

app.get("/allHospitals", async (req, res) => {
    try {
        // Fetch all hospitals from the Hospital collection
        const hospitals = await Hospital.find({isVerified:true}); 

        return res.status(200).json(hospitals);
    } catch (error) {
        return res.status(500).json({
            message: "An error has occurred. Try again after some time.",
            details: error.message,
        });
    }
});


////////////////////////
//Chat appliaction/////
////////////////////////

const users = {}; // To track online users

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Emit a welcome message to the client
  socket.emit("welcome", { message: "Welcome to the chat server!", socketId: socket.id });

  // Register user with their ID
  socket.on("joined-chat", (userId) => {
    users[userId] = { socketId: socket.id, online: true }; 
    console.log(`User joined: ${userId} -> ${socket.id}`);

     // Notify all clients about the updated user list
     io.emit("update-user-status", { userId, online: true });
    });
  


  // Handle sending a message
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      // Save the message to the database
      const chatMessage = new Chat({ sender, receiver, message });
      await chatMessage.save();

      // Check if the receiver is online
      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        // Emit the full message object to the receiver
        io.to(receiverSocketId).emit("receiveMessage", chatMessage);
      }
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  socket.on("receiveMessage", (data) => {
    if (data.sender === selectedUser || data.receiver === selectedUser) {
      setMessages((prev) => {
        // Check if the message already exists
        const isDuplicate = prev.some(
          (msg) => msg._id === data._id // Assuming each message has a unique `_id`
        );
        if (!isDuplicate) {
          return [...prev, data];
        }
        return prev;
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const user = Object.keys(users).find((key) => users[key] === socket.id);
    if (user) {
      delete users[user]; // Remove the user from the online users list
      io.emit("users", Object.keys(users)); // Notify all clients of the updated user list
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});



// API to send a message
app.post("/api/users/message-send", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Sender, receiver, and message are required" });
    }

    const chatMessage = new Chat({ sender, receiver, message });
    await chatMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully", chatMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message", details: error.message });
  }
});

// API to fetch chat history
app.get("/api/users/chat-history", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const chatHistory = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history", details: error.message });
  }
});

// API to fetch all users
app.get("/api/users/get-all", async (req, res) => {
  try {
    const users = await User.find(); // Replace with your user model
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});





///////////////////////////
/////////////Admin Add////
//////////////////////////

app.post("/adminRegistration", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Email, password, and fullName are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword, 
      fullName,
      createdAt: new Date(),
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: { email, fullName }, 
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});



///////////////////////////////////////
/////Get Unverified Hospitals////////
//////////////////////////////////////

app.get("/admin/hospitals", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    const decoded = jwt.verify(token, secret_key);
    const { role } = decoded;

    if (role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required" });
    }

    const unverifiedHospitals = await Hospital.find({ isVerified: false });

    if (unverifiedHospitals.length === 0) {
      return res.status(404).json({ message: "No unverified hospitals found" });
    }

    res.status(200).json({ success: true, hospitals: unverifiedHospitals });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "An error occurred. Try again later.", details: error.message });
  }
});



///////////////////////////////////////////////
////////Verify a Hospital ////////////////////
/////////////////////////////////////////////

app.put("/admin/hospital/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    const decoded = jwt.verify(token, secret_key);
    const { role } = decoded;

    if (role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required" });
    }

    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: "Hospital ID is required" });
    }

    const result = await Hospital.findByIdAndUpdate(
      hospitalId,
      { isVerified: true },
      { new: true } 
    );

    if (!result) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json({
      success: true,
      message: "Hospital successfully verified",
      hospital: result, 
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "An error occurred. Try again later.", details: error.message });
  }
});


///////////////////////////////
////ADD WEBINAR////////////////
//////////////////////////////

app.post("/addWebinar", async (req, res) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
          return res.status(401).json({ message: "Authorization token is required." });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, secret_key);

      const userId = decoded.id; 

      const { title, date, description, link } = req.body;

      if (!title || !date || !description || !link) {
          return res.status(400).json({ message: "All fields are required." });
      }

      const newWebinar = new Webinar({
          title,
          date,
          description,
          link,
          addedBy: new mongoose.Types.ObjectId(userId), 
      });

      await newWebinar.save();

      res.status(201).json({ message: "Webinar added successfully.", webinar: newWebinar });
  } catch (error) {
      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid or expired token." });
      }
      res.status(500).json({ message: "Failed to add webinar. Try again later.", details: error.message });
  }
});




/////////////////////////////////////
///Get list of unverified webinar////
/////////////////////////////////////
app.get("/admin/webinar", async (req, res) => {
  try {
      // Check if the Authorization header exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return res.status(401).json({ error: "Authorization token is required" });
      }

      const token = authHeader.split(" ")[1] || authHeader;

      const decoded = jwt.verify(token, secret_key);
      const { role } = decoded;

      if (role !== "admin") {
          return res.status(403).json({ error: "Access denied. Admin role required" });
      }

      const unverifiedWebinars= await Webinar.find({ isVerified: false });

      if (unverifiedWebinars.length === 0) {
          return res.status(404).json({ message: "No unverified webinars found" });
      }

      res.status(200).json({ success: true, hospitals: unverifiedWebinars });
  } catch (error) {
      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ error: "Invalid or expired token" });
      }
      res.status(500).json({ error: "An error occurred. Try again later.", details: error.message });
  }
});




///////////////////////////////////////
///Approve webinar   /////////////////
//////////////////////////////////////
app.put("/admin/webinar/verify", async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return res.status(401).json({ error: "Authorization token is required" });
      }

      const token = authHeader.split(" ")[1] || authHeader;

      const decoded = jwt.verify(token, secret_key);
      const { role } = decoded;

      if (role !== "admin") {
          return res.status(403).json({ error: "Access denied. Admin role required" });
      }

      const { webinarId } = req.query;

      const result = await Webinar .updateOne(
          { _id: new ObjectId(webinarId) },
          { $set: { isVerified: true } }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Webinar not found" });
      }

      res.status(200).json({
          success: true,
          message: "Webinar successfully verified",
      });
  } catch (error) {
      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ error: "Invalid or expired token" });
      }
      res.status(500).json({ error: "An error occurred. Try again later.", details: error.message });
  }
});


//////////////////////////////////
//Show all verified webinar///////
/////////////////////////////////

app.get("/getVerifiedWebinar",async(req,res)=>{
  try{


    const verifiedWebinar=await Webinar.find({isVerified:true});
    return res.status(200).json({message:"list of verified webinars",verifiedWebinar});

  }catch(error){
    return res.status(500).json({message:"failed to fetch verified webinar"});
  }
})



//////////////////////////////////
///Gen ai activity of user //////
/////////////////////////////////

app.post("/predict", async (req, res) => {
  try {
    const dynamic = new Function("modulePath", "return import(modulePath)");
    const { Client } = await dynamic("@gradio/client");

    const client = await Client.connect("akash-123-nitp/post-recommendation");

    const { heart_rate, bp, oxygen_saturation, symptoms, session_id } = req.body;

    if (!heart_rate || !bp || !oxygen_saturation || !symptoms) {
      return res.status(400).json({ error: "All fields are required: heart_rate, bp, oxygen_saturation, symptoms." });
    }


    let sessionId = session_id || new ObjectId().toString();

    try {
      // Replace `0` with the correct fn_index for the function
      const result = await client.predict(0, [
        heart_rate,
        bp,
        oxygen_saturation,
        symptoms,
        sessionId,
      ]);

      return res.json({ session_id: sessionId, response: result.data });
    } catch (error) {
      console.error("Error in AI prediction:", error.message);
      return res.status(500).json({ error: "AI response failed", details: error.message });
    }
  } catch (error) {
    console.error("Error connecting to AI client:", error.message);
    return res.status(500).json({ error: "Failed to connect to AI client", details: error.message });
  }
});

app.post("/lambda", async (req, res) => {
  try {
    const dynamic = new Function("modulePath", "return import(modulePath)");
    const { Client } = await dynamic("@gradio/client");

    const client = await Client.connect("akash-123-nitp/post-recommendation");

    try {
      const result = await client.predict(0, [], "/lambda");

      return res.status(200).json({ response: result.data });
    } catch (error) {
      console.error("Error in AI prediction:", error.message);
      return res.status(500).json({ error: "AI response failed", details: error.message });
    }
  } catch (error) {
    console.error("Error connecting to AI client:", error.message);
    return res.status(500).json({ error: "Failed to connect to AI client", details: error.message });
  }
});

app.post("/process_feedback", async (req, res) => {
  try {
    // Dynamically import the @gradio/client package
    const dynamic = new Function("modulePath", "return import(modulePath)");
    const { Client } = await dynamic("@gradio/client");

    // Connect to the Gradio client
    const client = await Client.connect("akash-123-nitp/post-recommendation");

    // Extract input data from the request body
    const { heart_rate, bp, oxygen_saturation, symptoms, feedback } = req.body;

    // Validate input
    if (!heart_rate || !bp || !oxygen_saturation || !symptoms || !feedback) {
      return res.status(400).json({
        error: "All fields are required: heart_rate, bp, oxygen_saturation, symptoms, feedback.",
      });
    }

    try {
      const result = await client.predict(
        0, 
        [heart_rate, bp, oxygen_saturation, symptoms, feedback],
        "/process_feedback"
      );

      return res.status(200).json({ response: result.data });
    } catch (error) {
      console.error("Error in AI prediction:", error.message);
      return res.status(500).json({ error: "AI response failed", details: error.message });
    }
  } catch (error) {
    console.error("Error connecting to AI client:", error.message);
    return res.status(500).json({ error: "Failed to connect to AI client", details: error.message });
  }
});

app.post("/predicts", async (req, res) => {
  try {
    const dynamic = new Function("modulePath", "return import(modulePath)");
    const { Client } = await dynamic("@gradio/client");

    const client = await Client.connect("akash-123-nitp/Donix");

    const { message, language = "English", session_id = "default_session" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!["English", "Hindi", "Sanskrit"].includes(language)) {
      return res.status(400).json({ error: "Invalid language. Supported languages are English, Hindi, and Sanskrit." });
    }

    let sessionId = session_id || new ObjectId().toString();

    try {
      const result = await client.predict(0, [message, language, sessionId]);

      return res.status(200).json({ session_id: sessionId, response: result.data });
    } catch (error) {
      console.error("Error in AI prediction:", error.message);
      return res.status(500).json({ error: "AI response failed. Please try again later.", details: error.message });
    }
  } catch (error) {
    console.error("Error initializing AI client:", error.message);
    return res.status(500).json({ error: "Failed to initialize AI client. Please try again later.", details: error.message });
  }
});



///////////////////////////////////
////ADD BLOGS ////////////////////
//////////////////////////////////

app.post("/addBlog", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 

    const userId = decoded.id; 

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    const { title, description, imageUrl, donationLink } = req.body;

    const newArticle = new Article({
      title,
      description,
      imageUrl,
      isSensitive: false, 
      donationLink,
      addedBy : new mongoose.Types.ObjectId(userId),  
      createdAt: Date.now() ,
    });

    await newArticle.save();
    res.status(201).json({ message: "Blog added successfully!", article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Error adding blog.", error });
  }
});


//////////////////////////////////////////////////////
////Get user Blog ///////////////////////////////////
/////////////////////////////////////////////////////

app.get("/getUserBlogs", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 

    const userId = decoded.id;

    const userBlogs = await Article.find({ addedBy: userId });

    // if (!userBlogs.length) {
    //   return res.status(404).json({ message: "No blogs found for this user." });
    // }

    res.status(200).json({ message: "Blogs retrieved successfully.", blogs: userBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs.", error });
  }
});


///////////////////////////////////////////////////////
////Get all blogs ////////////////////////////////////
//////////////////////////////////////////////////////
app.get("/getAllBlogs", async (req, res) => {
  try {
    // Query the database for articles with isSensitive set to false
    const articles = await Article.find({ isSensitive: false });

    

    res.status(200).json({ message: "articles retrieved successfully", articles });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URLs", error });
  }
});


//////////////////////////////////////////////////////
//Admin regulate blogs////////////////////////////////
/////////////////////////////////////////////////////
app.get("/getArticles", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 


    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }
[]
    const articles = await Article.find({ isSensitive: false });

    res.status(200).json({ message: "Articles retrieved successfully", articles });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving articles", error });
  }
});


app.put("/updateSensitive", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    const articleId = req.query.id; 

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { isSensitive: true },
      { new: true } 
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found." });
    }

    res.status(200).json({ message: "Article updated successfully!", article: updatedArticle });
  } catch (error) {
    res.status(500).json({ message: "Error updating article.", error });
  }
});


//////////////////////////////////////////////////
///Get Hospital Details //////////////////////////
/////////////////////////////////////////////////

app.get("/getHospitalDetails", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token,secret_key); 

    const hospitalId = decoded.id; 
    const hospitalDetails = await Hospital.findById(hospitalId); 

    if (!hospitalDetails) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    res.status(200).json({ message: "Hospital details retrieved successfully.", hospital: hospitalDetails });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving hospital details.", error });
  }
});



//////////////////////////////////////////////////////
/////Get all admin //////////////////////////////////
////////////////////////////////////////////////////

app.get("/allAdmins", async (req, res) => {
  try {
    const admins = await Admin.find().exec();
    return res.status(200).json({ message: "Admins fetched successfully", admins });
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching admin details.", error });
  }
});


/////////////////////////////////////////////////////
////ADD ORGAN //////////////////////////////////////
////////////////////////////////////////////////////
app.post("/addorgan", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 

    if (decoded.role !== "hospital") {
      return res.status(403).json({ message: "Access denied. Only hospitals can add organs." });
    }

    const hospitalId = decoded.id; 

    const hospital = await Hospital.findById(new mongoose.Types.ObjectId(hospitalId));
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    const { organ, count, price, bloodGroup } = req.body;

    const newOrgan = new Organ({
      hospitalName: hospital.hospitalName, 
      hospitalId: hospitalId,    
      organ,
      count,
      price,
      bloodGroup,
    });

    await newOrgan.save();
    res.status(201).json({ message: "Organ added successfully!", organ: newOrgan });
  } catch (error) {
    res.status(500).json({ message: "Error adding organ.", error });
  }
});


///////////////////////////////////////////////
///Fetch all organ ///////////////////////////
//////////////////////////////////////////////


app.get("/fetchOrgan",async(req,res)=>{

  try{

      const organs =await Organ.find().exec();
      return res.status(200).json({message:"organ fetched successfully",organs});

  }catch(error){
      return res.status(500).json({message:"error in fetching organ details.please try again after some time."})
  }

})




//////////////////////////////////////////////////////
/// Book an appointment /////////////////////////////
////////////////////////////////////////////////////

app.post("/bookAppointment", async (req, res) => {
  try {
    const hospitalId = req.headers.hospitalid; 
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, secret_key); 
    if(!token){
        return  res.status(200).json({message:"token expired or invalid!!!!"})
    }

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required in the headers." });
    }

    const { name, organ, formLink } = req.body;


    if (!name || !organ || !formLink) {
      return res.status(400).json({ message: "Name, organ, and form link are required in the body." });
    }


    const newAppointment = new Appointment({
      name,
      organ,
      formLink,
      hospitalId,
      createdAt: Date.now(), 
      userId:decoded.id
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment.", error });
  }
});


//////////////////////////////////////////////////
//// Get hospital appointment ///////////////////
////////////////////////////////////////////////

app.get("/getHospitalAppointments", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 
    if (decoded.role !== "hospital") {
      return res.status(403).json({ message: "Access denied. Only hospitals can fetch appointments." });
    }
    const hospitalId = decoded.id; 
    const appointments = await Appointment.find({ hospitalId ,isVerified:false});
    // if (!appointments.length) {
    //   return res.status(404).json({ message: "No appointments found for this hospital." });
    // }
    res.status(200).json({ message: "Appointments retrieved successfully.", appointments });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving appointments.", error });
  }
});


app.put("/approveAppointment/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secret_key); 
    if (decoded.role !== "hospital") {
      return res.status(403).json({ message: "Access denied. Only hospitals can approve appointments." });
    }

    const { id } = req.params;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true } 
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const user = await User.findById(updatedAppointment.userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User or email not found." });
    }


    const msg="your organ donation appointment is approved successfully."

    const mailOptions = {
      from: "hellocollege143@gmail.com",
      to: [user.email],
      subject: "Your donix approval mail",
      text: msg,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "Appointment approved successfully, and user notified.", 
      appointment: updatedAppointment, 
      email: user.email 
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving appointment or sending email.", error });
  }
});


//////////////////////////////////////////////
///Get all organ Request ////////////////////
/////////////////////////////////////////////

app.post("/requestOrgan", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key); 
    const { hospitalId, organ } = req.body;

    if (!hospitalId || !organ) {
      return res.status(400).json({ message: "Hospital ID and organ are required." });
    }

    const newRequest = new OrganRequest({
      userId: decoded.id,
      hospitalId,
      organ,
    });

    await newRequest.save();
    res.status(201).json({ message: "Organ request submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error submitting organ request.", error });
  }
});

//////////////////////////////////////////////////
//////All organ details /////////////////////////
////////////////////////////////////////////////
// API to fetch all organ requests and donations with verification status

app.get("/allOrganData", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secret_key);
    const userId = decoded.id;

    const organRequests = await OrganRequest.find({ userId }).populate("userId", "fullName email");

    const organDonations = await Appointment.find({ userId }).populate("userId", "fullName email");

    const categorizedData = {
      organRequests: {
        pending: organRequests.filter((request) => !request.isVerified),
        approved: organRequests.filter((request) => request.isVerified),
      },
      organDonations: {
        pending: organDonations.filter((donation) => !donation.isVerified),
        approved: organDonations.filter((donation) => donation.isVerified),
      },
    };

    res.status(200).json({
      message: "Organ data retrieved successfully.",
      data: categorizedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organ data.", error });
  }
});




//////route for hospital to get all request organ /////


app.get("/getAllRequestedOrgan",async(req,res)=>{
  try{


    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(400).json({message:"access denied no token provided."});

    }



    const decoded=jwt.verify(token,secret_key);
    const hospitalId=decoded.id;
    const requests=await OrganRequest.find({hospitalId:hospitalId,isVerified:false});
    return res.status(200).json({message:"pending request organ retrieved successfully",requests});


  }catch(error){
    return res.status(500).json({message:"some error occured.please try again after some time"});

  }

})



//////approve organ requests

app.put("/approveRequest/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secret_key); 
    if (decoded.role !== "hospital") {
      return res.status(403).json({ message: "Access denied. Only hospitals can approve appointments." });
    }

    const { id } = req.params;

    const updatedRequest = await OrganRequest.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true } 
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Fetch the user's email using userId from the appointment
    const user = await User.findById(updatedRequest.userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User or email not found." });
    }


    const msg="your organ donation request is approved successfully."

    const mailOptions = {
      from: "hellocollege143@gmail.com",
      to: [user.email],
      subject: "Your donix approval mail",
      text: msg,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "request approved successfully, and user notified.", 
      request:updatedRequest, 
      email: user.email 
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving request or sending email.", error });
  }
});



// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});