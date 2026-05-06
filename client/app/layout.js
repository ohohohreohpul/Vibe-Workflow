import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "0123 — Node-Based AI Workflow Builder",
  description:
    "0123 is a free, open-source, self-hostable node-based AI workflow builder. Design, automate, and scale generative image and video pipelines with a clean visual editor — no subscription required.",
  keywords: [
    "ai workflow builder",
    "node based ai editor",
    "generative ai pipeline",
    "visual ai workflow",
    "self hosted ai",
    "ai image generation workflow",
    "ai video generation pipeline",
    "no code ai workflow",
    "open source generative ai",
    "ai workflow automation",
    "0123",
  ],
  openGraph: {
    title: "0123 — Node-Based AI Workflow Builder",
    description:
      "Free, self-hostable, node-based AI workflow builder. Design and automate generative image and video pipelines.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "0123 — Node-Based AI Workflow Builder",
    description:
      "Free, self-hostable, node-based AI workflow builder. Design and automate generative image and video pipelines.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
