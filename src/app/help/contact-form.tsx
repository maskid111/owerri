"use client";

import { CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { buttonClass } from "@/components/ui";

const topics = ["An order", "Event tickets", "A listing", "Something else"];

/** Prototype contact form — validates locally and shows a confirmation; nothing is sent. */
export function ContactForm() {
  const id = useId();
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[1.25rem] border border-line/70 bg-paper p-6 text-center shadow-card" role="status">
        <CheckCircle2 className="mx-auto size-12 text-forest-light" strokeWidth={1.5} />
        <p className="mt-3 font-display text-2xl font-semibold text-forest">Thanks — message noted</p>
        <p className="mt-1 text-sm text-stone">This preview doesn’t send messages yet, but your note was validated successfully.</p>
        <button onClick={() => { setSent(false); setMessage(""); }} className={buttonClass("outline", "md", "mt-5")}>
          Write another
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (message.trim().length < 10) return setError("Please write at least a sentence so we can help.");
        setError("");
        setSent(true);
      }}
      className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card sm:p-6"
    >
      <h2 className="text-2xl font-semibold text-forest">Contact support</h2>
      <label htmlFor={`${id}-topic`} className="mt-4 block text-sm font-semibold">
        It’s about
      </label>
      <select id={`${id}-topic`} value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-forest">
        {topics.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <label htmlFor={`${id}-msg`} className="mt-4 block text-sm font-semibold">
        Message
      </label>
      <textarea
        id={`${id}-msg`}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-invalid={Boolean(error)}
        placeholder="Tell us what happened…"
        className="mt-1.5 w-full resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-forest"
      />
      {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
      <button type="submit" className={buttonClass("primary", "md", "mt-4 w-full")}>
        Send message
      </button>
      <p className="mt-2 text-center text-xs text-stone">Prototype — messages are not sent anywhere.</p>
    </form>
  );
}
