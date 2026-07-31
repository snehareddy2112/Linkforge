import { useEffect, useState, type FormEvent } from "react";
import {
  ExternalLink,
  Link2,
  Save,
  Smartphone,
  Monitor,
  X,
} from "lucide-react";

import type { SmartLink } from "../types/link";

interface Props {
  open: boolean;
  link: SmartLink | null;
  loading: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    payload: {
      title: string;
      destinationUrl: string;
      mobileUrl?: string;
      desktopUrl?: string;
      isActive: boolean;
    }
  ) => Promise<void>;
}

export default function EditLinkModal({
  open,
  link,
  loading,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [mobileUrl, setMobileUrl] = useState("");
  const [desktopUrl, setDesktopUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // The link form state should reset whenever the selected link changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!link) return;

    setTitle(link.title);
    setDestinationUrl(link.destinationUrl);
    setMobileUrl(link.mobileUrl || "");
    setDesktopUrl(link.desktopUrl || "");
    setIsActive(link.isActive);
  }, [link]);

  if (!open || !link) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    await onSave(link._id, {
      title: title.trim(),
      destinationUrl: destinationUrl.trim(),
      mobileUrl: mobileUrl.trim() || undefined,
      desktopUrl: desktopUrl.trim() || undefined,
      isActive,
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal edit-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">DYNAMIC LINK</span>
            <h2>Edit smart link</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="permanent-link">
          <div className="permanent-icon">
            <Link2 size={17} />
          </div>

          <div>
            <span>Permanent short URL</span>
            <strong>{link.shortUrl}</strong>
          </div>
        </div>

        <p className="dynamic-hint">
          This URL and its QR code stay the same when you change the
          destinations below.
        </p>

        <form onSubmit={submit}>
          <label>
            Link name
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Default destination
            <div className="input-with-icon">
              <ExternalLink size={15} />

              <input
                required
                type="url"
                value={destinationUrl}
                onChange={(event) =>
                  setDestinationUrl(event.target.value)
                }
              />
            </div>
          </label>

          <div className="routing-editor">
            <div className="routing-title">
              <span>SMART ROUTING</span>
              <p>Override the default destination by device.</p>
            </div>

            <label>
              <span className="field-title">
                <Smartphone size={14} />
                Mobile
              </span>

              <input
                type="url"
                value={mobileUrl}
                onChange={(event) => setMobileUrl(event.target.value)}
                placeholder="Uses default when empty"
              />
            </label>

            <label>
              <span className="field-title">
                <Monitor size={14} />
                Desktop
              </span>

              <input
                type="url"
                value={desktopUrl}
                onChange={(event) => setDesktopUrl(event.target.value)}
                placeholder="Uses default when empty"
              />
            </label>
          </div>

          <div className="active-setting">
            <div>
              <strong>Link active</strong>
              <span>
                Disabled links stop redirecting until reactivated.
              </span>
            </div>

            <button
              type="button"
              className={`switch ${isActive ? "on" : ""}`}
              onClick={() => setIsActive((current) => !current)}
              aria-label="Toggle link status"
            >
              <span />
            </button>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="primary-button" disabled={loading}>
              <Save size={16} />
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}