import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Grid, Typography } from "@mui/material";
import ProjectSummaryCard from "../components/ProjectSummaryCard";
import axios from "axios";


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState({
    active: 0,
    paused: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/project-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounts(res.data);
      } catch (err) {
        console.error("Error fetching summary", err);
      }
    };

    fetchSummary();
  }, []);


  return (
    <Container sx={{ mt: 2}}>
        <Typography variant="h5" gutterBottom>
            Welcome, {user?.name}
        </Typography>
        <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ width: {xs: '280px'}}}>
          <ProjectSummaryCard status="active" count={counts.active} />
        </Grid>
        <Grid item xs={12} md={4}sx={{ width: {xs: '280px'}}}>
          <ProjectSummaryCard status="paused" count={counts.paused} />
        </Grid>
        <Grid item xs={12} md={4}sx={{ width: {xs: '280px'}}}>
          <ProjectSummaryCard status="completed" count={counts.completed} />
        </Grid>
      </Grid>
    </Container>
  );
}
