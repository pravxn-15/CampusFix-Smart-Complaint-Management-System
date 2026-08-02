import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiMapPin, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import "./AuthForm.css";

export default function Register() {
  const { register: registerUser, authError } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = registerUser(data);
    if (result.ok) navigate("/user/dashboard");
  };

  return (
    <div className="auth-form">
      <h1>Create your account</h1>
      <p className="auth-form__subtitle">Set up a student account to start raising complaints.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          icon={FiUser}
          placeholder="Aditi Sharma"
          required
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Email address"
          type="email"
          icon={FiMail}
          placeholder="you@campus.edu"
          required
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Input
          label="Hostel / room or day scholar"
          icon={FiMapPin}
          placeholder="Hostel Block A, Room 204"
          {...register("location")}
        />
        <Input
          label="Password"
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
          label="Confirm password"
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

        {authError && <p className="auth-form__error">{authError}</p>}

        <Button type="submit" size="lg" fullWidth loading={isSubmitting} icon={FiArrowRight} iconPosition="right">
          Create account
        </Button>
      </form>

      <p className="auth-form__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
