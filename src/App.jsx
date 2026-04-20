import { useEffect, useMemo, useState } from "react";

const LOGS_STORAGE_KEY = "grindtracker-logs";
const BIOMETRICS_STORAGE_KEY = "grindtracker-biometrics";
const TARGET_WEIGHT = 82.55;
const TOTAL_DAYS = 84;
const PROGRAM_WEEKS = 12;
const EMPTY_VALUE = "—";
const DEFAULT_PROGRAM_START_DATE = "2026-04-20";

const appTabs = ["Overview", "Weekly Log", "Workouts"];
const workoutTabs = ["A", "B", "C"];

const workoutLibrary = {
  A: [
    {
      order: 1,
      muscle: "Chest",
      bias: "Mid / sternal pec fibers",
      options: "Pec deck fly, machine chest fly, or flat cable fly",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 2,
      muscle: "Chest",
      bias: "Lengthened chest line",
      options: "Low cable fly, plate-loaded fly, or unilateral cable fly",
      sets: 3,
      reps: "12-15",
    },
    {
      order: 3,
      muscle: "Back / Lats",
      bias: "Lats in shortened position",
      options: "Pullover machine or cable pullover",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 4,
      muscle: "Back / Lats",
      bias: "Straight-arm lat arc",
      options: "Straight-arm cable pulldown or pullover station",
      sets: 3,
      reps: "12-15",
    },
    {
      order: 5,
      muscle: "Shoulders",
      bias: "Side delts, mid-range",
      options: "Cable lateral raise or machine lateral raise",
      sets: 4,
      reps: "12-20",
    },
    {
      order: 6,
      muscle: "Shoulders",
      bias: "Rear delts, horizontal abduction",
      options: "Reverse pec deck, rear-delt machine, or cable rear fly",
      sets: 3,
      reps: "12-20",
    },
    {
      order: 7,
      muscle: "Legs",
      bias: "Quads, knee extension focus",
      options: "Leg extension",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 8,
      muscle: "Legs",
      bias: "Hamstrings, knee flexion",
      options: "Seated or lying leg curl",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 9,
      muscle: "Calves",
      bias: "Gastrocnemius",
      options: "Standing calf raise, donkey calf, or standing calf machine",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 10,
      muscle: "Arms",
      bias: "Biceps short-head bias",
      options: "Preacher curl machine, cable preacher curl, or supported curl machine",
      sets: 3,
      reps: "10-15",
    },
    {
      order: 11,
      muscle: "Arms",
      bias: "Triceps lateral / medial heads",
      options: "Cable pressdown, machine pressdown, or dual-rope pressdown",
      sets: 3,
      reps: "10-15",
    },
  ],
  B: [
    {
      order: 1,
      muscle: "Chest",
      bias: "Upper / clavicular pec fibers",
      options: "Low-to-high cable fly, incline fly machine, or adjustable machine fly",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 2,
      muscle: "Chest",
      bias: "Peak contraction chest line",
      options: "Machine fly with squeeze, dual cable fly, or unilateral cable fly",
      sets: 3,
      reps: "12-15",
    },
    {
      order: 3,
      muscle: "Back / Lats",
      bias: "Lats through longer arc",
      options: "One-arm straight-arm pulldown, cable lat prayer, or pullover machine variant",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 4,
      muscle: "Shoulders",
      bias: "Side delts, lengthened bias",
      options: "Behind-body cable lateral raise or machine lateral raise",
      sets: 4,
      reps: "12-20",
    },
    {
      order: 5,
      muscle: "Shoulders",
      bias: "Rear delts, cable arc",
      options: "Cross-cable rear-delt fly, reverse pec deck, or rear-delt machine",
      sets: 3,
      reps: "12-20",
    },
    {
      order: 6,
      muscle: "Legs",
      bias: "Quads unilateral control",
      options: "Single-leg leg extension",
      sets: 4,
      reps: "12-15",
    },
    {
      order: 7,
      muscle: "Legs",
      bias: "Hamstrings, knee flexion alt pattern",
      options: "Lying, seated, or single-leg leg curl",
      sets: 4,
      reps: "10-15",
    },
    {
      order: 8,
      muscle: "Glutes",
      bias: "Glute max",
      options: "Cable kickback, glute kickback machine, or standing kickback station",
      sets: 3,
      reps: "12-20",
    },
    {
      order: 9,
      muscle: "Calves",
      bias: "Soleus",
      options: "Seated calf raise",
      sets: 4,
      reps: "12-20",
    },
    {
      order: 10,
      muscle: "Arms",
      bias: "Biceps long-head bias",
      options: "Incline dumbbell curl, cable Bayesian curl, or behind-body cable curl",
      sets: 3,
      reps: "10-15",
    },
    {
      order: 11,
      muscle: "Arms",
      bias: "Triceps long head",
      options:
        "Overhead cable extension, machine overhead extension, or single-arm cable extension",
      sets: 3,
      reps: "10-15",
    },
  ],
  C: [
    {
      order: 1,
      muscle: "Chest",
      bias: "Shortened / squeeze bias",
      options: "Pec deck, converging fly machine, or high-tension cable fly",
      sets: 4,
      reps: "12-15",
    },
    {
      order: 2,
      muscle: "Back / Lats",
      bias: "Lats / teres straight-arm line",
      options: "Rope cable pullover, pullover machine, or one-arm cable pullover",
      sets: 4,
      reps: "8-12",
    },
    {
      order: 3,
      muscle: "Shoulders",
      bias: "Side delts, pump bias",
      options: "Dumbbell lateral raise, cable lateral raise, or machine lateral raise",
      sets: 4,
      reps: "15-20",
    },
    {
      order: 4,
      muscle: "Shoulders",
      bias: "Rear delts / scapular control",
      options: "Reverse cable fly, rear-delt machine, or reverse pec deck",
      sets: 3,
      reps: "12-20",
    },
    {
      order: 5,
      muscle: "Legs",
      bias: "Quads, squeeze / metabolite bias",
      options: "Leg extension with pause or drop-set style",
      sets: 4,
      reps: "12-15",
    },
    {
      order: 6,
      muscle: "Legs",
      bias: "Hamstrings, squeeze bias",
      options: "Seated or lying leg curl with pause",
      sets: 4,
      reps: "12-15",
    },
    {
      order: 7,
      muscle: "Glutes / Hips",
      bias: "Glute med / hip abductors",
      options: "Hip abduction machine or cable hip abduction",
      sets: 3,
      reps: "15-20",
    },
    {
      order: 8,
      muscle: "Calves",
      bias: "Calves, slower tempo",
      options: "Seated or standing calf raise",
      sets: 4,
      reps: "12-20",
    },
    {
      order: 9,
      muscle: "Arms",
      bias: "Brachialis / brachioradialis",
      options: "Hammer curl, rope hammer curl, or neutral-grip curl machine",
      sets: 3,
      reps: "10-15",
    },
    {
      order: 10,
      muscle: "Arms",
      bias: "Triceps shortened finisher",
      options: "Reverse-grip pressdown, cable kickback, or single-arm pressdown",
      sets: 3,
      reps: "12-15",
    },
  ],
};

const statusClasses = {
  Done: "border-[#7ee787]/30 bg-[#7ee787]/12 text-[#7ee787]",
  Missed: "border-[#ff6b6b]/30 bg-[#ff6b6b]/12 text-[#ff6b6b]",
  Rest: "border-[#6fb3ff]/30 bg-[#6fb3ff]/12 text-[#6fb3ff]",
};

const shellCardClassName =
  "rounded-[24px] border border-[var(--line)] bg-[var(--card)] transition duration-200";

const metricCardClassName = `${shellCardClassName} p-5 sm:p-6 hover:border-[var(--accent)]/35 hover:shadow-[0_0_0_1px_rgba(232,255,60,0.08)]`;

function getTodayInputValue() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const normalized = new Date(today.getTime() - offset * 60_000);
  return normalized.toISOString().slice(0, 10);
}

function createItemId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStorageItem(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallbackValue;
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallbackValue;
  }
}

function writeStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to persist ${key}:`, error);
  }
}

function formatDate(dateValue) {
  if (!dateValue) return EMPTY_VALUE;

  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return EMPTY_VALUE;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNumber(value, digits = 2) {
  if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
    return EMPTY_VALUE;
  }

  return Number(value).toFixed(digits);
}

function parseOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getWeekStart(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  const distanceFromMonday = (day + 6) % 7;
  date.setDate(date.getDate() - distanceFromMonday);
  return date;
}

function getWeekKey(dateValue) {
  return toLocalDateKey(getWeekStart(dateValue));
}

function parseInputDate(dateValue) {
  return new Date(`${dateValue}T00:00:00`);
}

function getDaysBetween(startDateValue, endDateValue) {
  const startDate = parseInputDate(startDateValue);
  const endDate = parseInputDate(endDateValue);
  return Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
}

function getPlannedWorkoutForOffset(dayOffset) {
  if (dayOffset < 0 || dayOffset >= TOTAL_DAYS) return null;
  if (dayOffset % 2 === 1) return "Off";

  const trainingIndex = Math.floor(dayOffset / 2) % 3;
  return ["A", "B", "C"][trainingIndex];
}

function getPlannedWorkoutForDate(dateValue, programStartDate) {
  if (!dateValue || !programStartDate) return null;
  return getPlannedWorkoutForOffset(getDaysBetween(programStartDate, dateValue));
}

function buildProgramSchedule(programStartDate) {
  if (!programStartDate) return [];

  return Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const date = parseInputDate(programStartDate);
    date.setDate(date.getDate() + index);

    return {
      dayNumber: index + 1,
      week: Math.floor(index / 7) + 1,
      dateKey: toLocalDateKey(date),
      dateLabel: formatDate(toLocalDateKey(date)),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      planned: getPlannedWorkoutForOffset(index),
    };
  });
}

function groupLogsByWeek(logs) {
  const weeklyMap = new Map();

  logs.forEach((log) => {
    const weekKey = getWeekKey(log.date);
    const currentWeek = weeklyMap.get(weekKey) ?? {
      weekKey,
      label: `Week of ${formatDate(weekKey)}`,
      planned: 0,
      done: 0,
      missed: 0,
    };

    const isPlannedSession = log.planned !== "Off";
    if (isPlannedSession) {
      currentWeek.planned += 1;
    }

    if (isPlannedSession && log.status === "Done") {
      currentWeek.done += 1;
    }

    if (isPlannedSession && log.status === "Missed") {
      currentWeek.missed += 1;
    }

    weeklyMap.set(weekKey, currentWeek);
  });

  return Array.from(weeklyMap.values())
    .sort((left, right) => right.weekKey.localeCompare(left.weekKey))
    .map((week) => ({
      ...week,
      adherence: week.planned
        ? Math.round((week.done / week.planned) * 100)
        : null,
    }));
}

function getAdherenceTone(adherence) {
  if (adherence === null) return "text-[var(--text)]";
  if (adherence > 80) return "text-[#7ee787]";
  if (adherence >= 50) return "text-[var(--accent)]";
  return "text-[#ff6b6b]";
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

function MetricCard({ eyebrow, value, toneClassName, caption }) {
  return (
    <article className={metricCardClassName}>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <p
        className={`mt-4 font-display text-[clamp(1.85rem,4vw,2.9rem)] leading-none ${toneClassName}`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">{caption}</p>
    </article>
  );
}

function TabButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[#111111]"
          : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
      }`}
    >
      {label}
    </button>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeWorkout, setActiveWorkout] = useState("A");
  const [logs, setLogs] = useState([]);
  const [biometrics, setBiometrics] = useState({
    weight: "",
    body_fat: "",
    program_start_date: DEFAULT_PROGRAM_START_DATE,
  });
  const [hasHydrated, setHasHydrated] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [logForm, setLogForm] = useState({
    date: getTodayInputValue(),
    planned: "A",
    status: "Done",
  });
  const [biometricForm, setBiometricForm] = useState({
    weight: "",
    body_fat: "",
    program_start_date: DEFAULT_PROGRAM_START_DATE,
  });

  useEffect(() => {
    const storedLogs = readStorageItem(LOGS_STORAGE_KEY, []);
    const storedBiometrics = readStorageItem(BIOMETRICS_STORAGE_KEY, {
      weight: "",
      body_fat: "",
      program_start_date: DEFAULT_PROGRAM_START_DATE,
    });
    const normalizedBiometrics =
      storedBiometrics && typeof storedBiometrics === "object"
        ? {
            weight: storedBiometrics.weight ?? "",
            body_fat:
              storedBiometrics.body_fat ??
              storedBiometrics.bodyFat ??
              "",
            program_start_date:
              storedBiometrics.program_start_date ??
              storedBiometrics.programStartDate ??
              DEFAULT_PROGRAM_START_DATE,
          }
        : { weight: "", body_fat: "", program_start_date: DEFAULT_PROGRAM_START_DATE };

    setLogs(Array.isArray(storedLogs) ? storedLogs : []);
    setBiometrics(normalizedBiometrics);
    setBiometricForm({
      weight: normalizedBiometrics.weight,
      body_fat: normalizedBiometrics.body_fat,
      program_start_date: normalizedBiometrics.program_start_date,
    });
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    writeStorageItem(LOGS_STORAGE_KEY, logs);
  }, [hasHydrated, logs]);

  useEffect(() => {
    if (!hasHydrated) return;
    writeStorageItem(BIOMETRICS_STORAGE_KEY, biometrics);
  }, [biometrics, hasHydrated]);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const sortedLogs = useMemo(
    () =>
      [...logs].sort((left, right) => {
        const dateComparison = right.date.localeCompare(left.date);
        if (dateComparison !== 0) return dateComparison;
        return (right.updatedAt ?? right.createdAt ?? "").localeCompare(
          left.updatedAt ?? left.createdAt ?? "",
        );
      }),
    [logs],
  );

  const weeklySummary = useMemo(() => groupLogsByWeek(sortedLogs), [sortedLogs]);

  const totalPlannedSessions = useMemo(
    () => logs.filter((log) => log.planned !== "Off").length,
    [logs],
  );
  const doneSessions = useMemo(
    () => logs.filter((log) => log.planned !== "Off" && log.status === "Done").length,
    [logs],
  );
  const missedSessions = useMemo(
    () => logs.filter((log) => log.planned !== "Off" && log.status === "Missed").length,
    [logs],
  );
  const uniqueLoggedDays = useMemo(() => new Set(logs.map((log) => log.date)).size, [logs]);

  const overallAdherence = totalPlannedSessions
    ? Math.round((doneSessions / totalPlannedSessions) * 100)
    : null;

  const daysInPercentage = Math.round((uniqueLoggedDays / TOTAL_DAYS) * 100);

  const currentWeightValue = parseOptionalNumber(biometrics.weight);
  const bodyFatValue = parseOptionalNumber(biometrics.body_fat);
  const programStartDate = biometrics.program_start_date || DEFAULT_PROGRAM_START_DATE;
  const programEndDate = useMemo(() => {
    const endDate = parseInputDate(programStartDate);
    endDate.setDate(endDate.getDate() + TOTAL_DAYS - 1);
    return toLocalDateKey(endDate);
  }, [programStartDate]);
  const programSchedule = useMemo(
    () => buildProgramSchedule(programStartDate),
    [programStartDate],
  );
  const selectedDateScheduledWorkout = useMemo(
    () => getPlannedWorkoutForDate(logForm.date, programStartDate),
    [logForm.date, programStartDate],
  );
  const scheduleTotals = useMemo(
    () =>
      programSchedule.reduce(
        (totals, day) => {
          totals[day.planned] += 1;
          return totals;
        },
        { A: 0, B: 0, C: 0, Off: 0 },
      ),
    [programSchedule],
  );

  useEffect(() => {
    const scheduledWorkout = getPlannedWorkoutForDate(logForm.date, programStartDate);
    if (!scheduledWorkout) return;

    setLogForm((current) =>
      current.planned === scheduledWorkout
        ? current
        : {
            ...current,
            planned: scheduledWorkout,
          },
    );
  }, [logForm.date, programStartDate]);

  const estimatedGoalDate = useMemo(() => {
    if (currentWeightValue === null || Number.isNaN(currentWeightValue)) return null;

    const remainingKilograms = Math.max(currentWeightValue - TARGET_WEIGHT, 0);
    const weeksToGoal = remainingKilograms / 1;
    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + Math.round(weeksToGoal * 7));
    return goalDate;
  }, [currentWeightValue]);

  const metricCards = [
    {
      eyebrow: "Overall Adherence",
      value: overallAdherence === null ? EMPTY_VALUE : `${overallAdherence}%`,
      toneClassName: overallAdherence === null ? "text-[var(--text)]" : getAdherenceTone(overallAdherence),
      caption: `${doneSessions} / ${totalPlannedSessions} sessions done`,
    },
    {
      eyebrow: "Current Weight / Target",
      value:
        currentWeightValue === null
          ? EMPTY_VALUE
          : `${formatNumber(currentWeightValue)} / ${formatNumber(TARGET_WEIGHT)} kg`,
      toneClassName: "text-[var(--text)]",
      caption:
        bodyFatValue === null
          ? "Add a body-fat measure"
          : `${formatNumber(bodyFatValue, 1)}% body fat`,
    },
    {
      eyebrow: "Days In / Total",
      value: `${uniqueLoggedDays} / ${TOTAL_DAYS} (${daysInPercentage}%)`,
      toneClassName: "text-[var(--text)]",
      caption: `${PROGRAM_WEEKS} weeks · alternate-day A/B/C rotation`,
    },
    {
      eyebrow: "Est. Goal Date",
      value: estimatedGoalDate ? formatDate(toLocalDateKey(estimatedGoalDate)) : EMPTY_VALUE,
      toneClassName: "text-[var(--text)]",
      caption: "Based on 1 kg/week loss",
    },
  ];

  function resetLogForm() {
    const today = getTodayInputValue();

    setEditingLogId(null);
    setLogForm({
      date: today,
      planned: getPlannedWorkoutForDate(today, programStartDate) ?? "A",
      status: "Done",
    });
  }

  function handleLogFieldChange(field) {
    return (event) => {
      const nextValue = event.target.value;

      setLogForm((current) => {
        if (field !== "date") {
          return {
            ...current,
            [field]: nextValue,
          };
        }

        const scheduledWorkout = getPlannedWorkoutForDate(nextValue, programStartDate);

        return {
          ...current,
          date: nextValue,
          planned: scheduledWorkout ?? current.planned,
        };
      });
    };
  }

  function handleBiometricFieldChange(field) {
    return (event) => {
      setBiometricForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  function handleSaveLog(event) {
    event.preventDefault();

    const nextLog = {
      id: editingLogId ?? createItemId(),
      date: logForm.date,
      planned: logForm.planned,
      status: logForm.status,
      createdAt: editingLogId
        ? logs.find((item) => item.id === editingLogId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLogs((current) => {
      if (editingLogId) {
        return current.map((item) => (item.id === editingLogId ? nextLog : item));
      }

      return [nextLog, ...current];
    });

    setToastMessage(editingLogId ? "Session updated" : "Session logged");
    resetLogForm();
  }

  function handleEditLog(log) {
    setActiveTab("Weekly Log");
    setEditingLogId(log.id);
    setLogForm({
      date: log.date,
      planned: log.planned,
      status: log.status,
    });
  }

  function handleDeleteLog(logId) {
    setLogs((current) => current.filter((item) => item.id !== logId));
    if (editingLogId === logId) {
      resetLogForm();
    }
    setToastMessage("Session deleted");
  }

  function handleSaveBiometrics(event) {
    event.preventDefault();

    const nextBiometrics = {
      weight: biometricForm.weight,
      body_fat: biometricForm.body_fat,
      program_start_date: biometricForm.program_start_date,
      updatedAt: new Date().toISOString(),
    };

    setBiometrics(nextBiometrics);
    setLogForm((current) => ({
      ...current,
      planned:
        getPlannedWorkoutForDate(current.date, biometricForm.program_start_date) ??
        current.planned,
    }));
    setToastMessage("Biometrics saved");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(10,10,10,0.92)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <div className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#111111]">
              ABC ISOLATION TRACKER
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.94] tracking-[-0.04em] text-[var(--text)]">
              12-week adherence dashboard
            </h1>
          </div>

          <div className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Program: <span className="text-[var(--text)]">A/B/C rotation every other day</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard
              key={metric.eyebrow}
              eyebrow={metric.eyebrow}
              value={metric.value}
              toneClassName={metric.toneClassName}
              caption={metric.caption}
            />
          ))}
        </section>

        <section className={`${shellCardClassName} p-4 sm:p-5`}>
          <div className="flex flex-wrap gap-2">
            {appTabs.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                label={tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </section>

        {activeTab === "Overview" && (
          <section className={`${shellCardClassName} p-5 sm:p-6`}>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Overview
                </p>
                <h2 className="mt-2 font-display text-2xl text-[var(--text)]">
                  Training summary
                </h2>
              </div>
              {logs.length > 0 && (
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {doneSessions} done / {missedSessions} missed / {totalPlannedSessions} planned
                </div>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-[var(--line)] bg-[#141414] px-6 py-16 text-center">
                <p className="font-display text-2xl text-[var(--text)]">No sessions logged yet</p>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Your weekly adherence view will populate as soon as you log sessions.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] border border-[var(--line)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--line)]">
                    <thead className="bg-[#151515]">
                      <tr className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                        <th className="px-4 py-4">Week</th>
                        <th className="px-4 py-4">Planned</th>
                        <th className="px-4 py-4">Done</th>
                        <th className="px-4 py-4">Missed</th>
                        <th className="px-4 py-4">Adherence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)] bg-[var(--card)]">
                      {weeklySummary.map((week) => (
                        <tr key={week.weekKey} className="transition hover:bg-[#1d1d1d]">
                          <td className="px-4 py-4 text-sm font-medium text-[var(--text)]">
                            {week.label}
                          </td>
                          <td className="px-4 py-4 text-sm text-[var(--muted)]">{week.planned}</td>
                          <td className="px-4 py-4 text-sm text-[#7ee787]">{week.done}</td>
                          <td className="px-4 py-4 text-sm text-[#ff6b6b]">{week.missed}</td>
                          <td
                            className={`px-4 py-4 text-sm font-semibold ${
                              week.adherence === null
                                ? "text-[var(--muted)]"
                                : getAdherenceTone(week.adherence)
                            }`}
                          >
                            {week.adherence === null ? EMPTY_VALUE : `${week.adherence}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "Weekly Log" && (
          <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className={`${shellCardClassName} p-5 sm:p-6`}>
              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Session Log
                </p>
                <h2 className="mt-2 font-display text-2xl text-[var(--text)]">
                  {editingLogId ? "Edit session" : "Log a session"}
                </h2>
              </div>

              <form className="space-y-4" onSubmit={handleSaveLog}>
                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--muted)]">Date</span>
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={handleLogFieldChange("date")}
                    className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--muted)]">Planned</span>
                  <select
                    value={logForm.planned}
                    onChange={handleLogFieldChange("planned")}
                    className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="Off">Off</option>
                  </select>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Workbook schedule for selected date:{" "}
                    <span className="text-[var(--accent)]">
                      {selectedDateScheduledWorkout ?? "Outside 12-week block"}
                    </span>
                  </p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--muted)]">Status</span>
                  <select
                    value={logForm.status}
                    onChange={handleLogFieldChange("status")}
                    className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="Done">Done</option>
                    <option value="Missed">Missed</option>
                    <option value="Rest">Rest</option>
                  </select>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition hover:brightness-95 active:scale-[0.99] sm:flex-1"
                  >
                    {editingLogId ? "Update Session" : "Log Session"}
                  </button>
                  {editingLogId && (
                    <button
                      type="button"
                      onClick={resetLogForm}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--line)] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text)] transition hover:border-[var(--accent)]/35 hover:text-[var(--accent)] sm:w-auto"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 border-t border-[var(--line)] pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Biometrics
                </p>
                <h3 className="mt-2 font-display text-xl text-[var(--text)]">
                  Save current measurements
                </h3>

                <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSaveBiometrics}>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm text-[var(--muted)]">Program start date</span>
                    <input
                      type="date"
                      value={biometricForm.program_start_date}
                      onChange={handleBiometricFieldChange("program_start_date")}
                      className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-[var(--muted)]">Weight (kg)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={biometricForm.weight}
                      onChange={handleBiometricFieldChange("weight")}
                      className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                      placeholder="94.55"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-[var(--muted)]">Body fat (%)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={biometricForm.body_fat}
                      onChange={handleBiometricFieldChange("body_fat")}
                      className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[#121212] px-4 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                      placeholder="21.8"
                    />
                  </label>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--line)] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Save Measurements
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className={`${shellCardClassName} p-5 sm:p-6`}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    Logged Sessions
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-[var(--text)]">
                    Session history
                  </h2>
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {sortedLogs.length} total
                </div>
              </div>

              {sortedLogs.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[var(--line)] bg-[#141414] px-6 py-16 text-center">
                  <p className="font-display text-2xl text-[var(--text)]">No sessions logged yet</p>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Logged entries appear here with edit and delete controls.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedLogs.map((log) => (
                    <article
                      key={log.id}
                      className="rounded-[20px] border border-[var(--line)] bg-[#141414] p-4 transition hover:border-[var(--accent)]/30"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-sm uppercase tracking-[0.16em] text-[var(--text)]">
                            {formatDate(log.date)}
                          </span>
                          <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                            Planned {log.planned}
                          </span>
                          <StatusPill status={log.status} />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditLog(log)}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLog(log.id)}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-[#ff6b6b]/25 px-4 text-sm font-semibold text-[#ff6b6b] transition hover:bg-[#ff6b6b]/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "Workouts" && (
          <section className={`${shellCardClassName} p-5 sm:p-6`}>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Workouts
                </p>
                <h2 className="mt-2 font-display text-2xl text-[var(--text)]">
                  Workbook-derived workout schedule
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {workoutTabs.map((tab) => (
                  <TabButton
                    key={tab}
                    active={activeWorkout === tab}
                    label={tab}
                    onClick={() => setActiveWorkout(tab)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
              <div className="rounded-[22px] border border-[var(--line)] bg-[#141414] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                  Workout {activeWorkout}
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Imported from the workbook’s ABC Program sheet. Pick one listed machine or cable option per row and keep the same movement for 3 to 4 exposures before changing it.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      Exercises
                    </p>
                    <p className="mt-2 font-display text-2xl text-[var(--text)]">
                      {workoutLibrary[activeWorkout].length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      Rotation Count
                    </p>
                    <p className="mt-2 font-display text-2xl text-[var(--text)]">
                      {scheduleTotals[activeWorkout]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {workoutLibrary[activeWorkout].map((exercise) => (
                  <article
                    key={`${activeWorkout}-${exercise.order}`}
                    className="rounded-[20px] border border-[var(--line)] bg-[#141414] p-4 transition hover:border-[var(--accent)]/35 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                          {activeWorkout}-{exercise.order} · {exercise.muscle}
                        </p>
                        <p className="mt-3 font-display text-xl text-[var(--text)]">
                          {exercise.bias}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                          {exercise.options}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                          {exercise.sets} sets
                        </span>
                        <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text)]">
                          {exercise.reps} reps
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-[var(--line)] bg-[#141414] p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    12-Week Schedule
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-[var(--text)]">
                    Alternate-day A / B / C rotation
                  </h3>
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {formatDate(programStartDate)} to {formatDate(programEndDate)}
                </div>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                {[
                  { label: "A Days", value: scheduleTotals.A, tone: "text-[var(--text)]" },
                  { label: "B Days", value: scheduleTotals.B, tone: "text-[var(--text)]" },
                  { label: "C Days", value: scheduleTotals.C, tone: "text-[var(--text)]" },
                  { label: "Off Days", value: scheduleTotals.Off, tone: "text-[var(--muted)]" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      {item.label}
                    </p>
                    <p className={`mt-2 font-display text-2xl ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-[20px] border border-[var(--line)]">
                <div className="max-h-[420px] overflow-auto">
                  <table className="min-w-full divide-y divide-[var(--line)]">
                    <thead className="sticky top-0 bg-[#151515]">
                      <tr className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                        <th className="px-4 py-4">Day</th>
                        <th className="px-4 py-4">Week</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Weekday</th>
                        <th className="px-4 py-4">Planned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)] bg-[var(--card)]">
                      {programSchedule.map((day) => (
                        <tr key={day.dayNumber} className="transition hover:bg-[#1d1d1d]">
                          <td className="px-4 py-3 text-sm text-[var(--text)]">{day.dayNumber}</td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">{day.week}</td>
                          <td className="px-4 py-3 text-sm text-[var(--text)]">{day.dateLabel}</td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">{day.weekday}</td>
                          <td className="px-4 py-3">
                            {day.planned === "Off" ? (
                              <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6fb3ff]">
                                Off
                              </span>
                            ) : (
                              <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                                {day.planned}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <div
        className={`pointer-events-none fixed bottom-4 right-4 z-50 transition duration-300 ${
          toastMessage ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-full border border-[var(--accent)]/30 bg-[#191919] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)] shadow-[0_8px_30px_rgba(0,0,0,0.32)]">
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
