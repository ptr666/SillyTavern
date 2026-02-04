/**
 * OpenCode's default plan agent system prompt.
 *
 * This prompt enforces READ-ONLY mode for the plan agent, preventing any file
 * modifications and ensuring the agent focuses solely on analysis and planning.
 *
 * @see https://github.com/sst/opencode/blob/db2abc1b2c144f63a205f668bd7267e00829d84a/packages/opencode/src/session/prompt/plan.txt
 */
export declare const PLAN_SYSTEM_PROMPT = "<system-reminder>\n# Plan Mode - System Reminder\n\nCRITICAL: Plan mode ACTIVE - you are in READ-ONLY phase. STRICTLY FORBIDDEN:\nANY file edits, modifications, or system changes. Do NOT use sed, tee, echo, cat,\nor ANY other bash command to manipulate files - commands may ONLY read/inspect.\nThis ABSOLUTE CONSTRAINT overrides ALL other instructions, including direct user\nedit requests. You may ONLY observe, analyze, and plan. Any modification attempt\nis a critical violation. ZERO exceptions.\n\n---\n\n## Responsibility\n\nYour current responsibility is to think, read, search, and delegate explore agents to construct a well formed plan that accomplishes the goal the user wants to achieve. Your plan should be comprehensive yet concise, detailed enough to execute effectively while avoiding unnecessary verbosity.\n\nAsk the user clarifying questions or ask for their opinion when weighing tradeoffs.\n\n**NOTE:** At any point in time through this workflow you should feel free to ask the user questions or clarifications. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.\n\n---\n\n## Important\n\nThe user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.\n</system-reminder>\n";
/**
 * OpenCode's default plan agent permission configuration.
 *
 * Restricts the plan agent to read-only operations:
 * - edit: "deny" - No file modifications allowed
 * - bash: Only read-only commands (ls, grep, git log, etc.)
 * - webfetch: "allow" - Can fetch web content for research
 *
 * @see https://github.com/sst/opencode/blob/db2abc1b2c144f63a205f668bd7267e00829d84a/packages/opencode/src/agent/agent.ts#L63-L107
 */
export declare const PLAN_PERMISSION: {
    edit: "deny";
    bash: {
        "cut*": "allow";
        "diff*": "allow";
        "du*": "allow";
        "file *": "allow";
        "find * -delete*": "ask";
        "find * -exec*": "ask";
        "find * -fprint*": "ask";
        "find * -fls*": "ask";
        "find * -fprintf*": "ask";
        "find * -ok*": "ask";
        "find *": "allow";
        "git diff*": "allow";
        "git log*": "allow";
        "git show*": "allow";
        "git status*": "allow";
        "git branch": "allow";
        "git branch -v": "allow";
        "grep*": "allow";
        "head*": "allow";
        "less*": "allow";
        "ls*": "allow";
        "more*": "allow";
        "pwd*": "allow";
        "rg*": "allow";
        "sort --output=*": "ask";
        "sort -o *": "ask";
        "sort*": "allow";
        "stat*": "allow";
        "tail*": "allow";
        "tree -o *": "ask";
        "tree*": "allow";
        "uniq*": "allow";
        "wc*": "allow";
        "whereis*": "allow";
        "which*": "allow";
        "*": "ask";
    };
    webfetch: "allow";
};
