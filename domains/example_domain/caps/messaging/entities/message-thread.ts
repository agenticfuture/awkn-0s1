import type { MessageThread } from "../common/types";

export function buildMessageThread(ownerId: string, title: string): MessageThread {
  return {
    id: `thread_${ownerId}_${Date.now()}`,
    ownerId,
    title,
    createdAt: new Date().toISOString(),
  };
}
