import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { USERS, STAFF, ADMIN, DEMO_PASSWORD } from "../../data/mockData";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import "./AuthForm.css";

const DEMO_ACCOUNTS = [
  { ...USERS[0], tag: "Student" },
  { ...STAFF[0], tag: "Staff" },
  { ...ADMIN, tag: "Admin" },
];

export default function Login() {
  const { login, authError, loginAs } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = login(data);
    if (result.ok) navigate(`/${result.account.role}/dashboard`);
  };

  return (
    <div className="auth-form">
      <h1>Welcome back</h1>
      <p className="auth-form__subtitle">Log in to raise, track, or manage campus complaints.</p>

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
        <Input
          label="Password"
          type="password"
          icon={FiLock}
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        {authError && <p className="auth-form__error">{authError}</p>}

        <div className="auth-form__row">
          <Link to="/forgot-password" className="auth-form__link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth loading={isSubmitting} icon={FiArrowRight} iconPosition="right">
          Log in
        </Button>
      </form>

      <div className="auth-form__divider"><span>or try a demo account</span></div>

      <div className="auth-form__demo">
        {DEMO_ACCOUNTS.map((acc) => (
          <button
            key={acc.id}
            type="button"
            className="auth-form__demo-btn"
            onClick={() => {
              loginAs(acc.id);
              navigate(`/${acc.role}/dashboard`);
            }}
          >
            <strong>{acc.tag}</strong>
            <span>{acc.name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-secondary" style={{ textAlign: "center", marginTop: 8 }}>
        Demo password for any account: <code>{DEMO_PASSWORD}</code>
      </p>

      <p className="auth-form__footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
