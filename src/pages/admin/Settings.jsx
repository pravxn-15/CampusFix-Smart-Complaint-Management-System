import { useState } from "react";
import { toast } from "react-toastify";
import { FiSave, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Toggle from "../../components/common/Toggle";
import { Input } from "../../components/common/FormField";
import "./Settings.css";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [general, setGeneral] = useState({
    institution: "Greenfield Institute of Technology",
    supportEmail: "helpdesk@campusfix.edu",
    supportPhone: "+91 98765 43210",
  });
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    autoAssign: false,
  });
  const [escalationHrs, setEscalationHrs] = useState(6);

  function saveGeneral(e) {
    e.preventDefault();
    toast.success("Settings saved.");
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p className="text-secondary">Configure how CampusFix behaves for your campus.</p>
        </div>
      </div>

      <div className="settings__grid">
        <Card padding="lg" as="form" onSubmit={saveGeneral}>
          <h4>General</h4>
          <div className="settings__form">
            <Input
              label="Institution name"
              value={general.institution}
              onChange={(e) => setGeneral({ ...general, institution: e.target.value })}
            />
            <Input
              label="Support email"
              type="email"
              value={general.supportEmail}
              onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
            />
            <Input
              label="Support phone"
              value={general.supportPhone}
              onChange={(e) => setGeneral({ ...general, supportPhone: e.target.value })}
            />
            <Input
              label="Escalate critical complaints after (hours)"
              type="number"
              min={1}
              value={escalationHrs}
              onChange={(e) => setEscalationHrs(e.target.value)}
            />
            <Button type="submit" icon={FiSave} iconPosition="right">
              Save changes
            </Button>
          </div>
        </Card>

        <div className="settings__side">
          <Card padding="lg">
            <h4>Appearance</h4>
            <div className="settings__toggle-list">
              <div className="toggle-row" style={{ cursor: "default" }}>
                <div>
                  <strong>Dark mode</strong>
                  <p>Switch the whole interface to a dark theme.</p>
                </div>
                <Button size="sm" variant="outline" icon={theme === "light" ? FiMoon : FiSun} onClick={toggleTheme}>
                  {theme === "light" ? "Enable" : "Disable"}
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h4>Notifications</h4>
            <div className="settings__toggle-list">
              <Toggle
                label="Email notifications"
                description="Send an email whenever a complaint's status changes."
                checked={prefs.email}
                onChange={(v) => setPrefs({ ...prefs, email: v })}
              />
              <Toggle
                label="In-app notifications"
                description="Show the notification bell badge and panel."
                checked={prefs.push}
                onChange={(v) => setPrefs({ ...prefs, push: v })}
              />
              <Toggle
                label="SMS notifications"
                description="Optional — requires an SMS gateway to be connected."
                checked={prefs.sms}
                onChange={(v) => setPrefs({ ...prefs, sms: v })}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h4>Automation</h4>
            <div className="settings__toggle-list">
              <Toggle
                label="Auto-assign by category"
                description="Automatically assign new complaints to the least-busy eligible staff member."
                checked={prefs.autoAssign}
                onChange={(v) => setPrefs({ ...prefs, autoAssign: v })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
