const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve complete frontend from backend
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Real-Time Chat Application</title>
    <style>
        body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
        }
        .chat-container {
            width: 400px;
            margin: 60px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
        }
        #messages {
            height: 300px;
            border: 1px solid #cccccc;
            padding: 10px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
        input {
            width: 75%;
            padding: 8px;
        }
        button {
            padding: 8px 12px;
            background-color: #ff5733;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>

<div class="chat-container">
    <h2>CODTECH Chat Application</h2>
    <div id="messages"></div>
    <input type="text" id="msg" placeholder="Type a message">
    <button onclick="sendMessage()">Send</button>
</div>

<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io();

    function sendMessage() {
        let message = document.getElementById("msg").value;
        if (message.trim() !== "") {
            socket.emit("sendMessage", message);
            document.getElementById("msg").value = "";
        }
    }

    socket.on("receiveMessage", (message) => {
        let messages = document.getElementById("messages");
        let p = document.createElement("p");
        p.innerText = message;
        messages.appendChild(p);
        messages.scrollTop = messages.scrollHeight;
    });
</script>

</body>
</html>
    `);
});

// Socket.io real-time communication
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start server
http.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
