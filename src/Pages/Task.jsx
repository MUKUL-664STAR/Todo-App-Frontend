import { useState, useEffect } from 'react';
import '../css/Task.css'; // Import CSS file

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', category: '' });
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedPriority, setSelectedPriority] = useState('All Priorities');

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, selectedCategory, selectedPriority]);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks/AllTask');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(task => task.category === selectedCategory);
        }

        if (selectedPriority !== 'All Priorities') {
            filtered = filtered.filter(task => task.priority === selectedPriority);
        }

        setFilteredTasks(filtered);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleAddTask = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks/CreateTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            fetchTasks();
            setNewTask({ title: '', description: '', priority: '', category: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateTask = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${selectedTaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            fetchTasks();
            setSelectedTaskId(null); // Reset selected task ID
            setNewTask({ title: '', description: '', priority: '', category: '' }); // Reset form
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectTask = (taskId) => {
        const selectedTask = tasks.find(task => task._id === taskId);
        setNewTask(selectedTask);
        setSelectedTaskId(taskId);
    };

    return (
        <div className="task-page">
            <h2 className="page-header">Task Page</h2>
            <div className="task-form">
                <h3>{selectedTaskId ? 'Update Task' : 'Add New Task'}</h3>
                <input type="text" name="title" value={newTask.title} placeholder="Task Title" onChange={handleChange} />
                <input type="text" name="description" value={newTask.description} placeholder="Description" onChange={handleChange} />
                <select name="priority" value={newTask.priority} onChange={handleChange}>
                    <option value="">Select Priority</option>
                    {[...new Set(tasks.map(task => task.priority))].map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                    ))}
                </select>
                <input type="text" name="category" value={newTask.category} placeholder="Category" onChange={handleChange} />
                <button className="submit-button" onClick={selectedTaskId ? handleUpdateTask : handleAddTask}>{selectedTaskId ? 'Update Task' : 'Add Task'}</button>
            </div>
            <div className="filters">
                <div className="filter">
                    <label htmlFor="category">Category:</label>
                    <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        <option value="All Categories">All Categories</option>
                        {[...new Set(tasks.map(task => task.category))].map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="filter">
                    <label htmlFor="priority">Priority:</label>
                    <select id="priority" value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)}>
                        <option value="All Priorities">All Priorities</option>
                        {[...new Set(tasks.map(task => task.priority))].map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="task-table">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.priority}</td>
                                <td>{task.category}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                    <button className="update-button" onClick={() => handleSelectTask(task._id)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default TaskPage;
