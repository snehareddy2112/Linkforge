import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Command,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  QrCode,
} from "lucide-react";

import CreateLinkModal from "../components/CreateLinkModal";
import LinkTable from "../components/LinkTable";
import QRModal from "../components/QRModal";
import StatsCards from "../components/statsCards";
import EditLinkModal from "../components/EditLinkModal";
import AnalyticsDrawer from "../components/AnalyticsDrawer";
import CreateQRModal from "../components/CreateQRModal";
import QRGallery from "../components/QRGallery";
import SmartLinksView from "../components/SmartLinksView";


import {
  checkHealth,
  createLink,
  deleteLink,
  getAnalytics,
  getLinks,
  getQR,
  updateLink,
} from "../services/api";

import type { CreateLinkPayload, SmartLink } from "../types/link";

interface QRState {
  open: boolean;
  title: string;
  qrCode: string;
  shortUrl: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<SmartLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"overview" | "links" | "qr">("overview");

  const [editLink, setEditLink] = useState<SmartLink | null>(null);
  const [saving, setSaving] = useState(false);

  const [analyticsLink, setAnalyticsLink] =
    useState<SmartLink | null>(null);

  const [analyticsData, setAnalyticsData] =
    useState<unknown | null>(null);

  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);
  
  const [qrGeneratorOpen, setQRGeneratorOpen] = useState(false);
  const [qr, setQR] = useState<QRState>({
    open: false,
    title: "",
    qrCode: "",
    shortUrl: "",
  });

  const loadLinks = async () => {
    try {
      setLoading(true);

      const data = await getLinks();

      setLinks(data);
    } catch (error) {
      console.error(error);
      alert("Could not load links. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadLinks();
    };

    void initialize();
  }, []);

  const filteredLinks = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return links;

    return links.filter(
      (link) =>
        link.title.toLowerCase().includes(value) ||
        link.shortCode.toLowerCase().includes(value) ||
        link.destinationUrl.toLowerCase().includes(value)
    );
  }, [links, search]);

  const stats = useMemo(
    () => ({
      totalLinks: links.length,

      totalClicks: links.reduce(
        (total, link) => total + link.clickCount,
        0
      ),

      activeLinks: links.filter((link) => link.isActive).length,

      healthyLinks: links.filter(
        (link) => link.healthStatus === "healthy"
      ).length,
    }),
    [links]
  );

  const handleCreate = async (payload: CreateLinkPayload) => {
    try {
      setCreating(true);

      const newLink = await createLink(payload);

      setLinks((current) => [newLink, ...current]);

      setCreateOpen(false);
    } catch (error) {
      console.error(error);
      alert("Could not create link. Check the URL or custom alias.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (link: SmartLink) => {
    const confirmed = window.confirm(
      `Delete "${link.title}"? This smart link will stop working.`
    );

    if (!confirmed) return;

    try {
      await deleteLink(link._id);

      setLinks((current) =>
        current.filter((item) => item._id !== link._id)
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete link.");
    }
  };

  const handleQR = async (link: SmartLink) => {
    try {
      const data = await getQR(link._id);

      setQR({
        open: true,
        title: link.title,
        qrCode: data.qrCode,
        shortUrl: data.shortUrl,
      });
    } catch (error) {
      console.error(error);
      alert("Could not generate QR.");
    }
  };

  const handleCreateQR = async (data: {
    title: string;
    destinationUrl: string;
    customAlias: string;
    mobileUrl: string;
    desktopUrl: string;
  }) => {
    try {
      const payload: CreateLinkPayload = {
        title: data.title.trim(),
        destinationUrl: data.destinationUrl.trim(),
        ...(data.customAlias.trim()
          ? { customAlias: data.customAlias.trim() }
          : {}),
        ...(data.mobileUrl.trim()
          ? { mobileUrl: data.mobileUrl.trim() }
          : {}),
        ...(data.desktopUrl.trim()
          ? { desktopUrl: data.desktopUrl.trim() }
          : {}),
      };

      const newLink = await createLink(payload);
      const qrData = await getQR(newLink._id);

      setLinks((current) => [newLink, ...current]);
      setQRGeneratorOpen(false);

      setQR({
        open: true,
        title: newLink.title,
        qrCode: qrData.qrCode,
        shortUrl: qrData.shortUrl,
      });
    } catch (error) {
      console.error("QR creation failed:", error);
      alert("Could not generate QR code. Check the URL or custom alias.");
      throw error;
    }
  };

  const handleHealth = async (link: SmartLink) => {
    try {
      const result = await checkHealth(link._id);

      setLinks((current) =>
        current.map((item) =>
          item._id === link._id
            ? {
                ...item,
                healthStatus: result.healthStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Health check failed.");
    }
  };

  const handleAnalytics = async (link: SmartLink) => {
    setAnalyticsLink(link);
    setAnalyticsData(null);
    setAnalyticsLoading(true);

    try {
      const data = await getAnalytics(link._id);
      setAnalyticsData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleUpdate = async (
    id: string,
    payload: {
      title: string;
      destinationUrl: string;
      mobileUrl?: string;
      desktopUrl?: string;
      isActive: boolean;
    }
  ) => {
    try {
      setSaving(true);

      const updated = await updateLink(id, payload);

      setLinks((current) =>
        current.map((link) =>
          link._id === id
            ? {
                ...link,
                ...updated,
                shortUrl: link.shortUrl,
              }
            : link
        )
      );

      setEditLink(null);
    } catch (error) {
      console.error(error);
      alert("Could not update smart link.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Link2 size={19} />
          </div>

          <span>LinkForge</span>
        </div>

        <nav>
          <button
            className={`nav-item ${view === "overview" ? "active" : ""}`}
            onClick={() => setView("overview")}
          >
            <Command size={17} />
            Overview
          </button>

          <button
            className={`nav-item ${view === "links" ? "active" : ""}`}
            onClick={() => setView("links")}
          >
            <Link2 size={17} />
            Smart links
          </button>

          <button
            className={`nav-item ${view === "qr" ? "active" : ""}`}
            onClick={() => setView("qr")}
          >
            <QrCode size={17} />
            QR Codes
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="pro-card">
            <Sparkles size={18} />

            <strong>Smart routing</strong>

            <p>One link. Different destinations.</p>

            <span>
              Built into LinkForge
              <ArrowUpRight size={13} />
            </span>
          </div>

          <div className="profile">
            <div className="avatar">LF</div>

            <div>
              <strong>Workspace</strong>
              <span>Developer</span>
            </div>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Workspace / {view === "qr" ? "QR Codes" : view === "links" ? "Smart Links" : "Overview"}
            </p>
            <h1>{view === "qr" ? "QR Codes" : "Links"}</h1>
          </div>

          <div className="topbar-actions">
  <button
    className="qr-button"
    onClick={() => setQRGeneratorOpen(true)}
  >
    <QrCode size={17} />
    Generate QR
  </button>

  <button
    className="primary-button"
    onClick={() => setCreateOpen(true)}
  >
    <Plus size={17} />
    New smart link
  </button>
</div>
        </header>

        <div className="content">
          {view === "qr" ? (
            <QRGallery
              links={filteredLinks}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              onRefresh={() => void loadLinks()}
              onQR={handleQR}
              onEdit={setEditLink}
              onAnalytics={handleAnalytics}
              onDelete={handleDelete}
            />
          ) : view === "links" ? (
            <SmartLinksView
              links={filteredLinks}
              allLinks={links}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              onRefresh={() => void loadLinks()}
              onQR={handleQR}
              onEdit={setEditLink}
              onAnalytics={handleAnalytics}
              onHealth={handleHealth}
              onDelete={handleDelete}
              onCreate={() => setCreateOpen(true)}
            />
          ) : (
            <>
          <section className="hero-copy">
            <div>
              <span className="eyebrow">OVERVIEW</span>
              <h2>Your links, under control.</h2>
              <p>
                Create permanent smart links, route visitors dynamically,
                generate QR codes and understand every click.
              </p>
            </div>
          </section>

          <StatsCards {...stats} />

          <section className="links-section">
            <div className="section-header">
              <div>
                <h3>Smart links</h3>
                <p>{links.length} links in this workspace</p>
              </div>

              <div className="toolbar">
                <div className="search-box">
                  <Search size={16} />

                  <input
                    placeholder="Search links..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  className="refresh-button"
                  onClick={() => void loadLinks()}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">Loading your links...</div>
            ) : (
              <LinkTable
                links={filteredLinks}
                onQR={handleQR}
                onDelete={handleDelete}
                onHealth={handleHealth}
                onAnalytics={handleAnalytics}
                onEdit={setEditLink}
              />
            )}
          </section>
            </>
          )}
        </div>
      </main>

      <CreateLinkModal
        open={createOpen}
        loading={creating}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <QRModal
        {...qr}
        onClose={() =>
          setQR((current) => ({
            ...current,
            open: false,
          }))
        }
      />
      <CreateQRModal
        open={qrGeneratorOpen}
        onClose={() => setQRGeneratorOpen(false)}
        onGenerate={handleCreateQR}
      />

      <EditLinkModal
        open={Boolean(editLink)}
        link={editLink}
        loading={saving}
        onClose={() => setEditLink(null)}
        onSave={handleUpdate}
      />

      <AnalyticsDrawer
        open={Boolean(analyticsLink)}
        link={analyticsLink}
        analytics={analyticsData}
        loading={analyticsLoading}
        onClose={() => {
          setAnalyticsLink(null);
          setAnalyticsData(null);
        }}
      />
    </div>
  );
}