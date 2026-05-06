import React from "react";
import { cookies } from "next/headers";
import WorkflowListingClient from "./WorkflowListingClient";

async function getWorkflowDefs(cookieHeader) {
  const endpoint = `http://127.0.0.1:8000/api/workflow/get-workflow-defs`;
  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        'Cookie': cookieHeader || '',
      },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching workflows on server:", error);
    return [];
  }
}

const WorkflowList = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const initialWorkflowList = await getWorkflowDefs(cookieHeader);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-white/20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <WorkflowListingClient initialWorkflowList={initialWorkflowList} />
    </div>
  );
};

export default WorkflowList;
