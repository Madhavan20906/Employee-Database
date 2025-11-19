import React, { useState } from "react";
import API from "../api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExportFilterModal from "./ExportFilterModal";

const COLUMN_ORDER = [
  "id",
  "name",
  "email",
  "position",
  "department",
  "salary",
  "date_joined"
];

export default function EmployeeTable({ rows, onRefresh, onEdit }) {
  const [showFilter, setShowFilter] = useState(false);

  const [columns, setColumns] = useState({
    id: true,
    name: true,
    email: true,
    position: true,
    department: true,
    salary: true,
    date_joined: true,
  });

  const deleteRow = async (id) => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/api/employees/${id}`);
    onRefresh();
  };

  // Apply filters for screen + exports
  const filteredRows = rows.map((row) => {
    const filtered = {};
    for (let key in row) {
      if (columns[key]) filtered[key] = row[key];
    }
    return filtered;
  });

  // ✅ FIXED EXCEL EXPORT — ordered + filtered
  const exportExcelClient = () => {
    const filtered = filteredRows.map((row) => {
      const ordered = {};
      COLUMN_ORDER.forEach((key) => {
        if (columns[key]) ordered[key] = row[key];
      });
      return ordered;
    });

    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });

    saveAs(blob, "employees.xlsx");
  };

  // PDF export (table screenshot)
  const exportPDFClient = async () => {
    const doc = new jsPDF();
    const el = document.getElementById("emp-table");

    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("employees_filtered.pdf");
  };

  return (
    <div>
      {/* Buttons */}
      <div className="mb-2">
        <button className="btn btn-warning me-2" onClick={() => setShowFilter(true)}>
          Choose Fields
        </button>

        <button className="btn btn-outline-primary me-2" onClick={exportExcelClient}>
          Export Excel
        </button>

        <button className="btn btn-outline-success" onClick={exportPDFClient}>
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table id="emp-table" className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              {COLUMN_ORDER.map(
                (key) => columns[key] && <th key={key}>{key.toUpperCase()}</th>
              )}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {COLUMN_ORDER.map(
                  (key) => columns[key] && <td key={key}>{r[key]}</td>
                )}

                <td>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => onEdit(r)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteRow(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <ExportFilterModal
          columns={columns}
          setColumns={setColumns}
          onClose={() => setShowFilter(false)}
          onExport={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
