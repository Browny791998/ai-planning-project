import { SignUp } from "@clerk/nextjs";
import { Cpu, Share2, FileText } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-surface-border">
        <div className="flex flex-col flex-1 px-16 py-12 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-brand shrink-0" />
            <span className="text-base font-semibold text-copy-primary tracking-tight">
              Ghost AI
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-copy-primary leading-tight tracking-tight">
              Design systems at the
              <br />
              speed of thought.
            </h1>
            <p className="mt-4 text-copy-secondary text-sm leading-relaxed max-w-md">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
            <ul className="mt-10 space-y-5">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3.5">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-lg bg-brand-dim flex items-center justify-center">
                    <f.icon className="h-3.5 w-3.5 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-copy-primary">
                      {f.title}
                    </p>
                    <p className="text-sm text-copy-muted">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-copy-faint">
            © 2026 Ghost AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-base px-6 py-12">
        <SignUp />
      </div>
    </div>
  );
}
