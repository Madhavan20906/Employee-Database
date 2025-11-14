from flask import Blueprint, request, jsonify, send_file
from models import db, Employee
from flask_jwt_extended import jwt_required
import io, pandas as pd

emp_bp = Blueprint("employees", __name__)

@emp_bp.route("", methods=["GET"])
@jwt_required()
def list_employees():
    q = Employee.query
    search = request.args.get("search")
    if search:
        q = q.filter(Employee.name.ilike(f"%{search}%"))
    emps = q.all()
    result = [ {
        "id": e.id, "name": e.name, "email": e.email,
        "position": e.position, "department": e.department,
        "salary": e.salary, "date_joined": e.date_joined
    } for e in emps]
    return jsonify(result)

@emp_bp.route("", methods=["POST"])
@jwt_required()
def create_employee():
    data = request.get_json() or {}
    e = Employee(
        name=data.get("name"),
        email=data.get("email"),
        position=data.get("position"),
        department=data.get("department"),
        salary=data.get("salary"),
        date_joined=data.get("date_joined")
    )
    db.session.add(e)
    db.session.commit()
    return jsonify({"id": e.id}), 201

@emp_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_employee(id):
    e = Employee.query.get_or_404(id)
    data = request.get_json() or {}
    for k in ["name","email","position","department","salary","date_joined"]:
        if k in data:
            setattr(e, k, data[k])
    db.session.commit()
    return jsonify({"msg":"updated"})

@emp_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_employee(id):
    e = Employee.query.get_or_404(id)
    db.session.delete(e)
    db.session.commit()
    return jsonify({"msg":"deleted"})

@emp_bp.route("/export/excel", methods=["GET"])
@jwt_required()
def export_excel():
    emps = Employee.query.all()
    df = pd.DataFrame([{
        "id": e.id, "name": e.name, "email": e.email,
        "position": e.position, "department": e.department,
        "salary": e.salary, "date_joined": e.date_joined or ""
    } for e in emps])
    buf = io.BytesIO()
    df.to_excel(buf, index=False, engine="openpyxl")
    buf.seek(0)
    return send_file(buf, as_attachment=True, download_name="employees.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
