import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, LinearProgress, Checkbox, IconButton
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const statusOptions = ["active", "paused", "completed"];
const BASE_URL = process.env.REACT_APP_BASE_URL;
const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", tech_stack: "", status: "active" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [logs, setLogs] = useState([]);
  const [newLogNote, setNewLogNote] = useState("");
  const [tasks, setTasks] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskProject, setTaskProject] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [tasksByProject, setTasksByProject] = useState({});

  const token = localStorage.getItem("token");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  }, [token]);

  const fetchLogs = async (projectId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/${projectId}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs", err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const fetchTasksForProject = useCallback(async (projectId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
    });
      setTasksByProject(prev => ({ ...prev, [projectId]: res.data }));
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  }, [token]);


  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    projects.forEach(project => {
      fetchTasksForProject(project.id);
    });
  }, [projects, fetchTasksForProject]);


  const handleOpenModal = async (project = null) => {
    setIsEdit(!!project);
    setSelectedProject(project);
    setFormData(project || { title: "", description: "", tech_stack: "", status: "active" });
    setOpenModal(true);
    if (project) {
      await fetchLogs(project.id);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
    setFormData({ title: "", description: "", tech_stack: "", status: "active" });
    setLogs([]);
    setTasks([]);
    setNewLogNote("");
  };

  const handleOpenTaskModal = async (project) => {
    setTaskProject(project);
    setSelectedProject(project);
    await fetchTasks(project.id);
    setOpenTaskModal(true);
  };

    const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
    setTaskProject(null);
    setTasks([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isEdit
      ? `${BASE_URL}/api/projects/${selectedProject.id}`
      : "http://localhost:5000/api/projects";
    const method = isEdit ? "put" : "post";

    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: isEdit ? "Project updated" : "Project created",
        severity: "success",
      });
      handleCloseModal();
      fetchProjects();
    } catch (err) {
      setSnackbar({ open: true, message: "Error saving project", severity: "error" });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Project deleted", severity: "info" });
      fetchProjects();
    } catch (err) {
      console.error("Delete failed", err);
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };
  
  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedProject?.id) {
      console.error("Missing task or project ID");
      return;
    }
    try { await axios.post(`${BASE_URL}/api/projects/${selectedProject.id}/tasks`, {
        tasks: [ { title: newTask } ]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(selectedProject.id); 
      setNewTask("");
    } catch (err) {
      console.error("Error adding task", err.response?.data || err.message);
    }
  };

  const handleToggleTask = async (taskId, isCompleted) => {
    const newStatus = isCompleted ? "todo" : "completed";

    console.log(`Toggling task ${taskId} from ${isCompleted ? "completed" : "todo"} to ${newStatus}`);

    try {
        // Call backend API to update task status
        await axios.put(
        `${BASE_URL}/api/tasks/${taskId}/status`,
        { status: newStatus },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        // Update local state immediately to reflect change in UI
        setTasks((prevTasks) =>
        prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
        )
        );

        console.log("Task status updated locally");
    } catch (err) {
        console.error("Error updating task", err.response?.data || err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${taskId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(selectedProject.id);
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };


  const handleAddLog = async () => {
    try {
      await axios.post(`${BASE_URL}/api/projects/${selectedProject.id}/logs`, {
        note: newLogNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewLogNote("");
      fetchLogs(selectedProject.id);
    } catch (err) {
      console.error("Error adding log", err);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Projects</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()}>
          New Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Tech Stack</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Tasks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              const projectTasks = tasksByProject[project.id] || [];
              const totalTasks = projectTasks.length;
              const completedTasks = projectTasks.filter(task => task.status === "completed").length;
              const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;


              return (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.tech_stack}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="caption">{Math.round(progress)}%</Typography>
                  </TableCell>

                  <TableCell>
                    <Button size="small" onClick={() => handleOpenModal(project)} startIcon={<Edit />}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(project.id)} startIcon={<Delete />}>Delete</Button>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpenTaskModal(project)}>
                      View Tasks
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Project Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>{isEdit ? "Edit Project" : "New Project"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="title" label="Project Title" fullWidth value={formData.title} onChange={handleChange} />
          <TextField margin="dense" name="description" label="Description" fullWidth multiline rows={3} value={formData.description} onChange={handleChange} />
          <TextField margin="dense" name="tech_stack" label="Tech Stack" fullWidth value={formData.tech_stack} onChange={handleChange} />
          <TextField select margin="dense" name="status" label="Status" fullWidth value={formData.status} onChange={handleChange}>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
            ))}
          </TextField>

          {/* Logs Section */}
          {isEdit && (
            <Box mt={3}>
              <Typography variant="subtitle1">Logs</Typography>
              {logs.map((log) => (
                <Typography key={log.id} variant="body2" color="textSecondary">
                  • {log.note} ({new Date(log.created_at).toLocaleString()})
                </Typography>
              ))}
              <TextField
                margin="dense"
                label="New Log Note"
                fullWidth
                multiline
                rows={2}
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
              />
              <Button onClick={handleAddLog} variant="outlined" sx={{ mt: 1 }}>Add Log</Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{isEdit ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={openTaskModal} onClose={handleCloseTaskModal} fullWidth>
        <DialogTitle>Manage Tasks - {taskProject?.title}</DialogTitle>
        <DialogContent>
            {tasks.map((task) => (
            <Box key={task.id} display="flex" alignItems="center" gap={1}>
                <Checkbox
                checked={task.status === "completed"}
                onChange={() => handleToggleTask(task.id, task.status === "completed")}
                />
                <Typography variant="body2">{task.title}</Typography>
                <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                <Delete fontSize="small" />
                </IconButton>
            </Box>
            ))}

            <Box mt={2}>
              <TextField
                label="New Task"
                fullWidth
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Button onClick={handleAddTask} variant="outlined" startIcon={<Add />} sx={{ mt: 1 }}>
                Add Task
              </Button>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseTaskModal}>Close</Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default MyProjects;
