import type { AgentConfig } from "@opencode-ai/sdk";
import type { AvailableAgent, AvailableSkill } from "./sisyphus-prompt-builder";
export declare function createSisyphusAgent(model?: string, availableAgents?: AvailableAgent[], availableToolNames?: string[], availableSkills?: AvailableSkill[]): AgentConfig;
export declare const sisyphusAgent: AgentConfig;
