import type { MessageThread } from "../../common/types";

export class MessageThreadRepository {
  async save(thread: MessageThread) {
    return {
      storage: "db-placeholder",
      thread,
    };
  }
}

export const messageThreadRepository = new MessageThreadRepository();
