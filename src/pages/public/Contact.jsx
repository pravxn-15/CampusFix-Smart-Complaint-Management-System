import { useForm } from "react-hook-form";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import Card from "../../components/common/Card";
import { Input, TextArea } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import "./StaticPage.css";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent — the help desk will get back to you soon.");
    reset();
  };

  return (
    <div className="container static-page__contact">
      <div className="static-page__contact-info">
        <div>
          <span className="home__eyebrow">Get in touch</span>
          <h1>Questions about CampusFix? We're around.</h1>
          <p>For urgent, on-campus issues, please raise a complaint directly from your dashboard — it reaches staff faster than email.</p>
        </div>
        <div className="static-page__contact-item">
          <FiMail />
          <div><strong>Email</strong><span>helpdesk@campusfix.edu</span></div>
        </div>
        <div className="static-page__contact-item">
          <FiPhone />
          <div><strong>Phone</strong><span>+91 98765 43210</span></div>
        </div>
        <div className="static-page__contact-item">
          <FiMapPin />
          <div><strong>Help desk</strong><span>Student Services Block, Ground Floor</span></div>
        </div>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full name" required error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <Input
            label="Email address"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input label="Subject" required error={errors.subject?.message} {...register("subject", { required: "Subject is required" })} />
          <TextArea
            label="Message"
            rows={5}
            required
            error={errors.message?.message}
            {...register("message", { required: "Message is required" })}
          />
          <Button type="submit" size="lg" loading={isSubmitting} icon={FiSend} iconPosition="right">
            Send message
          </Button>
        </form>
      </Card>
    </div>
  );
}
