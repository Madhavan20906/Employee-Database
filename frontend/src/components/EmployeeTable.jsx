import React from "react";
import API from "../api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function EmployeeTable({ rows, onRefresh, onEdit }) {

  const deleteRow = async (id) => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/api/employees/${id}`);   // <-- FIXED
    onRefresh();
  };

  const exportExcelClient = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    saveAs(blob, "employees.xlsx");
  };

  const exportExcelServer = async () => {
    const res = await API.get("/api/employees/export/excel", {   // <-- FIXED
      responseType: "blob"
    });
    saveAs(res.data, "employees.xlsx");
  };

  const exportPDFClient = async () => {
    const doc = new jsPDF();
    const el = document.getElementById("emp-table");
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("employees.pdf");
  };

  return (
    <div>
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
