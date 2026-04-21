import { messagingApi } from "./caps/messaging/api";

export const projectNameDomainApi = {
  messaging: messagingApi,
};

export type ProjectNameDomainApi = typeof projectNameDomainApi;
