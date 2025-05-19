import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { fetchAverageRating } from '../services/supabaseClient';

const HomePage = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const loadAverageRating = async () => {
      const avgRating = await fetchAverageRating();
      setAverageRating(avgRating);
      setLoading(false);
    };

    loadAverageRating();
  }, []);

  useEffect(() => {
    fetch('http://localhost:5050/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const response = await fetch('http://localhost:5050/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    });
    const createdTask = await response.json();
    setTasks([...tasks, createdTask]);
    setNewTask("");
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Stay organized!</h1>
          <h5>To Do List App</h5><br/>
          <Link to="/register" className="cta-button">
            <strong>Register Now</strong>
          </Link>
        </div>
        <img
          src="/assets/task-manager.png"
          alt="Hero"
          className="hero-image"
          style={{ width: "25%", justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
        />
      </header>

      {/* Tasks Section */}
      <section className="tasks-section">
        <h2>Your Tasks</h2>
        <div className="add-task-form">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="Enter new task..." 
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul className="list-group">
          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            tasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                {task.title}
                <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {task.completed ? 'Done' : 'Pending'}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our App?</h2>
        <br/>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-list-alt"></i>
            <h3>Organize Objectives</h3>
            <p>Create, edit, and manage objectives effortlessly.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Set Deadlines</h3>
            <p>Never miss a task with deadlines and reminders.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-tags"></i>
            <h3>Group by Category</h3>
            <p>Easily group and filter objectives by category or deadline.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p><em>This app transformed how I manage my work and personal tasks. I feel more productive than ever!</em></p>
            <strong>- Alex from Florida, USA</strong>
          </div>
          <div className="testimonial-card">
            <p><em>The grouping and deadline features are game-changers. Highly recommend it!</em></p>
            <strong>- Greta from Washington D.C., USA</strong>
          </div>
          <div className="testimonial-card">
            <p><em>I love how it is intuitive and easy to use. It made my daily life so much simpler.</em></p>
            <strong>- Michael from New York, USA</strong>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="cta-section">
        <div className="rating-display">
          {loading ? (
            <p>Loading average rating...</p>
          ) : (
            <>
              <h2>Average Rating: {averageRating.toFixed(1)} / 5</h2>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={
                      i < Math.round(averageRating)
                        ? 'fas fa-star filled'
                        : 'far fa-star'
                    }
                  ></i>
                ))}
              </div>
            </>
          )}
        </div>
        <br/><br/>
        <Link to="/register" className="cta-button">
          Get Started for Free
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
