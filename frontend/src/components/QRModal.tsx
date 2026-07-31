import { Download, ExternalLink, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  qrCode: string;
  shortUrl: string;
  onClose: () => void;
}

export default function QRModal({
  open,
  title,
  qrCode,
  shortUrl,
  onClose,
}: Props) {
  if (!open) return null;

  const download = () => {
    const anchor = document.createElement("a");

    anchor.href = qrCode;
    anchor.download = `${title || "linkforge"}-qr.png`;

    anchor.click();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal qr-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">DYNAMIC QR</span>
            <h2>{title}</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="qr-preview">
          <img src={qrCode} alt={`QR code for ${title}`} />
        </div>

        <p className="qr-description">
          This QR points to your LinkForge smart link. Change the destination
          later without reprinting the QR.
        </p>

        <div className="qr-url">
          <ExternalLink size={16} />
          <span>{shortUrl}</span>
        </div>

        <button className="primary-button full-button" onClick={download}>
          <Download size={17} />
          Download PNG
        </button>
      </div>
    </div>
  );
}