import { useState, useEffect, useRef, useCallback } from "react";

// ── Palette — warm amber / coral / sage — NO dark/blue ─────────────────────
const C = {
  bg: "#faf7f2",
  surface: "#ffffff",
  card: "#fdf9f4",
  border: "#e8ddd0",
  borderHover: "#c8a882",
  accent: "#d97706",       // amber
  accent2: "#e85d4a",      // coral-red
  accent3: "#059669",      // sage-green
  accent4: "#7c3aed",      // violet
  accent5: "#db2777",      // rose
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  text: "#1c1410",
  muted: "#78716c",
  dim: "#f5efe8",
  dimBorder: "#ede4d8",
  white: "#ffffff",
  sidebarBg: "#1c1410",
  sidebarText: "#e8d5b7",
  sidebarMuted: "#9c8470",
  sidebarActive: "#d97706",
};

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

async function askClaude(prompt, systemMsg = "") {
  try {
    const res = await fetch(`${BACKEND}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: systemMsg }),
    });
    const data = await res.json();
    if (data.error) return `⚠️ AI Error: ${data.error}`;
    return data.response || 'No response.';
  } catch (err) {
    return `⚠️ Cannot reach backend. Is it running on port 5000?`;
  }
}

function Typewriter({ text, speed = 14 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span style={{ whiteSpace: "pre-wrap" }}>{displayed}<span style={{ animation: "blink 1s step-end infinite", color: C.accent }}>▋</span></span>;
}

function Spinner({ label = "AI is thinking…" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 13, padding: "12px 0" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite" }} />
      {label}
    </div>
  );
}

function AIBox({ response, loading, borderColor }) {
  if (loading) return <Spinner />;
  if (!response) return null;
  return (
    <div style={{ background: C.dim, borderRadius: 14, padding: 20, marginTop: 16, border: `1.5px solid ${borderColor || C.accent}55`, fontSize: 14, color: C.text, lineHeight: 1.8 }}>
      <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>✦ AI RESPONSE</div>
      <Typewriter text={response} speed={10} />
    </div>
  );
}

function Tag({ children, color, bg }) {
  return <span style={{ background: bg || C.dim, color: color || C.accent, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${color || C.accent}33` }}>{children}</span>;
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.text, fontFamily: "'Playfair Display', serif" }}>{title}</h2>
      </div>
      {subtitle && <div style={{ fontSize: 13, color: C.muted, marginLeft: 32 }}>{subtitle}</div>}
    </div>
  );
}

const inputStyle = {
  background: C.dim, border: `1.5px solid ${C.border}`, borderRadius: 10,
  padding: "10px 14px", color: C.text, fontSize: 14, width: "100%",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const btnPrimary = {
  background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, border: "none",
  borderRadius: 10, padding: "11px 20px", color: "#fff", fontWeight: 700,
  cursor: "pointer", fontSize: 14, transition: "opacity 0.2s, transform 0.15s",
};

const btnSecondary = {
  background: C.dim, border: `1.5px solid ${C.border}`, borderRadius: 10,
  padding: "9px 16px", color: C.muted, fontWeight: 600, cursor: "pointer", fontSize: 13,
};

const chipStyle = {
  border: "1.5px solid transparent", borderRadius: 20, padding: "5px 14px",
  cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, borderRadius: 14, padding: 20, border: `1.5px solid ${C.border}`, ...style }}>
    {children}
  </div>
);

// ── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "finance", icon: "💰", label: "Finance" },
  { id: "movies", icon: "🎬", label: "Movies" },
  { id: "career", icon: "🚀", label: "Career" },
  { id: "travel", icon: "✈️", label: "Travel" },
  { id: "startup", icon: "💡", label: "Startup" },
  { id: "daily", icon: "📊", label: "Daily AI" },
  { id: "solver", icon: "🧠", label: "Solver" },
];

// ══════════════════════════════════════════════════════════════════════════════
// FINANCE MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function FinanceModule() {
  const [income, setIncome] = useState("5000");
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: 1200, cat: "housing", recurring: true },
    { id: 2, name: "Food", amount: 400, cat: "food", recurring: true },
    { id: 3, name: "Transport", amount: 150, cat: "transport", recurring: true },
    { id: 4, name: "Netflix", amount: 15, cat: "subscriptions", recurring: true },
    { id: 5, name: "Gym", amount: 45, cat: "health", recurring: true },
  ]);
  const [goal, setGoal] = useState("Buy a laptop");
  const [goalAmt, setGoalAmt] = useState("1500");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [newExp, setNewExp] = useState({ name: "", amount: "", cat: "other" });
  const [activeTab, setActiveTab] = useState("overview");
  const [debt, setDebt] = useState("3000");
  const [debtRate, setDebtRate] = useState("18");
  const [investments, setInvestments] = useState([
    { name: "Index Funds", amount: 500, return: 7 },
    { name: "Savings Account", amount: 2000, return: 4.5 },
  ]);
  const [newInv, setNewInv] = useState({ name: "", amount: "", return: "" });
  const [currency, setCurrency] = useState("USD");
  const [tax, setTax] = useState("22");
  const [aiMode, setAiMode] = useState("analysis");
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 15000, saved: 4200, deadline: "Dec 2025" },
    { id: 2, name: "Vacation", target: 3000, saved: 800, deadline: "Jun 2025" },
  ]);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", saved: "", deadline: "" });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [netWorthHistory] = useState([
    { month: "Jan", value: 8200 }, { month: "Feb", value: 8600 }, { month: "Mar", value: 9100 },
    { month: "Apr", value: 8900 }, { month: "May", value: 9800 }, { month: "Jun", value: 10400 },
  ]);

  const totalExp = expenses.reduce((a, e) => a + Number(e.amount), 0);
  const savings = parseFloat(income) - totalExp;
  const savingsRate = Math.round((savings / parseFloat(income)) * 100);
  const netIncome = parseFloat(income) * (1 - parseFloat(tax) / 100);
  const monthsToGoal = Math.ceil(parseFloat(goalAmt) / Math.max(savings, 1));
  const totalInvested = investments.reduce((a, i) => a + Number(i.amount), 0);
  const expByCategory = expenses.reduce((acc, e) => { acc[e.cat] = (acc[e.cat] || 0) + Number(e.amount); return acc; }, {});

  const catColors = { housing: C.accent2, food: C.accent3, transport: C.accent, subscriptions: C.accent4, health: C.green, other: C.muted };

  const analyze = async () => {
    setLoading(true); setAiResponse("");
    let prompt = "";
    if (aiMode === "analysis") {
      prompt = `Income: $${income}/mo (after ${tax}% tax: $${netIncome.toFixed(0)}). Expenses: ${expenses.map(e => `${e.name}: $${e.amount}`).join(", ")}. Savings: $${savings}. Debt: $${debt} at ${debtRate}% APR. Investments: ${investments.map(i => `${i.name}: $${i.amount} @ ${i.return}%`).join(", ")}. Goal: "${goal}" = $${goalAmt}.
Give: 1) Complete budget health score & breakdown 2) Debt payoff strategy (avalanche vs snowball) 3) Investment allocation advice 4) Tax optimization tips 5) 3 quick wins this month 6) 12-month wealth projection`;
    } else if (aiMode === "debt") {
      prompt = `I have $${debt} in debt at ${debtRate}% APR. Monthly income: $${income}. Disposable after expenses: $${savings}.
Create: 1) Optimal payoff schedule (month by month) 2) How much interest I'll pay 3) Should I invest vs pay debt? 4) Debt consolidation advice 5) Psychological strategies to stay on track`;
    } else if (aiMode === "invest") {
      prompt = `I can invest $${savings}/month. Current portfolio: ${investments.map(i => `${i.name}: $${i.amount}`).join(", ")}. Age assumed 28. Risk tolerance: moderate.
Give: 1) Ideal asset allocation % 2) Specific ETF/fund recommendations 3) Tax-advantaged accounts to use first 4) Dollar-cost averaging strategy 5) 10-year compound growth projections`;
    } else {
      prompt = `My financial goals: ${goals.map(g => `${g.name}: $${g.target} target, $${g.saved} saved, by ${g.deadline}`).join("; ")}. Monthly savings: $${savings}.
Give: 1) Which goal to prioritize and why 2) Exact monthly allocation per goal 3) Which goals are realistic vs need adjustment 4) Creative ways to accelerate savings 5) If I had to cut one goal, which and why`;
    }
    const r = await askClaude(prompt, "You are a certified financial planner AI. Be specific with numbers, percentages, and timelines.");
    setAiResponse(r); setLoading(false);
  };

  const tabs = ["overview", "expenses", "investments", "goals", "debt"];

  return (
    <div>
      <SectionTitle icon="💰" title="AI Finance Command Center" subtitle="Track wealth, crush debt, hit every goal" />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Monthly Income", value: `$${Number(income).toLocaleString()}`, sub: `$${Math.round(netIncome).toLocaleString()} after tax`, color: C.accent3 },
          { label: "Monthly Savings", value: `$${savings.toLocaleString()}`, sub: `${savingsRate}% savings rate`, color: savings > 0 ? C.green : C.red },
          { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, sub: "across all accounts", color: C.accent },
          { label: "Months to Goal", value: monthsToGoal, sub: `"${goal}"`, color: C.accent4 },
        ].map(s => (
          <Card key={s.label} style={{ padding: "16px" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, fontWeight: 600, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 16px", background: "transparent", border: "none", borderBottom: activeTab === t ? `3px solid ${C.accent}` : "3px solid transparent", color: activeTab === t ? C.accent : C.muted, fontWeight: activeTab === t ? 700 : 500, textTransform: "capitalize", fontSize: 13 }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>EXPENSE BREAKDOWN</div>
            {Object.entries(expByCategory).map(([cat, amt]) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.text, textTransform: "capitalize" }}>{cat}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: catColors[cat] || C.muted }}>${amt}</span>
                </div>
                <div style={{ background: C.dim, borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${(amt / totalExp) * 100}%`, height: "100%", borderRadius: 4, background: catColors[cat] || C.muted, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>NET WORTH TREND</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
              {netWorthHistory.map((d, i) => {
                const max = Math.max(...netWorthHistory.map(x => x.value));
                const h = (d.value / max) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top, ${C.accent}, ${C.gold})`, borderRadius: "4px 4px 0 0", transition: "height 0.6s ease" }} />
                    <span style={{ fontSize: 9, color: C.muted }}>{d.month}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: C.accent3, marginTop: 8, fontWeight: 600 }}>↑ Net worth trending up +26.8%</div>
          </Card>
        </div>
      )}

      {activeTab === "expenses" && (
        <Card>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>ALL EXPENSES · Total: <span style={{ color: C.accent2 }}>${totalExp}/mo</span></div>
          {expenses.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <span style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{e.name}</span>
                <span style={{ marginLeft: 8 }}><Tag color={catColors[e.cat]} children={e.cat} /></span>
                {e.recurring && <span style={{ marginLeft: 6 }}><Tag color={C.muted} bg={C.dim} children="recurring" /></span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: C.accent2, fontWeight: 700 }}>${e.amount}/mo</span>
                <button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} style={{ ...btnSecondary, padding: "4px 10px", fontSize: 11, color: C.red, borderColor: C.red + "44" }}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <input placeholder="Expense name" value={newExp.name} onChange={e => setNewExp({ ...newExp, name: e.target.value })} style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
            <input placeholder="$" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 70 }} type="number" />
            <select value={newExp.cat} onChange={e => setNewExp({ ...newExp, cat: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 100 }}>
              {["housing","food","transport","subscriptions","health","entertainment","other"].map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => { if (newExp.name && newExp.amount) { setExpenses([...expenses, { ...newExp, id: Date.now(), amount: parseFloat(newExp.amount), recurring: true }]); setNewExp({ name: "", amount: "", cat: "other" }); }}} style={btnPrimary}>+ Add</button>
          </div>
        </Card>
      )}

      {activeTab === "investments" && (
        <div>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>PORTFOLIO · ${totalInvested.toLocaleString()} total</div>
            {investments.map((inv, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, color: C.text }}>{inv.name}</div>
                  <div style={{ fontSize: 11, color: C.accent3 }}>+{inv.return}% annual return</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: C.accent, textAlign: "right" }}>${Number(inv.amount).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: C.muted, textAlign: "right" }}>+${Math.round(inv.amount * inv.return / 100)}/yr</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <input placeholder="Fund name" value={newInv.name} onChange={e => setNewInv({ ...newInv, name: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
              <input placeholder="Amount $" value={newInv.amount} onChange={e => setNewInv({ ...newInv, amount: e.target.value })} style={{ ...inputStyle, flex: 1 }} type="number" />
              <input placeholder="Return %" value={newInv.return} onChange={e => setNewInv({ ...newInv, return: e.target.value })} style={{ ...inputStyle, flex: 1 }} type="number" />
              <button onClick={() => { if (newInv.name && newInv.amount) { setInvestments([...investments, { ...newInv, amount: parseFloat(newInv.amount), return: parseFloat(newInv.return) || 0 }]); setNewInv({ name: "", amount: "", return: "" }); }}} style={btnPrimary}>+ Add</button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "goals" && (
        <div>
          {goals.map((g, i) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <Card key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: C.text }}>{g.name}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>🗓 {g.deadline}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: C.accent3 }}>Saved: ${g.saved.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>Target: ${g.target.toLocaleString()}</span>
                </div>
                <div style={{ background: C.dim, borderRadius: 6, height: 8 }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.accent3}, ${C.accent})`, transition: "width 0.8s" }} />
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{pct}% complete</div>
              </Card>
            );
          })}
          <button onClick={() => setShowGoalForm(!showGoalForm)} style={{ ...btnSecondary, width: "100%", marginBottom: showGoalForm ? 12 : 0 }}>+ Add New Goal</button>
          {showGoalForm && (
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input placeholder="Goal name" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} style={inputStyle} />
                <input placeholder="Target $" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} style={inputStyle} type="number" />
                <input placeholder="Already saved $" value={newGoal.saved} onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })} style={inputStyle} type="number" />
                <input placeholder="Deadline (e.g. Dec 2025)" value={newGoal.deadline} onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })} style={inputStyle} />
              </div>
              <button onClick={() => { if (newGoal.name) { setGoals([...goals, { ...newGoal, id: Date.now(), target: parseFloat(newGoal.target) || 0, saved: parseFloat(newGoal.saved) || 0 }]); setNewGoal({ name: "", target: "", saved: "", deadline: "" }); setShowGoalForm(false); }}} style={{ ...btnPrimary, width: "100%", marginTop: 10 }}>Save Goal</button>
            </Card>
          )}
        </div>
      )}

      {activeTab === "debt" && (
        <Card>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 14 }}>DEBT TRACKER</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Total Debt ($)</label><input value={debt} onChange={e => setDebt(e.target.value)} style={inputStyle} type="number" /></div>
            <div><label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Interest Rate (%)</label><input value={debtRate} onChange={e => setDebtRate(e.target.value)} style={inputStyle} type="number" /></div>
            <div><label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Tax Bracket (%)</label><input value={tax} onChange={e => setTax(e.target.value)} style={inputStyle} type="number" /></div>
          </div>
          <div style={{ background: C.dim, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div><div style={{ fontSize: 11, color: C.muted }}>Monthly Interest</div><div style={{ fontSize: 18, fontWeight: 800, color: C.red }}>${Math.round(parseFloat(debt) * parseFloat(debtRate) / 100 / 12)}</div></div>
              <div><div style={{ fontSize: 11, color: C.muted }}>Payoff at $500/mo</div><div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{Math.ceil(parseFloat(debt) / 500)} mo</div></div>
              <div><div style={{ fontSize: 11, color: C.muted }}>Total Interest</div><div style={{ fontSize: 18, fontWeight: 800, color: C.accent2 }}>${Math.round(parseFloat(debt) * parseFloat(debtRate) / 100 / 12 * Math.ceil(parseFloat(debt) / 500))}</div></div>
            </div>
          </div>
        </Card>
      )}

      {/* AI analysis section */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {[["analysis", "📊 Full Analysis"], ["debt", "💳 Debt Strategy"], ["invest", "📈 Investment Plan"], ["goals", "🎯 Goal Optimizer"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setAiMode(mode)}
              style={{ ...chipStyle, background: aiMode === mode ? C.accent : C.dim, color: aiMode === mode ? "#fff" : C.muted, border: `1.5px solid ${aiMode === mode ? C.accent : C.border}` }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div><label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Monthly Income ($)</label><input value={income} onChange={e => setIncome(e.target.value)} style={inputStyle} type="number" /></div>
          <div><label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Savings Goal</label><div style={{ display: "flex", gap: 6 }}><input placeholder="Goal" value={goal} onChange={e => setGoal(e.target.value)} style={{ ...inputStyle, flex: 2 }} /><input placeholder="$" value={goalAmt} onChange={e => setGoalAmt(e.target.value)} style={{ ...inputStyle, flex: 1 }} type="number" /></div></div>
        </div>
        <button onClick={analyze} style={{ ...btnPrimary, width: "100%", padding: 14, fontSize: 15 }} disabled={loading}>
          {loading ? "Analyzing…" : "🤖 Get AI Financial Analysis"}
        </button>
        <AIBox response={aiResponse} loading={loading} borderColor={C.accent} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MOVIES MODULE — Full Watch Support (YouTube + Internet Archive + Stream Links)
// ══════════════════════════════════════════════════════════════════════════════

// FREE FULL MOVIES from Internet Archive (public domain, legal, embeddable)
const FREE_FULL_MOVIES = [
  { id: "f1", title: "Metropolis", genre: "Sci-Fi", year: 1927, rating: 8.3, runtime: 153, mood: ["epic","drama"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Metropolis_%281927_film%29.jpg/220px-Metropolis_%281927_film%29.jpg", overview: "In a futuristic city sharply divided between the working class and city planners, the son of the city's mastermind falls in love with a working-class prophet.", director: "Fritz Lang", cast: "Brigitte Helm, Alfred Abel", language: "Silent", archiveId: "Metropolis_1927", watchType: "archive", free: true },
  { id: "f2", title: "Nosferatu", genre: "Horror", year: 1922, rating: 7.9, runtime: 81, mood: ["thriller","mystery"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Nosferatu_1922_poster.jpg/220px-Nosferatu_1922_poster.jpg", overview: "Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter's wife.", director: "F.W. Murnau", cast: "Max Schreck", language: "Silent", archiveId: "Nosferatu_1922", watchType: "archive", free: true },
  { id: "f3", title: "The General", genre: "Comedy", year: 1926, rating: 8.1, runtime: 79, mood: ["comedy","adventure"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/The_General_1926_film_poster.jpg/220px-The_General_1926_film_poster.jpg", overview: "Union spies steal engineer Johnnie Gray's beloved locomotive during the American Civil War.", director: "Buster Keaton", cast: "Buster Keaton", language: "Silent", archiveId: "TheGeneral_1926", watchType: "archive", free: true },
  { id: "f4", title: "Sherlock Jr.", genre: "Comedy", year: 1924, rating: 7.9, runtime: 45, mood: ["comedy","mystery"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sherlock_Jr_1924_film_poster.jpg/220px-Sherlock_Jr_1924_film_poster.jpg", overview: "A film projectionist longs to be a detective and gets his chance.", director: "Buster Keaton", cast: "Buster Keaton", language: "Silent", archiveId: "Sherlock_Jr_1924", watchType: "archive", free: true },
  { id: "f5", title: "The Kid", genre: "Drama", year: 1921, rating: 8.3, runtime: 68, mood: ["emotional","drama"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/The_Kid_poster.jpg/220px-The_Kid_poster.jpg", overview: "The Tramp cares for an abandoned child, but when the boy is seen by officials, he is taken away.", director: "Charlie Chaplin", cast: "Charlie Chaplin, Jackie Coogan", language: "Silent", archiveId: "TheKid_1921", watchType: "archive", free: true },
  { id: "f6", title: "City Lights", genre: "Comedy", year: 1931, rating: 8.5, runtime: 87, mood: ["comedy","emotional"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/City_lights_1931_movie_poster.jpg/220px-City_lights_1931_movie_poster.jpg", overview: "With the aid of a wealthy erratic tippler, a vagabond befriends a blind flower girl.", director: "Charlie Chaplin", cast: "Charlie Chaplin, Virginia Cherrill", language: "English", archiveId: "CityLights_1931", watchType: "archive", free: true },
  { id: "f7", title: "Modern Times", genre: "Comedy", year: 1936, rating: 8.5, runtime: 87, mood: ["comedy","drama"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Modern_Times_poster.jpg/220px-Modern_Times_poster.jpg", overview: "The Tramp struggles to live in modern industrialized society with the help of a young homeless woman.", director: "Charlie Chaplin", cast: "Charlie Chaplin, Paulette Goddard", language: "English", archiveId: "ModernTimes_1936", watchType: "archive", free: true },
  { id: "f8", title: "Night of the Living Dead", genre: "Horror", year: 1968, rating: 7.9, runtime: 96, mood: ["thriller","action"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg/220px-Night_of_the_Living_Dead_%281968%29_theatrical_poster.jpg", overview: "A group of people hide from bloodthirsty zombies in a farmhouse.", director: "George A. Romero", cast: "Duane Jones, Judith O'Dea", language: "English", archiveId: "Night_of_the_Living_Dead_1968", watchType: "archive", free: true },
  { id: "f9", title: "His Girl Friday", genre: "Comedy", year: 1940, rating: 7.9, runtime: 92, mood: ["comedy","drama"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/His_Girl_Friday_poster.jpg/220px-His_Girl_Friday_poster.jpg", overview: "A newspaper editor uses every trick in the book to prevent his ace reporter ex-wife from remarrying.", director: "Howard Hawks", cast: "Cary Grant, Rosalind Russell", language: "English", archiveId: "HisGirlFriday_1940", watchType: "archive", free: true },
  { id: "f10", title: "The Gold Rush", genre: "Comedy", year: 1925, rating: 8.2, runtime: 95, mood: ["comedy","adventure"], poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/The_Gold_Rush_%281925_film_poster%29.jpg/220px-The_Gold_Rush_%281925_film_poster%29.jpg", overview: "A lone prospector ventures into Alaska looking for gold.", director: "Charlie Chaplin", cast: "Charlie Chaplin, Mack Swain", language: "Silent", archiveId: "TheGoldRush_1925", watchType: "archive", free: true },
];

// DEMO MOVIES with YouTube trailer IDs + streaming links
const DEMO_MOVIES = [
  { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8, runtime: 148, mood: ["thriller", "mystery"], poster: "https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", overview: "A thief who steals corporate secrets through dream-sharing technology.", director: "Christopher Nolan", cast: "DiCaprio, Gordon-Levitt", language: "English", trailerYT: "YoHD9XEInc0", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Prime",url:"https://primevideo.com"},{name:"Apple TV",url:"https://tv.apple.com"}] },
  { id: 2, title: "Interstellar", genre: "Sci-Fi", year: 2014, rating: 8.6, runtime: 169, mood: ["epic", "emotional"], poster: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lZFWFe2a8cTY.jpg", overview: "A team of explorers travel through a wormhole in space.", director: "Christopher Nolan", cast: "McConaughey, Hathaway", language: "English", trailerYT: "zSWdZVtXT7E", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Prime",url:"https://primevideo.com"}] },
  { id: 3, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0, runtime: 152, mood: ["thriller", "action"], poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview: "Batman faces the Joker, a criminal mastermind.", director: "Christopher Nolan", cast: "Bale, Ledger", language: "English", trailerYT: "EXeTwQWrcwY", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Tubi",url:"https://tubitv.com"},{name:"Max",url:"https://max.com"}] },
  { id: 4, title: "Parasite", genre: "Drama", year: 2019, rating: 8.5, runtime: 132, mood: ["mystery", "drama"], poster: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", overview: "Greed and class discrimination threaten a symbiotic relationship.", director: "Bong Joon-ho", cast: "Song Kang-ho", language: "Korean", trailerYT: "5xH0HfJHsaY", watchType: "trailer", streaming: [{name:"Hulu",url:"https://hulu.com"},{name:"Prime",url:"https://primevideo.com"}] },
  { id: 5, title: "Dune", genre: "Sci-Fi", year: 2021, rating: 8.0, runtime: 155, mood: ["epic", "adventure"], poster: "https://image.tmdb.org/t/p/w300/d5NXSklpcvkmXGR9m5QZXF9UBCA.jpg", overview: "A noble family becomes embroiled in a war for control over a desert planet.", director: "Denis Villeneuve", cast: "Chalamet, Zendaya", language: "English", trailerYT: "n9xhJrPXop4", watchType: "trailer", streaming: [{name:"Max",url:"https://max.com"},{name:"Prime",url:"https://primevideo.com"}] },
  { id: 6, title: "Everything Everywhere", genre: "Comedy", year: 2022, rating: 7.9, runtime: 139, mood: ["quirky", "emotional"], poster: "https://image.tmdb.org/t/p/w300/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", overview: "A woman discovers she must connect with parallel universe versions of herself.", director: "Daniels", cast: "Michelle Yeoh", language: "English", trailerYT: "wxN1T1uxQ2g", watchType: "trailer", streaming: [{name:"Prime",url:"https://primevideo.com"},{name:"Showtime",url:"https://showtime.com"}] },
  { id: 7, title: "Oppenheimer", genre: "Drama", year: 2023, rating: 8.3, runtime: 180, mood: ["epic", "thriller"], poster: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", overview: "The story of American scientist J. Robert Oppenheimer.", director: "Christopher Nolan", cast: "Cillian Murphy", language: "English", trailerYT: "uYPbbksJxIg", watchType: "trailer", streaming: [{name:"Peacock",url:"https://peacocktv.com"},{name:"Prime",url:"https://primevideo.com"}] },
  { id: 8, title: "Knives Out", genre: "Mystery", year: 2019, rating: 7.9, runtime: 130, mood: ["mystery", "comedy"], poster: "https://image.tmdb.org/t/p/w300/pThyQovXQrws2hmsbpCpu2E5FaS.jpg", overview: "A detective investigates the death of a patriarch of a wealthy family.", director: "Rian Johnson", cast: "Craig, de Armas", language: "English", trailerYT: "qGqiHJTsRkQ", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Prime",url:"https://primevideo.com"}] },
  { id: 9, title: "The Grand Budapest Hotel", genre: "Comedy", year: 2014, rating: 8.1, runtime: 99, mood: ["quirky", "comedy"], poster: "https://image.tmdb.org/t/p/w300/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", overview: "The adventures of Gustave H, a legendary concierge.", director: "Wes Anderson", cast: "Ralph Fiennes", language: "English", trailerYT: "1Fg0tForHqM", watchType: "trailer", streaming: [{name:"Disney+",url:"https://disneyplus.com"},{name:"Tubi",url:"https://tubitv.com"}] },
  { id: 10, title: "Whiplash", genre: "Drama", year: 2014, rating: 8.5, runtime: 107, mood: ["thriller", "drama"], poster: "https://image.tmdb.org/t/p/w300/7fn624j5lj3xTme2SgiLCeuedmO.jpg", overview: "A young drummer enrolls at a cut-throat music conservatory.", director: "Damien Chazelle", cast: "Miles Teller", language: "English", trailerYT: "7d_jQycdQGo", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Tubi",url:"https://tubitv.com"}] },
  { id: 11, title: "The Shawshank Redemption", genre: "Drama", year: 1994, rating: 9.3, runtime: 142, mood: ["drama","emotional"], poster: "https://image.tmdb.org/t/p/w300/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", overview: "Two imprisoned men bond over a number of years, finding solace and redemption through acts of decency.", director: "Frank Darabont", cast: "Tim Robbins, Morgan Freeman", language: "English", trailerYT: "6hB3S9bIaco", watchType: "trailer", streaming: [{name:"Netflix",url:"https://netflix.com"},{name:"Tubi (FREE)",url:"https://tubitv.com/movies/shawshank"}] },
  { id: 12, title: "Forrest Gump", genre: "Drama", year: 1994, rating: 8.8, runtime: 142, mood: ["emotional","comedy"], poster: "https://image.tmdb.org/t/p/w300/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", overview: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.", director: "Robert Zemeckis", cast: "Tom Hanks, Robin Wright", language: "English", trailerYT: "bLvqoHBptjg", watchType: "trailer", streaming: [{name:"Paramount+",url:"https://paramountplus.com"},{name:"Tubi (FREE)",url:"https://tubitv.com"}] },
];

const ALL_MOVIES = [...DEMO_MOVIES, ...FREE_FULL_MOVIES];
const MOODS = ["All", "thriller", "epic", "mystery", "emotional", "action", "drama", "comedy", "adventure", "quirky"];

const streamingColors = { Netflix: "#e50914", Prime: "#00a8e0", "Apple TV": "#000", Max: "#002be7", Hulu: "#1ce783", Disney: "#113ccf", Tubi: "#fa5514", Peacock: "#0066cc", Showtime: "#ff0000", "Paramount+": "#0064ff", "Tubi (FREE)": "#fa5514" };

function MoviePlayer({ movie, onClose }) {
  const [playerMode, setPlayerMode] = useState(movie.watchType === "archive" ? "full" : "trailer");

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', serif" }}>{movie.title}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{movie.year} · {movie.director} · {movie.runtime}min</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Mode switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {movie.trailerYT && (
            <button onClick={() => setPlayerMode("trailer")} style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: playerMode === "trailer" ? C.accent2 : "rgba(255,255,255,0.15)", color: "#fff" }}>
              🎬 Watch Trailer
            </button>
          )}
          {movie.watchType === "archive" && (
            <button onClick={() => setPlayerMode("full")} style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: playerMode === "full" ? C.accent3 : "rgba(255,255,255,0.15)", color: "#fff" }}>
              📽 Watch Full Movie (FREE)
            </button>
          )}
          {movie.streaming && movie.streaming.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
              style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: streamingColors[s.name] || "#555", color: "#fff", textDecoration: "none", display: "inline-block" }}>
              ▶ {s.name}
            </a>
          ))}
        </div>

        {/* Player */}
        <div style={{ borderRadius: 14, overflow: "hidden", background: "#000", width: "100%", aspectRatio: "16/9", position: "relative" }}>
          {playerMode === "trailer" && movie.trailerYT && (
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerYT}?autoplay=1&rel=0`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`${movie.title} trailer`}
            />
          )}
          {playerMode === "full" && movie.archiveId && (
            <iframe
              src={`https://archive.org/embed/${movie.archiveId}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`${movie.title} full movie`}
            />
          )}
        </div>

        {/* Info bar */}
        <div style={{ marginTop: 12, padding: "10px 16px", background: "rgba(255,255,255,0.07)", borderRadius: 10, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>⭐ {movie.rating}</span>
          <span style={{ color: "#9ca3af", fontSize: 13 }}>{movie.genre}</span>
          {movie.free && <span style={{ background: C.accent3 + "33", color: C.accent3, padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>✓ FREE FULL MOVIE</span>}
          <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: "auto" }}>{movie.overview?.slice(0, 100)}…</span>
        </div>
      </div>
    </div>
  );
}

function MoviesModule() {
  const [mood, setMood] = useState("All");
  const [maxRuntime, setMaxRuntime] = useState(200);
  const [minRating, setMinRating] = useState(7.0);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [watched, setWatched] = useState([1, 3]);
  const [watchlist, setWatchlist] = useState([2, 5]);
  const [favorites, setFavorites] = useState([3]);
  const [selected, setSelected] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterSource, setFilterSource] = useState("all"); // all, free, streaming
  const [aiMode, setAiMode] = useState("recommend");
  const [reviews, setReviews] = useState({ 1: "Mind-bending! Watched twice.", 3: "Best superhero film ever made." });
  const [newReview, setNewReview] = useState("");
  const [ratings, setRatings] = useState({ 1: 9, 3: 10 });
  const [tab, setTab] = useState("discover");

  const genres = ["All", ...new Set(ALL_MOVIES.map(m => m.genre))];
  let filtered = ALL_MOVIES
    .filter(m =>
      (mood === "All" || m.mood.includes(mood)) &&
      m.runtime <= maxRuntime &&
      m.rating >= minRating &&
      (filterGenre === "All" || m.genre === filterGenre) &&
      (filterSource === "all" || (filterSource === "free" && m.free) || (filterSource === "streaming" && m.streaming?.length)) &&
      (query === "" || m.title.toLowerCase().includes(query.toLowerCase()) || m.director?.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : sortBy === "year" ? b.year - a.year : a.runtime - b.runtime);

  const aiRecommend = async () => {
    setLoading(true); setAiResponse("");
    const watchedTitles = ALL_MOVIES.filter(m => watched.includes(m.id)).map(m => m.title).join(", ") || "none";
    const favTitles = ALL_MOVIES.filter(m => favorites.includes(m.id)).map(m => m.title).join(", ") || "none";
    let prompt = "";
    if (aiMode === "recommend") {
      prompt = `Watched: ${watchedTitles}. Favorites: ${favTitles}. Mood: ${mood}. Max runtime: ${maxRuntime}min. Search: "${query}".
Catalog: ${ALL_MOVIES.map(m => `${m.title}(${m.genre},${m.runtime}min,⭐${m.rating}${m.free?" FREE FULL MOVIE":""})`).join("; ")}.
Give: 1) Top 3 picks from catalog with specific reason 2) 3 movies NOT in catalog they'd love 3) A hidden gem for their taste 4) Best director to explore next`;
    } else if (aiMode === "similar") {
      const fav = selected || ALL_MOVIES.find(m => favorites.includes(m.id));
      prompt = `Find movies similar to "${fav?.title}" (${fav?.genre}, ${fav?.mood?.join(", ")}). Give 5 films with exact reasons why they match.`;
    } else {
      prompt = `Based on my watch history: ${watchedTitles}, what does my movie personality say about me? Give: 1) My cinematic archetype 2) Directors I'll love 3) Underrated genres for me 4) My perfect movie night setup`;
    }
    const r = await askClaude(prompt, "You are a cinephile AI with encyclopedic film knowledge. Be enthusiastic and specific.");
    setAiResponse(r); setLoading(false);
  };

  const toggleWatched = (id) => setWatched(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleWatchlist = (id) => setWatchlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleFavorite = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <div>
      {nowPlaying && <MoviePlayer movie={nowPlaying} onClose={() => setNowPlaying(null)} />}

      <SectionTitle icon="🎬" title="Movie Hub — Watch, Discover & Track" subtitle="Trailers + Free full movies + Streaming links — all in one place" />

      {/* Free movies banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent3}18, ${C.accent}18)`, border: `1.5px solid ${C.accent3}55`, borderRadius: 12, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 20 }}>📽</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent3 }}>Free Full Movies Available!</div>
          <div style={{ fontSize: 11, color: C.muted }}>10 classic films playable right here — 100% free & legal via Internet Archive + YouTube trailers for all films</div>
        </div>
        <button onClick={() => { setFilterSource("free"); setTab("free"); }} style={{ ...btnPrimary, background: C.accent3, marginLeft: "auto", fontSize: 12, padding: "8px 16px" }}>Watch Free Movies →</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1 }}>
        {[["discover","🔍 Discover"], ["free","📽 Free Movies"], ["watchlist","📋 Watchlist"], ["watched","✅ Watched"], ["favorites","❤️ Favorites"]].map(([t, l]) => (
          <button key={t} onClick={() => { setTab(t); if (t === "free") setFilterSource("free"); else if (t === "discover") setFilterSource("all"); }}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: tab === t ? `3px solid ${C.accent2}` : "3px solid transparent", color: tab === t ? C.accent2 : C.muted, fontWeight: tab === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {selected ? (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 20 }}>
              <img src={selected.poster} alt={selected.title} style={{ width: 110, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.text, fontFamily: "'Playfair Display', serif" }}>{selected.title}</div>
                  {selected.free && <span style={{ background: C.accent3 + "22", color: C.accent3, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>✓ FREE FULL MOVIE</span>}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>📽 {selected.director} · {selected.year} · {selected.runtime}min · {selected.language}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  <Tag color={C.gold} bg={C.gold + "22"}>⭐ {selected.rating}</Tag>
                  <Tag color={C.accent2}>{selected.genre}</Tag>
                  {selected.mood.map(m => <Tag key={m} color={C.accent4}>{m}</Tag>)}
                </div>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{selected.overview}</p>
                {selected.cast && <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>🎭 {selected.cast}</div>}
                {/* Watch buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  {selected.trailerYT && (
                    <button onClick={() => setNowPlaying(selected)} style={{ ...btnPrimary, background: "linear-gradient(135deg,#ff0000,#cc0000)", fontSize: 12, padding: "9px 16px" }}>▶ Watch Trailer</button>
                  )}
                  {selected.free && selected.archiveId && (
                    <button onClick={() => setNowPlaying(selected)} style={{ ...btnPrimary, background: `linear-gradient(135deg,${C.accent3},#047857)`, fontSize: 12, padding: "9px 16px" }}>🎬 Watch Full Movie FREE</button>
                  )}
                </div>
                {selected.streaming && selected.streaming.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>ALSO STREAM ON:</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {selected.streaming.map(s => (
                        <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ background: streamingColors[s.name] || C.muted, color: "#fff", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>{s.name}</a>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => toggleWatched(selected.id)} style={{ ...btnSecondary, fontSize: 12, color: watched.includes(selected.id) ? C.green : C.muted }}>{watched.includes(selected.id) ? "✓ Watched" : "Mark Watched"}</button>
                  <button onClick={() => toggleWatchlist(selected.id)} style={{ ...btnSecondary, fontSize: 12, color: watchlist.includes(selected.id) ? C.accent : C.muted }}>{watchlist.includes(selected.id) ? "📋 In Watchlist" : "+ Watchlist"}</button>
                  <button onClick={() => toggleFavorite(selected.id)} style={{ ...btnSecondary, fontSize: 12, color: favorites.includes(selected.id) ? C.red : C.muted }}>{favorites.includes(selected.id) ? "❤️ Favorited" : "♡ Favorite"}</button>
                  <button onClick={() => setSelected(null)} style={btnSecondary}>← Back</button>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>YOUR REVIEW</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setRatings({ ...ratings, [selected.id]: n })}
                  style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${ratings[selected.id] >= n ? C.gold : C.border}`, background: ratings[selected.id] >= n ? C.gold + "33" : C.dim, color: ratings[selected.id] >= n ? C.gold : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                  {n}
                </button>
              ))}
            </div>
            <textarea value={reviews[selected.id] || newReview} onChange={e => setNewReview(e.target.value)} placeholder="Write your review…" rows={2} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
            <button onClick={() => { setReviews({ ...reviews, [selected.id]: newReview }); setNewReview(""); }} style={{ ...btnPrimary, marginTop: 8, fontSize: 12 }}>Save Review</button>
          </Card>
        </div>
      ) : (
        <>
          {(tab === "discover" || tab === "free") && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <input placeholder="🔍 Search title or director…" value={query} onChange={e => setQuery(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  <option value="rating">Sort: Rating</option><option value="year">Sort: Newest</option><option value="runtime">Sort: Shortest</option>
                </select>
                <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  {genres.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {[["all","🎬 All"], ["free","📽 Free Full Movies"], ["streaming","🎥 Has Streaming"]].map(([src, label]) => (
                  <button key={src} onClick={() => setFilterSource(src)} style={{ ...chipStyle, background: filterSource === src ? C.accent3 : C.dim, color: filterSource === src ? "#fff" : C.muted, border: `1.5px solid ${filterSource === src ? C.accent3 : C.border}` }}>{label}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {MOODS.map(m => <button key={m} onClick={() => setMood(m)} style={{ ...chipStyle, background: mood === m ? C.accent2 : C.dim, color: mood === m ? "#fff" : C.muted, border: `1.5px solid ${mood === m ? C.accent2 : C.border}` }}>{m}</button>)}
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, color: C.muted }}>Max {maxRuntime}min</span><input type="range" min={60} max={240} value={maxRuntime} onChange={e => setMaxRuntime(+e.target.value)} style={{ accentColor: C.accent }} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, color: C.muted }}>Min ⭐{minRating}</span><input type="range" min={6} max={10} step={0.1} value={minRating} onChange={e => setMinRating(+e.target.value)} style={{ accentColor: C.gold }} /></div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  <button onClick={() => setView("grid")} style={{ ...btnSecondary, padding: "6px 10px", color: view === "grid" ? C.accent : C.muted }}>⊞</button>
                  <button onClick={() => setView("list")} style={{ ...btnSecondary, padding: "6px 10px", color: view === "list" ? C.accent : C.muted }}>☰</button>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>{filtered.length} movies · {filtered.filter(m => m.free).length} free to watch right here</div>

              {view === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12, marginBottom: 16 }}>
                  {filtered.map(m => (
                    <div key={m.id} style={{ background: C.surface, borderRadius: 12, overflow: "hidden", border: `1.5px solid ${m.free ? C.accent3 + "88" : C.border}`, transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setSelected(m)}>
                        <img src={m.poster} alt={m.title} style={{ width: "100%", height: 128, objectFit: "cover", display: "block", background: C.dim }} onError={e => { e.target.style.minHeight = "128px"; }} />
                        {watched.includes(m.id) && <div style={{ position: "absolute", top: 6, right: 6, background: C.green, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>✓</div>}
                        {favorites.includes(m.id) && <div style={{ position: "absolute", top: 6, left: 6, fontSize: 13 }}>❤️</div>}
                        {m.free && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.accent3, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 6px", textAlign: "center", letterSpacing: 0.5 }}>📽 FREE FULL MOVIE</div>}
                        {!m.free && <div style={{ position: "absolute", bottom: 6, left: 6 }}><Tag color={C.gold} bg="rgba(0,0,0,0.65)">⭐ {m.rating}</Tag></div>}
                      </div>
                      <div style={{ padding: "8px 10px 10px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{m.title}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>{m.year} · {m.runtime}min</div>
                        <button onClick={() => setNowPlaying(m)} style={{ width: "100%", padding: "6px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: m.free ? `${C.accent3}25` : `${C.accent2}22`, color: m.free ? C.accent3 : C.accent2 }}>
                          {m.free ? "▶ Watch FREE" : "▶ Trailer"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  {filtered.map(m => (
                    <div key={m.id} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                      <img src={m.poster} alt={m.title} style={{ width: 38, height: 54, objectFit: "cover", borderRadius: 6, cursor: "pointer", flexShrink: 0 }} onClick={() => setSelected(m)} onError={e => { e.target.style.display = "none"; }} />
                      <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelected(m)}>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{m.title}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{m.director} · {m.year} · {m.runtime}min</div>
                        {m.free && <span style={{ fontSize: 10, color: C.accent3, fontWeight: 700 }}>📽 FREE</span>}
                      </div>
                      <Tag color={C.gold}>⭐ {m.rating}</Tag>
                      <button onClick={() => setNowPlaying(m)} style={{ ...btnPrimary, fontSize: 11, padding: "6px 12px", background: m.free ? C.accent3 : C.accent2 }}>{m.free ? "▶ Watch" : "▶ Trailer"}</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "watchlist" && (
            <div>
              {ALL_MOVIES.filter(m => watchlist.includes(m.id)).map(m => (
                <div key={m.id} style={{ display: "flex", gap: 12, padding: 12, marginBottom: 10, background: C.surface, borderRadius: 12, border: `1.5px solid ${C.border}`, alignItems: "center" }}>
                  <img src={m.poster} alt={m.title} style={{ width: 38, height: 54, objectFit: "cover", borderRadius: 6, cursor: "pointer" }} onClick={() => setSelected(m)} onError={e => { e.target.style.display = "none"; }} />
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelected(m)}><div style={{ fontWeight: 700, color: C.text }}>{m.title}</div><div style={{ fontSize: 12, color: C.muted }}>{m.year} · {m.genre}</div></div>
                  <button onClick={() => setNowPlaying(m)} style={{ ...btnPrimary, fontSize: 11, padding: "6px 12px", background: m.free ? C.accent3 : C.accent2 }}>{m.free ? "▶ Watch FREE" : "▶ Trailer"}</button>
                  <button onClick={() => toggleWatchlist(m.id)} style={{ ...btnSecondary, fontSize: 11, padding: "5px 10px", color: C.red }}>✕</button>
                </div>
              ))}
              {watchlist.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: 40 }}>Watchlist empty — add from Discover!</div>}
            </div>
          )}

          {tab === "watched" && (
            <div>
              {ALL_MOVIES.filter(m => watched.includes(m.id)).map(m => (
                <div key={m.id} style={{ display: "flex", gap: 12, padding: 12, marginBottom: 10, background: C.surface, borderRadius: 12, border: `1.5px solid ${C.border}` }}>
                  <img src={m.poster} alt={m.title} style={{ width: 38, height: 54, objectFit: "cover", borderRadius: 6 }} onError={e => { e.target.style.display = "none"; }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.text }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{m.year} · ⭐ {m.rating}</div>
                    {reviews[m.id] && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>"{reviews[m.id]}"</div>}
                    {ratings[m.id] && <div style={{ fontSize: 12, color: C.gold }}>Your rating: {ratings[m.id]}/10</div>}
                  </div>
                  <button onClick={() => setNowPlaying(m)} style={{ ...btnPrimary, fontSize: 11, padding: "6px 12px", background: m.free ? C.accent3 : C.accent2 }}>{m.free ? "▶ Rewatch" : "▶ Trailer"}</button>
                </div>
              ))}
              {watched.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: 40 }}>No watched movies yet!</div>}
            </div>
          )}

          {tab === "favorites" && (
            <div>
              {ALL_MOVIES.filter(m => favorites.includes(m.id)).map(m => (
                <div key={m.id} style={{ display: "flex", gap: 12, padding: 12, marginBottom: 10, background: C.surface, borderRadius: 12, border: `1.5px solid ${C.red}44`, alignItems: "center" }}>
                  <img src={m.poster} alt={m.title} style={{ width: 38, height: 54, objectFit: "cover", borderRadius: 6, cursor: "pointer" }} onClick={() => setSelected(m)} onError={e => { e.target.style.display = "none"; }} />
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelected(m)}><div style={{ fontWeight: 700, color: C.text }}>{m.title}</div><div style={{ fontSize: 12, color: C.muted }}>{m.director} · {m.year}</div></div>
                  <button onClick={() => setNowPlaying(m)} style={{ ...btnPrimary, fontSize: 11, padding: "6px 12px", background: m.free ? C.accent3 : C.accent2 }}>{m.free ? "▶ Watch FREE" : "▶ Trailer"}</button>
                  <span style={{ fontSize: 18 }}>❤️</span>
                </div>
              ))}
              {favorites.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: 40 }}>No favorites yet!</div>}
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["recommend","🎯 Recommend"], ["similar","🔗 Similar Films"], ["personality","🧬 My Taste DNA"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setAiMode(mode)} style={{ ...chipStyle, background: aiMode === mode ? C.accent2 : C.dim, color: aiMode === mode ? "#fff" : C.muted, border: `1.5px solid ${aiMode === mode ? C.accent2 : C.border}` }}>{label}</button>
          ))}
        </div>
        <button onClick={aiRecommend} style={{ ...btnPrimary, width: "100%", padding: 13 }} disabled={loading}>
          {loading ? "Analyzing your taste…" : "🤖 Get AI Movie Intelligence"}
        </button>
        <AIBox response={aiResponse} loading={loading} borderColor={C.accent2} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CAREER MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function CareerModule() {
  const [form, setForm] = useState({ degree: "Computer Science", skills: "Python, React, SQL", interests: "AI, startups, product", years: "2", location: "San Francisco", salary: "85000" });
  const [targetRole, setTargetRole] = useState("CTO");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("roadmap");
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [interview, setInterview] = useState({ role: "", company: "", type: "behavioral" });
  const [networkNote, setNetworkNote] = useState({ name: "", company: "", context: "" });
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Learn TypeScript", done: false, deadline: "Q1 2025", impact: "high" },
    { id: 2, title: "Get AWS certification", done: false, deadline: "Q2 2025", impact: "high" },
    { id: 3, title: "Build 2 open source projects", done: true, deadline: "Done", impact: "medium" },
    { id: 4, title: "Lead a team of 3+", done: false, deadline: "Q3 2025", impact: "critical" },
  ]);
  const [salaryTarget, setSalaryTarget] = useState("120000");
  const [skills, setSkills] = useState([
    { name: "Python", level: 85 }, { name: "React", level: 75 }, { name: "SQL", level: 70 }, { name: "Leadership", level: 40 }, { name: "System Design", level: 50 },
  ]);

  const analyze = async () => {
    setLoading(true); setAiResponse("");
    let prompt = "";
    if (activeTab === "roadmap") {
      prompt = `Career profile: ${form.degree} degree. Skills: ${form.skills}. Interests: ${form.interests}. ${form.years} yrs exp. Currently in ${form.location}. Current salary: $${form.salary}. Target: ${targetRole} at $${salaryTarget}/yr.
Give: 1) Step-by-step roadmap with timelines 2) Top 5 skill gaps with specific courses 3) Realistic salary progression 4) Companies to target 5) Contrarian career advice 6) Side projects that prove your skills`;
    } else if (activeTab === "resume") {
      prompt = `Resume: "${resume.slice(0, 400)}". Job description: "${jobDesc.slice(0, 400)}".
Give: 1) ATS score estimate (%) 2) Missing keywords 3) 3 bullet point rewrites 4) Summary statement rewrite 5) Red flags to fix 6) What will get you past screening`;
    } else if (activeTab === "interview") {
      prompt = `Interview for ${interview.role} at ${interview.company}. Type: ${interview.type}.
Give: 1) 8 most likely questions with ideal answers 2) 3 questions to ask them 3) Red flags to avoid 4) What they're really evaluating 5) How to negotiate the offer afterward`;
    } else if (activeTab === "network") {
      prompt = `I want to connect with ${networkNote.name} at ${networkNote.company}. Context: ${networkNote.context}.
Write: 1) Perfect LinkedIn connection message (under 300 chars) 2) Follow-up email if they accept 3) How to provide value first 4) What NOT to say 5) Suggested meeting agenda`;
    } else {
      prompt = `Current skills with levels: ${skills.map(s => `${s.name}: ${s.level}%`).join(", ")}. Target role: ${targetRole}.
Give: 1) Skill gap analysis 2) Learning priority order 3) How long to reach ${targetRole} level 4) Skills most valuable in job market now 5) Skills that AI will replace vs augment`;
    }
    const r = await askClaude(prompt, "You are a world-class career coach, recruiter, and talent strategist. Be brutally honest and hyper-specific.");
    setAiResponse(r); setLoading(false);
  };

  const impactColors = { critical: C.red, high: C.accent, medium: C.gold, low: C.muted };

  return (
    <div>
      <SectionTitle icon="🚀" title="AI Career Intelligence" subtitle="Roadmap, resume, interviews, and network — all in one" />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1, flexWrap: "wrap" }}>
        {[["roadmap","🗺 Roadmap"], ["resume","📄 Resume AI"], ["interview","🎤 Interview"], ["network","🤝 Network"], ["skills","📊 Skill Gap"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: activeTab === t ? `3px solid ${C.accent4}` : "3px solid transparent", color: activeTab === t ? C.accent4 : C.muted, fontWeight: activeTab === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "roadmap" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["Degree / Field", "degree", "Computer Science"], ["Current Skills", "skills", "Python, React…"], ["Interests", "interests", "AI, product…"], ["Years Experience", "years", "0"], ["Location", "location", "City"], ["Current Salary $", "salary", "70000"]].map(([label, key, ph]) => (
              <div key={key} style={{ background: C.surface, borderRadius: 12, padding: 14, border: `1.5px solid ${C.border}` }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>{label.toUpperCase()}</label>
                <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={inputStyle} />
              </div>
            ))}
          </div>
          <Card style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 10 }}>DREAM ROLE & SALARY TARGET</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {["CEO", "CTO", "Product Manager", "AI Engineer", "Data Scientist", "Founder", "VP Engineering", "Design Lead"].map(r => (
                <button key={r} onClick={() => setTargetRole(r)} style={{ ...chipStyle, background: targetRole === r ? C.accent4 : C.dim, color: targetRole === r ? "#fff" : C.muted, border: `1.5px solid ${targetRole === r ? C.accent4 : C.border}` }}>{r}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Custom role…" style={{ ...inputStyle, flex: 2 }} />
              <input value={salaryTarget} onChange={e => setSalaryTarget(e.target.value)} placeholder="Target salary $" style={{ ...inputStyle, flex: 1 }} type="number" />
            </div>
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 12 }}>CAREER MILESTONES</div>
            {milestones.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div onClick={() => setMilestones(milestones.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
                  style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${m.done ? C.green : C.border}`, background: m.done ? C.green : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {m.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                </div>
                <span style={{ flex: 1, color: m.done ? C.muted : C.text, textDecoration: m.done ? "line-through" : "none", fontSize: 13 }}>{m.title}</span>
                <span style={{ fontSize: 10, color: impactColors[m.impact], fontWeight: 700, background: impactColors[m.impact] + "22", padding: "2px 8px", borderRadius: 10 }}>{m.impact}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{m.deadline}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {activeTab === "resume" && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>PASTE YOUR RESUME</label>
            <textarea value={resume} onChange={e => setResume(e.target.value)} rows={6} placeholder="Paste your resume text here…" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </Card>
          <Card>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>PASTE JOB DESCRIPTION</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={5} placeholder="Paste the job posting here…" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </Card>
        </div>
      )}

      {activeTab === "interview" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>ROLE</label><input value={interview.role} onChange={e => setInterview({ ...interview, role: e.target.value })} placeholder="Software Engineer" style={inputStyle} /></div>
            <div><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>COMPANY</label><input value={interview.company} onChange={e => setInterview({ ...interview, company: e.target.value })} placeholder="Google, Meta…" style={inputStyle} /></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>INTERVIEW TYPE</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["behavioral", "technical", "system design", "case study", "culture fit", "salary negotiation"].map(t => (
                <button key={t} onClick={() => setInterview({ ...interview, type: t })} style={{ ...chipStyle, background: interview.type === t ? C.accent4 : C.dim, color: interview.type === t ? "#fff" : C.muted, border: `1.5px solid ${interview.type === t ? C.accent4 : C.border}` }}>{t}</button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "network" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>PERSON'S NAME</label><input value={networkNote.name} onChange={e => setNetworkNote({ ...networkNote, name: e.target.value })} placeholder="Jane Smith" style={inputStyle} /></div>
            <div><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>COMPANY</label><input value={networkNote.company} onChange={e => setNetworkNote({ ...networkNote, company: e.target.value })} placeholder="Anthropic, OpenAI…" style={inputStyle} /></div>
          </div>
          <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>CONTEXT / HOW YOU MET</label>
          <textarea value={networkNote.context} onChange={e => setNetworkNote({ ...networkNote, context: e.target.value })} rows={3} placeholder="e.g. Met at a conference, saw their talk on AI…" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
        </Card>
      )}

      {activeTab === "skills" && (
        <Card>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 14 }}>YOUR SKILL LEVELS</div>
          {skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{s.level}%</span>
              </div>
              <input type="range" min={0} max={100} value={s.level} onChange={e => setSkills(skills.map((x, j) => j === i ? { ...x, level: +e.target.value } : x))} style={{ width: "100%", accentColor: C.accent4 }} />
            </div>
          ))}
        </Card>
      )}

      <button onClick={analyze} style={{ ...btnPrimary, width: "100%", padding: 14, marginTop: 16, background: `linear-gradient(135deg, ${C.accent4}, ${C.accent5})` }} disabled={loading}>
        {loading ? "Building your plan…" : "🤖 Get AI Career Intelligence"}
      </button>
      <AIBox response={aiResponse} loading={loading} borderColor={C.accent4} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRAVEL MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function TravelModule() {
  const [budget, setBudget] = useState("2000");
  const [origin, setOrigin] = useState("New York");
  const [duration, setDuration] = useState("7");
  const [vibe, setVibe] = useState("adventure");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("June");
  const [travelers, setTravelers] = useState("1");
  const [accommodation, setAccommodation] = useState("hostel");
  const [dietary, setDietary] = useState([]);
  const [activeTab, setActiveTab] = useState("planner");
  const [packing, setPacking] = useState({ clothing: true, electronics: true, health: true, documents: true });
  const [aiMode, setAiMode] = useState("full");
  const [bucketList, setBucketList] = useState([
    { id: 1, place: "Kyoto, Japan", reason: "Cherry blossoms", done: false },
    { id: 2, place: "Patagonia, Argentina", reason: "Hiking Torres del Paine", done: false },
    { id: 3, place: "Iceland", reason: "Northern lights", done: true },
  ]);
  const [newBucket, setNewBucket] = useState({ place: "", reason: "" });
  const [currencies, setCurrencies] = useState([
    { from: "USD", to: "EUR", rate: 0.92 }, { from: "USD", to: "JPY", rate: 149.5 }, { from: "USD", to: "GBP", rate: 0.79 },
  ]);
  const [tripHistory, setTripHistory] = useState([
    { dest: "Thailand", year: 2023, rating: 5, cost: 1800, notes: "Amazing food and temples!" },
    { dest: "Portugal", year: 2022, rating: 4, cost: 2200, notes: "Lisbon was beautiful." },
  ]);

  const plan = async () => {
    setLoading(true); setAiResponse("");
    const dietStr = dietary.length ? `Dietary: ${dietary.join(", ")}.` : "";
    let prompt = "";
    if (aiMode === "full") {
      prompt = `Travel: Budget $${budget} for ${travelers} person(s), from ${origin}, ${duration} days in ${month}, vibe: ${vibe}, accommodation: ${accommodation}. ${dietStr}
Give: 1) Top 3 destinations with full cost breakdown 2) Best pick with hour-by-hour day 1 itinerary 3) Complete ${duration}-day outline 4) Money hacks & free activities 5) What to pack 6) Hidden gems 7) Safety tips 8) Best apps to download`;
    } else if (aiMode === "budget") {
      prompt = `I have $${budget} for ${duration} days for ${travelers} people from ${origin} in ${month}. ${dietStr}
Give: 1) Cheapest incredible destinations ranked 2) Day-by-day budget ($${Math.round(parseFloat(budget) / parseFloat(duration))}/day) 3) Free activities that don't feel cheap 4) Best budget airline routes 5) Hostels vs Airbnb analysis`;
    } else if (aiMode === "offbeat") {
      prompt = `Traveler who likes ${vibe} and has $${budget}, ${duration} days from ${origin} in ${month}. Suggest truly UNIQUE, off-the-beaten-path destinations most travel blogs don't mention. Include 1 unusual experience per destination.`;
    } else {
      prompt = `I visited ${tripHistory.map(t => t.dest).join(", ")}. Based on my travel history and preferences (${vibe} vibe, budget: $${budget}), what should I visit next and why? Also predict my dream destination I haven't thought of.`;
    }
    const r = await askClaude(prompt, "You are an expert travel planner with deep knowledge of global destinations, budgets, and cultures. Give specific, actionable advice with real numbers.");
    setAiResponse(r); setLoading(false);
  };

  return (
    <div>
      <SectionTitle icon="✈️" title="Smart Travel Command" subtitle="Plan trips, track adventures, discover the world" />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1, flexWrap: "wrap" }}>
        {[["planner","✈️ Planner"], ["bucketlist","🌍 Bucket List"], ["history","📖 Trip History"], ["tools","🧰 Travel Tools"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: activeTab === t ? `3px solid ${C.gold}` : "3px solid transparent", color: activeTab === t ? C.gold : C.muted, fontWeight: activeTab === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "planner" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>TOTAL BUDGET ($)</label><input value={budget} onChange={e => setBudget(e.target.value)} style={inputStyle} type="number" /></Card>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>DEPARTING FROM</label><input value={origin} onChange={e => setOrigin(e.target.value)} style={inputStyle} placeholder="City or Airport" /></Card>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>DURATION (DAYS)</label><input value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} type="number" /></Card>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>TRAVEL MONTH</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m}>{m}</option>)}
              </select>
            </Card>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>TRAVELERS</label>
              <select value={travelers} onChange={e => setTravelers(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["1","2","3","4","5+"].map(n => <option key={n}>{n}</option>)}
              </select>
            </Card>
            <Card style={{ padding: 14 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 5 }}>ACCOMMODATION</label>
              <select value={accommodation} onChange={e => setAccommodation(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["hostel","budget hotel","airbnb","boutique hotel","luxury resort","camping"].map(a => <option key={a}>{a}</option>)}
              </select>
            </Card>
          </div>

          <Card style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 10 }}>TRAVEL VIBE</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {["adventure", "beach", "culture", "food", "nature", "city break", "backpacking", "luxury", "wellness", "photography"].map(v => (
                <button key={v} onClick={() => setVibe(v)} style={{ ...chipStyle, background: vibe === v ? C.gold + "ee" : C.dim, color: vibe === v ? "#fff" : C.muted, border: `1.5px solid ${vibe === v ? C.gold : C.border}` }}>{v}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>DIETARY PREFERENCES</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["vegetarian", "vegan", "gluten-free", "halal", "kosher", "no restrictions"].map(d => (
                <button key={d} onClick={() => setDietary(dietary.includes(d) ? dietary.filter(x => x !== d) : [...dietary, d])}
                  style={{ ...chipStyle, background: dietary.includes(d) ? C.accent3 + "dd" : C.dim, color: dietary.includes(d) ? "#fff" : C.muted, border: `1.5px solid ${dietary.includes(d) ? C.accent3 : C.border}` }}>
                  {d}
                </button>
              ))}
            </div>
          </Card>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {[["full","🌍 Full Trip Plan"], ["budget","💸 Budget Focus"], ["offbeat","🗺 Off the Beaten Path"], ["personal","✨ Based on My History"]].map(([mode, label]) => (
              <button key={mode} onClick={() => setAiMode(mode)} style={{ ...chipStyle, background: aiMode === mode ? C.gold : C.dim, color: aiMode === mode ? "#fff" : C.muted, border: `1.5px solid ${aiMode === mode ? C.gold : C.border}` }}>{label}</button>
            ))}
          </div>
          <button onClick={plan} style={{ ...btnPrimary, width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }} disabled={loading}>
            {loading ? "Planning your adventure…" : "🌍 Generate AI Travel Plan"}
          </button>
          <AIBox response={aiResponse} loading={loading} borderColor={C.gold} />
        </>
      )}

      {activeTab === "bucketlist" && (
        <div>
          {bucketList.map((b, i) => (
            <div key={b.id} style={{ display: "flex", gap: 12, padding: 14, marginBottom: 10, background: C.surface, borderRadius: 12, border: `1.5px solid ${b.done ? C.accent3 + "66" : C.border}`, alignItems: "center" }}>
              <div onClick={() => setBucketList(bucketList.map(x => x.id === b.id ? { ...x, done: !x.done } : x))}
                style={{ width: 20, height: 20, borderRadius: 50, border: `2px solid ${b.done ? C.accent3 : C.border}`, background: b.done ? C.accent3 : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#fff" }}>
                {b.done && "✓"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: b.done ? C.muted : C.text, textDecoration: b.done ? "line-through" : "none" }}>{b.place}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{b.reason}</div>
              </div>
              {b.done && <Tag color={C.accent3}>✓ Visited</Tag>}
              <button onClick={() => setBucketList(bucketList.filter(x => x.id !== b.id))} style={{ ...btnSecondary, padding: "4px 8px", fontSize: 11, color: C.red, borderColor: C.red + "44" }}>✕</button>
            </div>
          ))}
          <Card style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 10 }}>ADD TO BUCKET LIST</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Destination" value={newBucket.place} onChange={e => setNewBucket({ ...newBucket, place: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
              <input placeholder="Why?" value={newBucket.reason} onChange={e => setNewBucket({ ...newBucket, reason: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
              <button onClick={() => { if (newBucket.place) { setBucketList([...bucketList, { ...newBucket, id: Date.now(), done: false }]); setNewBucket({ place: "", reason: "" }); }}} style={btnPrimary}>+ Add</button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {tripHistory.map((t, i) => (
            <Card key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{t.dest}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{t.year} · ${t.cost.toLocaleString()} spent</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontStyle: "italic" }}>"{t.notes}"</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20 }}>{"⭐".repeat(t.rating)}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{t.rating}/5</div>
                </div>
              </div>
            </Card>
          ))}
          <button onClick={() => setTripHistory([...tripHistory, { dest: "New Trip", year: 2025, rating: 5, cost: 0, notes: "Add notes…" }])} style={{ ...btnSecondary, width: "100%" }}>+ Log New Trip</button>
        </div>
      )}

      {activeTab === "tools" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>CURRENCY QUICK REFERENCE</div>
            {currencies.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.text, fontWeight: 600 }}>$1 {c.from}</span>
                <span style={{ color: C.accent3, fontWeight: 700 }}>{c.rate} {c.to}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 12 }}>PACKING CHECKLIST</div>
            {[["clothing","👕 Clothing"], ["electronics","💻 Electronics"], ["health","💊 Health & Meds"], ["documents","📄 Documents"]].map(([k, l]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div onClick={() => setPacking({ ...packing, [k]: !packing[k] })}
                  style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${packing[k] ? C.accent3 : C.border}`, background: packing[k] ? C.accent3 : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                  {packing[k] && "✓"}
                </div>
                <span style={{ fontSize: 13, color: packing[k] ? C.text : C.muted, textDecoration: packing[k] ? "none" : "line-through" }}>{l}</span>
              </div>
            ))}
          </Card>
          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>DAILY BUDGET CALCULATOR</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, fontFamily: "'Playfair Display', serif" }}>${Math.round(parseFloat(budget) / parseInt(duration) / parseInt(travelers) || 0)}</div>
            <div style={{ fontSize: 12, color: C.muted }}>per person per day · ${Math.round(parseFloat(budget) / parseInt(duration) || 0)} total/day · ${Math.round(parseFloat(budget) / parseInt(travelers) || 0)} per person total</div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STARTUP MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function StartupModule() {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [stage, setStage] = useState("idea");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blueprint");
  const [aiMode, setAiMode] = useState("blueprint");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [revenue, setRevenue] = useState("subscription");
  const [teamSize, setTeamSize] = useState("solo");
  const [budget, setBudget] = useState("10000");
  const [competitors, setCompetitors] = useState("");
  const [metrics, setMetrics] = useState([
    { name: "MRR", value: "$0", change: "+0%", icon: "💰" },
    { name: "Users", value: "0", change: "+0%", icon: "👥" },
    { name: "Churn", value: "0%", change: "0%", icon: "📉" },
    { name: "CAC", value: "$0", change: "0%", icon: "🎯" },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, task: "Validate idea with 10 customer interviews", done: false, phase: "validate" },
    { id: 2, task: "Build landing page + collect emails", done: false, phase: "validate" },
    { id: 3, task: "Create wireframes/mockups", done: false, phase: "build" },
    { id: 4, task: "Launch MVP on Product Hunt", done: false, phase: "launch" },
  ]);
  const [pitchDeck, setPitchDeck] = useState({ problem: "", solution: "", market: "", businessModel: "" });

  const build = async () => {
    setLoading(true); setAiResponse("");
    let prompt = "";
    if (aiMode === "blueprint") {
      prompt = `Startup: "${idea}". Industry: ${industry}. Stage: ${stage}. Target customer: "${targetCustomer}". Revenue model: ${revenue}. Team: ${teamSize}. Budget: $${budget}. Competitors: "${competitors}".
Give: 1) Market validation score (1-10) with rationale 2) Precise ICP (ideal customer profile) 3) MVP features (must have vs nice to have) 4) 3 revenue streams with pricing tiers 5) 90-day roadmap by week 6) Key risks & mitigation 7) Unfair advantage to build`;
    } else if (aiMode === "naming") {
      prompt = `Startup idea: "${idea}". Industry: ${industry}. Target market: "${targetCustomer}".
Generate: 1) 10 creative brand name options with rationale 2) Check which sound distinctive 3) Taglines for top 3 4) Brand personality description 5) Colors and font style recommendations`;
    } else if (aiMode === "pitch") {
      prompt = `Startup: "${idea}". Industry: ${industry}. Problem: "${pitchDeck.problem}". Solution: "${pitchDeck.solution}". Market: "${pitchDeck.market}". Business model: "${pitchDeck.businessModel}".
Write a complete investor pitch narrative: 1) Hook (1 sentence) 2) Problem (3 bullets) 3) Solution story 4) Market size (TAM/SAM/SOM) 5) Business model 6) Traction/why now 7) Team (what to say) 8) Ask + use of funds 9) Questions they'll ask & answers`;
    } else {
      prompt = `Startup: "${idea}". Industry: ${industry}. Target: "${targetCustomer}". Revenue model: ${revenue}.
Give: 1) Complete growth hacking playbook 2) First 100 users strategy 3) Viral loop design 4) Influencer/partnership targets 5) Content marketing angle 6) PR headline that would get coverage 7) Product-led growth tactics`;
    }
    const r = await askClaude(prompt, "You are a Y Combinator-level startup advisor, serial entrepreneur, and investor. Be brutally honest, creative, and hyper-specific.");
    setAiResponse(r); setLoading(false);
  };

  return (
    <div>
      <SectionTitle icon="💡" title="Startup Builder System" subtitle="Validate ideas, build blueprints, win investors" />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1, flexWrap: "wrap" }}>
        {[["blueprint","🏗 Blueprint"], ["pitch","🎤 Pitch Deck"], ["metrics","📊 Metrics"], ["tasks","✅ Roadmap"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: activeTab === t ? `3px solid ${C.accent5}` : "3px solid transparent", color: activeTab === t ? C.accent5 : C.muted, fontWeight: activeTab === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "blueprint" && (
        <>
          <Card style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>YOUR STARTUP IDEA</label>
            <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={3} placeholder="Describe your idea in 1-3 sentences. What problem does it solve and for whom?" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>INDUSTRY</label>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {["SaaS", "Marketplace", "FinTech", "EdTech", "HealthTech", "AI/ML", "Hardware", "Consumer", "B2B", "Climate"].map(i => (
                  <button key={i} onClick={() => setIndustry(i)} style={{ ...chipStyle, fontSize: 11, background: industry === i ? C.accent5 : C.dim, color: industry === i ? "#fff" : C.muted, border: `1.5px solid ${industry === i ? C.accent5 : C.border}` }}>{i}</button>
                ))}
              </div>
            </Card>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>STAGE</label>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {["idea", "validating", "building MVP", "launched", "scaling"].map(s => (
                  <button key={s} onClick={() => setStage(s)} style={{ ...chipStyle, fontSize: 11, background: stage === s ? C.accent3 + "cc" : C.dim, color: stage === s ? "#fff" : C.muted, border: `1.5px solid ${stage === s ? C.accent3 : C.border}` }}>{s}</button>
                ))}
              </div>
            </Card>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>TARGET CUSTOMER</label>
              <input value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} placeholder="e.g. Freelance designers aged 25-35" style={inputStyle} />
            </Card>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>REVENUE MODEL</label>
              <select value={revenue} onChange={e => setRevenue(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["subscription", "freemium", "marketplace (% fee)", "one-time purchase", "ads", "usage-based", "enterprise sales"].map(r => <option key={r}>{r}</option>)}
              </select>
            </Card>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>TEAM SIZE</label>
              <select value={teamSize} onChange={e => setTeamSize(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {["solo", "co-founder", "2-5 people", "5-10 people", "10+"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Card>
            <Card style={{ padding: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>RUNWAY BUDGET ($)</label>
              <input value={budget} onChange={e => setBudget(e.target.value)} style={inputStyle} type="number" />
            </Card>
          </div>

          <Card style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>MAIN COMPETITORS</label>
            <input value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="e.g. Notion, Airtable, Coda…" style={inputStyle} />
          </Card>
        </>
      )}

      {activeTab === "pitch" && (
        <div>
          <Card style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>STARTUP IDEA</label><textarea value={idea} onChange={e => setIdea(e.target.value)} rows={2} placeholder="One line description…" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          {[["problem", "The Problem You Solve"], ["solution", "Your Solution"], ["market", "Market Size (e.g. $50B healthcare)"], ["businessModel", "How You Make Money"]].map(([k, l]) => (
            <Card key={k} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>{l.toUpperCase()}</label>
              <textarea value={pitchDeck[k]} onChange={e => setPitchDeck({ ...pitchDeck, [k]: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
            </Card>
          ))}
        </div>
      )}

      {activeTab === "metrics" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {metrics.map((m, i) => (
              <Card key={i} style={{ padding: 16 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{m.name}</div>
                <input value={m.value} onChange={e => setMetrics(metrics.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} style={{ ...inputStyle, fontSize: 20, fontWeight: 900, color: C.text, padding: "6px 10px", marginTop: 4 }} />
                <input value={m.change} onChange={e => setMetrics(metrics.map((x, j) => j === i ? { ...x, change: e.target.value } : x))} style={{ ...inputStyle, fontSize: 11, color: m.change.startsWith("+") ? C.accent3 : C.red, padding: "4px 10px", marginTop: 4 }} placeholder="+0%" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <Card>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 14 }}>90-DAY STARTUP ROADMAP</div>
          {["validate", "build", "launch"].map(phase => (
            <div key={phase} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: phase === "validate" ? C.accent : phase === "build" ? C.accent4 : C.accent5, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Phase: {phase}</div>
              {tasks.filter(t => t.phase === phase).map(t => (
                <div key={t.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                  <div onClick={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                    style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${t.done ? C.accent3 : C.border}`, background: t.done ? C.accent3 : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#fff" }}>
                    {t.done && "✓"}
                  </div>
                  <span style={{ flex: 1, color: t.done ? C.muted : C.text, textDecoration: t.done ? "line-through" : "none", fontSize: 13 }}>{t.task}</span>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["blueprint","🏗 Blueprint"], ["naming","💬 Brand Naming"], ["pitch","🎤 Pitch Script"], ["growth","📈 Growth Hacks"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setAiMode(mode)} style={{ ...chipStyle, background: aiMode === mode ? C.accent5 : C.dim, color: aiMode === mode ? "#fff" : C.muted, border: `1.5px solid ${aiMode === mode ? C.accent5 : C.border}` }}>{label}</button>
          ))}
        </div>
        <button onClick={build} style={{ ...btnPrimary, width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.accent5}, ${C.accent4})` }} disabled={loading || !idea.trim()}>
          {loading ? "Building your blueprint…" : "🚀 Generate Startup Intelligence"}
        </button>
        <AIBox response={aiResponse} loading={loading} borderColor={C.accent5} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DAILY MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function DailyModule() {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Study 2 hours", done: true, cat: "learning", priority: "high", time: "09:00" },
    { id: 2, label: "Exercise 30 min", done: true, cat: "health", priority: "high", time: "07:00" },
    { id: 3, label: "Read 20 pages", done: false, cat: "learning", priority: "medium", time: "20:00" },
    { id: 4, label: "Work on project", done: false, cat: "work", priority: "critical", time: "10:00" },
    { id: 5, label: "Meditate 10 min", done: false, cat: "health", priority: "low", time: "06:30" },
  ]);
  const [newTask, setNewTask] = useState({ label: "", cat: "work", priority: "medium", time: "" });
  const [mood, setMood] = useState("focused");
  const [energy, setEnergy] = useState(70);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState("optimize");
  const [activeTab, setActiveTab] = useState("tasks");
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning workout", streak: 12, target: 30, done: true, icon: "💪" },
    { id: 2, name: "Read 20 pages", streak: 5, target: 20, done: false, icon: "📚" },
    { id: 3, name: "No social media before 10am", streak: 3, target: 14, done: true, icon: "📵" },
    { id: 4, name: "Sleep by 11pm", streak: 0, target: 21, done: false, icon: "😴" },
  ]);
  const [journal, setJournal] = useState("");
  const [journalHistory, setJournalHistory] = useState([
    { date: "May 3", entry: "Had a productive morning. Need to focus more on deep work.", mood: "focused" },
    { date: "May 2", entry: "Feeling a bit scattered. Good gym session helped.", mood: "tired" },
  ]);
  const [water, setWater] = useState(4);
  const [sleep, setSleep] = useState("7.5");
  const [steps, setSteps] = useState("6200");
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const pomodoroRef = useRef(null);

  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroRef.current = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroRunning(false);
    }
    return () => clearInterval(pomodoroRef.current);
  }, [pomodoroRunning, pomodoroTime]);

  const done = tasks.filter(t => t.done).length;
  const completion = Math.round((done / tasks.length) * 100);
  const pMin = Math.floor(pomodoroTime / 60);
  const pSec = pomodoroTime % 60;

  const priorityColors = { critical: C.red, high: C.accent, medium: C.gold, low: C.accent3 };
  const catColors2 = { learning: C.accent4, health: C.accent3, work: C.accent, personal: C.accent5 };

  const analyze = async () => {
    setLoading(true); setAiResponse("");
    const doneList = tasks.filter(t => t.done).map(t => t.label).join(", ") || "none";
    const pendingList = tasks.filter(t => !t.done).map(t => t.label).join(", ") || "none";
    let prompt = "";
    if (aiMode === "optimize") {
      prompt = `Daily stats: Done: ${doneList}. Pending: ${pendingList}. Mood: ${mood}. Energy: ${energy}%. Water: ${water}/8 glasses. Sleep: ${sleep}hrs. Steps: ${steps}.
Give: 1) Productivity score & what's dragging you down 2) Optimal schedule for pending tasks using time blocks 3) Best task to tackle next based on energy level 4) One habit to add this week 5) Tomorrow's #1 priority`;
    } else if (aiMode === "journal") {
      prompt = `Today's journal entry: "${journal}". Mood: ${mood}. Energy: ${energy}%.
Give: 1) Emotional pattern you're showing 2) Underlying themes in your thoughts 3) One cognitive distortion to watch 4) 3 positive reframes 5) What your future self would tell you 6) Tonight's journaling prompt`;
    } else {
      prompt = `My habits: ${habits.map(h => `${h.name}: ${h.streak} day streak, target ${h.target} days`).join("; ")}. Mood: ${mood}. Energy: ${energy}%.
Give: 1) Which habit will have biggest life impact 2) Why streaks break and how to recover 3) Habit stacking strategy for my list 4) Which habit to drop vs double down on 5) Build a morning routine from these habits`;
    }
    const r = await askClaude(prompt, "You are a behavioral psychologist, productivity coach, and wellness expert. Be specific and scientifically grounded.");
    setAiResponse(r); setLoading(false);
  };

  return (
    <div>
      <SectionTitle icon="📊" title="Daily Life AI Tracker" subtitle="Tasks, habits, journal, wellness — all tracked and optimized" />

      {/* Health bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Tasks Done", value: `${done}/${tasks.length}`, icon: "✅", color: C.accent3 },
          { label: "Water", value: `${water}/8 🥤`, icon: "💧", color: "#3b82f6" },
          { label: "Sleep", value: `${sleep}h 😴`, icon: "🌙", color: C.accent4 },
          { label: "Steps", value: Number(steps).toLocaleString(), icon: "👟", color: C.accent },
        ].map(s => (
          <Card key={s.label} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 2, fontWeight: 600 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1, flexWrap: "wrap" }}>
        {[["tasks","✅ Tasks"], ["habits","🔥 Habits"], ["journal","📓 Journal"], ["wellness","❤️ Wellness"], ["pomodoro","⏱ Focus"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: activeTab === t ? `3px solid ${C.accent3}` : "3px solid transparent", color: activeTab === t ? C.accent3 : C.muted, fontWeight: activeTab === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "tasks" && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>TODAY'S PROGRESS</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: completion >= 80 ? C.accent3 : completion >= 50 ? C.gold : C.accent, fontFamily: "'Playfair Display', serif" }}>{completion}%</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Energy: {energy}%</span>
              <input type="range" min={0} max={100} value={energy} onChange={e => setEnergy(+e.target.value)} style={{ accentColor: C.gold, width: 100 }} />
            </div>
          </div>
          <div style={{ background: C.dim, borderRadius: 6, height: 8, marginBottom: 16 }}>
            <div style={{ width: `${completion}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.accent3}, ${C.accent})`, transition: "width 0.5s" }} />
          </div>
          {tasks.sort((a, b) => { const order = { critical: 0, high: 1, medium: 2, low: 3 }; return order[a.priority] - order[b.priority]; }).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div onClick={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.done ? C.accent3 : priorityColors[t.priority]}`, background: t.done ? C.accent3 : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {t.done && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
              </div>
              <span style={{ flex: 1, color: t.done ? C.muted : C.text, textDecoration: t.done ? "line-through" : "none", fontSize: 13 }}>{t.label}</span>
              {t.time && <span style={{ fontSize: 10, color: C.muted }}>🕐 {t.time}</span>}
              <span style={{ fontSize: 9, fontWeight: 700, color: priorityColors[t.priority], background: priorityColors[t.priority] + "22", padding: "2px 7px", borderRadius: 10, textTransform: "uppercase" }}>{t.priority}</span>
              <span style={{ fontSize: 10, color: catColors2[t.cat] || C.muted, background: (catColors2[t.cat] || C.muted) + "22", padding: "2px 7px", borderRadius: 10 }}>{t.cat}</span>
              <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: 2 }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <input placeholder="New task…" value={newTask.label} onChange={e => setNewTask({ ...newTask, label: e.target.value })} onKeyDown={e => e.key === "Enter" && newTask.label.trim() && (setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]), setNewTask({ label: "", cat: "work", priority: "medium", time: "" }))} style={{ ...inputStyle, flex: 3, minWidth: 140 }} />
            <select value={newTask.cat} onChange={e => setNewTask({ ...newTask, cat: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 80 }}>
              {["work","learning","health","personal"].map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 80 }}>
              {["critical","high","medium","low"].map(p => <option key={p}>{p}</option>)}
            </select>
            <input type="time" value={newTask.time} onChange={e => setNewTask({ ...newTask, time: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 90 }} />
            <button onClick={() => { if (newTask.label.trim()) { setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]); setNewTask({ label: "", cat: "work", priority: "medium", time: "" }); }}} style={btnPrimary}>+ Add</button>
          </div>
        </Card>
      )}

      {activeTab === "habits" && (
        <div>
          {habits.map((h, i) => {
            const pct = Math.round((h.streak / h.target) * 100);
            return (
              <Card key={h.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div onClick={() => setHabits(habits.map(x => x.id === h.id ? { ...x, done: !x.done, streak: x.done ? x.streak - 1 : x.streak + 1 } : x))}
                      style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${h.done ? C.accent3 : C.border}`, background: h.done ? C.accent3 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
                      {h.done ? "✓" : h.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>🔥 {h.streak} day streak · target: {h.target} days</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? C.accent3 : C.accent }}>{pct}%</div>
                </div>
                <div style={{ background: C.dim, borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.accent3}, ${C.accent})`, transition: "width 0.6s" }} />
                </div>
              </Card>
            );
          })}
          <button onClick={() => setHabits([...habits, { id: Date.now(), name: "New Habit", streak: 0, target: 21, done: false, icon: "⭐" }])} style={{ ...btnSecondary, width: "100%", marginTop: 8 }}>+ Add Habit</button>
        </div>
      )}

      {activeTab === "journal" && (
        <div>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>TODAY'S ENTRY</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["focused", "happy", "tired", "anxious", "motivated", "sad"].map(m => (
                  <button key={m} onClick={() => setMood(m)} style={{ fontSize: 14, cursor: "pointer", background: "none", border: "none", opacity: mood === m ? 1 : 0.4, transform: mood === m ? "scale(1.3)" : "scale(1)", transition: "all 0.2s" }}>
                    {m === "focused" ? "🎯" : m === "happy" ? "😊" : m === "tired" ? "😴" : m === "anxious" ? "😰" : m === "motivated" ? "🚀" : "😔"}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={journal} onChange={e => setJournal(e.target.value)} rows={5} placeholder="What's on your mind today? Wins, challenges, reflections…" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.7 }} />
            <button onClick={() => { if (journal.trim()) { setJournalHistory([{ date: "Today", entry: journal, mood }, ...journalHistory]); setJournal(""); }}} style={{ ...btnPrimary, marginTop: 10, fontSize: 12 }}>Save Entry</button>
          </Card>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 10 }}>PAST ENTRIES</div>
            {journalHistory.map((j, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{j.date}</span>
                  <Tag color={C.accent}>{j.mood}</Tag>
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{j.entry}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "wellness" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>💧 WATER INTAKE</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <button key={n} onClick={() => setWater(n)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${water >= n ? "#3b82f6" : C.border}`, background: water >= n ? "#3b82f6" + "33" : C.dim, cursor: "pointer", fontSize: 16 }}>
                  💧
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>{water}/8 glasses today</div>
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>😴 SLEEP TRACKER</div>
            <input value={sleep} onChange={e => setSleep(e.target.value)} style={{ ...inputStyle, fontSize: 24, fontWeight: 900, color: C.accent4, padding: "6px 10px" }} type="number" step="0.5" />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>hours last night · Optimal: 7-9h</div>
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>👟 STEPS</div>
            <input value={steps} onChange={e => setSteps(e.target.value)} style={{ ...inputStyle, fontSize: 20, fontWeight: 900, color: C.accent, padding: "6px 10px" }} type="number" />
            <div style={{ background: C.dim, borderRadius: 4, height: 6, marginTop: 8 }}>
              <div style={{ width: `${Math.min((parseInt(steps) / 10000) * 100, 100)}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.accent}, ${C.accent3})` }} />
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{Math.round((parseInt(steps) / 10000) * 100)}% of 10,000 goal</div>
          </Card>
          <Card>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>🧘 CURRENT MOOD</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["focused", "tired", "motivated", "anxious", "creative", "distracted", "happy", "stressed"].map(m => (
                <button key={m} onClick={() => setMood(m)} style={{ ...chipStyle, background: mood === m ? C.accent : C.dim, color: mood === m ? "#fff" : C.muted, border: `1.5px solid ${mood === m ? C.accent : C.border}`, fontSize: 11 }}>{m}</button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "pomodoro" && (
        <div style={{ textAlign: "center" }}>
          <Card style={{ padding: 40, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 2, marginBottom: 16 }}>FOCUS TIMER</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: pomodoroRunning ? C.accent2 : C.text, fontFamily: "'Playfair Display', serif", letterSpacing: -2, marginBottom: 24 }}>
              {pMin.toString().padStart(2, "0")}:{pSec.toString().padStart(2, "0")}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              <button onClick={() => { setPomodoroRunning(!pomodoroRunning); }} style={{ ...btnPrimary, padding: "12px 28px", fontSize: 16 }}>{pomodoroRunning ? "⏸ Pause" : "▶ Start"}</button>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(25 * 60); }} style={{ ...btnSecondary, padding: "12px 20px" }}>↺ Reset</button>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[["25:00", 25 * 60], ["10:00", 10 * 60], ["5:00", 5 * 60]].map(([label, secs]) => (
                <button key={label} onClick={() => { setPomodoroRunning(false); setPomodoroTime(secs); }} style={{ ...btnSecondary, fontSize: 12 }}>{label}</button>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["optimize","⚡ Optimize Day"], ["journal","📓 Journal Analysis"], ["habits","🔥 Habit Coach"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setAiMode(mode)} style={{ ...chipStyle, background: aiMode === mode ? C.accent3 : C.dim, color: aiMode === mode ? "#fff" : C.muted, border: `1.5px solid ${aiMode === mode ? C.accent3 : C.border}` }}>{label}</button>
          ))}
        </div>
        <button onClick={analyze} style={{ ...btnPrimary, width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.accent3}, ${C.accent})` }} disabled={loading}>
          {loading ? "Analyzing your day…" : "🤖 Get AI Daily Intelligence"}
        </button>
        <AIBox response={aiResponse} loading={loading} borderColor={C.accent3} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SOLVER MODULE — 10+ new features
// ══════════════════════════════════════════════════════════════════════════════
function SolverModule() {
  const [problem, setProblem] = useState("");
  const [category, setCategory] = useState("general");
  const [context, setContext] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [urgency, setUrgency] = useState("normal");
  const [solveMode, setSolveMode] = useState("solve");
  const [debate, setDebate] = useState({ topic: "", side: "for" });
  const [decision, setDecision] = useState({ question: "", optionA: "", optionB: "", criteria: "" });
  const [essay, setEssay] = useState({ topic: "", type: "persuasive", length: "medium" });
  const [brainstorm, setBrainstorm] = useState({ challenge: "", constraints: "" });
  const [template, setTemplate] = useState("cover letter");
  const [templateContext, setTemplateContext] = useState("");
  const [savedSolutions, setSavedSolutions] = useState([]);

  const solve = async () => {
    if (!problem.trim() && solveMode === "solve") return;
    setLoading(true); setAiResponse("");
    let prompt = "";
    if (solveMode === "solve") {
      const urgencyNote = urgency === "urgent" ? "This is URGENT — prioritize speed and quick wins." : urgency === "long-term" ? "Focus on sustainable, long-term solutions." : "";
      prompt = `Category: ${category}. Problem: "${problem}". Context: "${context}". ${urgencyNote}
Give: 1) Root cause analysis 2) 5-step action plan (numbered, specific) 3) Quick win in next 24 hours 4) Resources & tools 5) Prevention strategy 6) Success metrics to track 7) Timeline to resolution`;
    } else if (solveMode === "debate") {
      prompt = `Debate topic: "${debate.topic}". Build the strongest possible argument ${debate.side === "for" ? "IN FAVOR of" : "AGAINST"} this.
Include: 1) 5 compelling arguments with evidence 2) Key statistics 3) Counter-argument responses 4) Emotional appeal 5) Closing statement`;
    } else if (solveMode === "decide") {
      prompt = `Decision: "${decision.question}". Option A: "${decision.optionA}". Option B: "${decision.optionB}". Criteria: "${decision.criteria}".
Give: 1) Weighted pros/cons matrix 2) Short-term vs long-term impact 3) Risk analysis for each 4) What you'll regret less in 5 years 5) Clear recommendation with reasoning 6) What information would change this decision`;
    } else if (solveMode === "essay") {
      prompt = `Write a ${essay.length} length ${essay.type} essay about: "${essay.topic}".
Structure it properly with: compelling intro, 3 main arguments with evidence, counter-argument, and powerful conclusion. Make it memorable.`;
    } else if (solveMode === "brainstorm") {
      prompt = `Brainstorming challenge: "${brainstorm.challenge}". Constraints: "${brainstorm.constraints}".
Generate: 1) 15 diverse ideas (crazy to practical) 2) Group into themes 3) Top 3 ranked by impact/feasibility 4) How to test the best idea in 1 week 5) Unexpected angle nobody would think of`;
    } else {
      prompt = `Write a professional ${template} for: "${templateContext}". Make it compelling, specific, and ready to use immediately.`;
    }
    const r = await askClaude(prompt, "You are a universal expert — psychologist, strategist, writer, analyst, and coach. Be specific, honest, and give immediately actionable output.");
    setAiResponse(r);
    if (solveMode === "solve") setHistory(h => [{ problem, response: r, category, date: new Date().toLocaleDateString() }, ...h].slice(0, 8));
    setLoading(false);
  };

  const categories = [
    ["general","🌐"], ["financial","💰"], ["career","🚀"], ["academic","📚"],
    ["productivity","⚡"], ["relationships","❤️"], ["health","🏥"], ["technical","💻"],
    ["creative","🎨"], ["legal","⚖️"], ["emotional","🧘"], ["business","🏢"],
  ];

  return (
    <div>
      <SectionTitle icon="🧠" title="Universal AI Solver" subtitle="Any problem. Any challenge. Solved with intelligence." />

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 1, flexWrap: "wrap" }}>
        {[["solve","🔧 Problem Solver"], ["decide","⚖️ Decision Maker"], ["brainstorm","💡 Brainstorm"], ["debate","🗣 Debate Builder"], ["essay","✍️ Essay Writer"], ["template","📝 Templates"]].map(([t, l]) => (
          <button key={t} onClick={() => { setSolveMode(t); setAiResponse(""); }}
            style={{ ...chipStyle, borderRadius: 8, padding: "7px 14px", background: "transparent", border: "none", borderBottom: solveMode === t ? `3px solid ${C.accent4}` : "3px solid transparent", color: solveMode === t ? C.accent4 : C.muted, fontWeight: solveMode === t ? 700 : 500, fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {solveMode === "solve" && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {categories.map(([c, icon]) => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ ...chipStyle, background: category === c ? C.accent4 : C.dim, color: category === c ? "#fff" : C.muted, border: `1.5px solid ${category === c ? C.accent4 : C.border}` }}>
                {icon} {c}
              </button>
            ))}
          </div>
          <Card style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>DESCRIBE YOUR PROBLEM</label>
            <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={4} placeholder="Be specific. The more detail you give, the better the solution…" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </Card>
          <Card style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>ADDITIONAL CONTEXT</label>
            <input value={context} onChange={e => setContext(e.target.value)} placeholder="Any relevant background info…" style={inputStyle} />
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <span style={{ fontSize: 11, color: C.muted, paddingTop: 6 }}>Urgency:</span>
              {["quick fix", "normal", "urgent", "long-term"].map(u => (
                <button key={u} onClick={() => setUrgency(u)} style={{ ...chipStyle, background: urgency === u ? C.accent2 : C.dim, color: urgency === u ? "#fff" : C.muted, border: `1.5px solid ${urgency === u ? C.accent2 : C.border}`, fontSize: 11 }}>{u}</button>
              ))}
            </div>
          </Card>
        </>
      )}

      {solveMode === "decide" && (
        <div>
          <Card style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>YOUR DECISION QUESTION</label><textarea value={decision.question} onChange={e => setDecision({ ...decision, question: e.target.value })} rows={2} placeholder="e.g. Should I quit my job to start a business?" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Card><label style={{ fontSize: 11, color: C.accent3, fontWeight: 600, display: "block", marginBottom: 6 }}>OPTION A ✅</label><textarea value={decision.optionA} onChange={e => setDecision({ ...decision, optionA: e.target.value })} rows={3} placeholder="Describe Option A…" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
            <Card><label style={{ fontSize: 11, color: C.accent2, fontWeight: 600, display: "block", marginBottom: 6 }}>OPTION B 🔄</label><textarea value={decision.optionB} onChange={e => setDecision({ ...decision, optionB: e.target.value })} rows={3} placeholder="Describe Option B…" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          </div>
          <Card><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>DECISION CRITERIA (what matters most to you)</label><input value={decision.criteria} onChange={e => setDecision({ ...decision, criteria: e.target.value })} placeholder="e.g. financial security, freedom, growth, family time…" style={inputStyle} /></Card>
        </div>
      )}

      {solveMode === "brainstorm" && (
        <div>
          <Card style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>THE CHALLENGE TO BRAINSTORM</label><textarea value={brainstorm.challenge} onChange={e => setBrainstorm({ ...brainstorm, challenge: e.target.value })} rows={3} placeholder="e.g. How might we increase user engagement for a productivity app?" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          <Card><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>CONSTRAINTS (optional)</label><input value={brainstorm.constraints} onChange={e => setBrainstorm({ ...brainstorm, constraints: e.target.value })} placeholder="e.g. no budget, 2-person team, must launch in 1 month…" style={inputStyle} /></Card>
        </div>
      )}

      {solveMode === "debate" && (
        <div>
          <Card style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>DEBATE TOPIC</label><textarea value={debate.topic} onChange={e => setDebate({ ...debate, topic: e.target.value })} rows={2} placeholder="e.g. AI will eliminate more jobs than it creates" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          <Card>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>ARGUE WHICH SIDE?</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDebate({ ...debate, side: "for" })} style={{ ...btnPrimary, flex: 1, background: debate.side === "for" ? `linear-gradient(135deg, ${C.accent3}, ${C.accent})` : C.dim, color: debate.side === "for" ? "#fff" : C.muted }}>✅ For / In Favor</button>
              <button onClick={() => setDebate({ ...debate, side: "against" })} style={{ ...btnPrimary, flex: 1, background: debate.side === "against" ? `linear-gradient(135deg, ${C.red}, ${C.accent2})` : C.dim, color: debate.side === "against" ? "#fff" : C.muted }}>❌ Against / Opposed</button>
            </div>
          </Card>
        </div>
      )}

      {solveMode === "essay" && (
        <div>
          <Card style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>ESSAY TOPIC</label><textarea value={essay.topic} onChange={e => setEssay({ ...essay, topic: e.target.value })} rows={2} placeholder="e.g. The impact of social media on mental health" style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} /></Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>TYPE</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["persuasive", "analytical", "narrative", "expository", "compare & contrast"].map(t => (
                  <button key={t} onClick={() => setEssay({ ...essay, type: t })} style={{ ...chipStyle, background: essay.type === t ? C.accent4 : C.dim, color: essay.type === t ? "#fff" : C.muted, border: `1.5px solid ${essay.type === t ? C.accent4 : C.border}`, fontSize: 11 }}>{t}</button>
                ))}
              </div>
            </Card>
            <Card><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>LENGTH</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["short (300w)", "medium (600w)", "long (1000w)"].map(l => (
                  <button key={l} onClick={() => setEssay({ ...essay, length: l })} style={{ ...chipStyle, background: essay.length === l ? C.accent4 : C.dim, color: essay.length === l ? "#fff" : C.muted, border: `1.5px solid ${essay.length === l ? C.accent4 : C.border}`, fontSize: 11 }}>{l}</button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {solveMode === "template" && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 8 }}>TEMPLATE TYPE</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["cover letter", "cold email", "LinkedIn message", "apology letter", "resignation letter", "business proposal", "thank you note", "complaint letter", "reference letter", "negotiation email"].map(t => (
                <button key={t} onClick={() => setTemplate(t)} style={{ ...chipStyle, background: template === t ? C.accent4 : C.dim, color: template === t ? "#fff" : C.muted, border: `1.5px solid ${template === t ? C.accent4 : C.border}`, fontSize: 11 }}>{t}</button>
              ))}
            </div>
          </Card>
          <Card><label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6 }}>CONTEXT & DETAILS</label><textarea value={templateContext} onChange={e => setTemplateContext(e.target.value)} rows={4} placeholder="Provide specifics so the template is personalized…" style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /></Card>
        </div>
      )}

      <button onClick={solve} style={{ ...btnPrimary, width: "100%", padding: 14, marginTop: 16, background: `linear-gradient(135deg, ${C.accent4}, ${C.accent5})` }} disabled={loading || (solveMode === "solve" && !problem.trim())}>
        {loading ? "Processing…" : "🧠 Get AI Solution"}
      </button>
      {aiResponse && (
        <div style={{ position: "relative" }}>
          <AIBox response={aiResponse} loading={loading} borderColor={C.accent4} />
          <button onClick={() => setSavedSolutions([{ problem: problem || solveMode, response: aiResponse, date: new Date().toLocaleDateString() }, ...savedSolutions])}
            style={{ ...btnSecondary, marginTop: 8, fontSize: 12 }}>💾 Save This Solution</button>
        </div>
      )}
      {loading && <Spinner />}

      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 10, letterSpacing: 1 }}>RECENT PROBLEMS</div>
          {history.map((h, i) => (
            <div key={i} onClick={() => { setProblem(h.problem); setCategory(h.category); setAiResponse(h.response); }}
              style={{ background: C.surface, borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: `1.5px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent4}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <Tag color={C.accent4}>{h.category}</Tag>
                <span style={{ fontSize: 10, color: C.muted }}>{h.date}</span>
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{h.problem.slice(0, 70)}…</div>
            </div>
          ))}
        </div>
      )}

      {savedSolutions.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 10, letterSpacing: 1 }}>💾 SAVED SOLUTIONS</div>
          {savedSolutions.map((s, i) => (
            <Card key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>{s.problem.slice(0, 60)}</span>
                <span style={{ fontSize: 10, color: C.muted }}>{s.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ setTab }) {
  const [tip, setTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const [scores] = useState({ productivity: 68, finance: 74, learning: 55, health: 62, social: 45 });
  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

  const getDailyTip = async () => {
    setLoadingTip(true); setTip("");
    const r = await askClaude("Give me one powerful, unexpected life insight for today. Make it actionable and memorable. 2-3 sentences max.", "You are a wise life coach. Be inspiring but not cliché.");
    setTip(r); setLoadingTip(false);
  };

  useEffect(() => { getDailyTip(); }, []);

  const modules = [
    { id: "finance", icon: "💰", label: "Finance", desc: "Wealth tracking & optimization", color: C.accent3, feat: "Budget · Debt · Investments · Goals" },
    { id: "movies", icon: "🎬", label: "Movies", desc: "AI film intelligence hub", color: C.accent2, feat: "Discover · Watchlist · Reviews" },
    { id: "career", icon: "🚀", label: "Career", desc: "Roadmap to your dream role", color: C.accent4, feat: "Resume · Interview · Networking" },
    { id: "travel", icon: "✈️", label: "Travel", desc: "Smart trip planning", color: C.gold, feat: "Planner · Bucket List · Tools" },
    { id: "startup", icon: "💡", label: "Startup", desc: "Build ventures from ideas", color: C.accent5, feat: "Blueprint · Pitch · Metrics" },
    { id: "daily", icon: "📊", label: "Daily AI", desc: "Track & optimize every day", color: C.accent, feat: "Tasks · Habits · Journal · Wellness" },
    { id: "solver", icon: "🧠", label: "Solver", desc: "Any challenge, solved", color: C.accent4, feat: "Problems · Decisions · Brainstorm" },
  ];

  const scoreColor = v => v > 70 ? C.accent3 : v > 40 ? C.gold : C.red;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: C.accent, marginBottom: 8, fontWeight: 700 }}>AI LIFE OPERATING SYSTEM</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
          Your Intelligent<br />
          <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Life Command Center</span>
        </div>
        <div style={{ fontSize: 14, color: C.muted }}>Finance · Movies · Career · Travel · Startup · Daily · Solver</div>
      </div>

      {/* Life Score */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>LIFE SCORE</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: scoreColor(avg), fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{avg}<span style={{ fontSize: 16, color: C.muted }}>/100</span></div>
          </div>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: `conic-gradient(${scoreColor(avg)} ${avg}%, ${C.dim} 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: scoreColor(avg), fontFamily: "'Playfair Display', serif" }}>{avg}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {Object.entries(scores).map(([k, v]) => (
            <div key={k}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: C.muted, textTransform: "capitalize" }}>{k}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor(v) }}>{v}%</span>
              </div>
              <div style={{ background: C.dim, borderRadius: 4, height: 5 }}>
                <div style={{ width: `${v}%`, height: "100%", borderRadius: 4, background: scoreColor(v), transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insight */}
      {(tip || loadingTip) && (
        <div style={{ background: `linear-gradient(135deg, ${C.accent}0d, ${C.accent2}0d)`, borderRadius: 14, padding: 20, marginBottom: 24, border: `1.5px solid ${C.accent}33`, position: "relative" }}>
          <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>✦ TODAY'S AI INSIGHT</div>
          {loadingTip ? <Spinner label="Generating your daily insight…" /> : <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7, fontStyle: "italic" }}>{tip}</div>}
          <button onClick={getDailyTip} style={{ position: "absolute", top: 14, right: 14, ...btnSecondary, padding: "4px 12px", fontSize: 11 }}>{loadingTip ? "…" : "↺ Refresh"}</button>
        </div>
      )}

      {/* Module grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {modules.map(m => (
          <div key={m.id} onClick={() => setTab(m.id)}
            style={{ background: C.surface, borderRadius: 16, padding: 20, border: `1.5px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${m.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ position: "absolute", top: -16, right: -16, fontSize: 56, opacity: 0.07 }}>{m.icon}</div>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{m.desc}</div>
            <div style={{ fontSize: 10, color: m.color, fontWeight: 600 }}>{m.feat}</div>
            <div style={{ marginTop: 12, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function AILifeOS() {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const now = new Date();

  const MODULES = {
    dashboard: <Dashboard setTab={setTab} />,
    finance: <FinanceModule />,
    movies: <MoviesModule />,
    career: <CareerModule />,
    travel: <TravelModule />,
    startup: <StartupModule />,
    daily: <DailyModule />,
    solver: <SolverModule />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        input, textarea, select { font-family: 'DM Sans', sans-serif; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        input:focus, textarea:focus, select:focus { border-color: ${C.accent} !important; outline: none; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 220 : 64, transition: "width 0.3s ease",
        background: C.sidebarBg, borderRight: "none",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          {sidebarOpen && <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.gold, whiteSpace: "nowrap" }}>Life OS</span>}
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ marginLeft: "auto", background: "transparent", border: "none", color: C.sidebarMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV.map(n => (
            <div key={n.id} onClick={() => setTab(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
                cursor: "pointer", marginBottom: 2, transition: "all 0.15s",
                background: tab === n.id ? `${C.accent}22` : "transparent",
                borderLeft: tab === n.id ? `3px solid ${C.sidebarActive}` : "3px solid transparent",
              }}
              onMouseEnter={e => { if (tab !== n.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (tab !== n.id) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 600, color: tab === n.id ? C.gold : C.sidebarMuted, whiteSpace: "nowrap" }}>{n.label}</span>}
            </div>
          ))}
        </nav>

        {sidebarOpen && (
          <div style={{ padding: "12px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 9, color: C.sidebarMuted, marginBottom: 4, letterSpacing: 2 }}>POWERED BY</div>
            <div style={{ fontSize: 12, color: C.gold, fontFamily: "'Playfair Display', serif" }}>Claude AI</div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px", maxWidth: 960 }}>
        <div style={{ animation: "fadeIn 0.3s ease" }} key={tab}>
          {MODULES[tab]}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 210, flexShrink: 0, background: C.surface, borderLeft: `1.5px solid ${C.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, fontWeight: 700 }}>QUICK STATS</div>
        {[
          { label: "Life Score", value: "61", unit: "/100", color: C.accent },
          { label: "Tasks Done", value: "2", unit: "/5 today", color: C.accent3 },
          { label: "Savings Rate", value: "32", unit: "%", color: C.gold },
          { label: "Habit Streak", value: "12", unit: " days 🔥", color: C.accent2 },
        ].map(s => (
          <div key={s.label} style={{ background: C.dim, borderRadius: 10, padding: "12px 14px", border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 4, fontWeight: 600, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}<span style={{ fontSize: 11, color: C.muted, fontFamily: "inherit", fontWeight: 400 }}>{s.unit}</span></div>
          </div>
        ))}

        <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 14 }}>
          <div style={{ fontSize: 9, color: C.muted, marginBottom: 8, letterSpacing: 2, fontWeight: 700 }}>TODAY</div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${C.accent}12, ${C.accent2}12)`, borderRadius: 10, padding: 14, border: `1.5px solid ${C.accent}33` }}>
          <div style={{ fontSize: 9, color: C.accent, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>💡 PRO TIP</div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>Use the Solver tab for any life challenge — from decisions to essay writing to brainstorming.</div>
        </div>

        <div style={{ background: C.dim, borderRadius: 10, padding: 14, border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.muted, marginBottom: 8, fontWeight: 700, letterSpacing: 1 }}>ACTIVE MODULE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{NAV.find(n => n.id === tab)?.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{NAV.find(n => n.id === tab)?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
