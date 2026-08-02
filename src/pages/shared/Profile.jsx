import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";
import { Input } from "../../components/common/FormField";
import { formatDate } from "../../utils/formatDate";
import "./Profile.css";

export default function Profile({ role }) {
  const { user, updateProfile } = useAuth();
  const { complaints, staff } = useData();
  const [tab, setTab] = useState("details");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
      department: user.department || "",
    },
  });

  const {
    register: registerPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    watch: watchPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm();

  const onSave = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({ id: user.id, ...data });
    toast.success("Profile updated.");
  };

  const onChangePassword = async () => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Password updated.");
    resetPw();
  };

  const myComplaints = role === "user" ? complaints.filter((c) => c.raisedBy === user.id) : [];
  const staffRecord = role === "staff" ? staff.find((s) => s.id === user.id) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="text-secondary">Manage your account details.</p>
        </div>
      </div>

      <div className="profile__grid">
        <Card padding="lg" className="profile__summary">
          <Avatar name={user.name} color={user.avatarColor || "#2563EB"} size={72} />
          <h3 style={{ marginTop: 12 }}>{user.name}</h3>
          <p className="text-sm text-secondary">{user.email}</p>
          <span className="profile__role-tag">{role}</span>
          <div className="profile__stats">
            {role === "user" && (
              <>
                <div><strong>{myComplaints.length}</strong><span>Complaints raised</span></div>
                <div><strong>{myComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length}</strong><span>Resolved</span></div>
              </>
            )}
            {staffRecord && (
              <>
                <div><strong>{staffRecord.resolvedCount}</strong><span>Resolved</span></div>
                <div><strong>{staffRecord.rating}</strong><span>Rating</span></div>
              </>
            )}
            <div><strong>{formatDate(user.joinedAt)}</strong><span>Member since</span></div>
          </div>
        </Card>

        <Card padding="lg" className="profile__main">
          <Tabs
            tabs={[
              { value: "details", label: "Details" },
              { value: "security", label: "Security" },
            ]}
            active={tab}
            onChange={setTab}
          />

          {tab === "details" ? (
            <form onSubmit={handleSubmit(onSave)} className="profile__form">
              <Input label="Full name" icon={FiUser} {...register("name")} />
              <Input label="Email address" type="email" icon={FiMail} {...register("email")} />
              <Input label="Phone number" icon={FiPhone} {...register("phone")} />
              <Input
                label={role === "user" ? "Hostel / room" : "Department"}
                icon={FiMapPin}
                {...register(role === "user" ? "location" : "department")}
              />
              <Button type="submit" loading={isSubmitting} icon={FiSave} iconPosition="right">
                Save changes
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePwSubmit(onChangePassword)} className="profile__form">
              <Input label="Current password" type="password" icon={FiLock} {...registerPw("current", { required: true })} />
              <Input
                label="New password"
                type="password"
                icon={FiLock}
                error={pwErrors.next?.message}
                {...registerPw("next", { required: "Required", minLength: { value: 8, message: "At least 8 characters" } })}
              />
              <Input
                label="Confirm new password"
                type="password"
                icon={FiLock}
                error={pwErrors.confirm?.message}
                {...registerPw("confirm", { validate: (v) => v === watchPw("next") || "Passwords don't match" })}
              />
              <Button type="submit" loading={pwSubmitting} icon={FiSave} iconPosition="right">
                Update password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
