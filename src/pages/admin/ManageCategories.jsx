import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTag, FiPlus, FiTrash2 } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import CategoryIcon from "../../components/common/CategoryIcon";
import { Input } from "../../components/common/FormField";
import "../shared/DataTable.css";
import "../shared/Dashboard.css";

export default function ManageCategories() {
  const { categories, complaints, addCategory, updateCategory, deleteCategory } = useData();
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 300));
    addCategory(data.name);
    reset();
    setOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Categories</h1>
          <p className="text-secondary">{categories.length} categories complaints can be routed to.</p>
        </div>
        <Button icon={FiPlus} onClick={() => setOpen(true)}>
          Add category
        </Button>
      </div>

      <Card padding="lg">
        {categories.length === 0 ? (
          <EmptyState icon={FiTag} title="No categories yet" description="Add a category to start routing complaints." />
        ) : (
          <div className="data-table__wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Complaints</th>
                  <th>Avg. resolution (hrs)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="data-table__person">
                        <span className="dash-recent-item__icon">
                          <CategoryIcon icon={cat.icon} />
                        </span>
                        <strong>{cat.name}</strong>
                      </div>
                    </td>
                    <td className="text-sm">{complaints.filter((c) => c.category === cat.id).length}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        className="field__input"
                        style={{ width: 90, height: 36 }}
                        defaultValue={cat.avgResolutionHrs}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val > 0 && val !== cat.avgResolutionHrs) updateCategory(cat.id, { avgResolutionHrs: val });
                        }}
                      />
                    </td>
                    <td>
                      <div className="data-table__actions">
                        <button className="data-table__icon-btn data-table__icon-btn--danger" onClick={() => setToDelete(cat)} aria-label={`Delete ${cat.name}`}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a category">
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
          <Input
            label="Category name"
            placeholder="e.g. Sports Facilities"
            required
            error={errors.name?.message}
            {...register("name", { required: "Category name is required" })}
          />
          <Button type="submit" loading={isSubmitting} fullWidth>
            Add category
          </Button>
        </form>
      </Modal>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteCategory(toDelete.id);
                setToDelete(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Delete <strong>{toDelete?.name}</strong>? Existing complaints in this category will keep their record, but it
          won't be selectable for new ones.
        </p>
      </Modal>
    </div>
  );
}
