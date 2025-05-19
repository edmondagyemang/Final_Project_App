const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.send('API is working!');
});

let tasks = [
    { id: 1, title: 'Learn Supabase', completed: false },
    { id: 2, title: 'Finish Final Project', completed: true }
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }
    const newTask = { id: tasks.length + 1, title, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const task = tasks.find(t => t.id == id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id != id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
});

app.listen(PORT, 'localhost', () => 
    console.log(`✅ Backend API running on http://localhost:${PORT}`)
);

app.get('/status', (req, res) => res.send('OK'));
// Version 1.0
// TODO: Integrate with real database
