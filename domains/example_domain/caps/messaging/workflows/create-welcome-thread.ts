import { messageThreadRepository } from "../adapters/db/message-thread.repository";
import { createMessageThread } from "../functions/create-message-thread";

export async function createWelcomeThread(ownerId: string) {
  const thread = createMessageThread(ownerId, "Welcome");

  return messageThreadRepository.save(thread);
}
