import { buildMessageThread } from "../entities/message-thread";
import { formatThreadTitle } from "../utils/format-thread-title";

export function createMessageThread(ownerId: string, baseLabel: string) {
  return buildMessageThread(ownerId, formatThreadTitle(baseLabel));
}
