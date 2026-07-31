import {
  BarChart3,
  Globe2,
  Monitor,
  MousePointerClick,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SmartLink } from "../types/link";

interface Analytics {
  totalClicks: number;

  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };

  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;

  recentClicks: Array<{
    _id: string;
    device: string;
    browser: string;
    os: string;
    referrer: string;
    createdAt: string;
  }>;
}

interface Props {
  open: boolean;
  link: SmartLink | null;
  analytics: Analytics | null;
  loading: boolean;
  onClose: () => void;
}

export default function AnalyticsDrawer({
  open,
  link,
  analytics,
  loading,
  onClose,
}: Props) {
  if (!open) return null;

  const deviceData = analytics
    ? [
        {
          name: "Desktop",
          clicks: analytics.devices.desktop,
        },
        {
          name: "Mobile",
          clicks: analytics.devices.mobile,
        },
        {
          name: "Tablet",
          clicks: analytics.devices.tablet,
        },
      ]
    : [];

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />

      <aside className="analytics-drawer">
        <div className="drawer-header">
          <div>
            <span className="eyebrow">LINK ANALYTICS</span>
            <h2>{link?.title || "Analytics"}</h2>

            {link && <p>{link.shortUrl}</p>}
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        {loading ? (
          <div className="drawer-loading">
            Loading analytics...
          </div>
        ) : analytics ? (
          <div className="analytics-content">
            <section className="analytics-total">
              <div className="analytics-total-icon">
                <MousePointerClick size={20} />
              </div>

              <div>
                <span>Total clicks</span>
                <strong>{analytics.totalClicks}</strong>
              </div>
            </section>

            <section className="analytics-block">
              <div className="analytics-block-title">
                <div>
                  <BarChart3 size={16} />
                  <h3>Devices</h3>
                </div>

                <span>ALL TIME</span>
              </div>

              <div className="device-summary">
                <div>
                  <Monitor size={16} />
                  <strong>{analytics.devices.desktop}</strong>
                  <span>Desktop</span>
                </div>

                <div>
                  <Smartphone size={16} />
                  <strong>{analytics.devices.mobile}</strong>
                  <span>Mobile</span>
                </div>

                <div>
                  <Tablet size={16} />
                  <strong>{analytics.devices.tablet}</strong>
                  <span>Tablet</span>
                </div>
              </div>

              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={deviceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="clicks"
                      fill="#252522"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-block">
              <div className="analytics-block-title">
                <div>
                  <Globe2 size={16} />
                  <h3>Browsers</h3>
                </div>
              </div>

              <div className="analytics-list">
                {Object.entries(analytics.browsers).length === 0 ? (
                  <p className="analytics-empty">
                    No browser data yet.
                  </p>
                ) : (
                  Object.entries(analytics.browsers).map(
                    ([browser, count]) => (
                      <div className="analytics-row" key={browser}>
                        <span>{browser}</span>
                        <strong>{count}</strong>
                      </div>
                    )
                  )
                )}
              </div>
            </section>

            <section className="analytics-block">
              <div className="analytics-block-title">
                <div>
                  <Monitor size={16} />
                  <h3>Operating systems</h3>
                </div>
              </div>

              <div className="analytics-list">
                {Object.entries(
                  analytics.operatingSystems
                ).map(([os, count]) => (
                  <div className="analytics-row" key={os}>
                    <span>{os}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="analytics-block">
              <div className="analytics-block-title">
                <div>
                  <MousePointerClick size={16} />
                  <h3>Recent activity</h3>
                </div>
              </div>

              {analytics.recentClicks.length === 0 ? (
                <p className="analytics-empty">
                  No visits recorded yet.
                </p>
              ) : (
                <div className="activity-list">
                  {analytics.recentClicks.map((click) => (
                    <div className="activity-item" key={click._id}>
                      <div className="activity-dot" />

                      <div>
                        <strong>
                          {click.browser} on {click.os}
                        </strong>

                        <span>
                          {click.device} ·{" "}
                          {new Date(
                            click.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="drawer-loading">
            Analytics unavailable.
          </div>
        )}
      </aside>
    </>
  );
}