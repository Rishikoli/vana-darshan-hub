import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Tribe: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnTribe = location.pathname === "/tribe";

  // --- Mock Data (replace with API data later) ---
  type TribeRow = {
    name: string;
    region: string;
    population: number;
    forestCoverKm2: number;
    claimsTotal: number;
    claimsApproved: number;
    claimsPending: number;
    claimsRejected: number;
    health: "healthy" | "moderate" | "degraded";
  };

  const data: TribeRow[] = [
    { name: "Gond", region: "Central India", population: 15000000, forestCoverKm2: 120000, claimsTotal: 52000, claimsApproved: 34000, claimsPending: 15000, claimsRejected: 3000, health: "healthy" },
    { name: "Bhil", region: "Western India", population: 17000000, forestCoverKm2: 95000, claimsTotal: 43000, claimsApproved: 27000, claimsPending: 12000, claimsRejected: 4000, health: "degraded" },
    { name: "Santhal", region: "Eastern India", population: 7000000, forestCoverKm2: 68000, claimsTotal: 21000, claimsApproved: 12000, claimsPending: 7000, claimsRejected: 2000, health: "moderate" },
    { name: "Toda", region: "Western Ghats", population: 60000, forestCoverKm2: 2400, claimsTotal: 1200, claimsApproved: 800, claimsPending: 300, claimsRejected: 100, health: "healthy" },
    { name: "Khasi", region: "North East", population: 1400000, forestCoverKm2: 26000, claimsTotal: 9800, claimsApproved: 6400, claimsPending: 2800, claimsRejected: 600, health: "healthy" },
    { name: "Garo", region: "North East", population: 1100000, forestCoverKm2: 22000, claimsTotal: 8700, claimsApproved: 5200, claimsPending: 2900, claimsRejected: 600, health: "moderate" },
  ];

  // --- Filters ---
  const tribeOptions = useMemo(() => Array.from(new Set(data.map(d => d.name))).sort(), [data]);
  const [selectedTribe, setSelectedTribe] = useState<string>("All");
  const [healthFilter, setHealthFilter] = useState<"All" | "healthy" | "moderate" | "degraded">("All");

  const filtered = useMemo(() => {
    return data.filter(d => (selectedTribe === "All" || d.name === selectedTribe) && (healthFilter === "All" || d.health === healthFilter));
  }, [data, selectedTribe, healthFilter]);

  // --- Aggregates ---
  const aggregates = useMemo(() => {
    const base = { tribes: 0, population: 0, forest: 0, claimsTotal: 0, approved: 0, pending: 0, rejected: 0 };
    for (const d of filtered) {
      base.tribes += 1;
      base.population += d.population;
      base.forest += d.forestCoverKm2;
      base.claimsTotal += d.claimsTotal;
      base.approved += d.claimsApproved;
      base.pending += d.claimsPending;
      base.rejected += d.claimsRejected;
    }
    return base;
  }, [filtered]);

  // --- Helpers ---
  const fmt = new Intl.NumberFormat("en-IN");
  const pct = (num: number, den: number) => (den ? Math.round((num / den) * 100) : 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1f2937" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Tribe Insights</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Go to Home</span>
          <button
            role="switch"
            aria-checked={isOnTribe}
            aria-label="Toggle to navigate between Home and Tribe pages"
            onClick={() => {
              if (isOnTribe) navigate("/");
              else navigate("/tribe");
            }}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                if (isOnTribe) navigate("/");
                else navigate("/tribe");
              }
            }}
            style={{
              position: "relative",
              width: 46,
              height: 26,
              borderRadius: 9999,
              border: "1px solid #334155",
              background: isOnTribe ? "#10b981" : "#0f172a",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 2,
                left: isOnTribe ? 22 : 2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: isOnTribe ? "#022c22" : "#94a3b8",
                transition: "left 120ms ease-in-out",
              }}
            />
          </button>
        </div>
      </header>

      <main style={{ padding: 20 }}>
        {/* Filters */}
        <section style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", background: "#0f172a", border: "1px solid #1f2937", padding: "8px 10px", borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Tribe</span>
            <select
              value={selectedTribe}
              onChange={(e) => setSelectedTribe(e.target.value)}
              style={{ background: "#0b1220", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 6, padding: "6px 8px" }}
            >
              <option>All</option>
              {tribeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#0f172a", border: "1px solid #1f2937", padding: "8px 10px", borderRadius: 8 }}>
            <span id="health-filter-label" style={{ fontSize: 12, color: "#94a3b8" }}>Health</span>
            {(["All", "healthy", "moderate", "degraded"] as const).map(h => (
              <button
                key={h}
                role="switch"
                aria-labelledby="health-filter-label"
                aria-checked={healthFilter === h}
                onClick={() => setHealthFilter(h)}
                style={{
                  position: "relative",
                  padding: "6px 10px",
                  borderRadius: 9999,
                  border: "1px solid #334155",
                  background: healthFilter === h ? (h === "healthy" ? "#22c55e" : h === "moderate" ? "#facc15" : h === "degraded" ? "#ef4444" : "#10b981") : "#0b1220",
                  color: healthFilter === h ? "#000" : "#e2e8f0",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {typeof h === "string" ? h[0].toUpperCase() + h.slice(1) : h}
              </button>
            ))}
          </div>
        </section>

        {/* KPI Cards */}
        <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 20 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Total Tribes</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt.format(aggregates.tribes)}</div>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Population (est.)</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt.format(aggregates.population)}</div>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Forest Cover</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt.format(aggregates.forest)} km²</div>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Claims</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt.format(aggregates.claimsTotal)}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>
              Approved {fmt.format(aggregates.approved)} • Pending {fmt.format(aggregates.pending)} • Rejected {fmt.format(aggregates.rejected)}
            </div>
          </div>
        </section>

        {/* Claims Breakdown Bar */}
        <section style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Claims Breakdown</div>
          <div style={{ height: 16, width: "100%", background: "#111827", borderRadius: 9999, overflow: "hidden", display: "flex" }} aria-label="Claims breakdown bar">
            <div style={{ width: `${pct(aggregates.approved, aggregates.claimsTotal)}%`, background: "#22c55e" }} title={`Approved ${pct(aggregates.approved, aggregates.claimsTotal)}%`} />
            <div style={{ width: `${pct(aggregates.pending, aggregates.claimsTotal)}%`, background: "#facc15" }} title={`Pending ${pct(aggregates.pending, aggregates.claimsTotal)}%`} />
            <div style={{ width: `${pct(aggregates.rejected, aggregates.claimsTotal)}%`, background: "#ef4444" }} title={`Rejected ${pct(aggregates.rejected, aggregates.claimsTotal)}%`} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
            <span>Approved: {pct(aggregates.approved, aggregates.claimsTotal)}%</span>
            <span>Pending: {pct(aggregates.pending, aggregates.claimsTotal)}%</span>
            <span>Rejected: {pct(aggregates.rejected, aggregates.claimsTotal)}%</span>
          </div>
        </section>

        {/* Table + Next Steps */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr" }}>
          {/* Data Table */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: 12, borderBottom: "1px solid #1f2937", fontWeight: 600 }}>Tribe Details</div>
            <div role="table" aria-label="Tribe details" style={{ width: "100%", overflowX: "auto" }}>
              <div role="row" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: 8, padding: "8px 12px", color: "#94a3b8", borderBottom: "1px solid #1f2937", fontSize: 12 }}>
                <div role="columnheader">Tribe</div>
                <div role="columnheader">Region</div>
                <div role="columnheader">Population</div>
                <div role="columnheader">Forest Cover</div>
                <div role="columnheader">Claims (A/P/R)</div>
                <div role="columnheader">Total</div>
                <div role="columnheader">Health</div>
              </div>
              {filtered.map((d, idx) => (
                <div key={idx} role="row" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: 8, padding: "10px 12px", borderBottom: "1px solid #111827", alignItems: "center" }}>
                  <div role="cell" style={{ fontWeight: 600 }}>{d.name}</div>
                  <div role="cell" style={{ color: "#cbd5e1" }}>{d.region}</div>
                  <div role="cell">{fmt.format(d.population)}</div>
                  <div role="cell">{fmt.format(d.forestCoverKm2)} km²</div>
                  <div role="cell">
                    <span title="Approved" style={{ color: "#22c55e" }}>{fmt.format(d.claimsApproved)}</span>
                    <span style={{ color: "#94a3b8" }}> / </span>
                    <span title="Pending" style={{ color: "#facc15" }}>{fmt.format(d.claimsPending)}</span>
                    <span style={{ color: "#94a3b8" }}> / </span>
                    <span title="Rejected" style={{ color: "#ef4444" }}>{fmt.format(d.claimsRejected)}</span>
                  </div>
                  <div role="cell">{fmt.format(d.claimsTotal)}</div>
                  <div role="cell">
                    <span style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: d.health === "healthy" ? "#22c55e" : d.health === "moderate" ? "#facc15" : "#ef4444",
                      marginRight: 6
                    }} />
                    {d.health[0].toUpperCase() + d.health.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Next Steps</div>
            <ul style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
              <li><strong style={{ color: "#e2e8f0" }}>Connect to live data API</strong> — integrate MoTA/FRA endpoints; add auth, caching, and error states.</li>
              <li><strong style={{ color: "#e2e8f0" }}>Add filters per tribe</strong> — multi-select tribes, region filter, health chips, and search.</li>
              <li><strong style={{ color: "#e2e8f0" }}>Visualize claim statuses</strong> — mini bar charts per row and a trends view over time.</li>
              <li><strong style={{ color: "#e2e8f0" }}>Export & sharing</strong> — CSV export of current view and shareable links with query params.</li>
              <li><strong style={{ color: "#e2e8f0" }}>Accessibility</strong> — ensure keyboard operability and proper ARIA across all filters.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tribe;
