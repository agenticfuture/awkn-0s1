import { cookies } from "next/headers";
import { ChatSDKError } from "@/lib/errors";
import {
  getServiceGenApiBaseUrl,
  SERVICE_GEN_ROUTES,
} from "@/lib/servicegen-config";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

function toSsePayload(payload: Record<string, unknown>) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function emitTextDelta(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  textId: string,
  delta: string
) {
  if (!delta) {
    return;
  }
  controller.enqueue(
    encoder.encode(
      toSsePayload({
        type: "text-delta",
        id: textId,
        delta,
      })
    )
  );
}

function extractCompleteSseEvents(buffer: string): {
  events: string[];
  remaining: string;
} {
  const events: string[] = [];
  let start = 0;

  while (true) {
    const end = buffer.indexOf("\n\n", start);
    if (end === -1) {
      break;
    }
    events.push(buffer.slice(start, end));
    start = end + 2;
  }

  return { events, remaining: buffer.slice(start) };
}

export const maxDuration = 60;

type StreamContext = {
  resumableStream: (
    streamId: string,
    fallback: () => ReadableStream
  ) => Promise<ReadableStream | null>;
};

// Resume stream context is currently disabled in this deployment profile.
export function getStreamContext(): StreamContext | null {
  return null;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    requestBody = postRequestBodySchema.parse(await request.json());
  } catch {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const { message, messages } = requestBody;
  const cookieStore = await cookies();

  const serviceId =
    requestBody.service_id || cookieStore.get("sg_service_id")?.value || "";
  const tenantId =
    requestBody.tenant_id || cookieStore.get("sg_tenant_id")?.value || "";
  const orgId = requestBody.org_id || cookieStore.get("sg_org_id")?.value || "";

  const userText =
    message?.parts?.find((part) => part.type === "text")?.text ||
    messages
      ?.slice()
      .reverse()
      .flatMap((m) => m.parts || [])
      .map((part: any) =>
        part?.type === "text" ? String(part.text || "") : ""
      )
      .find((v) => v.trim().length > 0) ||
    "";

  if (!userText.trim()) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const upstream = await fetch(
    `${getServiceGenApiBaseUrl()}${SERVICE_GEN_ROUTES.LANGUAGE_MODEL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-id": serviceId,
        "x-tenant-id": tenantId,
        "x-org-id": orgId,
      },
      body: JSON.stringify({
        model: "service-gen-wrapper",
        stream: true,
        service_id: serviceId,
        tenant_id: tenantId,
        org_id: orgId,
        prompt: [
          {
            role: "user",
            content: [{ type: "text", text: userText }],
          },
        ],
      }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    return new ChatSDKError("offline:chat").toResponse();
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const messageId = crypto.randomUUID();
  const textId = `text-${messageId}`;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        encoder.encode(toSsePayload({ type: "start", messageId }))
      );
      controller.enqueue(encoder.encode(toSsePayload({ type: "start-step" })));
      controller.enqueue(
        encoder.encode(toSsePayload({ type: "text-start", id: textId }))
      );

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const { events, remaining } = extractCompleteSseEvents(buffer);
        buffer = remaining;

        for (const eventChunk of events) {
          const dataLines = eventChunk
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim());

          for (const dataLine of dataLines) {
            if (!dataLine || dataLine === "[DONE]") {
              continue;
            }
            let parsed: any;
            try {
              parsed = JSON.parse(dataLine);
            } catch {
              continue;
            }

            if (parsed?.type === "error") {
              throw new Error(
                String(
                  parsed?.message || "Upstream language-model stream error"
                )
              );
            }

            if (parsed?.type === "text-delta") {
              const directDelta =
                typeof parsed?.delta === "string" ? parsed.delta : "";
              if (directDelta) {
                emitTextDelta(controller, encoder, textId, directDelta);
              }
              continue;
            }

            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              emitTextDelta(controller, encoder, textId, delta);
            }
          }
        }
      }

      if (buffer.trim().length > 0) {
        const dataLines = buffer
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());
        for (const dataLine of dataLines) {
          if (!dataLine || dataLine === "[DONE]") {
            continue;
          }
          let parsed: any;
          try {
            parsed = JSON.parse(dataLine);
          } catch {
            continue;
          }

          if (parsed?.type === "error") {
            throw new Error(
              String(parsed?.message || "Upstream language-model stream error")
            );
          }

          if (
            parsed?.type === "text-delta" &&
            typeof parsed?.delta === "string" &&
            parsed.delta.length > 0
          ) {
            emitTextDelta(controller, encoder, textId, parsed.delta);
            continue;
          }

          const delta = parsed?.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length > 0) {
            emitTextDelta(controller, encoder, textId, delta);
          }
        }
      }

      controller.enqueue(encoder.encode(toSsePayload({ type: "finish-step" })));
      controller.enqueue(encoder.encode(toSsePayload({ type: "finish" })));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
    },
  });
}

export function DELETE() {
  return new Response(null, { status: 204 });
}
