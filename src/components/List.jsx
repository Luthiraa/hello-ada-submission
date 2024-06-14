import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';

function List() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [showAddTask, setShowAddTask] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data.tasks);
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    let response;
    if (updateIndex !== null) {
      const task = tasks[updateIndex];
      task.title = title;
      task.description = description;
      task.priority = priority;
      await axios.put(`http://localhost:5000/tasks/${task.id}`, task);
    } else {
      response = await axios.post('http://localhost:5000/tasks', { title, description, priority });
      const newTask = response.data.task;
      setTasks([...tasks, newTask]);
    }
    response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data.tasks);
    setTitle('');
    setDescription('');
    setPriority('Low');
    setShowAddTask(false);
    setUpdateIndex(null);
  };

  const deleteTask = async (index) => {
    const task = tasks[index];
    await axios.delete(`http://localhost:5000/tasks/${task.id}`);
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data.tasks);
  };

  const updateTask = (index) => {
    setTitle(tasks[index].title);
    setDescription(tasks[index].description);
    setPriority(tasks[index].priority);
    setShowAddTask(true);
    setUpdateIndex(index);
  };

  return (
    <div className="list">
      <h1>Task List</h1>
      <button onClick={() => setShowAddTask(!showAddTask)}>
        {showAddTask ? (updateIndex !== null ? 'Update Task' : 'Cancel') : 'Add Task'}
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showAddTask && (
            <tr>
              <td><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /></td>
              <td><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" /></td>
              <td>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </td>
              <td><button onClick={addTask}>{updateIndex !== null ? 'Update Task' : 'Submit Task'}</button></td>
            </tr>
          )}
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.priority}</td>
              <td>
                <button onClick={() => updateTask(index)}>Update</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default List;