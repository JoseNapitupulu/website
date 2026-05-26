"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LiveReportPayload = {
  count: number;
  latestTrackingCode: string | null;
  latestUpdatedAt: string | null;
};

type AdminLiveMonitorProps = {
  initialCount: number;
};

function formatCount(count: number) {
  return count.toLocaleString("id-ID");
}

export function AdminLiveMonitor({ initialCount }: AdminLiveMonitorProps) {
  const [count, setCount] = useState(initialCount);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "error">("idle");
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastCountRef = useRef(initialCount);
  const announcementTimerRef = useRef<number | null>(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const toneEnabledLabel = useMemo(() => (enabled ? "Suara aktif" : "Suara mati"), [enabled]);

  async function unlockAudio() {
    if (typeof window === "undefined") return;

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }

  function playTone() {
    const context = audioContextRef.current;

    if (!context) return;

    const start = context.currentTime;
    const notes = [784, 988, 1175];

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const noteStart = start + index * 0.12;

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.0001, noteStart);
      gainNode.gain.exponentialRampToValueAtTime(0.05, noteStart + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22);
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.24);
    });

    if (typeof window.speechSynthesis !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Ada laporan masuk");
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }

  function announce(message: string) {
    setAnnouncement(message);
    setPulse(true);

    if (announcementTimerRef.current) {
      window.clearTimeout(announcementTimerRef.current);
    }

    announcementTimerRef.current = window.setTimeout(() => {
      setAnnouncement(null);
      setPulse(false);
    }, 4000);
  }

  const pollLiveStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/reports/live", { cache: "no-store" });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const payload = (await response.json()) as LiveReportPayload;
      const nextCount = typeof payload.count === "number" ? payload.count : initialCount;

      if (nextCount > lastCountRef.current) {
        const diff = nextCount - lastCountRef.current;
        const message = diff === 1 ? "Ada laporan masuk" : `Ada ${diff} laporan masuk`;

        announce(message);

        if (enabledRef.current) {
          playTone();
        }
      }

      lastCountRef.current = nextCount;
      setCount(nextCount);
      setStatus("listening");
    } catch {
      setStatus("error");
    }
  }, [initialCount]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const runPoll = async () => {
      if (cancelled) return;
      await pollLiveStatus();
    };

    void runPoll();
    const intervalId = window.setInterval(runPoll, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [enabled, pollLiveStatus]);

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        window.clearTimeout(announcementTimerRef.current);
      }
    };
  }, []);

  const statusLabel =
    status === "error" ? "Pemantauan terganggu" : status === "listening" ? "Live aktif" : "Siap dipantau";

  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur transition ${pulse ? "ring-2 ring-campus-200" : ""}`}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-campus-100">Live Monitor</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCount(count)}</p>
          <p className="mt-1 text-sm text-slate-200">Laporan tersimpan di sistem</p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
          {toneEnabledLabel}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm">
        {announcement ?? statusLabel}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            await unlockAudio();
            setEnabled(true);
            setStatus("listening");
            setAnnouncement((current) => current ?? "Suara notifikasi siap");
          }}
          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {enabled ? "Bunyi aktif" : "Aktifkan bunyi"}
        </button>
        <button
          type="button"
          onClick={pollLiveStatus}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Cek sekarang
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-200">Pengecekan otomatis setiap 20 detik setelah suara diaktifkan.</p>
    </div>
  );
}
