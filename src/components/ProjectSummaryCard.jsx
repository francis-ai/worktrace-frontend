import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { CheckCircle, PauseCircle, Loop } from "@mui/icons-material";

const iconMap = {
  active: <Loop color="primary" sx={{ fontSize: 40 }} />,
  paused: <PauseCircle color="warning" sx={{ fontSize: 40 }} />,
  completed: <CheckCircle color="success" sx={{ fontSize: 40 }} />,
};

const labelMap = {
  active: "Active Projects",
  paused: "Paused Projects",
  completed: "Completed Projects",
};

export default function ProjectSummaryCard({ status, count }) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>{iconMap[status]}</Box>
        <Box>
          <Typography variant="h6">{count}</Typography>
          <Typography color="text.secondary">{labelMap[status]}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
