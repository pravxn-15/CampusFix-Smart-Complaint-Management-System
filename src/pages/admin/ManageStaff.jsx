import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUsers, FiPlus, FiTrash2, FiStar } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { Input } from "../../components/common/FormField";
import "../shared/DataTable.css";
import "./ManageStaff.css";

export default function ManageStaff() {
  const { staff, categories, addStaffMember, removeStaffMember } = useData();
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [specialty, setSpecialty] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  function toggleSpecialty(id) {
    setSpecialty((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    addStaffMember({ ...data, specialty });
    reset();
    setSpecialty([]);
    setOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Staff</h1>
          <p className="text-secondary">{staff.length} staff members across all departments.</p>
        </div>
        <Button icon={FiPlus} onClick={() => setOpen(true)}>
          Add staff member
        </Button>
      </div>

      {staff.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={FiUsers} title="No staff members yet" description="Add your first staff member to start assigning complaints." />
        </Card>
      ) : (
        <div className="manage-staff__grid">
          {staff.map((s) => (
            <Card key={s.id} padding="lg" className="manage-staff__card">
              <button className="manage-staff__delete" onClick={() => setToDelete(s)} aria-label={`Remove ${s.name}`}>
                <FiTrash2 />
              </button>
              <Avatar name={s.name} color={s.avatarColor} size={56} />
              <h4>{s.name}</h4>
              <span className="text-xs text-secondary">{s.department}</span>
              <div className="manage-staff__tags">
                {s.specialty.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return cat ? <span key={catId} className="manage-staff__tag">{cat.name}</span> : null;
                })}
              </div>
              <div className="manage-staff__stats">
                <div><strong>{s.activeCount}</strong><span>Active</span></div>
                <div><strong>{s.resolvedCount}</strong><span>Resolved</span></div>
                <div><strong><FiStar style={{ marginBottom: -2 }} /> {s.rating}</strong><span>Rating</span></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add a staff member">
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
          <Input label="Full name" required error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <Input
            label="Email address"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input label="Department" required error={errors.department?.message} {...register("department", { required: "Department is required" })} />

          <div className="field">
            <label className="field__label">Handles categories</label>
            <div className="manage-staff__checkbox-grid">
              {categories.map((cat) => (
                <label key={cat.id} className="manage-staff__checkbox">
                  <input type="checkbox" checked={specialty.includes(cat.id)} onChange={() => toggleSpecialty(cat.id)} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} fullWidth>
            Add staff member
          </Button>
        </form>
      </Modal>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remove staff member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                removeStaffMember(toDelete.id);
                setToDelete(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p>
          Remove <strong>{toDelete?.name}</strong> from staff? Complaints already assigned to them will keep their history,
          but you'll need to reassign anything still open.
        </p>
      </Modal>
    </div>
  );
}
