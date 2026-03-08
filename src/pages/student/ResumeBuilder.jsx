import { useState, useRef } from "react";

// ── Template definitions ──────────────────────────────────────
const TEMPLATES = {
  modern: {
    name: "Modern",
    desc: "Clean, minimal, ATS-friendly",
    accent: "#6366f1",
    bg: "#ffffff",
    text: "#111827",
    secondary: "#6b7280",
    tag: "Most Popular",
  },
  creative: {
    name: "Creative",
    desc: "Bold sidebar, eye-catching",
    accent: "#ec4899",
    bg: "#fdf4ff",
    text: "#1e1b4b",
    secondary: "#7c3aed",
    tag: "Unique",
  },
  classic: {
    name: "Classic",
    desc: "Traditional, professional",
    accent: "#1e3a5f",
    bg: "#fffdf7",
    text: "#1a1a1a",
    secondary: "#374151",
    tag: "Trusted",
  },
};

const SECTIONS = ["contact","summary","experience","education","skills","projects"];

const DEFAULT_DATA = {
  name: "Your Name",
  title: "Software Engineer",
  email: "your@email.com",
  phone: "+91 9876543210",
  location: "Bangalore, India",
  linkedin: "linkedin.com/in/yourname",
  github: "github.com/yourname",
  summary: "Passionate developer with experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Seeking to leverage technical expertise to drive innovation.",
  experience: [
    { company: "Tech Corp", role: "Frontend Developer", duration: "2022 - Present", points: ["Built React dashboard used by 50k+ users", "Improved app performance by 40%", "Led team of 3 engineers"] },
    { company: "Startup Inc", role: "Junior Developer", duration: "2020 - 2022", points: ["Developed REST APIs with Node.js", "Integrated payment gateway", "Reduced bug count by 60%"] },
  ],
  education: [
    { institution: "IIT Delhi", degree: "B.Tech Computer Science", year: "2016 - 2020", grade: "8.5 CGPA" },
  ],
  skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB", "AWS", "Docker", "Git", "Python", "SQL"],
  projects: [
    { name: "Job Portal App", tech: "React, Node.js, MongoDB", desc: "Full-stack job portal with AI matching and real-time chat. 500+ users." },
    { name: "E-Commerce Platform", tech: "Next.js, Stripe, PostgreSQL", desc: "Complete shopping platform with payment integration." },
  ],
};

// ── Modern Template ───────────────────────────────────────────
function ModernTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: t.bg, color: t.text, minHeight: "297mm", width: "210mm", padding: "12mm 14mm", boxSizing: "border-box", fontSize: "9.5pt", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${t.accent}`, paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ fontSize: "24pt", fontWeight: 900, letterSpacing: "-0.5px", color: t.text }}>{data.name}</div>
        <div style={{ fontSize: "11pt", color: t.accent, fontWeight: 600, marginBottom: 6 }}>{data.title}</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "8.5pt", color: t.secondary }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📱 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
          {data.github && <span>⌥ {data.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <Section title="PROFESSIONAL SUMMARY" accent={t.accent}>
          <p style={{ color: t.secondary, margin: 0 }}>{data.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <Section title="EXPERIENCE" accent={t.accent}>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 700, fontSize: "10pt" }}>{exp.role}</div>
                <div style={{ fontSize: "8pt", color: t.secondary }}>{exp.duration}</div>
              </div>
              <div style={{ color: t.accent, fontSize: "9pt", marginBottom: 3 }}>{exp.company}</div>
              <ul style={{ margin: "3px 0 0 14px", padding: 0 }}>
                {exp.points?.map((p, j) => <li key={j} style={{ color: t.secondary, marginBottom: 2 }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <Section title="EDUCATION" accent={t.accent}>
          {data.education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ color: t.accent, fontSize: "9pt" }}>{edu.institution}</div>
              </div>
              <div style={{ textAlign: "right", color: t.secondary, fontSize: "8.5pt" }}>
                <div>{edu.year}</div>
                {edu.grade && <div>{edu.grade}</div>}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Section title="SKILLS" accent={t.accent}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.skills.map((s, i) => (
              <span key={i} style={{ background: `${t.accent}15`, color: t.accent, padding: "2px 8px", borderRadius: 3, fontSize: "8.5pt", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <Section title="PROJECTS" accent={t.accent}>
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: t.accent, fontSize: "8pt" }}>{p.tech}</span>
              </div>
              <div style={{ color: t.secondary }}>{p.desc}</div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

// ── Creative Template ─────────────────────────────────────────
function CreativeTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", display: "flex", minHeight: "297mm", width: "210mm", boxSizing: "border-box", fontSize: "9pt", lineHeight: 1.5 }}>
      {/* Sidebar */}
      <div style={{ width: "68mm", background: t.secondary, color: "white", padding: "14mm 8mm", flexShrink: 0 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22pt", fontWeight: 900, color: "white", margin: "0 auto 12px" }}>
          {data.name?.[0] || "Y"}
        </div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "13pt", fontWeight: 800, lineHeight: 1.2 }}>{data.name}</div>
          <div style={{ color: t.accent, fontSize: "9pt", marginTop: 4 }}>{data.title}</div>
        </div>

        <SideSection title="CONTACT" accent={t.accent}>
          {data.email && <div style={{ marginBottom: 4, fontSize: "8pt", wordBreak: "break-all" }}>✉ {data.email}</div>}
          {data.phone && <div style={{ marginBottom: 4, fontSize: "8pt" }}>📱 {data.phone}</div>}
          {data.location && <div style={{ marginBottom: 4, fontSize: "8pt" }}>📍 {data.location}</div>}
          {data.linkedin && <div style={{ marginBottom: 4, fontSize: "8pt", wordBreak: "break-all" }}>in {data.linkedin}</div>}
          {data.github && <div style={{ fontSize: "8pt", wordBreak: "break-all" }}>⌥ {data.github}</div>}
        </SideSection>

        <SideSection title="SKILLS" accent={t.accent}>
          {data.skills?.map((s, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: "8pt", marginBottom: 2 }}>{s}</div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${70 + (i % 3) * 10}%`, background: t.accent, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </SideSection>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: t.bg, padding: "14mm 10mm", color: t.text }}>
        {data.summary && (
          <Section title="ABOUT ME" accent={t.accent} dark>
            <p style={{ color: "#4b5563", margin: 0 }}>{data.summary}</p>
          </Section>
        )}
        {data.experience?.length > 0 && (
          <Section title="EXPERIENCE" accent={t.accent} dark>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${t.accent}` }}>
                <div style={{ fontWeight: 700 }}>{exp.role}</div>
                <div style={{ color: t.accent, fontSize: "8.5pt" }}>{exp.company} · {exp.duration}</div>
                <ul style={{ margin: "4px 0 0 12px", padding: 0 }}>
                  {exp.points?.map((p, j) => <li key={j} style={{ color: "#4b5563", marginBottom: 2 }}>{p}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}
        {data.education?.length > 0 && (
          <Section title="EDUCATION" accent={t.accent} dark>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${t.accent}` }}>
                <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ color: t.accent, fontSize: "8.5pt" }}>{edu.institution}</div>
                <div style={{ color: "#6b7280", fontSize: "8pt" }}>{edu.year} {edu.grade && `· ${edu.grade}`}</div>
              </div>
            ))}
          </Section>
        )}
        {data.projects?.length > 0 && (
          <Section title="PROJECTS" accent={t.accent} dark>
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${t.accent}` }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: t.accent, fontSize: "8pt" }}>{p.tech}</div>
                <div style={{ color: "#4b5563" }}>{p.desc}</div>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// ── Classic Template ──────────────────────────────────────────
function ClassicTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Times New Roman', serif", background: t.bg, color: t.text, minHeight: "297mm", width: "210mm", padding: "15mm 16mm", boxSizing: "border-box", fontSize: "10pt", lineHeight: 1.6 }}>
      <div style={{ textAlign: "center", marginBottom: 14, borderBottom: `2px solid ${t.accent}`, paddingBottom: 12 }}>
        <div style={{ fontSize: "22pt", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", color: t.accent }}>{data.name}</div>
        <div style={{ fontSize: "10pt", color: t.secondary, marginTop: 2 }}>{data.title}</div>
        <div style={{ marginTop: 6, fontSize: "8.5pt", color: t.secondary, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {data.summary && (
        <ClassicSection title="OBJECTIVE">
          <p style={{ margin: 0, textAlign: "justify", color: t.secondary }}>{data.summary}</p>
        </ClassicSection>
      )}
      {data.experience?.length > 0 && (
        <ClassicSection title="WORK EXPERIENCE">
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{exp.role}, {exp.company}</span>
                <span style={{ fontStyle: "italic", color: t.secondary, fontSize: "9pt" }}>{exp.duration}</span>
              </div>
              <ul style={{ margin: "3px 0 0 16px", padding: 0 }}>
                {exp.points?.map((p, j) => <li key={j} style={{ color: t.secondary, marginBottom: 1 }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </ClassicSection>
      )}
      {data.education?.length > 0 && (
        <ClassicSection title="EDUCATION">
          {data.education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                <span style={{ color: t.secondary }}>, {edu.institution}</span>
              </div>
              <span style={{ fontStyle: "italic", color: t.secondary, fontSize: "9pt" }}>{edu.year} {edu.grade && `· ${edu.grade}`}</span>
            </div>
          ))}
        </ClassicSection>
      )}
      {data.skills?.length > 0 && (
        <ClassicSection title="TECHNICAL SKILLS">
          <div style={{ color: t.secondary }}>{data.skills.join(" • ")}</div>
        </ClassicSection>
      )}
      {data.projects?.length > 0 && (
        <ClassicSection title="PROJECTS">
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ color: t.accent }}> ({p.tech})</span>
              <span style={{ color: t.secondary }}> — {p.desc}</span>
            </div>
          ))}
        </ClassicSection>
      )}
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────────
function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: "8.5pt", fontWeight: 800, letterSpacing: "1.5px", color: accent, borderBottom: `1px solid ${accent}40`, paddingBottom: 2, marginBottom: 6, textTransform: "uppercase" }}>{title}</div>
      {children}
    </div>
  );
}
function SideSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "8pt", fontWeight: 800, letterSpacing: "1.5px", color: accent, marginBottom: 6, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 3 }}>{title}</div>
      {children}
    </div>
  );
}
function ClassicSection({ title, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: "10pt", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1.5px solid #1e3a5f", paddingBottom: 2, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [template, setTemplate] = useState("modern");
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState("contact");
  const [aiLoading, setAiLoading] = useState(false);
  const printRef = useRef();

  const t = TEMPLATES[template];

  const update = (field, value) => setData(d => ({ ...d, [field]: value }));
  const updateExp = (i, field, value) => setData(d => ({ ...d, experience: d.experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e) }));
  const updateExpPoint = (i, j, value) => setData(d => ({ ...d, experience: d.experience.map((e, idx) => idx === i ? { ...e, points: e.points.map((p, pIdx) => pIdx === j ? value : p) } : e) }));
  const updateEdu = (i, field, value) => setData(d => ({ ...d, education: d.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e) }));
  const updateProject = (i, field, value) => setData(d => ({ ...d, projects: d.projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p) }));

  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { company: "", role: "", duration: "", points: [""] }] }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { institution: "", degree: "", year: "", grade: "" }] }));
  const addProject = () => setData(d => ({ ...d, projects: [...d.projects, { name: "", tech: "", desc: "" }] }));

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${data.name} - Resume</title><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { width: 210mm; }
      @media print { body { margin: 0; } @page { size: A4; margin: 0; } }
    </style></head><body>${printContents}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  const aiSuggest = async (field) => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (field === "summary") {
      update("summary", `Results-driven ${data.title || "professional"} with proven expertise in ${data.skills?.slice(0, 3).join(", ") || "technology"}. Demonstrated ability to deliver high-quality solutions and collaborate effectively in fast-paced environments. Passionate about continuous learning and driving impactful outcomes.`);
    } else if (field === "skills") {
      const suggestions = ["Problem Solving", "Team Collaboration", "Agile/Scrum", "Code Review", "System Design"];
      const newSkills = [...new Set([...data.skills, ...suggestions])];
      update("skills", newSkills);
    }
    setAiLoading(false);
  };

  const inp = (style = {}) => ({ style: { width: "100%", padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "inherit", background: "#f8fafc", ...style } });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#0f172a", color: "#e2e8f0", overflow: "hidden" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: 360, background: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155", background: "#0f172a" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 2 }}>📄 Resume Builder</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Build · Preview · Download</div>
        </div>

        {/* Template Picker */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 10, textTransform: "uppercase" }}>Choose Template</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <div key={key} onClick={() => setTemplate(key)}
                style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: `2px solid ${template === key ? tmpl.accent : "#334155"}`, background: template === key ? `${tmpl.accent}20` : "#0f172a", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                <div style={{ width: 20, height: 26, background: tmpl.accent, borderRadius: 3, margin: "0 auto 5px", opacity: 0.8 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: template === key ? tmpl.accent : "#94a3b8" }}>{tmpl.name}</div>
                <div style={{ fontSize: 9, color: "#64748b", marginTop: 1 }}>{tmpl.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Tabs */}
        <div style={{ display: "flex", overflowX: "auto", padding: "8px 16px 0", gap: 4, borderBottom: "1px solid #334155" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveTab(s)}
              style={{ padding: "6px 12px", borderRadius: "6px 6px 0 0", border: "none", background: activeTab === s ? "#334155" : "transparent", color: activeTab === s ? "#f1f5f9" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

          {activeTab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["name","Full Name"],["title","Job Title"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn URL"],["github","GitHub URL"]].map(([f, label]) => (
                <div key={f}>
                  <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>
                  <input {...inp()} value={data[f] || ""} onChange={e => update(f, e.target.value)} placeholder={label} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "summary" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Professional Summary</label>
                <button onClick={() => aiSuggest("summary")} disabled={aiLoading}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#6366f1", color: "white", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  {aiLoading ? "..." : "✨ AI Write"}
                </button>
              </div>
              <textarea {...inp({ height: 120, resize: "vertical" })} value={data.summary || ""} onChange={e => update("summary", e.target.value)} placeholder="Write a professional summary..." />
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              {data.experience?.map((exp, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: 12, marginBottom: 12, border: "1px solid #334155" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>Experience {i + 1}</div>
                  {[["role","Job Title"],["company","Company"],["duration","Duration (e.g. 2022 - Present)"]].map(([f, label]) => (
                    <div key={f} style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 3 }}>{label}</label>
                      <input {...inp()} value={exp[f] || ""} onChange={e => updateExp(i, f, e.target.value)} placeholder={label} />
                    </div>
                  ))}
                  <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Key Points</label>
                  {exp.points?.map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                      <span style={{ color: "#6366f1", marginTop: 7 }}>•</span>
                      <input {...inp()} value={pt} onChange={e => updateExpPoint(i, j, e.target.value)} placeholder={`Achievement ${j + 1}`} />
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({ ...d, experience: d.experience.map((e, idx) => idx === i ? { ...e, points: [...e.points, ""] } : e) }))}
                    style={{ marginTop: 4, padding: "3px 10px", background: "#334155", border: "none", borderRadius: 5, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>+ Add Point</button>
                </div>
              ))}
              <button onClick={addExp} style={{ width: "100%", padding: "8px", background: "#334155", border: "1px dashed #475569", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>+ Add Experience</button>
            </div>
          )}

          {activeTab === "education" && (
            <div>
              {data.education?.map((edu, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: 12, marginBottom: 12, border: "1px solid #334155" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>Education {i + 1}</div>
                  {[["degree","Degree"],["institution","Institution"],["year","Year (e.g. 2016-2020)"],["grade","Grade/CGPA"]].map(([f, label]) => (
                    <div key={f} style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 3 }}>{label}</label>
                      <input {...inp()} value={edu[f] || ""} onChange={e => updateEdu(i, f, e.target.value)} placeholder={label} />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={addEdu} style={{ width: "100%", padding: "8px", background: "#334155", border: "1px dashed #475569", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>+ Add Education</button>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Skills (comma separated)</label>
                <button onClick={() => aiSuggest("skills")} disabled={aiLoading}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#6366f1", color: "white", fontSize: 11, cursor: "pointer" }}>
                  {aiLoading ? "..." : "✨ AI Suggest"}
                </button>
              </div>
              <textarea {...inp({ height: 80 })} value={data.skills?.join(", ") || ""} onChange={e => update("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, Python, ..." />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {data.skills?.map((s, i) => (
                  <span key={i} style={{ padding: "3px 10px", borderRadius: 20, background: `${t.accent}30`, color: t.accent, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                    {s}
                    <span onClick={() => update("skills", data.skills.filter((_, idx) => idx !== i))} style={{ cursor: "pointer", opacity: 0.7, fontSize: 14 }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              {data.projects?.map((p, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: 12, marginBottom: 12, border: "1px solid #334155" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>Project {i + 1}</div>
                  {[["name","Project Name"],["tech","Technologies Used"],["desc","Description"]].map(([f, label]) => (
                    <div key={f} style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 3 }}>{label}</label>
                      {f === "desc"
                        ? <textarea {...inp({ height: 60 })} value={p[f] || ""} onChange={e => updateProject(i, f, e.target.value)} placeholder={label} />
                        : <input {...inp()} value={p[f] || ""} onChange={e => updateProject(i, f, e.target.value)} placeholder={label} />}
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={addProject} style={{ width: "100%", padding: "8px", background: "#334155", border: "1px dashed #475569", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>+ Add Project</button>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div style={{ padding: 14, borderTop: "1px solid #334155", background: "#0f172a" }}>
          <button onClick={handlePrint}
            style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ⬇️ Download PDF
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL — Live Preview ── */}
      <div style={{ flex: 1, overflow: "auto", background: "#374151", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 16px", background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ marginLeft: 8, fontSize: 12, color: "#64748b" }}>Live Preview — {t.name} Template</span>
          <span style={{ marginLeft: "auto", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: `${t.accent}30`, color: t.accent, fontWeight: 600 }}>{t.desc}</span>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "24px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div ref={printRef} style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)", transform: "scale(0.85)", transformOrigin: "top center" }}>
            {template === "modern" && <ModernTemplate data={data} t={t} />}
            {template === "creative" && <CreativeTemplate data={data} t={t} />}
            {template === "classic" && <ClassicTemplate data={data} t={t} />}
          </div>
        </div>
      </div>
    </div>
  );
}