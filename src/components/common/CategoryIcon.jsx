import {
  FiZap,
  FiDroplet,
  FiWifi,
  FiWind,
  FiHome,
  FiBookOpen,
  FiActivity,
  FiTruck,
  FiShield,
  FiCloudRain,
  FiBook,
  FiMoreHorizontal,
} from "react-icons/fi";

const ICONS = {
  zap: FiZap,
  droplet: FiDroplet,
  wifi: FiWifi,
  wind: FiWind,
  home: FiHome,
  "book-open": FiBookOpen,
  activity: FiActivity,
  truck: FiTruck,
  shield: FiShield,
  "cloud-rain": FiCloudRain,
  book: FiBook,
  "more-horizontal": FiMoreHorizontal,
};

export default function CategoryIcon({ icon, className = "" }) {
  const Icon = ICONS[icon] || FiMoreHorizontal;
  return <Icon className={className} aria-hidden="true" />;
}
