import { config as loadEnv } from "dotenv";
import { getServerEnv } from "../lib/env";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.secrets" });

getServerEnv();

console.log("Chatbot env validation passed.");
