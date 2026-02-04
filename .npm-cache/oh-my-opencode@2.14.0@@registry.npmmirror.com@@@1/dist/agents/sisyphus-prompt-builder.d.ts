import type { AgentPromptMetadata, BuiltinAgentName } from "./types";
export interface AvailableAgent {
    name: BuiltinAgentName;
    description: string;
    metadata: AgentPromptMetadata;
}
export interface AvailableTool {
    name: string;
    category: "lsp" | "ast" | "search" | "session" | "command" | "other";
}
export interface AvailableSkill {
    name: string;
    description: string;
    location: "user" | "project" | "plugin";
}
export declare function categorizeTools(toolNames: string[]): AvailableTool[];
export declare function buildKeyTriggersSection(agents: AvailableAgent[], skills?: AvailableSkill[]): string;
export declare function buildToolSelectionTable(agents: AvailableAgent[], tools?: AvailableTool[], skills?: AvailableSkill[]): string;
export declare function buildExploreSection(agents: AvailableAgent[]): string;
export declare function buildLibrarianSection(agents: AvailableAgent[]): string;
export declare function buildDelegationTable(agents: AvailableAgent[]): string;
export declare function buildFrontendSection(agents: AvailableAgent[]): string;
export declare function buildOracleSection(agents: AvailableAgent[]): string;
export declare function buildHardBlocksSection(agents: AvailableAgent[]): string;
export declare function buildAntiPatternsSection(agents: AvailableAgent[]): string;
export declare function buildUltraworkAgentSection(agents: AvailableAgent[]): string;
