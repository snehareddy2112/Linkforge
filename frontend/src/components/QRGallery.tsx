import {
  BarChart3,
  Download,
  ExternalLink,
  Pencil,
  QrCode,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import type { SmartLink } from "../types/link";

interface Props {
  links: SmartLink[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onQR: (link: SmartLink) => void;
  onEdit: (link: SmartLink) => void;
  onAnalytics: (link: SmartLink) => void;
  onDelete: (link: SmartLink) => void;
}

export default function QRGallery({
  links,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onQR,
  onEdit,
  onAnalytics,
  onDelete,
}: Props) {
  return (
    <section className="qr-gallery-page">
      <div className="hero-copy qr-gallery-hero">
        <div>
          <span className="eyebrow">QR CODES</span>
          <h2>Every smart link is QR-ready.</h2>
          <p>
            View, download and manage dynamic QR codes backed by the same
            routing and analytics engine as your smart links.
          </p>
        </div>
      </div>

      <div className="qr-gallery-toolbar">
        <div>
          <h3>QR library</h3>
          <p>{links.length} smart links available as dynamic QR codes</p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search QR codes..."
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
        <div className="loading-state">Loading QR library...</div>
      ) : links.length === 0 ? (
        <div className="qr-gallery-empty">
          <QrCode size={32} />
          <strong>No QR-ready links found</strong>
          <span>Create a smart link or generate a new dynamic QR.</span>
        </div>
      ) : (
        <div className="qr-gallery-grid">
          {links.map((link) => (
            <article className="qr-gallery-card" key={link._id}>
              <div className="qr-gallery-code" onClick={() => onQR(link)}>
                <QrCode size={64} strokeWidth={1.1} />
                <span>View QR</span>
              </div>

              <div className="qr-gallery-card-copy">
                <div className="qr-gallery-title-row">
                  <h3>{link.title}</h3>
                  <span className={`qr-gallery-status ${link.isActive ? "active" : ""}`}>
                    {link.isActive ? "Active" : "Paused"}
                  </span>
                </div>

                <button className="qr-gallery-short" onClick={() => onQR(link)}>
                  {link.shortUrl || `/r/${link.shortCode}`}
                  <ExternalLink size={12} />
                </button>

                <p className="qr-gallery-destination">{link.destinationUrl}</p>

                <div className="qr-gallery-meta">
                  <span>
                    <BarChart3 size={13} />
                    {link.clickCount} {link.clickCount === 1 ? "scan/click" : "scans/clicks"}
                  </span>
                  <span className={`health-dot ${link.healthStatus}`} />
                  <span>{link.healthStatus || "unchecked"}</span>
                </div>
              </div>

              <div className="qr-gallery-actions">
                <button onClick={() => onQR(link)} title="View or download QR">
                  <Download size={14} />
                  QR
                </button>
                <button onClick={() => onEdit(link)} title="Edit destination">
                  <Pencil size={14} />
                  Edit
                </button>
                <button onClick={() => onAnalytics(link)} title="Analytics">
                  <BarChart3 size={14} />
                  Analytics
                </button>
                <button
                  className="danger"
                  onClick={() => onDelete(link)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
