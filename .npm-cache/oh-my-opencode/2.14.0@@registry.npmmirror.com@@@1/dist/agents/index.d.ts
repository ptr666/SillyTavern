import type { AgentConfig } from "@opencode-ai/sdk";
export declare const builtinAgents: Record<string, AgentConfig>;
export * from "./types";
export { createBuiltinAgents } from "./utils";
export type { AvailableAgent } from "./sisyphus-prompt-builder";
