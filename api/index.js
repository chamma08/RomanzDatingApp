const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require('dotenv').config();

const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;
const cors = require("cors");

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors( {
  origin: 'https://romanz-dating-app.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
} 
));

require('dotenv').config();

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN
};


//const serviceAccount = require("C:/Users/User/Desktop/RomanzDatingApp/api/key.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Chat = require("./models/message");

const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: 'mern-blog-19722.appspot.com',
});


const bucket = admin.storage().bucket();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/profile-pictures');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});



mongoose
  .connect("mongodb+srv://romanzu:romanzu@cluster0.hrd19zs.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("Server is running on 3000");
});

app.put('/users/:userId/profile-images', upload.single('profilePicture'), async (req, res) => {
  console.log('File:', req.file);  // Log the file object
  if (!req.file) {
    return res.status(400).send({ success: false, message: 'No file uploaded' });
  }

  const { userId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ success: false, message: 'No file uploaded' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    const destination = `profilePictures/${userId}${path.extname(file.originalname)}`;

    const uploadedFile = await bucket.upload(file.path, {
      destination,
      metadata: {
        contentType: file.mimetype,
      },
    });

    const profilePictureUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

    user.profilePicture = profilePictureUrl;
    await user.save();

    fs.unlinkSync(file.path);

    res.send({ success: true, message: 'Profile image updated', profilePictureUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

//endpoint to register a user to the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password,age } = req.body;

    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password,
      age,
    });

    //generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send the verification email to the registered user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res
      .status(200)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});
const sendVerificationEmail = async (email, verificationToken) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "matheeshacham8@gmail.com",
      pass: "zsvp izfh fgwo ldes",
    },
  });

  const mailOptions = {
    from: "RomanzU Dating",
    to: email,
    subject: "Email verification",
    text: `Please click on the following link to verify your email : http://192.168.8.189:3000/verify/${verificationToken}`,
  };

  //send the mail
  try {
    await transpoter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending the verification email");
  }
};

//verify the user
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified Sucesfully" });
  } catch (error) {
    console.log("errror", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check in password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalide password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "login failed" });
  }
});

//endpoint to change or select the gender for a particular user profile
app.put("/users/:userId/gender", async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User gender updated Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user gender", error });
  }
});


//endpoint to update the user description
app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        description: description,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User description updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user description" });
  }
});

/* // Endpoint to upload a profile picture
app.post('/users/:userId/profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile picture path in the database
    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error });
  }
}); */

//endpoint to update the user name
app.put("/users/:userId/name", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User name updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user name" });
  }
});
//endpoint to update the user email
app.put("/users/:userId/email", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        email: email,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User email updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user email" });
  }
});

//fetch users data
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the user details" });
  }
});

//end point to add a turnon for a user in the backend
app.put("/users/:userId/turn-ons/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Turn on updated succesfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding the turn on" });
  }
});

//endpoint to remove a particular turn on for the user
app.put("/users/:userId/turn-ons/remove", async (req, res) => {
  try {
    const { userId } = req.params;

    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Turn on removed succesfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error removing turn on" });
  }
});

//end point to add a lookingFor  for a user in the backend
app.put("/users/:userId/looking-for", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    return res
      .status(200)
      .json({ message: "Looking for updated succesfully".user });
  } catch (error) {
    res.status(500).json({ message: "Error updating looking for", error });
  }
});

//endpoint to remove looking for in the backend
app.put("/users/:userId/looking-for/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    return res
      .status(200)
      .json({ message: "Looking for updated succesfully".user });
  } catch (error) {
    res.status(500).json({ message: "Error removing looking for", error });
  }
});






//endpoint to fetch all the profiles for a particular user
app.get("/profiles", async (req, res) => {
  const { userId, gender, turnOns, lookingFor,age } = req.query;

  try {
    let filter = { gender: gender === "male" ? "female" : "male" }; // For gender filtering

    // Add filtering based on turnOns and lookingFor arrays
    if (turnOns) {
      filter.turnOns = { $in: turnOns };
    }

    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }

    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    // Extract IDs of friends
    const friendIds = currentUser.matches.map((friend) => friend._id);

    // Extract IDs of crushes
    const crushIds = currentUser.crushes.map((crush) => crush._id);

    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profiles", error });
  }
});

app.post("/send-like", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { recievedLikes: currentUserId },
    });
    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { crushes: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//ednpoint to get the details of the received Likes
app.get("/received-likes/:userId/details", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch details of users who liked the current user
    const receivedLikesDetails = [];
    for (const likedUserId of user.recievedLikes) {
      const likedUser = await User.findById(likedUserId);
      if (likedUser) {
        receivedLikesDetails.push(likedUser);
      }
    }

    res.status(200).json({ receivedLikesDetails });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching received likes details",
      error: error.message,
    });
  }
});

//endpoint to create a match betweeen two people
app.post("/create-match", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //update the selected user's crushes array and the matches array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { matches: currentUserId },
      $pull: { crushes: currentUserId },
    });

    //update the current user's matches array recievedlikes array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { matches: selectedUserId },
      $pull: { recievedLikes: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Error creating a match", error });
  }
});

//endpoint to get all the matches of the particular user
app.get("/users/:userId/matches", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchIds = user.matches;

    const matches = await User.find({ _id: { $in: matchIds } });

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the matches", error });
  }
});

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      console.log("data", data);

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      // Emit the message to the receiver
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error handling the messages:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(8000, () => {
  console.log("Socket.IO server running on port 8000");
});

app.get("/messages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    console.log(senderId);
    console.log(receiverId);

    const messages = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error in getting messages", error });
  }
});


//endpoint to delete the messages;

app.post("/delete",async(req,res) => {
    try{
        const {messages} = req.body;

        if(!Array.isArray(messages) || messages.length == 0){
            return res.status(400).json({message:"Invalid request body"})
        };

        for(const messageId of messages){
            await Chat.findByIdAndDelete(messageId);
        }

        res.status(200).json({message:"Messages delted successfully!"})
    } catch(error){
        res.status(500).json({message:"Internal server error",error})
    }
})