import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import "./AuthForm.css";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
  };

  return (
    <div className="auth-form">
      <Link to="/login" className="auth-form__link" style={{ display: "inline-flex", gap: 6, alignItems: "center", marginBottom: 16 }}>
        <FiArrowLeft /> Back to login
      </Link>
      <h1>Reset your password</h1>
      <p className="auth-form__subtitle">
        Enter your campus email and we'll send a link to reset your password.
      </p>

      {sent ? (
        <>
          <p className="auth-form__success">
            If an account exists for that email, a reset link is on its way.
          </p>
          <Button fullWidth size="lg" style={{ marginTop: 16 }} onClick={() => navigate("/reset-password")}>
            Continue to reset (demo)
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email address"
            type="email"
            icon={FiMail}
            placeholder="you@campus.edu"
            required
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Button type="submit" size="lg" fullWidth loading={isSubmitting} icon={FiArrowRight} iconPosition="right">
            Send reset link
          </Button>
        </form>
      )}
    </div>
  );
}
