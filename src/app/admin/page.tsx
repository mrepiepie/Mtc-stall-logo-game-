"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ClipboardList,
  CloudUpload,
  Gamepad2,
  Image as ImageIcon,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  Type,
} from "lucide-react";

const ADMIN_ACCESS_KEY = "MTC123";

const questions = [
  {
    type: "IMAGE",
    text: "Which brand uses the bitten apple logo?",
    answer: "Apple",
    points: 100,
  },
  {
    type: "TEXT",
    text: "What does HTML stand for?",
    answer: "HyperText Markup Language",
    points: 150,
  },
  {
    type: "IMAGE",
    text: "Identify the three-stripe sportswear brand.",
    answer: "Adidas",
    points: 100,
  },
  {
    type: "TEXT",
    text: "Which company created the Windows operating system?",
    answer: "Microsoft",
    points: 200,
  },
];

const stats = [
  { label: "Total Questions", value: "24", icon: ClipboardList },
  { label: "Image Questions", value: "14", icon: ImageIcon },
  { label: "Text Questions", value: "10", icon: Type },
];

function AdminDashboard() {
  const [questionType, setQuestionType] = useState("TEXT");
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState("100");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleQuestionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");

    if (questionType !== "TEXT") {
      setFormError("Image questions are not supported yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: questionText,
          answer,
          points: Number(points),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error("Question creation failed");
      }

      setQuestionText("");
      setAnswer("");
      setPoints("");
      setFormMessage("Question added successfully.");
    } catch {
      setFormError("Unable to add question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111111] px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b-4 border-[#333] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Byte Blitz
            </Link>
            <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#4fc3f7]">
              Microsoft Tech Club <span className="mx-2 text-zinc-500">•</span> BITS Pilani Dubai
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-6xl">
              Byte <span className="text-red-600">Blitz</span>
            </h1>
            <p className="mt-2 font-bold uppercase tracking-[0.18em] text-zinc-400">
              Admin Panel / Question Bank
            </p>
          </div>
          <div className="flex items-center gap-2 self-start border-2 border-[#333] bg-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 sm:self-auto">
            <span className="h-2 w-2 bg-[#00ff9d]" />
            Control Room Online
          </div>
        </header>

        <section aria-labelledby="question-bank-heading">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">01 / Content Ops</p>
              <h2 id="question-bank-heading" className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Question Bank
              </h2>
            </div>
            <p className="max-w-sm text-sm font-bold text-zinc-500 sm:text-right">
              Build the challenge one sharp question at a time.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between border-4 border-black bg-[#f4f0e6] p-5 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-600">{label}</p>
                  <p className="mt-1 font-mono text-4xl font-black tracking-tighter">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-red-600" />
              </div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <section className="border-4 border-black bg-[#f4f0e6] text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-4 border-black bg-black p-4 text-white">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">Create</p>
                  <h3 className="text-xl font-black uppercase tracking-widest">Add Question</h3>
                </div>
                <Plus className="h-6 w-6 text-[#f4f0e6]" />
              </div>

              <form onSubmit={handleQuestionSubmit} className="space-y-5 p-5 sm:p-6">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest">Question Type</span>
                  <span className="relative block">
                    <select value={questionType} onChange={(event) => setQuestionType(event.target.value)} className="w-full appearance-none border-4 border-black bg-white px-4 py-3 font-black uppercase tracking-wider outline-none focus:bg-yellow-100">
                      <option>TEXT</option>
                      <option>IMAGE</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest">Question Text</span>
                  <textarea
                    rows={3}
                    placeholder="Write the prompt for players..."
                    value={questionText}
                    onChange={(event) => setQuestionText(event.target.value)}
                    className="w-full resize-none border-4 border-black bg-white px-4 py-3 font-bold outline-none placeholder:text-zinc-400 focus:bg-yellow-100"
                  />
                </label>

                <div>
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest">Question Image</span>
                  <div className="flex min-h-32 flex-col items-center justify-center border-4 border-dashed border-black bg-white p-5 text-center transition-colors hover:bg-yellow-100">
                    <CloudUpload className="mb-2 h-8 w-8 text-red-600" />
                    <p className="font-black uppercase tracking-wider">Drag & drop image here</p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">or select a file from your device</p>
                    <button type="button" className="mt-4 border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-transform hover:translate-x-1 hover:translate-y-1">
                      Choose Image
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest">Correct Answer</span>
                    <input type="text" placeholder="e.g. Microsoft" value={answer} onChange={(event) => setAnswer(event.target.value)} className="w-full border-4 border-black bg-white px-4 py-3 font-bold outline-none placeholder:text-zinc-400 focus:bg-yellow-100" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest">Points</span>
                    <input type="number" value={points} onChange={(event) => setPoints(event.target.value)} min={1} className="w-full border-4 border-black bg-white px-4 py-3 font-mono font-bold outline-none focus:bg-yellow-100" />
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 border-4 border-black bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60">
                  <Check className="h-5 w-5" />
                  {isSubmitting ? "Adding..." : "Add Question"}
                </button>
                {formMessage && <p role="status" className="border-2 border-black bg-[#00ff9d] px-3 py-2 text-center text-sm font-black uppercase tracking-widest">{formMessage}</p>}
                {formError && <p role="alert" className="border-2 border-black bg-red-600 px-3 py-2 text-center text-sm font-black uppercase tracking-widest text-white">{formError}</p>}
              </form>
            </section>

            <section className="min-w-0 border-4 border-black bg-[#f4f0e6] text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-4 border-black bg-black p-4 text-white">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">Manage</p>
                  <h3 className="text-xl font-black uppercase tracking-widest">Saved Questions</h3>
                </div>
                <span className="border-2 border-white px-2 py-1 font-mono text-xs font-bold">04 ITEMS</span>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-[5.5rem_minmax(16rem,1fr)_minmax(10rem,0.7fr)_5rem_7.5rem] gap-3 border-b-2 border-black/20 bg-black/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    <span>Type</span><span>Question</span><span>Answer</span><span>Pts</span><span>Actions</span>
                  </div>
                  {questions.map((question) => (
                    <div key={question.text} className="grid grid-cols-[5.5rem_minmax(16rem,1fr)_minmax(10rem,0.7fr)_5rem_7.5rem] items-center gap-3 border-b-2 border-black/10 px-4 py-4 text-sm last:border-0 hover:bg-black/5">
                      <span className={`w-fit border-2 border-black px-2 py-1 text-[10px] font-black tracking-widest ${question.type === "IMAGE" ? "bg-yellow-300" : "bg-white"}`}>
                        {question.type}
                      </span>
                      <span className="font-bold leading-tight">{question.text}</span>
                      <span className="font-bold text-zinc-600">{question.answer}</span>
                      <span className="font-mono font-black">{question.points}</span>
                      <span className="flex gap-2">
                        <button type="button" aria-label={`Edit ${question.text}`} className="border-2 border-black bg-white p-2 transition-colors hover:bg-yellow-300"><Pencil className="h-4 w-4" /></button>
                        <button type="button" aria-label={`Delete ${question.text}`} className="border-2 border-black bg-red-600 p-2 text-white transition-colors hover:bg-red-700"><Trash2 className="h-4 w-4" /></button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-12 border-4 border-dashed border-[#555] bg-black/60 p-5 sm:p-7" aria-labelledby="game-rounds-heading">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#4fc3f7]">02 / Coming Soon</p>
              <h2 id="game-rounds-heading" className="text-3xl font-black uppercase tracking-tight text-white">Game Rounds</h2>
              <p className="mt-2 max-w-2xl font-bold leading-relaxed text-zinc-400">
                The launch bay for live Byte Blitz sessions. Create a game, generate a unique 6-digit PIN, start a round, and send ten randomized questions into play.
              </p>
            </div>
            <Gamepad2 className="h-12 w-12 shrink-0 text-zinc-600" />
          </div>
          <div className="mt-6 grid gap-3 text-xs font-black uppercase tracking-widest text-zinc-500 sm:grid-cols-3">
            <div className="border-2 border-[#444] px-4 py-3">Create a game</div>
            <div className="border-2 border-[#444] px-4 py-3">Generate 6-digit PIN</div>
            <div className="border-2 border-[#444] px-4 py-3">Start 10-question round</div>
          </div>
          <button type="button" disabled className="mt-6 border-4 border-[#444] px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-600">
            Game Controls Locked for Now
          </button>
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessKey === ADMIN_ACCESS_KEY) {
      setIsAuthorized(true);
      setIsInvalid(false);
      return;
    }

    setIsInvalid(true);
  };

  if (isAuthorized) {
    return <AdminDashboard />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px]" />

      <section className="relative z-10 w-full max-w-md border-4 border-black bg-[#f4f0e6] text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black bg-black p-5 text-white">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">Byte Blitz / Restricted</p>
          <h1 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tight">
            <KeyRound className="h-7 w-7 text-red-600" />
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleAccessSubmit} className="space-y-5 p-5 sm:p-7">
          <p className="font-bold leading-relaxed text-zinc-700">
            Enter the admin access key to open the question bank control room.
          </p>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest">Access Key</span>
            <input
              type="password"
              value={accessKey}
              onChange={(event) => {
                setAccessKey(event.target.value);
                setIsInvalid(false);
              }}
              autoFocus
              className="w-full border-4 border-black bg-white px-4 py-3 font-mono font-bold tracking-widest outline-none focus:bg-yellow-100"
              aria-invalid={isInvalid}
            />
          </label>

          {isInvalid && (
            <p role="alert" className="border-2 border-black bg-red-600 px-3 py-2 text-center text-sm font-black uppercase tracking-widest text-white">
              Invalid Access Key
            </p>
          )}

          <button type="submit" className="flex w-full items-center justify-center gap-2 border-4 border-black bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <KeyRound className="h-5 w-5" />
            Enter
          </button>
        </form>
      </section>
    </main>
  );
}
