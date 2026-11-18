
const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

// Initial data
let leaves = [
  {
    id: 701,
    employeeName: "Ananya Singh",
    employeeCode: "EMP101",
    leaveType: "Casual",
    days: 2,
    status: "Pending"
  },
  {
    id: 702,
    employeeName: "Rahul Verma",
    employeeCode: "EMP102",
    leaveType: "Sick",
    days: 1,
    status: "Approved"
  },
  {
    id: 703,
    employeeName: "Simran Kaur",
    employeeCode: "EMP103",
    leaveType: "Earned",
    days: 3,
    status: "Rejected"
  }
];

// Validation function
function isValidLeave(data) {
  return (
    typeof data.employeeName === "string" &&
    data.employeeName.trim() !== "" &&
    typeof data.employeeCode === "string" &&
    data.employeeCode.trim() !== "" &&
    ["Casual", "Sick", "Earned"].includes(data.leaveType) &&
    Number.isInteger(data.days) &&
    data.days > 0 &&
    ["Pending", "Approved", "Rejected"].includes(data.status)
  );
}

// 1. GET all leave requests
app.get("/api/leaves", (req, res) => {
  res.status(200).json(leaves);
});

// 2. POST a new leave request
app.post("/api/leaves", (req, res) => {
  const data = req.body;

  if (!isValidLeave(data)) {
    return res.status(400).json({
      message: "Invalid leave request data"
    });
  }

  const newLeave = {
    id: Math.max(700, ...leaves.map(l => l.id)) + 1,
    ...data
  };

  leaves.push(newLeave);

  res.status(201).json(newLeave);
});

// 3. Filter by status
app.get("/api/leaves/filter", (req, res) => {
  const status = req.query.status;

  if (typeof status !== "string" || !status.trim()) {
    return res.status(400).json({
      message: "Status is required"
    });
  }

  const result = leaves.filter(
    l => l.status.toLowerCase() === status.trim().toLowerCase()
  );

  res.status(200).json(result);
});

// 4. GET pending leave requests
app.get("/api/leaves/pending", (req, res) => {
  const result = leaves.filter(
    l => l.status === "Pending"
  );

  res.status(200).json(result);
});

// 5. GET leave request by ID
app.get("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const leave = leaves.find(l => l.id === id);

  if (!leave) {
    return res.status(404).json({
      message: "Leave request not found"
    });
  }

  res.status(200).json(leave);
});

// 6. PUT / Update leave request
app.put("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Leave request not found"
    });
  }

  const data = req.body;

  if (!isValidLeave(data)) {
    return res.status(400).json({
      message: "Invalid leave request data"
    });
  }

  leaves[index] = {
    id: id,
    ...data
  };

  res.status(200).json(leaves[index]);
});

// 7. DELETE leave request
app.delete("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Leave request not found"
    });
  }

  leaves.splice(index, 1);

  res.status(200).json({
    message: "Leave request deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
