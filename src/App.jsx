import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STORAGE_KEY = "abc-logs";
const PROGRAM_WEEKS = 12;
const TOTAL_DAYS = 84;
const PLANNED_SESSIONS = 6;
const START_WEIGHT = 94.55;
const TARGET_WEIGHT = 82.55;
const START_DATE = new Date("2026-04-20T00:00:00");
const DAYS_IN = 28;

const weeklyLogData = [
  { week: "Week 1", planned: 6, done: 6, missed: 0, adherence: 100 },
  { week: "Week 2", planned: 6, done: 5, missed: 1, adherence: 83 },
  { week: "Week 3", planned: 6, done: 6, missed: 0, adherence: 100 },
  { week: "Week 4", planned: 6, done: 5, missed: 1, adherence: 83 },
];

const weightTrendData = [
  { week: "Week 1", actual: 93.85, target: 93.55 },
  { week: "Week 2", actual: 92.9, target: 92.55 },
  { week: "Week 3", actual: 91.95, target: 91.55 },
  { week: "Week 4", actual: 90.95, target: 90.55 },
];

const workoutLibrary = {
  A: [
    "Pec deck",
    "Low cable fly",
    "Cable pullover",
    "Lateral raise",
    "Reverse pec deck",
    "Leg extension",
    "Seated leg curl",
  ],
  B: [
    "Incline dumbbell press",
    "Chest-supported row",
    "Single-arm cable lat pull",
    "Machine shoulder press",
    "Hack squat",
    "Romanian deadlift",
    "Standing calf raise",
  ],
  C: [
    "Smith machine incline press",
    "Wide-grip pulldown",
    "Cable row",
    "Cable Y-raise",
    "Bulgarian split squat",
    "Lying leg curl",
    "Cable crunch",
  ],
};

const statusTone = (value) => {
  if (value > 80) return "text-emerald-400";
  if (value >= 50) return "text-amber-300";
  return "text-rose-400";
};

const cardClassName =
  "rounded-3xl border border-line bg-slate-900/70 p-5 shadow-glow backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-400/40";

const getLocalDateInput = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const normalized = new Date(today.getTime() - offset * 60_000);
  return normalized.toISOString().slice(0, 10);
};

const createLogId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `log-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readStoredLogs = () => {
  try {
    const storedLogs = localStorage.getItem(STORAGE_KEY);
    if (!storedLogs) return [];

    const parsedLogs = JSON.parse(storedLogs);
    return Array.isArray(parsedLogs) ? parsedLogs : [];
  } catch (error) {
    console.error("Unable to parse abc logs:", error);
    return [];
  }
};

const persistStoredLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Unable to persist abc logs:", error);
  }
};

function App() {
  const [selectedWorkout, setSelectedWorkout] = useState("A");
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [savedLogs, setSavedLogs] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [formState, setFormState] = useState({
    date: getLocalDateInput(),
    plannedWorkout: "A",
    status: "Done",
  });

  useEffect(() => {
    setSavedLogs(readStoredLogs());
  }, []);

  useEffect(() => {
    persistStoredLogs(savedLogs);
  }, [savedLogs]);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const overallAdherence = useMemo(() => {
    const totals = weeklyLogData.reduce(
      (accumulator, row) => {
        accumulator.done += row.done;
        accumulator.planned += row.planned;
        return accumulator;
      },
      { done: 0, planned: 0 },
    );

    return Math.round((totals.done / totals.planned) * 100);
  }, []);

  const elapsedPercentage = Math.round((DAYS_IN / TOTAL_DAYS) * 100);
  const estimatedGoalDate = new Date(START_DATE);
  estimatedGoalDate.setDate(estimatedGoalDate.getDate() + TOTAL_DAYS);

  const metrics = [
    {
      label: "Overall Adherence",
      value: `${overallAdherence}%`,
      caption: `${weeklyLogData.reduce((sum, row) => sum + row.done, 0)} / ${
        weeklyLogData.reduce((sum, row) => sum + row.planned, 0)
      } sessions done`,
      valueClassName: `text-4xl font-semibold ${statusTone(overallAdherence)}`,
    },
    {
      label: "Current Weight / Target",
      value: `${START_WEIGHT.toFixed(2)} / ${TARGET_WEIGHT.toFixed(2)} kg`,
      caption: "21.8% body fat",
      valueClassName: "text-2xl font-semibold text-slate-50",
    },
    {
      label: "Days In / Total",
      value: `${DAYS_IN} / ${TOTAL_DAYS} (${elapsedPercentage}%)`,
      caption: `${PROGRAM_WEEKS} weeks · ${PLANNED_SESSIONS} sessions/week`,
      valueClassName: "text-2xl font-semibold text-slate-50",
    },
    {
      label: "Est. Goal Date",
      value: estimatedGoalDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      caption: "Based on 1 kg/week loss",
      valueClassName: "text-2xl font-semibold text-slate-50",
    },
  ];

  const handleFieldChange = (field) => (event) => {
    setFormState((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSaveLog = (event) => {
    event.preventDefault();

    const nextEntry = {
      id: createLogId(),
      ...formState,
      createdAt: new Date().toISOString(),
    };

    setSavedLogs((current) => [nextEntry, ...current]);
    setToastMessage("Workout log saved");
    setFormState((current) => ({
      ...current,
      date: getLocalDateInput(),
      plannedWorkout: current.plannedWorkout,
      status: "Done",
    }));
  };

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_34%),linear-gradient(180deg,_#020617_0%,_#06101f_42%,_#020617_100%)]" />
      <div className="absolute inset-0 -z-10 bg-app-grid bg-[size:24px_24px] opacity-20" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-sky-400/20 bg-slate-950/60 p-5 shadow-glow backdrop-blur sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">
                ABC Isolation Tracker
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                12-week adherence dashboard
              </h1>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              <span className="font-medium text-emerald-300">Program:</span>{" "}
              A/B/C rotation every other day
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-3xl border border-sky-300/15 bg-gradient-to-br from-sky-600/20 via-slate-900/95 to-blue-950/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30"
              >
                <p className="text-sm text-sky-100/75">{metric.label}</p>
                <p className={`mt-4 ${metric.valueClassName}`}>{metric.value}</p>
                <p className="mt-3 text-sm text-slate-300">{metric.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className={cardClassName}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Weekly Log</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Hardcoded adherence sample for the current 4-week block.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-line text-left">
                  <thead className="bg-slate-800/80 text-xs uppercase tracking-[0.2em] text-slate-300">
                    <tr>
                      <th className="px-4 py-4">Week</th>
                      <th className="px-4 py-4">Planned</th>
                      <th className="px-4 py-4">Done</th>
                      <th className="px-4 py-4">Missed</th>
                      <th className="px-4 py-4">Adherence %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-slate-900/70 text-sm text-slate-200">
                    {weeklyLogData.map((row) => (
                      <tr
                        key={row.week}
                        className="transition hover:bg-slate-800/70"
                      >
                        <td className="px-4 py-4 font-medium text-white">
                          {row.week}
                        </td>
                        <td className="px-4 py-4">{row.planned}</td>
                        <td className="px-4 py-4 text-emerald-300">
                          {row.done}
                        </td>
                        <td className="px-4 py-4 text-rose-300">{row.missed}</td>
                        <td className={`px-4 py-4 font-medium ${statusTone(row.adherence)}`}>
                          {row.adherence}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className={cardClassName}>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Log Workout</h2>
              <p className="mt-1 text-sm text-slate-400">
                Save sessions to local storage with the key{" "}
                <span className="font-medium text-sky-300">{STORAGE_KEY}</span>.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSaveLog}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Date
                </span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={handleFieldChange("date")}
                  className="w-full rounded-2xl border border-line bg-slate-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Planned Workout
                </span>
                <select
                  value={formState.plannedWorkout}
                  onChange={handleFieldChange("plannedWorkout")}
                  className="w-full rounded-2xl border border-line bg-slate-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="Off">Off</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Status
                </span>
                <select
                  value={formState.status}
                  onChange={handleFieldChange("status")}
                  className="w-full rounded-2xl border border-line bg-slate-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25"
                >
                  <option value="Done">Done</option>
                  <option value="Missed">Missed</option>
                  <option value="Rest">Rest</option>
                </select>
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-900/30 transition duration-200 hover:scale-[1.01] hover:from-sky-400 hover:to-emerald-400 active:scale-[0.99]"
              >
                Save
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-line bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Recent saved logs
                </h3>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
                  {savedLogs.length} total
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {savedLogs.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No entries saved yet. Your first log will appear here.
                  </p>
                ) : (
                  savedLogs.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-line bg-slate-900/75 px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-white">
                          {entry.plannedWorkout}
                        </span>
                        <span className="text-slate-400">{entry.date}</span>
                      </div>
                      <p className="mt-1 text-slate-300">{entry.status}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className={cardClassName}>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Adherence Trend
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Week-by-week completion rate against the 6-session target.
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyLogData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: "16px",
                    }}
                    formatter={(value) => [`${value}%`, "Adherence"]}
                  />
                  <Bar
                    dataKey="adherence"
                    radius={[12, 12, 0, 0]}
                    fill="#38bdf8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardClassName}>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Weight Trend</h2>
              <p className="mt-1 text-sm text-slate-400">
                Actual progress versus the program target across the first 4 weeks.
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    domain={[89.5, 95]}
                    tickFormatter={(value) => `${value} kg`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: "16px",
                    }}
                    formatter={(value) => [`${value} kg`, ""]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22c55e" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    strokeDasharray="6 6"
                    dot={{ r: 4, fill: "#38bdf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className={cardClassName}>
          <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Workout Library
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Expand a workout tab to review the exercise sequence for the A/B/C split.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLibraryOpen((current) => !current)}
              className="inline-flex items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-100 transition hover:bg-sky-500/20"
            >
              {isLibraryOpen ? "Collapse library" : "Expand library"}
            </button>
          </div>

          <div
            className={`grid overflow-hidden transition-all duration-300 ${
              isLibraryOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="flex flex-wrap gap-3">
                {Object.keys(workoutLibrary).map((key) => {
                  const isActive = key === selectedWorkout;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedWorkout(key)}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-950/30"
                          : "border border-line bg-slate-900/80 text-slate-300 hover:border-sky-400/30 hover:text-white"
                      }`}
                    >
                      Workout {key}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-line bg-gradient-to-br from-sky-500/10 via-slate-900/90 to-emerald-500/10 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">
                    Active tab
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Workout {selectedWorkout}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">
                    Machine-forward isolation focus with clean volume distribution and recovery spacing.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {workoutLibrary[selectedWorkout].map((exercise, index) => (
                    <div
                      key={exercise}
                      className="rounded-2xl border border-line bg-slate-900/75 px-4 py-4 transition hover:border-emerald-400/30 hover:bg-slate-900"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Exercise {index + 1}
                      </p>
                      <p className="mt-2 font-medium text-white">{exercise}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-center text-sm text-slate-500">
          Built for fast daily logging, responsive review, and local-first persistence.
        </footer>
      </main>

      <div
        className={`pointer-events-none fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
          toastMessage
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-100 shadow-lg shadow-emerald-950/30 backdrop-blur">
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
