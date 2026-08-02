import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiSend, FiInfo } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Input, TextArea, Select } from "../../components/common/FormField";
import FileUpload from "../../components/common/FileUpload";
import CategoryIcon from "../../components/common/CategoryIcon";
import "./RaiseComplaint.css";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function RaiseComplaint() {
  const { user } = useAuth();
  const { categories, addComplaint } = useData();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { priority: "Medium", category: "" } });

  const selectedCategory = watch("category");
  const activeCategory = categories.find((c) => c.id === selectedCategory);

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    const created = addComplaint({ ...data, images: files }, user);
    navigate(`/user/complaints/${created.id}`);
  };

  return (
    <div className="raise-complaint">
      <div className="page-header">
        <div>
          <h1>Raise a complaint</h1>
          <p className="text-secondary">Give us the details — the more specific, the faster it gets routed.</p>
        </div>
      </div>

      <div className="raise-complaint__grid">
        <Card padding="lg" as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Title"
            placeholder="e.g. Flickering tube light in Room 204"
            required
            error={errors.title?.message}
            {...register("title", { required: "Give your complaint a short title" })}
          />

          <div className="raise-complaint__row">
            <Controller
              name="category"
              control={control}
              rules={{ required: "Choose a category" }}
              render={({ field }) => (
                <Select
                  label="Category"
                  placeholder="Select a category"
                  required
                  error={errors.category?.message}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  {...field}
                />
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  label="Priority"
                  required
                  options={PRIORITIES.map((p) => ({ value: p, label: p }))}
                  {...field}
                />
              )}
            />
          </div>

          <Input
            label="Location"
            placeholder="e.g. Hostel Block A, Room 204"
            required
            error={errors.location?.message}
            {...register("location", { required: "Let staff know where to go" })}
          />

          <TextArea
            label="Description"
            placeholder="Describe what's wrong, when it started, and anything staff should know before they arrive."
            rows={5}
            required
            error={errors.description?.message}
            {...register("description", { required: "A short description helps staff prepare" })}
          />

          <div className="field">
            <label className="field__label">Photos (optional)</label>
            <FileUpload files={files} onChange={setFiles} />
          </div>

          <Button type="submit" size="lg" loading={isSubmitting} icon={FiSend} iconPosition="right" fullWidth>
            Submit complaint
          </Button>
        </Card>

        <div className="raise-complaint__side">
          <Card padding="lg">
            <div className="raise-complaint__tip">
              <FiInfo />
              <div>
                <strong>Tip</strong>
                <p>Mention the exact room, floor, or block — it's the single biggest factor in how fast staff can act.</p>
              </div>
            </div>
          </Card>

          {activeCategory && (
            <Card padding="lg">
              <div className="raise-complaint__preview">
                <span className="raise-complaint__preview-icon">
                  <CategoryIcon icon={activeCategory.icon} />
                </span>
                <div>
                  <strong>{activeCategory.name}</strong>
                  <span className="text-xs text-secondary">Typical resolution: ~{activeCategory.avgResolutionHrs} hrs</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
