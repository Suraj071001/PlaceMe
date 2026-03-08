import { NextRequest } from "next/server";

const backendApiBase =
  process.env.NEXT_PUBLIC_API_V1_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:5501/api/v1";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authorization = request.headers.get("authorization");
  const body = await request.text();

  try {
    const backendResponse = await fetch(
      `${backendApiBase}/admin-applications/${id}/stage`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body,
      },
    );

    const responseText = await backendResponse.text();
    return new Response(responseText, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        success: false,
        message:
          "Unable to connect to backend API for stage update. Ensure server is running on port 5501.",
      },
      { status: 502 },
    );
  }
}
