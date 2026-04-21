import { createWelcomeThread } from "./workflows/create-welcome-thread";

export class MessagingCapProcessor {
  async createWelcomeThread(ownerId: string) {
    return createWelcomeThread(ownerId);
  }
}

export const messagingCapProcessor = new MessagingCapProcessor();
