import React from "react";
import API from "../api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EmployeeTable({ rows, onRefresh, onEdit }) {

  const [selectedColumns, setSelectedColumns] = React.useState([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const columns = ["id", "name", "email", "position", "department", "salary"];

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

  // ⭐ Excel Export with Filters
  const exportExcelClient = () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column.");
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
    saveAs(new Blob([buf]), "employees_filtered.xlsx");
  };

  const exportExcelServer = async () => {
    const res = await API.get("/employees/export/excel", {
      responseType: "blob"
    });
    saveAs(res.data, "employees.xlsx");
  };

  // ⭐ PDF Export with Filters (autoTable)
  const exportPDFClient = () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column.");
      return;
    }

    const doc = new jsPDF();

    const tableData = rows.map(r => {
      let obj = {};
      selectedColumns.forEach(c => obj[c] = r[c]);
      return obj;
    });

    const tableColumns = selectedColumns.map(c => ({
      header: c.toUpperCase(),
      dataKey: c
    }));

    doc.autoTable({
      columns: tableColumns,
      body: tableData
    });

    doc.save("employees_filtered.pdf");
  };

  return (
    <div>

      {/* ⭐ Dropdown Column Filter */}
      <div className="mb-2" style={{ position: "relative" }}>
        <button
          className="btn btn-outline-dark"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Select Columns ▼
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              background: "white",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 50
            }}
          >
            {columns.map(col => (
              <div key={col}>
                <input
                  type="checkbox"
                  value={col}
                  onChange={handleColumnToggle}
                />
                {" "}{col.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Buttons */}
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

      {/* Table */}
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
