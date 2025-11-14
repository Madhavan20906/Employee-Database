import React, {useState, useEffect} from "react";
import API from "../api";

export default function EmployeeForm({ employee, onClose }){
  const [form, setForm] = useState({ name:"", email:"", position:"", department:"", salary:"", date_joined:"" });

  useEffect(()=>{ if(employee && employee.id) setForm(employee); else setForm({ name:"", email:"", position:"", department:"", salary:"", date_joined:"" }) }, [employee]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if(form.id){
        await API.put(`/employees/${form.id}`, form);
      } else {
        await API.post("/employees", form);
      }
      onClose();
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="card p-3" style={{position:"fixed", right:20, top:80, width:360, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>
      <h5>{form.id ? "Edit" : "Add"} Employee</h5>
      <form onSubmit={submit}>
        <input className="form-control my-1" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="form-control my-1" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="form-control my-1" placeholder="Position" value={form.position} onChange={e=>setForm({...form, position:e.target.value})} />
        <input className="form-control my-1" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} />
        <input className="form-control my-1" placeholder="Salary" value={form.salary} onChange={e=>setForm({...form, salary:e.target.value})} />
        <input className="form-control my-1" placeholder="Date joined (YYYY-MM-DD)" value={form.date_joined} onChange={e=>setForm({...form, date_joined:e.target.value})} />
        <div className="d-flex justify-content-end mt-2">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">{form.id ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
