import React from "react";

export default function ExportFilterModal({ columns, setColumns, onClose, onExport }) {
  const toggle = (key) => {
    setColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}>
      <div style={{
        background: "white",
        padding: 20,
        width: 350,
        borderRadius: 10,
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
      }}>
        <h4>Select Fields</h4>
        <hr />

        {Object.keys(columns).map(key => (
          <div key={key} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={columns[key]}
              onChange={() => toggle(key)}
              id={key}
            />
            <label className="form-check-label" htmlFor={key}>
              {key}
            </label>
          </div>
        ))}

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onExport}>Export</button>
        </div>
      </div>
    </div>
  );
}
