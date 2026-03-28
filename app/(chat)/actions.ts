"use server";

import type { UIMessage } from "ai";
import { cookies } from "next/headers";
import type { VisibilityType } from "@/components/visibility-selector";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisibilityById,
} from "@/lib/db/queries";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const textPart = message.parts?.find((part) => part.type === "text");
  const candidateTitle =
    textPart && "text" in textPart ? textPart.text.trim() : "";

  await Promise.resolve();

  return candidateTitle.length > 0 ? candidateTitle.slice(0, 80) : "welcome";
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisibilityById({ chatId, visibility });
}
