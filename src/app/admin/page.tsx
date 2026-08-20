"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  CloudUpload,
  Copy,
  Gamepad2,
  Image as ImageIcon,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const ADMIN_ACCESS_KEY = "MTC123";

type Question = {
  id: string;
  answer: string;
  image_url: string | null;
  difficulty: string;
};

type CreatedGame = {
  gamePin: number;
  round: number;
  status: string;
  questions: Question[];
  players?: string[];
};

async function loadQuestions() {
  const response = await fetch("/api/questions");
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !Array.isArray(result.questions)) {
    throw new Error("Questions could not be loaded");
  }

  return result.questions as Question[];
}

function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("medium");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createdGame, setCreatedGame] = useState<CreatedGame | null>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [gameError, setGameError] = useState("");
  const [isPinCopied, setIsPinCopied] = useState(false);

  const stats = [
    { label: "Total Questions", value: questions.length, icon: ClipboardList },
    {
      label: "Questions With Images",
      value: questions.filter((question) => Boolean(question.image_url?.trim())).length,
      icon: ImageIcon,
    },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsError("");
        setQuestions(await loadQuestions());
      } catch {
        setQuestionsError("Unable to load questions. Please try again.");
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleImageSelection = (file: File | undefined) => {
    setFormMessage("");
    setFormError("");

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setImageFile(null);
      setFormError("Please select a PNG, JPG, or WEBP image up to 5 MB.");
      return;
    }

    setImageFile(file);
  };

  const handleQuestionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");

    setIsSubmitting(true);

    try {
      if (!imageFile) {
        throw new Error("Image is required");
      }

      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadResponse = await fetch("/api/questions/upload", {
        method: "POST",
        body: uploadData,
      });
      const uploadResult = await uploadResponse.json().catch(() => null);

      if (!uploadResponse.ok || !uploadResult?.success || typeof uploadResult.image_url !== "string") {
        throw new Error("Image upload failed");
      }

      const response = await fetch("/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer,
          image_url: uploadResult.image_url,
          difficulty,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error("Question creation failed");
      }

      setImageFile(null);
      setAnswer("");
      setDifficulty("medium");
      setQuestionsError("");
      setQuestions(await loadQuestions());
      setFormMessage("Question added successfully.");
    } catch {
      setFormError("Unable to add question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (question: Question) => {
    setDeleteConfirmationId(null);
    setEditingQuestionId(question.id);
    setEditAnswer(question.answer);
    setEditImageUrl(question.image_url ?? "");
    setEditDifficulty(question.difficulty);
    setFormMessage("");
    setFormError("");
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditAnswer("");
    setEditImageUrl("");
    setEditDifficulty("medium");
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");
    setIsSavingEdit(true);

    try {
      const response = await fetch("/api/questions/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          answer: editAnswer,
          image_url: editImageUrl,
          difficulty: editDifficulty,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error("Question update failed");
      }

      setQuestions(await loadQuestions());
      cancelEditing();
      setFormMessage("Question updated successfully.");
    } catch {
      setFormError("Unable to update question. Please try again.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    setFormMessage("");
    setFormError("");
    setIsDeleting(true);

    try {
      const response = await fetch("/api/questions/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error("Question deletion failed");
      }

      setQuestions(await loadQuestions());
      setDeleteConfirmationId(null);
      setFormMessage("Question deleted successfully.");
    } catch {
      setFormError("Unable to delete question. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateGame = async () => {
    setGameError("");
    setIsPinCopied(false);
    setIsCreatingGame(true);

    try {
      const response = await fetch("/api/games/create", { method: "POST" });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || typeof result.gamePin !== "number" || !Array.isArray(result.questions)) {
        throw new Error("Game creation failed");
      }

      setCreatedGame({
        gamePin: result.gamePin,
        round: result.round,
        status: "waiting",
        questions: result.questions as Question[],
          players: [],
        });
    } catch {
      setGameError("Unable to create game. Please try again.");
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleCopyPin = async () => {
    if (!createdGame) return;
    await navigator.clipboard.writeText(String(createdGame.gamePin));
    setIsPinCopied(true);
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

          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <section className="self-start border-4 border-black bg-[#f4f0e6] text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between border-b-4 border-black bg-black p-4 text-white">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">Create</p>
                  <h3 className="text-xl font-black uppercase tracking-widest">Add Question</h3>
                </div>
                <Plus className="h-6 w-6 text-[#f4f0e6]" />
              </div>

              <form onSubmit={handleQuestionSubmit} className="space-y-5 p-5 sm:p-6">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest">Logo Image Question</span>
                  <label className="block cursor-pointer border-4 border-black bg-white px-4 py-3 font-bold transition-colors hover:bg-yellow-100">
                    <span className="block truncate text-zinc-500">{imageFile ? imageFile.name : "Choose a logo image"}</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImageSelection(event.target.files?.[0])} className="sr-only" />
                  </label>
                </label>

                <div>
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest">Image Preview Area</span>
                  <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-white p-5 text-center transition-colors hover:bg-yellow-100">
                    {imagePreviewUrl ? <img src={imagePreviewUrl} alt="Selected logo preview" className="mb-2 h-12 w-12 object-contain" /> : <CloudUpload className="mb-2 h-8 w-8 text-red-600" />}
                    <span className="font-black uppercase tracking-wider">{imageFile ? "Image selected" : "Choose or drop image here"}</span>
                    <span className="mt-1 text-xs font-bold text-zinc-500">PNG, JPG, or WEBP up to 5 MB</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImageSelection(event.target.files?.[0])} className="sr-only" />
                  </label>
                  </div>

                <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest">Answer</span>
                    <input type="text" placeholder="e.g. Microsoft" value={answer} onChange={(event) => setAnswer(event.target.value)} className="w-full border-4 border-black bg-white px-4 py-3 font-bold outline-none placeholder:text-zinc-400 focus:bg-yellow-100" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-widest">Difficulty</span>
                    <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="w-full border-4 border-black bg-white px-3 py-3 font-black uppercase outline-none focus:bg-yellow-100">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
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
                <span className="border-2 border-white px-2 py-1 font-mono text-xs font-bold">{questions.length} ITEMS</span>
              </div>

              <div className="w-full min-w-0 overflow-hidden">
                <div className="w-full min-w-0">
                  {isLoadingQuestions ? (
                    <p className="p-10 text-center text-sm font-black uppercase tracking-widest text-zinc-600">Loading questions...</p>
                  ) : questionsError ? (
                    <p role="alert" className="p-10 text-center text-sm font-black uppercase tracking-widest text-red-600">{questionsError}</p>
                  ) : questions.length === 0 ? (
                    <p className="p-10 text-center text-sm font-black uppercase tracking-widest text-zinc-600">No questions found.</p>
                  ) : (
                    <>
                      <div className="hidden grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_5.5rem_8rem] gap-3 border-b-2 border-black/20 bg-black/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 sm:grid">
                        <span>Image</span><span>Image URL</span><span>Answer</span><span>Difficulty</span><span>Actions</span>
                      </div>
                      {questions.map((question) => (
                        editingQuestionId === question.id ? (
                          <form key={question.id} onSubmit={(event) => handleEditSubmit(event, question.id)} className="grid min-w-0 grid-cols-1 gap-3 border-b-2 border-black/10 bg-yellow-100 px-4 py-4 text-sm last:border-0 sm:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_5.5rem_8rem] sm:items-center">
                            <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-white p-1">
                              {editImageUrl ? <img src={editImageUrl} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-5 w-5 text-zinc-400" />}
                            </div>
                            <input type="url" value={editImageUrl} onChange={(event) => setEditImageUrl(event.target.value)} className="min-w-0 w-full border-2 border-black bg-white px-2 py-2 font-mono text-xs outline-none focus:bg-yellow-200" aria-label="Image URL" />
                            <input type="text" value={editAnswer} onChange={(event) => setEditAnswer(event.target.value)} className="min-w-0 w-full border-2 border-black bg-white px-2 py-2 font-bold outline-none focus:bg-yellow-200" aria-label="Answer" />
                            <select value={editDifficulty} onChange={(event) => setEditDifficulty(event.target.value)} className="min-w-0 w-full border-2 border-black bg-white px-2 py-2 font-black uppercase outline-none focus:bg-yellow-200" aria-label="Difficulty">
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                            <span className="flex min-w-0 gap-2 whitespace-nowrap">
                              <button type="submit" disabled={isSavingEdit} className="border-2 border-black bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-60">{isSavingEdit ? "Saving..." : "Save"}</button>
                              <button type="button" disabled={isSavingEdit} onClick={cancelEditing} className="border-2 border-black bg-white p-2 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Cancel edit"><X className="h-4 w-4" /></button>
                            </span>
                          </form>
                        ) : (
                          <div key={question.id} className="grid min-w-0 grid-cols-1 gap-3 border-b-2 border-black/10 px-4 py-4 text-sm last:border-0 hover:bg-black/5 sm:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_5.5rem_8rem] sm:items-center">
                            <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-white p-1">
                              {question.image_url ? <img src={question.image_url} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-5 w-5 text-zinc-400" />}
                            </div>
                            <span className="min-w-0 truncate font-mono text-xs font-bold text-zinc-600">{question.image_url || "No image URL"}</span>
                            <span className="min-w-0 truncate font-bold leading-tight">{question.answer}</span>
                            <span className="w-fit border-2 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase tracking-widest">{question.difficulty}</span>
                            {deleteConfirmationId === question.id ? (
                              <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                                <span className="min-w-0 text-[10px] font-black uppercase leading-tight text-red-600">Permanently remove?</span>
                                <button type="button" disabled={isDeleting} onClick={() => handleDelete(question.id)} className="border-2 border-black bg-red-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60" aria-label="Confirm delete">{isDeleting ? "..." : <Check className="h-4 w-4" />}</button>
                                <button type="button" disabled={isDeleting} onClick={() => setDeleteConfirmationId(null)} className="border-2 border-black bg-white p-2 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Cancel delete"><X className="h-4 w-4" /></button>
                              </span>
                            ) : (
                              <span className="flex min-w-0 gap-2 whitespace-nowrap">
                                <button type="button" disabled={deleteConfirmationId !== null} onClick={() => startEditing(question)} className="border-2 border-black bg-white p-2 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Edit ${question.answer}`}><Pencil className="h-4 w-4" /></button>
                                <button type="button" disabled={editingQuestionId !== null} onClick={() => setDeleteConfirmationId(question.id)} className="border-2 border-black bg-red-600 p-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Delete ${question.answer}`}><Trash2 className="h-4 w-4" /></button>
                              </span>
                            )}
                          </div>
                        )
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-12 border-4 border-black bg-[#f4f0e6] p-5 text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:p-7" aria-labelledby="game-rounds-heading">
          <div className="flex flex-col gap-5 border-b-4 border-black pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-600">02 / Host Controls</p>
              <h2 id="game-rounds-heading" className="text-3xl font-black uppercase tracking-tight">Game Rounds</h2>
              <p className="mt-2 max-w-2xl font-bold leading-relaxed text-zinc-600">Create a waiting room with ten randomized questions for your next Byte Blitz round.</p>
            </div>
            <Gamepad2 className="h-12 w-12 shrink-0 text-red-600" />
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={handleCreateGame} disabled={isCreatingGame} className="flex items-center justify-center gap-2 border-4 border-black bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60">
              <Plus className="h-5 w-5" />
              {isCreatingGame ? "Creating..." : "Create New Game"}
            </button>
            {gameError && <p role="alert" className="border-2 border-black bg-red-600 px-3 py-2 text-center text-xs font-black uppercase tracking-widest text-white">{gameError}</p>}
          </div>

          {createdGame && (
            <div className="mt-5 border-4 border-black bg-white p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_repeat(3,auto)] sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Game PIN</p>
                  <p className="font-mono text-5xl font-black tracking-[0.12em] text-red-600">{createdGame.gamePin}</p>
                </div>
                <div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Questions</p><p className="font-mono text-2xl font-black">{createdGame.questions.length}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Round</p><p className="font-mono text-2xl font-black">{createdGame.round}</p></div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</p>
                    <p className={`font-black uppercase ${createdGame.status === 'playing' ? 'text-blue-600' : 'text-[#008f5a]'}`}>
                      {createdGame.status === 'timed_out' ? 'Timed Out' : createdGame.status}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:col-start-2">
                    <button type="button" onClick={handleCopyPin} className="flex items-center justify-center gap-2 border-2 border-black bg-[#f4f0e6] px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors hover:bg-yellow-300">
                      <Copy className="h-4 w-4" />
                      {isPinCopied ? "Copied" : "Copy PIN"}
                    </button>
                    {createdGame.status === 'waiting' && (
                      <button 
                        type="button" 
                        onClick={async () => {
                          await fetch('/api/games/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin }) });
                          setCreatedGame(prev => prev ? { ...prev, status: 'playing' } : null);
                        }}
                        className="flex items-center justify-center gap-2 border-2 border-black bg-red-600 text-white px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors hover:bg-red-500"
                      >
                        Start Lobby
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t-2 border-black/20 pt-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Players Joined ({createdGame.players?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {createdGame.players?.map((p: string, i: number) => (
                      <span key={i} className="bg-yellow-300 border-2 border-black px-2 py-1 text-xs font-bold uppercase">{p}</span>
                    ))}
                    {(!createdGame.players || createdGame.players.length === 0) && (
                      <span className="text-sm font-bold text-zinc-400">Waiting for players...</span>
                    )}
                  </div>
                </div>

              <div className="mt-4 grid gap-2 border-t-2 border-black/20 pt-4 sm:grid-cols-2">
                {createdGame.questions.map((question, index) => (
                  <div key={question.id} className="flex min-w-0 items-center gap-3 border-2 border-black/10 p-2">
                    <span className="font-mono text-xs font-black text-red-600">{String(index + 1).padStart(2, "0")}</span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-[#f4f0e6] p-1">
                      {question.image_url ? <img src={question.image_url} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-4 w-4 text-zinc-400" />}
                    </div>
                    <span className="min-w-0 flex-1 truncate font-bold uppercase">{question.answer}</span>
                    <span className="border-2 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase">{question.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
