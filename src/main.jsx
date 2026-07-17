import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  Filter,
  Gauge,
  Lock,
  Menu,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import "./styles.css";

const routes = [
  { path: "/", label: "Overview", icon: Gauge },
  { path: "/pricing", label: "Pricing", icon: Sparkles },
  { path: "/checkout", label: "Checkout", icon: CreditCard },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/support", label: "Support", icon: MessageSquare },
  { path: "/account", label: "Account", icon: UserRound }
];

const pageMeta = {
  "/": {
    title: "Workspace Overview",
    eyebrow: "Northstar Ops",
    summary: "A command surface for teams watching product health, revenue risk, and release readiness."
  },
  "/pricing": {
    title: "Pricing",
    eyebrow: "Plan Selection",
    summary: "Compare workspace plans, billing periods, and conversion features before checkout."
  },
  "/checkout": {
    title: "Checkout",
    eyebrow: "Activation",
    summary: "Complete billing, assign seats, and launch the onboarding workspace."
  },
  "/dashboard": {
    title: "Dashboard",
    eyebrow: "Product Analytics",
    summary: "Review adoption, conversion, and incident signals across customer journeys."
  },
  "/support": {
    title: "Support",
    eyebrow: "Help Center",
    summary: "Find articles, open assistant replies, and recover blocked customer flows."
  },
  "/account": {
    title: "Account",
    eyebrow: "Workspace Settings",
    summary: "Manage identity, permissions, billing contacts, and notification routing."
  }
};

function trackFixtureEvent(eventName, detail = {}) {
  const payload = {
    eventName,
    detail,
    path: window.location.pathname,
    at: new Date().toISOString()
  };
  const existing = JSON.parse(localStorage.getItem("uxFixtureEvents") || "[]");
  existing.push(payload);
  localStorage.setItem("uxFixtureEvents", JSON.stringify(existing.slice(-80)));
  window.dispatchEvent(new CustomEvent("ux-fixture-event", { detail: payload }));
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  trackFixtureEvent("navigation", { path });
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return pathname;
}

function App() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lateBanner, setLateBanner] = useState(false);
  const current = pageMeta[pathname] || pageMeta["/support"];

  useEffect(() => {
    document.body.dataset.route = pathname.replace("/", "") || "overview";
    setMenuOpen(false);
    setLateBanner(false);
    const timer = window.setTimeout(() => {
      if (["/", "/pricing", "/dashboard"].includes(pathname)) {
        setLateBanner(true);
        trackFixtureEvent("layout_shift_seed", { component: "late-risk-banner" });
      }
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="app-shell" data-page={pathname}>
      <aside className={`side-nav ${menuOpen ? "is-open" : ""}`} data-defect-id="mobile-navigation">
        <button className="brand" onClick={() => navigate("/")} aria-label="Go to overview">
          <span className="brand-mark">N</span>
          <span>
            <strong>Northstar</strong>
            <small>Ops Console</small>
          </span>
        </button>
        <nav aria-label="Primary">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <button
                key={route.path}
                className={pathname === route.path ? "active" : ""}
                onClick={() => navigate(route.path)}
              >
                <Icon size={18} />
                <span>{route.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="nav-card" data-defect-id="decorative-help-card">
          <CircleHelp size={18} />
          <span>Release checklist</span>
          <button
            className="micro-icon"
            aria-label="Dismiss release checklist"
            onClick={() => trackFixtureEvent("tiny_dismiss_clicked", { component: "release-checklist" })}
          >
            <X size={13} />
          </button>
        </div>
      </aside>

      <main className="page-frame">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen((value) => !value)}
            data-defect-id="small-mobile-menu-target"
          >
            <Menu size={18} />
          </button>
          <div className="search-shell" data-defect-id="search-affordance">
            <Search size={16} />
            <input
              placeholder="Search accounts, reports, or tickets"
              onFocus={() => trackFixtureEvent("search_focus", { expected: true })}
            />
            <kbd>?</kbd>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Refresh workspace">
              <RefreshCw size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => trackFixtureEvent("dead_click_seed", { component: "notifications" })}
              data-defect-id="notification-dead-click"
            >
              <Bell size={17} />
            </button>
          </div>
        </header>

        {lateBanner && (
          <section className="late-banner" data-defect-id="layout-shift-risk-banner">
            <AlertTriangle size={18} />
            <span>Three high-value accounts have delayed onboarding tasks.</span>
            <button onClick={() => navigate("/dashboard")}>Review</button>
          </section>
        )}

        <section className="page-hero">
          <div>
            <p>{current.eyebrow}</p>
            <h1>{current.title}</h1>
            <span>{current.summary}</span>
          </div>
          <HeroActions pathname={pathname} />
        </section>

        <RouteView pathname={pathname} />
      </main>
    </div>
  );
}

function HeroActions({ pathname }) {
  if (pathname === "/checkout") {
    return (
      <button
        className="primary-action"
        onClick={() => trackFixtureEvent("checkout_header_cta", { component: "hero-continue" })}
      >
        <CreditCard size={17} />
        Continue setup
      </button>
    );
  }

  return (
    <div className="hero-actions" data-component="hero-cta">
      <button className="primary-action" onClick={() => navigate("/dashboard")}>
        <BarChart3 size={17} />
        Open dashboard
      </button>
      <button
        className="secondary-action"
        onClick={() => trackFixtureEvent("ambiguous_secondary_cta", { component: "book-review" })}
        data-defect-id="hero-secondary-dead-click"
      >
        <CalendarDays size={17} />
        Book review
      </button>
    </div>
  );
}

function RouteView({ pathname }) {
  switch (pathname) {
    case "/pricing":
      return <Pricing />;
    case "/checkout":
      return <Checkout />;
    case "/dashboard":
      return <Dashboard />;
    case "/support":
      return <Support />;
    case "/account":
      return <Account />;
    case "/support/article/loading":
      return <LoadingArticle />;
    default:
      return <Overview />;
  }
}

function Overview() {
  const cards = [
    { label: "Open activation risk", value: "18", trend: "+4 this week", defect: "audit-card-non-clickable" },
    { label: "Revenue at risk", value: "$184k", trend: "6 accounts", defect: "metric-card-affordance" },
    { label: "Waiting on design", value: "11", trend: "3 escalated", defect: "false-positive-design-card" }
  ];

  return (
    <div className="content-grid overview-layout">
      <section className="panel audit-board" data-defect-id="audit-board">
        <div className="section-heading">
          <span>Audit board</span>
          <button className="icon-button" aria-label="Filter audit board">
            <Filter size={16} />
          </button>
        </div>
        <div className="metric-row">
          {cards.map((card) => (
            <button
              key={card.label}
              className="metric-card"
              data-defect-id={card.defect}
              onClick={() => trackFixtureEvent("dead_click_seed", { component: card.defect })}
            >
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.trend}</small>
            </button>
          ))}
        </div>
        <div className="pipeline" data-component="conversion-pipeline">
          {["Visit", "Qualify", "Trial", "Security", "Purchase"].map((step, index) => (
            <div key={step} className="pipeline-step" style={{ "--height": `${54 + index * 9}%` }}>
              <span>{step}</span>
              <i />
            </div>
          ))}
        </div>
      </section>

      <section className="panel activity-rail" data-defect-id="activity-rail">
        <div className="section-heading">
          <span>Recent activity</span>
          <button
            className="text-button looks-like-link"
            onClick={() => trackFixtureEvent("false_positive_click", { component: "activity-view-all" })}
          >
            View all
          </button>
        </div>
        <Timeline />
      </section>
    </div>
  );
}

function Timeline() {
  const items = [
    ["Checkout form", "Two users returned to pricing after payment validation."],
    ["Support search", "Article clicks spike on mobile viewport widths under 390px."],
    ["Dashboard export", "Repeated clicks around CSV control in Chrome."]
  ];

  return (
    <ol className="timeline">
      {items.map(([title, detail], index) => (
        <li key={title}>
          <span>{index + 1}</span>
          <div>
            <strong>{title}</strong>
            <p>{detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const [selected, setSelected] = useState("scale");

  const plans = [
    { id: "starter", name: "Starter", price: "$79", badge: "For pilots" },
    { id: "scale", name: "Scale", price: "$229", badge: "Most used" },
    { id: "enterprise", name: "Enterprise", price: "Talk to sales", badge: "Security review" }
  ];

  return (
    <div className="stacked-page" data-page="pricing">
      <section className="panel pricing-panel">
        <div className="section-heading wrap">
          <span>Choose a plan</span>
          <div className="segmented" data-defect-id="billing-toggle-small-hit-target">
            {["monthly", "annual"].map((item) => (
              <button
                key={item}
                className={period === item ? "selected" : ""}
                onClick={() => setPeriod(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="plans" data-component="plan-selector">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card ${selected === plan.id ? "chosen" : ""}`}
              data-defect-id={`plan-card-${plan.id}`}
              onClick={() => {
                if (plan.id === "enterprise") {
                  trackFixtureEvent("dead_click_seed", { component: "enterprise-plan-card" });
                  return;
                }
                setSelected(plan.id);
              }}
            >
              <span>{plan.badge}</span>
              <h2>{plan.name}</h2>
              <strong>{plan.price}</strong>
              <p>{period === "annual" ? "Annual billing applied at checkout." : "Monthly billing with flexible seat changes."}</p>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  if (plan.id === "enterprise") {
                    trackFixtureEvent("rage_click_seed", { component: "enterprise-contact-button" });
                    return;
                  }
                  setSelected(plan.id);
                  navigate("/checkout");
                }}
              >
                {plan.id === "enterprise" ? "Contact sales" : "Select plan"}
                <ChevronRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel comparison" data-defect-id="comparison-table-horizontal-scroll">
        <div className="section-heading">
          <span>Feature comparison</span>
          <span className="quiet-label">Scroll behavior differs on mobile</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Starter</th>
                <th>Scale</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Journey analytics",
                "Clarity review queue",
                "Design parity checks",
                "Linear issue sync",
                "Executive reporting"
              ].map((row, index) => (
                <tr key={row}>
                  <td>{row}</td>
                  <td>{index < 2 ? "Included" : "Limited"}</td>
                  <td>Included</td>
                  <td>{index === 4 ? "Custom" : "Included"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Checkout() {
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState("idle");
  const [saveState, setSaveState] = useState("idle");
  const [seatCount, setSeatCount] = useState(7);

  function applyCoupon() {
    setCouponState("checking");
    trackFixtureEvent("javascript_error_seed", { component: "coupon-entry", coupon });
    window.setTimeout(() => {
      Promise.reject(new Error("UX-FIXTURE checkout coupon validation failed"));
      setCouponState("failed");
    }, 500);
  }

  function submitCheckout(event) {
    event.preventDefault();
    setSaveState("loading");
    trackFixtureEvent("submit_without_completion", { component: "checkout-form" });
    window.setTimeout(() => setSaveState("stalled"), 1800);
  }

  return (
    <form className="checkout-grid" onSubmit={submitCheckout} data-page="checkout">
      <section className="panel checkout-form" data-defect-id="checkout-form-validation">
        <div className="section-heading">
          <span>Billing details</span>
          <span className="lock-label"><Lock size={13} /> Secure</span>
        </div>
        <div className="form-grid">
          <label>
            Full name
            <input required defaultValue="Mira Patel" />
          </label>
          <label>
            Work email
            <input required type="email" defaultValue="mira@northwind.example" />
          </label>
          <label className="span-two">
            Card number
            <input
              required
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              onInvalid={() => trackFixtureEvent("error_click_seed", { component: "card-number" })}
            />
          </label>
          <label>
            Expiry
            <input required placeholder="MM / YY" />
          </label>
          <label>
            CVC
            <input required placeholder="123" />
          </label>
        </div>
        <div className="coupon-row" data-defect-id="coupon-entry-js-error">
          <label>
            Promo code
            <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="SUMMER26" />
          </label>
          <button type="button" onClick={applyCoupon}>
            Apply
          </button>
        </div>
        {couponState === "failed" && (
          <p className="floating-error">Promo code cannot be verified. Try again later.</p>
        )}
      </section>

      <aside className="panel order-summary" data-defect-id="payment-summary">
        <div className="section-heading">
          <span>Order summary</span>
          <span className="quiet-label">Scale plan</span>
        </div>
        <div className="seat-stepper" data-defect-id="small-touch-target-seat-stepper">
          <span>Seats</span>
          <button type="button" onClick={() => setSeatCount(Math.max(1, seatCount - 1))}>-</button>
          <strong>{seatCount}</strong>
          <button type="button" onClick={() => setSeatCount(seatCount + 1)}>+</button>
        </div>
        <dl className="summary-list">
          <div><dt>Base plan</dt><dd>$229</dd></div>
          <div><dt>Seats</dt><dd>${seatCount * 18}</dd></div>
          <div><dt>Tax estimate</dt><dd>$41</dd></div>
          <div className="total"><dt>Total due</dt><dd>${229 + seatCount * 18 + 41}</dd></div>
        </dl>
        <button className="primary-action full" type="submit" data-defect-id="checkout-primary-stalled-state">
          {saveState === "loading" ? "Processing..." : saveState === "stalled" ? "Still processing" : "Start workspace"}
        </button>
      </aside>

      <div className="mobile-pay-bar" data-defect-id="mobile-sticky-footer-overlap">
        <span>${229 + seatCount * 18 + 41}</span>
        <button type="submit">Pay now</button>
      </div>
    </form>
  );
}

function Dashboard() {
  const [range, setRange] = useState("7d");
  const [tab, setTab] = useState("conversion");

  const chartBars = useMemo(
    () => [44, 68, 35, 80, 58, 74, 49, 66, 37, 59, 72, 52],
    []
  );

  return (
    <div className="stacked-page" data-page="dashboard">
      <section className="panel dashboard-toolbar" data-defect-id="date-filter-small-hit-target">
        <div className="segmented compact">
          {["24h", "7d", "30d", "QTD"].map((item) => (
            <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>
              {item}
            </button>
          ))}
        </div>
        <button
          className="export-button"
          data-defect-id="export-csv-dead-click"
          onClick={() => trackFixtureEvent("excessive_click_seed", { component: "export-csv" })}
        >
          <Download size={16} />
          Export CSV
        </button>
      </section>

      <section className="kpi-grid" data-defect-id="kpi-grid">
        {[
          ["Activation", "64%", "+6.4"],
          ["Checkout dropoff", "28%", "-1.1"],
          ["Mobile errors", "17", "+9"],
          ["Median load", "2.9s", "+0.8"]
        ].map(([label, value, trend]) => (
          <article key={label} className="panel kpi-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{trend}</small>
          </article>
        ))}
      </section>

      <section className="panel chart-panel" data-defect-id="chart-tabs-ambiguous-state">
        <div className="section-heading wrap">
          <span>Journey health</span>
          <div className="segmented">
            {["conversion", "errors", "rage clicks"].map((item) => (
              <button key={item} className={tab === item ? "selected" : ""} onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-bars" aria-label={`${tab} chart for ${range}`}>
          {chartBars.map((height, index) => (
            <span key={index} style={{ "--bar": `${height}%` }} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Support() {
  const [query, setQuery] = useState("");
  const articles = [
    "Resolve failed coupon validation",
    "Understand dashboard export limits",
    "Invite a billing approver",
    "Troubleshoot mobile checkout overlap"
  ];

  return (
    <div className="support-layout" data-page="support">
      <section className="panel support-search" data-defect-id="help-search-autocomplete">
        <div className="search-large">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search help articles"
          />
        </div>
        <div className="article-list" data-defect-id="article-list-quickback">
          {articles.map((article, index) => (
            <button
              key={article}
              onClick={() => {
                if (index === 0) navigate("/support/article/loading");
                else trackFixtureEvent("dead_click_seed", { component: "support-article", article });
              }}
            >
              <span>{article}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <aside className="panel assistant-panel" data-defect-id="assistant-panel-disabled-send">
        <div className="section-heading">
          <span>Assistant</span>
          <span className="status-dot">Online</span>
        </div>
        <div className="assistant-thread">
          <p>Share the page and component where the customer is blocked.</p>
          <p>Attach a recording link for faster routing.</p>
        </div>
        <div className="assistant-composer">
          <input placeholder="Type a message" aria-label="Assistant message" />
          <button onClick={() => trackFixtureEvent("dead_click_seed", { component: "assistant-send" })}>
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}

function LoadingArticle() {
  useEffect(() => {
    trackFixtureEvent("quick_back_seed", { component: "support-loading-article" });
  }, []);

  return (
    <section className="panel loading-article" data-defect-id="quickback-article">
      <button className="text-button" onClick={() => navigate("/support")}>
        <ArrowLeft size={15} />
        Back to support
      </button>
      <div className="skeleton-block" />
      <div className="skeleton-line wide" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </section>
  );
}

function Account() {
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(true);

  function saveAccount(event) {
    event.preventDefault();
    setSaving(true);
    trackFixtureEvent("stalled_save_seed", { component: "account-save" });
  }

  return (
    <form className="account-grid" onSubmit={saveAccount} data-page="account">
      <section className="panel profile-form" data-defect-id="profile-form-label-mismatch">
        <div className="section-heading">
          <span>Profile</span>
          <ShieldCheck size={17} />
        </div>
        <label>
          Display name
          <input defaultValue="Mira Patel" />
        </label>
        <label>
          Company URL
          <input defaultValue="northwind.example/app" />
        </label>
        <label>
          Notification email
          <input defaultValue="billing@northwind.example" />
        </label>
      </section>

      <section className="panel permission-panel" data-defect-id="permission-toggle-small-target">
        <div className="section-heading">
          <span>Permissions</span>
          <Settings size={17} />
        </div>
        {["Design comments", "Linear creation", "Weekly report", "Teams summary"].map((item, index) => (
          <button
            type="button"
            key={item}
            className="permission-row"
            onClick={() => {
              if (index === 2) trackFixtureEvent("false_positive_click", { component: "weekly-report-toggle" });
              else setEnabled((value) => !value);
            }}
          >
            <span>{item}</span>
            <i className={enabled || index < 2 ? "on" : ""}>{enabled || index < 2 ? <Check size={13} /> : ""}</i>
          </button>
        ))}
        <button className="primary-action full" type="submit" data-defect-id="account-save-stalled">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </section>
    </form>
  );
}

createRoot(document.getElementById("root")).render(<App />);
