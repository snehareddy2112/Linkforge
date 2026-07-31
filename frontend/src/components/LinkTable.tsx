import {
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  HeartPulse,
  MoreHorizontal,
  Pencil, 
  QrCode,
  Trash2,
} from "lucide-react";

import type { SmartLink } from "../types/link";

interface Props {
  links: SmartLink[];
  onQR: (link: SmartLink) => void;
  onDelete: (link: SmartLink) => void;
  onHealth: (link: SmartLink) => void;
  onAnalytics: (link: SmartLink) => void;
  onEdit: (link: SmartLink) => void;
}

export default function LinkTable({
  links,
  onQR,
  onDelete,
  onHealth,
  onAnalytics,
  onEdit,
}: Props) {
  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <ExternalLink size={24} />
        </div>

        <h3>No smart links yet</h3>

        <p>Create your first link to start routing and tracking traffic.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>LINK</th>
            <th>STATUS</th>
            <th>CLICKS</th>
            <th>HEALTH</th>
            <th>CREATED</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {links.map((link) => (
            <tr key={link._id}>
              <td>
                <div className="link-main">
                  <div className="link-icon">
                    <ExternalLink size={17} />
                  </div>

                  <div>
                    <strong>{link.title}</strong>

                    <div className="short-link">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.shortUrl}
                      </a>

                      <button
                        title="Copy short URL"
                        onClick={() => copy(link.shortUrl)}
                      >
                        <Copy size={13} />
                      </button>
                    </div>

                    <span className="destination">
                      {link.destinationUrl}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span
                  className={`status ${
                    link.isActive ? "active" : "inactive"
                  }`}
                >
                  {link.isActive ? "Active" : "Disabled"}
                </span>
              </td>

              <td>
                <button
                  className="click-count"
                  onClick={() => onAnalytics(link)}
                >
                  <BarChart3 size={15} />
                  {link.clickCount}
                </button>
              </td>

              <td>
                {link.healthStatus === "healthy" ? (
                  <span className="health healthy">
                    <CheckCircle2 size={14} />
                    Healthy
                  </span>
                ) : link.healthStatus === "broken" ? (
                  <span className="health broken">Broken</span>
                ) : (
                  <button
                    className="health-check"
                    onClick={() => onHealth(link)}
                  >
                    <HeartPulse size={14} />
                    Check
                  </button>
                )}
              </td>

              <td className="date-cell">
                {new Date(link.createdAt).toLocaleDateString()}
              </td>

              <td>
                
                <div className="row-actions">
  <button
    title="Edit smart link"
    onClick={() => onEdit(link)}
  >
    <Pencil size={16} />
  </button>

  <button
    title="QR code"
    onClick={() => onQR(link)}
  >
    <QrCode size={17} />
  </button>

  <button
    title="Delete"
    onClick={() => onDelete(link)}
  >
    <Trash2 size={17} />
  </button>

  <button title="More">
    <MoreHorizontal size={17} />
  </button>
</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}