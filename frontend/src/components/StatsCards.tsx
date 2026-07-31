import {
  Activity,
  Link2,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";

interface Props {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  healthyLinks: number;
}

export default function StatsCards({
  totalLinks,
  totalClicks,
  activeLinks,
  healthyLinks,
}: Props) {
  const cards = [
    {
      label: "Total links",
      value: totalLinks,
      icon: Link2,
    },
    {
      label: "Total clicks",
      value: totalClicks,
      icon: MousePointerClick,
    },
    {
      label: "Active links",
      value: activeLinks,
      icon: Activity,
    },
    {
      label: "Healthy",
      value: healthyLinks,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map(({ label, value, icon: Icon }) => (
        <article className="stat-card" key={label}>
          <div>
            <p>{label}</p>
            <strong>{value.toLocaleString()}</strong>
          </div>

          <div className="stat-icon">
            <Icon size={20} />
          </div>
        </article>
      ))}
    </section>
  );
}