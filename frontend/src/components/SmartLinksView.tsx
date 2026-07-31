import {
  Activity,
  BarChart3,
  HeartPulse,
  Link2,
  Pencil,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import type { SmartLink } from "../types/link";

interface Props {
  links: SmartLink[];
  allLinks: SmartLink[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onQR: (link: SmartLink) => void;
  onEdit: (link: SmartLink) => void;
  onAnalytics: (link: SmartLink) => void;
  onHealth: (link: SmartLink) => void;
  onDelete: (link: SmartLink) => void;
  onCreate: () => void;
}

export default function SmartLinksView({
  links,
  allLinks,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onQR,
  onEdit,
  onAnalytics,
  onHealth,
  onDelete,
  onCreate,
}: Props) {
  const totalClicks = allLinks.reduce((sum, link) => sum + link.clickCount, 0);
  const active = allLinks.filter((link) => link.isActive).length;
  const healthy = allLinks.filter((link) => link.healthStatus === "healthy").length;
  const maxClicks = Math.max(...allLinks.map((link) => link.clickCount), 1);

  return (
    <section className="smart-links-view">
      <div className="smart-links-heading">
        <div>
          <span className="eyebrow">SMART LINKS</span>
          <h2>Control every destination.</h2>
          <p>
            Manage routing, health, QR access and analytics from one focused workspace.
          </p>
        </div>
        <button className="primary-button" onClick={onCreate}>
          <Plus size={16} />
          New smart link
        </button>
      </div>

      <div className="smart-links-summary">
        <div><Link2 size={16} /><span>Active links<strong>{active}</strong></span></div>
        <div><BarChart3 size={16} /><span>Total clicks<strong>{totalClicks}</strong></span></div>
        <div><HeartPulse size={16} /><span>Healthy<strong>{healthy}</strong></span></div>
      </div>

      <section className="smart-traffic-card">
        <div className="smart-section-head">
          <div>
            <h3>Traffic across links</h3>
            <p>Relative click activity for your current smart links</p>
          </div>
          <Activity size={17} />
        </div>

        <div className="smart-bars">
          {allLinks.length === 0 ? (
            <div className="smart-bars-empty">Traffic will appear after your links receive clicks.</div>
          ) : (
            allLinks.slice(0, 7).map((link) => {
              const percent = Math.max(6, Math.round((link.clickCount / maxClicks) * 100));
              return (
                <div className="smart-bar-row" key={link._id}>
                  <span title={link.title}>{link.title}</span>
                  <div><i style={{ width: `${percent}%` }} /></div>
                  <strong>{link.clickCount}</strong>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="smart-links-manager">
        <div className="smart-manager-head">
          <div>
            <h3>Your smart links</h3>
            <p>{links.length} shown · {allLinks.length} total</p>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                placeholder="Search smart links..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
            <button className="refresh-button" onClick={onRefresh} aria-label="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading smart links...</div>
        ) : links.length === 0 ? (
          <div className="smart-links-empty">
            <Link2 size={28} />
            <strong>No smart links found</strong>
            <span>Create a link or change your search.</span>
          </div>
        ) : (
          <div className="smart-link-list">
            {links.map((link) => (
              <article className="smart-link-row" key={link._id}>
                <div className="smart-link-icon"><Link2 size={17} /></div>
                <div className="smart-link-main">
                  <div>
                    <h4>{link.title}</h4>
                    <span className={`smart-status ${link.isActive ? "active" : ""}`}>
                      {link.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <button onClick={() => onQR(link)}>
                    {link.shortUrl || `/r/${link.shortCode}`}
                  </button>
                  <p>{link.destinationUrl}</p>
                </div>
                <div className="smart-link-clicks">
                  <strong>{link.clickCount}</strong>
                  <span>clicks</span>
                </div>
                <div className="smart-link-actions">
                  <button onClick={() => onAnalytics(link)} title="Analytics"><BarChart3 size={14} /></button>
                  <button onClick={() => onEdit(link)} title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => onQR(link)} title="QR"><QrCode size={14} /></button>
                  <button onClick={() => onHealth(link)} title="Health"><HeartPulse size={14} /></button>
                  <button className="danger" onClick={() => onDelete(link)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
