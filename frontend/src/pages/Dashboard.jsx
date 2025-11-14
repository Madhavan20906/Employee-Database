import React, { useEffect, useState } from "react";
import API from "../api";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";

export default function Dashboard() {
  const [emps, setEmps] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/employees?search=${encodeURIComponent(search)}`);
      setEmps(res.data);
    } catch (err) {
      console.error("Fetch error", err);

      if (err.response?.status === 422 || err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Employees</h3>
        <button
          className="btn btn-secondary"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      <div className="my-3 d-flex">
        <input
          className="form-control me-2"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          Add Employee
        </button>
      </div>

      <EmployeeTable rows={emps} onRefresh={fetchData} onEdit={(emp) => setEditing(emp)} />

      {editing !== null && (
        <EmployeeForm
          employee={editing}
          onClose={() => {
            setEditing(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
