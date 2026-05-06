import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WorkflowListingClient from "./WorkflowListingClient";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

async function getWorkflowDefs(token) {
  try {
    const res = await fetch(`${API_URL}/api/workflow/get-workflow-defs`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const WorkflowList = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  const initialWorkflowList = await getWorkflowDefs(token);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-white/20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <WorkflowListingClient initialWorkflowList={initialWorkflowList} />
    </div>
  );
};

export default WorkflowList;
