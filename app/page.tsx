"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const FIELDS = [
  { key: "students", label: "No. Of Students" },
  { key: "qualification", label: "Qualification" },
  { key: "experience", label: "Experience" },
  { key: "class", label: "Class" },
  { key: "duration", label: "Duration" },
  { key: "fees", label: "Fees" },
  { key: "subject", label: "Subject" },
  { key: "address", label: "Address" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

const CONTACT = "+91 6396219729";

type FormData = Record<FieldKey, string>;

const INITIAL: FormData = {
  students: "",
  qualification: "",
  experience: "",
  class: "",
  duration: "",
  fees: "",
  subject: "",
  address: "",
};

export default function Home() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [form, setForm] = useState<FormData>(INITIAL);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const isMale = gender === "male";
  const bgColor = isMale ? "#38b7fe" : "#ff66c6";
  const bottomBarBg = isMale ? "rgba(0,150,170,0.25)" : "rgba(220,80,130,0.25)";

  // Scale the card preview to fit its container
  useEffect(() => {
    const update = () => {
      if (previewWrapperRef.current) {
        const available = previewWrapperRef.current.offsetWidth;
        setScale(Math.min(1, available / 400));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (previewWrapperRef.current) observer.observe(previewWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const set = (key: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    await document.fonts.ready;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: bgColor,
      logging: false,
    });
    const link = document.createElement("a");
    link.download = `${gender}-required-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Card element (fixed 400px — captured by html2canvas at real size)
  const card = (
    <div
      ref={cardRef}
      style={{
        width: 400,
        backgroundColor: bgColor,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, padding: "18px 24px 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "0.18em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {isMale ? "MALE" : "FEMALE"}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.12em",
              marginTop: 2,
            }}
          >
            Required
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid rgba(255,255,255,0.7)", margin: "14px 0" }} />

        {/* Fields — beige box */}
        <div
          style={{
            backgroundColor: "rgba(245, 240, 232, 0.82)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 7,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Watermark logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 320,
              opacity: 0.28,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          {FIELDS.map((f) => (
            <div key={f.key} style={{ fontSize: 19, color: "#111", lineHeight: 1.35 }}>
              <span style={{ fontWeight: 900 }}>{f.label}</span>
              <span style={{ fontWeight: 700 }}>
                {" "}-{" "}
                {form[f.key] || <span style={{ opacity: 0.35 }}>{f.label}</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Contact — beige box */}
        <div
          style={{
            backgroundColor: "rgba(245, 240, 232, 0.82)",
            borderRadius: 12,
            padding: "10px 16px",
            marginTop: 10,
            textAlign: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#111",
          }}
        >
          Contact- {CONTACT}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          backgroundColor: bottomBarBg,
          textAlign: "center",
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 500,
          color: "#111",
        }}
      >
        Please don&apos;t call, Only{" "}
        <span style={{ color: "#15803d", fontWeight: 700 }}>Whatsapp</span> Message
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      {/* Nav */}
      <nav className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="FindMyTutor"
          width={64}
          height={46}
          style={{ objectFit: "contain" }}
        />
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Card Generator</h1>
      </nav>

      {/* Mobile hint */}
      <p className="lg:hidden text-center text-xs text-gray-400 pt-3 pb-0 px-4">
        Fill the form below, then scroll down to see the preview
      </p>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* ── Form ── */}
        <div className="bg-white rounded-2xl shadow-lg p-5 w-full lg:w-80 lg:flex-shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Gender
          </p>
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isMale
                  ? "bg-[#38b7fe] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                !isMale
                  ? "bg-[#ff66c6] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Female
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  {f.label}
                </label>
                {f.key === "address" ? (
                  <textarea
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    value={form[f.key]}
                    onChange={set(f.key)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={form[f.key]}
                    onChange={set(f.key)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Contact:{" "}
            <span className="font-semibold text-gray-600">{CONTACT}</span>
          </p>

          <button
            onClick={handleDownload}
            className="mt-5 w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
            style={{ background: isMale ? "#0891b2" : "#db2777" }}
          >
            Download Card
          </button>
        </div>

        {/* ── Preview ── */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest self-center">
            Preview
          </p>

          {/* Scaling wrapper — measures available width, scales card to fit */}
          <div ref={previewWrapperRef} className="w-full flex justify-center">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                // Collapse vertical space consumed by the scaled-down card
                marginBottom: scale < 1 ? `calc((${scale} - 1) * 100%)` : 0,
              }}
            >
              {card}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
