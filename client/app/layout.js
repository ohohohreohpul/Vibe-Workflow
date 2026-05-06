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
    "0123 is a node-based AI workflow builder for generative image and video. Design, automate, and scale creative pipelines visually.",
  keywords: [
    "ai workflow builder",
    "node based ai editor",
    "generative ai pipeline",
    "visual ai workflow",
    "ai image generation workflow",
    "ai video generation pipeline",
    "no code ai workflow",
    "ai workflow automation",
    "0123",
  ],
  openGraph: {
    title: "0123 — Node-Based AI Workflow Builder",
    description:
      "Node-based AI workflow builder for generative image and video. Design and automate creative pipelines with 0123.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "0123 — Node-Based AI Workflow Builder",
    description:
      "Node-based AI workflow builder for generative image and video. Design and automate creative pipelines with 0123.",
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
