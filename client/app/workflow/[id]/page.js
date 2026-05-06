import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WorkflowBuilderClient from "./WorkflowBuilderClient";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

async function fetchWorkflowData(id, token) {
  try {
    const [workflowRes, schemasRes] = await Promise.all([
      fetch(`${API_URL}/api/workflow/get-workflow-def/${id}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/workflow/${id}/node-schemas`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const initialWorkflowData = workflowRes.ok ? await workflowRes.json() : null;
    const initialNodeSchemas = schemasRes.ok ? await schemasRes.json() : null;

    return { initialWorkflowData, initialNodeSchemas };
  } catch {
    return { initialWorkflowData: null, initialNodeSchemas: null };
  }
}

export default async function WorkflowPage({ params }) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  const { initialWorkflowData, initialNodeSchemas } = await fetchWorkflowData(id, token);

  return (
    <div className="h-dvh w-full bg-black">
      <WorkflowBuilderClient
        initialWorkflowData={initialWorkflowData}
        initialNodeSchemas={initialNodeSchemas}
      />
    </div>
  );
}
