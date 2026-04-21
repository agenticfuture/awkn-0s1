import { messagingCapProcessor } from "./caps/messaging/cap_processor";

export class ProjectNameDomainProcessor {
  async bootstrap() {
    const seededThread = await messagingCapProcessor.createWelcomeThread("demo-user");

    return {
      domain: "project_name",
      seededThread,
    };
  }
}

export const projectNameDomainProcessor = new ProjectNameDomainProcessor();
