import { useState, type FormEvent } from "react";
import { X, Zap } from "lucide-react";

import type { CreateLinkPayload } from "../types/link";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (payload: CreateLinkPayload) => Promise<void>;
}

const initialForm: CreateLinkPayload = {
  title: "",
  destinationUrl: "",
  customAlias: "",
  mobileUrl: "",
  desktopUrl: "",
};

export default function CreateLinkModal({
  open,
  loading,
  onClose,
  onCreate,
}: Props) {
  const [form, setForm] = useState<CreateLinkPayload>(initialForm);
  const [advanced, setAdvanced] = useState(false);

  if (!open) return null;

  const update = (key: keyof CreateLinkPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    await onCreate({
      ...form,
      title: form.title.trim(),
      destinationUrl: form.destinationUrl.trim(),
      customAlias: form.customAlias?.trim() || undefined,
      mobileUrl: form.mobileUrl?.trim() || undefined,
      desktopUrl: form.desktopUrl?.trim() || undefined,
    });

    setForm(initialForm);
    setAdvanced(false);
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">NEW SMART LINK</span>
            <h2>Create a link</h2>
          </div>

          <button className="icon-button" onClick={onClose} type="button">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label>
            Link name
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Product launch"
            />
          </label>

          <label>
            Destination URL
            <input
              required
              type="url"
              value={form.destinationUrl}
              onChange={(e) => update("destinationUrl", e.target.value)}
              placeholder="https://example.com/product"
            />
          </label>

          <label>
            Custom alias
            <div className="alias-input">
              <span>/r/</span>

              <input
                value={form.customAlias}
                onChange={(e) => update("customAlias", e.target.value)}
                placeholder="launch"
              />
            </div>
          </label>

          <button
            className="advanced-toggle"
            type="button"
            onClick={() => setAdvanced((value) => !value)}
          >
            <Zap size={16} />

            {advanced ? "Hide smart routing" : "Add smart routing"}
          </button>

          {advanced && (
            <div className="advanced-panel">
              <label>
                Mobile destination
                <input
                  type="url"
                  value={form.mobileUrl}
                  onChange={(e) => update("mobileUrl", e.target.value)}
                  placeholder="https://m.example.com"
                />
              </label>

              <label>
                Desktop destination
                <input
                  type="url"
                  value={form.desktopUrl}
                  onChange={(e) => update("desktopUrl", e.target.value)}
                  placeholder="https://example.com/desktop"
                />
              </label>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="primary-button" disabled={loading}>
              {loading ? "Creating..." : "Create smart link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}