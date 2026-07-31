import { useEffect, useState, type FormEvent } from "react";
import {
  Link2,
  Monitor,
  QrCode,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";

interface QRFormData {
  title: string;
  destinationUrl: string;
  customAlias: string;
  mobileUrl: string;
  desktopUrl: string;
}

interface Props {
  open: boolean;
  onClose: () => void;

  // Backend connection comes next.
  onGenerate?: (data: QRFormData) => Promise<void> | void;
}

const initialForm: QRFormData = {
  title: "",
  destinationUrl: "",
  customAlias: "",
  mobileUrl: "",
  desktopUrl: "",
};

export default function CreateQRModal({
  open,
  onClose,
  onGenerate,
}: Props) {
  const [form, setForm] = useState<QRFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (
    field: keyof QRFormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const cleanAlias =
    form.customAlias.trim().replace(/\s+/g, "-").toLowerCase() ||
    "your-alias";

  const previewUrl = `linkforge.app/r/${cleanAlias}`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!onGenerate) {
      console.log("QR form:", form);
      return;
    }

    try {
      setLoading(true);

      await onGenerate({
        ...form,
        title: form.title.trim(),
        destinationUrl: form.destinationUrl.trim(),
        customAlias: form.customAlias.trim(),
        mobileUrl: form.mobileUrl.trim(),
        desktopUrl: form.desktopUrl.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="create-qr-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="create-qr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-qr-title"
      >
        {/* HEADER */}

        <header className="create-qr-header">
          <div>
            <span className="eyebrow">DYNAMIC QR</span>

            <h2 id="create-qr-title">
              Generate Dynamic QR
            </h2>

            <p>
              Create a QR code that remains editable after it has
              been shared or printed.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close QR generator"
          >
            <X size={18} />
          </button>
        </header>

        {/* TWO COLUMNS */}

        <div className="create-qr-body">
          {/* LEFT */}

          <form
            className="create-qr-form"
            onSubmit={handleSubmit}
          >
            <span className="create-qr-section-label">
              CREATE DYNAMIC QR
            </span>

            <label className="create-qr-field">
              <span>QR name</span>

              <input
                required
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="Portfolio"
              />
            </label>

            <label className="create-qr-field">
              <span>Destination URL</span>

              <div className="create-qr-icon-input">
                <Link2 size={14} />

                <input
                  required
                  type="url"
                  value={form.destinationUrl}
                  onChange={(event) =>
                    updateField(
                      "destinationUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://example.com"
                />
              </div>
            </label>

            <label className="create-qr-field">
              <span>Custom alias</span>

              <div className="create-qr-alias">
                <span>linkforge.app/r/</span>

                <input
                  value={form.customAlias}
                  onChange={(event) =>
                    updateField(
                      "customAlias",
                      event.target.value
                    )
                  }
                  placeholder="portfolio"
                />
              </div>
            </label>

            {/* SMART ROUTING */}

            <div className="create-qr-routing">
              <div className="create-qr-routing-header">
                <div>
                  <strong>Smart routing</strong>
                  <span>Optional</span>
                </div>

                <p>
                  Send mobile and desktop visitors to different
                  destinations.
                </p>
              </div>

              <label>
                <span className="create-qr-route-label">
                  <Smartphone size={13} />
                  Mobile
                </span>

                <input
                  type="url"
                  value={form.mobileUrl}
                  onChange={(event) =>
                    updateField(
                      "mobileUrl",
                      event.target.value
                    )
                  }
                  placeholder="Uses default destination"
                />
              </label>

              <label>
                <span className="create-qr-route-label">
                  <Monitor size={13} />
                  Desktop
                </span>

                <input
                  type="url"
                  value={form.desktopUrl}
                  onChange={(event) =>
                    updateField(
                      "desktopUrl",
                      event.target.value
                    )
                  }
                  placeholder="Uses default destination"
                />
              </label>
            </div>

            <button
              type="submit"
              className="primary-button create-qr-submit"
              disabled={loading}
            >
              <QrCode size={17} />

              {loading
                ? "Generating..."
                : "Generate Dynamic QR"}
            </button>
          </form>

          {/* RIGHT */}

          <aside className="create-qr-preview">
            <span className="create-qr-section-label">
              PREVIEW
            </span>

            <div className="create-qr-placeholder">
              <QrCode size={92} strokeWidth={1.05} />

              <small>QR PREVIEW</small>
            </div>

            <div className="create-qr-preview-info">
              <h3>
                {form.title.trim() || "Your QR code"}
              </h3>

              <p>{previewUrl}</p>
            </div>

            <div className="create-qr-dynamic">
              <Sparkles size={16} />

              <div>
                <strong>Dynamic QR</strong>

                <span>
                  Change the destination later without
                  regenerating or reprinting this QR.
                </span>
              </div>
            </div>

            <div className="create-qr-routing-preview">
              <div>
                <Smartphone size={13} />

                <span>
                  Mobile
                  <strong>
                    {form.mobileUrl
                      ? "Custom route"
                      : "Default"}
                  </strong>
                </span>
              </div>

              <div>
                <Monitor size={13} />

                <span>
                  Desktop
                  <strong>
                    {form.desktopUrl
                      ? "Custom route"
                      : "Default"}
                  </strong>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}