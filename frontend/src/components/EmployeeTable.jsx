import React from "react";
import API from "../api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export default function EmployeeTable({ rows, onRefresh, onEdit }) {

  // 🔥 NEW: Column filter state
  const [selectedColumns, setSelectedColumns] = React.useState([]);

  // 🔥 NEW: Toggle selected columns
  const handleColumnToggle = (e) => {
    const col = e.target.value;
    setSelectedColumns(prev =>
      prev.includes(col)
        ? prev.filter(c => c !== col)
        : [...prev, col]
    );
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/employees/${id}`);
    onRefresh();
  };

  // 🔥 UPDATED: Excel export (client) with filters
  const exportExcelClient = () => {
    if (selectedColumns.length === 0) {
      alert("Select at least one column to export.");
      return;
    }

    const filtered = rows.map(r => {
      let obj = {};
      selectedColumns.forEach(c => obj[c] = r[c]);
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    saveAs(blob, "employees_filtered.xlsx");
  };

  const exportExcelServer = async () => {
    const res = await API.get("/employees/export/excel", {
      responseType: "blob"
    });
    saveAs(res.data, "employees.xlsx");
  };

  // 🔥 UPDATED: PDF export (client) with filters
  const exportPDFClient = () => {
    if (selectedColumns.length === 0) {
      alert("Select at least one column to export.");
      return;
    }

    const doc = new jsPDF();

    const tableData = rows.map(r => {
      let obj = {};
      selectedColumns.forEach(c => obj[c] = r[c]);
      return obj;
    });

    const columns = selectedColumns.map(c => ({
      header: c.toUpperCase(),
      dataKey: c
    }));

    doc.autoTable({
      columns,
      body: tableData
    });

    doc.save("employees_filtered.pdf");
  };

  return (
    <div>

      {/* 🔥 NEW: Column Filters */}
      <div className="mb-2">
        <strong>Select columns:</strong>
        <div className="mt-1">
          {["id", "name", "email", "position", "department", "salary"].map(col => (
            <label key={col} className="me-3">
              <input type="checkbox" value={col} onChange={handleColumnToggle} />
              {" "}{col.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <button className="btn btn-outline-primary me-2" onClick={exportExcelClient}>
          Export Excel (client)
        </button>
        <button className="btn btn-outline-secondary me-2" onClick={exportExcelServer}>
          Export Excel (server)
        </button>
        <button className="btn btn-outline-success" onClick={exportPDFClient}>
          Export PDF (client)
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table id="emp-table" className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Position</th>
              <th>Department</th><th>Salary</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.position}</td>
                <td>{r.department}</td>
                <td>{r.salary}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-1" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteRow(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
