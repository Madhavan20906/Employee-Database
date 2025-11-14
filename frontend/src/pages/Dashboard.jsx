import React, { useEffect, useState } from "react";
import API from "../api";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";

export default function Dashboard() {

  /* ------------------------------ */
  /*            STATE               */
  /* ------------------------------ */
  const [emps, setEmps] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  /* ------------------------------ */
  /*     FETCH EMPLOYEES (API)      */
  /* ------------------------------ */
  const fetchData = async () => {
    try {
      const res = await API.get(`/api/employees?search=${encodeURIComponent(search)}`);
      setEmps(res.data);

    } catch (err) {
      console.error("Fetch error", err);

      // Handle expired/missing JWT
      if (err.response?.status === 422 || err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  /* ------------------------------ */
  /*  RUN FETCH WHEN SEARCH CHANGES */
  /* ------------------------------ */
  useEffect(() => {
    fetchData();
  }, [search]);

  /* ------------------------------ */
  /*              UI                */
  /* ------------------------------ */
  return (
    <div className="container" style={{ marginTop: 20 }}>
      
      {/* Header */}
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

      {/* Search + Add */}
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

      {/* Employees Table */}
      <EmployeeTable
        rows={emps}
        onRefresh={fetchData}
        onEdit={(emp) => setEditing(emp)}
      />

      {/* Add/Edit Form */}
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
