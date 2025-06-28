const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/log', async (req, res) => {
  try {
    const { stack, level, package, message = "received string, expected bool" } = req.body;

    const Stack = ["backend", "frontend"];
    const levels = ["debug", "info", "warn", "error", "fatal"];
    const packages = [
      "cache", "controller", "service", "middleware", "routes", "utils", "auth", "db", "config", "hook",
      "page", "state", "style", "component", "api", "server", "client", "common", "hooks", "pages",
      "styles", "components", "cron_job", "domain"
    ];

    if (!Stack.includes(stack)) {
      return res.status(400).json({ message: "Invalid stack" });
    }

    if (!levels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    if (!packages.includes(package)) {
      return res.status(400).json({ message: "Invalid package" });
    }

    const api = "http://20.244.56.144/evalutaion-service/logs";
    const bearerToken = "YOUR_SECRET_BEARER_TOKEN"; // replace this with the actual token

    const body = {
      stack,
      level,
      package,
      message
    };

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjUwMWE0NDU4QHB2cHNpdC5hYy5pbiIsImV4cCI6MTc1MTA4OTEyMywiaWF0IjoxNzUxMDg4MjIzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmM2YjVlZDctYTlmOS00N2RjLTg5YTUtZGQ4ZWMyY2MxZGYxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2h5YW0gdmVua2F0YSByYW1hIGtyaXNobmEgZHViYSIsInN1YiI6IjcyNmFlMjc0LTg3YTUtNGU1Yy1iMTA0LWIwNzg5Y2NmYzk4ZiJ9LCJlbWFpbCI6IjIyNTAxYTQ0NThAcHZwc2l0LmFjLmluIiwibmFtZSI6InNoeWFtIHZlbmthdGEgcmFtYSBrcmlzaG5hIGR1YmEiLCJyb2xsTm8iOiIyMjUwMWE0NDU4IiwiYWNjZXNzQ29kZSI6ImVIV056dCIsImNsaWVudElEIjoiNzI2YWUyNzQtODdhNS00ZTVjLWIxMDQtYjA3ODljY2ZjOThmIiwiY2xpZW50U2VjcmV0Ijoibmt4bXhOc0N2cnJFQkR2USJ9.HODaf5LKDXjcV5LcD7TbPihlR9jQqsR0Gk6LO-vspYQ`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error('Error in /log route:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = app;
