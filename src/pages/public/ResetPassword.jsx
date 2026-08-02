import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCheck } from "react-icons/fi";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";
import "./AuthForm.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password reset — you can log in now.");
    navigate("/login");
  };

  return (
    <div className="auth-form">
      <h1>Set a new password</h1>
      <p className="auth-form__subtitle">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="New password"
          type="password"
          icon={FiLock}
          placeholder="At least 8 characters"
          required
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={FiLock}
          placeholder="Re-enter your password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === watch("password") || "Passwords don't match",
          })}
        />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} icon={FiCheck} iconPosition="right">
          Update password
        </Button>
      </form>
    </div>
  );
}
