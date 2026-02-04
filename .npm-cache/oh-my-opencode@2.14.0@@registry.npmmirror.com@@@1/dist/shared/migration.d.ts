export declare const AGENT_NAME_MAP: Record<string, string>;
export declare const HOOK_NAME_MAP: Record<string, string>;
export declare function migrateAgentNames(agents: Record<string, unknown>): {
    migrated: Record<string, unknown>;
    changed: boolean;
};
export declare function migrateHookNames(hooks: string[]): {
    migrated: string[];
    changed: boolean;
};
export declare function migrateConfigFile(configPath: string, rawConfig: Record<string, unknown>): boolean;
