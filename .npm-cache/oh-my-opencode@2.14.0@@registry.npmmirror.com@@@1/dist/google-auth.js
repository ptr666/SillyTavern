// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __require = import.meta.require;
// src/auth/antigravity/constants.ts
var ANTIGRAVITY_CLIENT_ID = "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com";
var ANTIGRAVITY_CLIENT_SECRET = "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";
var ANTIGRAVITY_CALLBACK_PORT = 51121;
var ANTIGRAVITY_REDIRECT_URI = `http://localhost:${ANTIGRAVITY_CALLBACK_PORT}/oauth-callback`;
var ANTIGRAVITY_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/cclog",
  "https://www.googleapis.com/auth/experimentsandconfigs"
];
var ANTIGRAVITY_ENDPOINT_FALLBACKS = [
  "https://daily-cloudcode-pa.sandbox.googleapis.com",
  "https://autopush-cloudcode-pa.sandbox.googleapis.com",
  "https://cloudcode-pa.googleapis.com"
];
var ANTIGRAVITY_API_VERSION = "v1internal";
var ANTIGRAVITY_HEADERS = {
  "User-Agent": "google-api-nodejs-client/9.15.1",
  "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
  "Client-Metadata": JSON.stringify({
    ideType: "IDE_UNSPECIFIED",
    platform: "PLATFORM_UNSPECIFIED",
    pluginType: "GEMINI"
  })
};
var ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc";
var GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
var GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
var ANTIGRAVITY_TOKEN_REFRESH_BUFFER_MS = 60000;
var SKIP_THOUGHT_SIGNATURE_VALIDATOR = "skip_thought_signature_validator";
// node_modules/@openauthjs/openauth/node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder;
var decoder = new TextDecoder;
var MAX_INT32 = 2 ** 32;

// node_modules/@openauthjs/openauth/node_modules/jose/dist/browser/runtime/base64url.js
var encodeBase64 = (input) => {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  const CHUNK_SIZE = 32768;
  const arr = [];
  for (let i = 0;i < unencoded.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(""));
};
var encode = (input) => {
  return encodeBase64(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};
var decodeBase64 = (encoded) => {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0;i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};
var decode = (input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};

// node_modules/@openauthjs/openauth/node_modules/jose/dist/browser/util/base64url.js
var exports_base64url = {};
__export(exports_base64url, {
  encode: () => encode2,
  decode: () => decode2
});
var encode2 = encode;
var decode2 = decode;
// node_modules/@openauthjs/openauth/dist/esm/pkce.js
function generateVerifier(length) {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return exports_base64url.encode(buffer);
}
async function generateChallenge(verifier, method) {
  if (method === "plain")
    return verifier;
  const encoder2 = new TextEncoder;
  const data = encoder2.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return exports_base64url.encode(new Uint8Array(hash));
}
async function generatePKCE(length = 64) {
  if (length < 43 || length > 128) {
    throw new Error("Code verifier length must be between 43 and 128 characters");
  }
  const verifier = generateVerifier(length);
  const challenge = await generateChallenge(verifier, "S256");
  return {
    verifier,
    challenge,
    method: "S256"
  };
}

// src/auth/antigravity/oauth.ts
async function generatePKCEPair() {
  const pkce = await generatePKCE();
  return {
    verifier: pkce.verifier,
    challenge: pkce.challenge,
    method: pkce.method
  };
}
function encodeState(state) {
  const json = JSON.stringify(state);
  return Buffer.from(json, "utf8").toString("base64url");
}
function decodeState(encoded) {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
  const json = Buffer.from(padded, "base64").toString("utf8");
  const parsed = JSON.parse(json);
  if (typeof parsed.verifier !== "string") {
    throw new Error("Missing PKCE verifier in state");
  }
  return {
    verifier: parsed.verifier,
    projectId: typeof parsed.projectId === "string" ? parsed.projectId : undefined
  };
}
async function buildAuthURL(projectId, clientId = ANTIGRAVITY_CLIENT_ID, port = ANTIGRAVITY_CALLBACK_PORT) {
  const pkce = await generatePKCEPair();
  const state = {
    verifier: pkce.verifier,
    projectId
  };
  const redirectUri = `http://localhost:${port}/oauth-callback`;
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", ANTIGRAVITY_SCOPES.join(" "));
  url.searchParams.set("state", encodeState(state));
  url.searchParams.set("code_challenge", pkce.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return {
    url: url.toString(),
    verifier: pkce.verifier
  };
}
async function exchangeCode(code, verifier, clientId = ANTIGRAVITY_CLIENT_ID, clientSecret = ANTIGRAVITY_CLIENT_SECRET, port = ANTIGRAVITY_CALLBACK_PORT) {
  const redirectUri = `http://localhost:${port}/oauth-callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code_verifier: verifier
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type
  };
}
async function fetchUserInfo(accessToken) {
  const response = await fetch(`${GOOGLE_USERINFO_URL}?alt=json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }
  const data = await response.json();
  return {
    email: data.email || "",
    name: data.name,
    picture: data.picture
  };
}
function startCallbackServer(timeoutMs = 5 * 60 * 1000) {
  let server = null;
  let timeoutId = null;
  let resolveCallback = null;
  let rejectCallback = null;
  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (server) {
      server.stop();
      server = null;
    }
  };
  server = Bun.serve({
    port: 0,
    fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/oauth-callback") {
        const code = url.searchParams.get("code") || "";
        const state = url.searchParams.get("state") || "";
        const error = url.searchParams.get("error") || undefined;
        let responseBody;
        if (code && !error) {
          responseBody = "<html><body><h1>Login successful</h1><p>You can close this window.</p></body></html>";
        } else {
          responseBody = "<html><body><h1>Login failed</h1><p>Please check the CLI output.</p></body></html>";
        }
        setTimeout(() => {
          cleanup();
          if (resolveCallback) {
            resolveCallback({ code, state, error });
          }
        }, 100);
        return new Response(responseBody, {
          status: 200,
          headers: { "Content-Type": "text/html" }
        });
      }
      return new Response("Not Found", { status: 404 });
    }
  });
  const actualPort = server.port;
  const waitForCallback = () => {
    return new Promise((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("OAuth callback timeout"));
      }, timeoutMs);
    });
  };
  return {
    port: actualPort,
    waitForCallback,
    close: cleanup
  };
}
// src/auth/antigravity/token.ts
class AntigravityTokenRefreshError extends Error {
  code;
  description;
  status;
  statusText;
  responseBody;
  constructor(options) {
    super(options.message);
    this.name = "AntigravityTokenRefreshError";
    this.code = options.code;
    this.description = options.description;
    this.status = options.status;
    this.statusText = options.statusText;
    this.responseBody = options.responseBody;
  }
  get isInvalidGrant() {
    return this.code === "invalid_grant";
  }
  get isNetworkError() {
    return this.status === 0;
  }
}
function parseOAuthErrorPayload(text) {
  if (!text) {
    return {};
  }
  try {
    const payload = JSON.parse(text);
    let code;
    if (typeof payload.error === "string") {
      code = payload.error;
    } else if (payload.error && typeof payload.error === "object") {
      code = payload.error.status ?? payload.error.code;
    }
    return {
      code,
      description: payload.error_description
    };
  } catch {
    return { description: text };
  }
}
function isTokenExpired(tokens) {
  const expirationTime = tokens.timestamp + tokens.expires_in * 1000;
  return Date.now() >= expirationTime - ANTIGRAVITY_TOKEN_REFRESH_BUFFER_MS;
}
var MAX_REFRESH_RETRIES = 3;
var INITIAL_RETRY_DELAY_MS = 1000;
function calculateRetryDelay(attempt) {
  return Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt), 1e4);
}
function isRetryableError(status) {
  if (status === 0)
    return true;
  if (status === 429)
    return true;
  if (status >= 500 && status < 600)
    return true;
  return false;
}
async function refreshAccessToken(refreshToken, clientId = ANTIGRAVITY_CLIENT_ID, clientSecret = ANTIGRAVITY_CLIENT_SECRET) {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });
  let lastError;
  for (let attempt = 0;attempt <= MAX_REFRESH_RETRIES; attempt++) {
    try {
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      if (response.ok) {
        const data = await response.json();
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token || refreshToken,
          expires_in: data.expires_in,
          token_type: data.token_type
        };
      }
      const responseBody = await response.text().catch(() => {
        return;
      });
      const parsed = parseOAuthErrorPayload(responseBody);
      lastError = new AntigravityTokenRefreshError({
        message: parsed.description || `Token refresh failed: ${response.status} ${response.statusText}`,
        code: parsed.code,
        description: parsed.description,
        status: response.status,
        statusText: response.statusText,
        responseBody
      });
      if (parsed.code === "invalid_grant") {
        throw lastError;
      }
      if (!isRetryableError(response.status)) {
        throw lastError;
      }
      if (attempt < MAX_REFRESH_RETRIES) {
        const delay = calculateRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (error instanceof AntigravityTokenRefreshError) {
        throw error;
      }
      lastError = new AntigravityTokenRefreshError({
        message: error instanceof Error ? error.message : "Network error during token refresh",
        status: 0,
        statusText: "Network Error"
      });
      if (attempt < MAX_REFRESH_RETRIES) {
        const delay = calculateRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new AntigravityTokenRefreshError({
    message: "Token refresh failed after all retries",
    status: 0,
    statusText: "Max Retries Exceeded"
  });
}
function parseStoredToken(stored) {
  const parts = stored.split("|");
  const [refreshToken, projectId, managedProjectId] = parts;
  return {
    refreshToken: refreshToken || "",
    projectId: projectId || undefined,
    managedProjectId: managedProjectId || undefined
  };
}
function formatTokenForStorage(refreshToken, projectId, managedProjectId) {
  return `${refreshToken}|${projectId}|${managedProjectId || ""}`;
}
// src/auth/antigravity/project.ts
var projectContextCache = new Map;
function debugLog(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-project] ${message}`);
  }
}
var CODE_ASSIST_METADATA = {
  ideType: "IDE_UNSPECIFIED",
  platform: "PLATFORM_UNSPECIFIED",
  pluginType: "GEMINI"
};
function extractProjectId(project) {
  if (!project)
    return;
  if (typeof project === "string") {
    const trimmed = project.trim();
    return trimmed || undefined;
  }
  if (typeof project === "object" && "id" in project) {
    const id = project.id;
    if (typeof id === "string") {
      const trimmed = id.trim();
      return trimmed || undefined;
    }
  }
  return;
}
function getDefaultTierId(allowedTiers) {
  if (!allowedTiers || allowedTiers.length === 0)
    return;
  for (const tier of allowedTiers) {
    if (tier?.isDefault)
      return tier.id;
  }
  return allowedTiers[0]?.id;
}
function isFreeTier(tierId) {
  if (!tierId)
    return true;
  const lower = tierId.toLowerCase();
  return lower === "free" || lower === "free-tier" || lower.startsWith("free");
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function callLoadCodeAssistAPI(accessToken, projectId) {
  const metadata = { ...CODE_ASSIST_METADATA };
  if (projectId)
    metadata.duetProject = projectId;
  const requestBody = { metadata };
  if (projectId)
    requestBody.cloudaicompanionProject = projectId;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
  for (const baseEndpoint of ANTIGRAVITY_ENDPOINT_FALLBACKS) {
    const url = `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:loadCodeAssist`;
    debugLog(`[loadCodeAssist] Trying: ${url}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        debugLog(`[loadCodeAssist] Failed: ${response.status} ${response.statusText}`);
        continue;
      }
      const data = await response.json();
      debugLog(`[loadCodeAssist] Success: ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      debugLog(`[loadCodeAssist] Error: ${err}`);
      continue;
    }
  }
  debugLog(`[loadCodeAssist] All endpoints failed`);
  return null;
}
async function onboardManagedProject(accessToken, tierId, projectId, attempts = 10, delayMs = 5000) {
  debugLog(`[onboardUser] Starting with tierId=${tierId}, projectId=${projectId || "none"}`);
  const metadata = { ...CODE_ASSIST_METADATA };
  if (projectId)
    metadata.duetProject = projectId;
  const requestBody = { tierId, metadata };
  if (!isFreeTier(tierId)) {
    if (!projectId) {
      debugLog(`[onboardUser] Non-FREE tier requires projectId, returning undefined`);
      return;
    }
    requestBody.cloudaicompanionProject = projectId;
  }
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
  debugLog(`[onboardUser] Request body: ${JSON.stringify(requestBody)}`);
  for (let attempt = 0;attempt < attempts; attempt++) {
    debugLog(`[onboardUser] Attempt ${attempt + 1}/${attempts}`);
    for (const baseEndpoint of ANTIGRAVITY_ENDPOINT_FALLBACKS) {
      const url = `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:onboardUser`;
      debugLog(`[onboardUser] Trying: ${url}`);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          debugLog(`[onboardUser] Failed: ${response.status} ${response.statusText} - ${errorText}`);
          continue;
        }
        const payload = await response.json();
        debugLog(`[onboardUser] Response: ${JSON.stringify(payload)}`);
        const managedProjectId = payload.response?.cloudaicompanionProject?.id;
        if (payload.done && managedProjectId) {
          debugLog(`[onboardUser] Success! Got managed project ID: ${managedProjectId}`);
          return managedProjectId;
        }
        if (payload.done && projectId) {
          debugLog(`[onboardUser] Done but no managed ID, using original: ${projectId}`);
          return projectId;
        }
        debugLog(`[onboardUser] Not done yet, payload.done=${payload.done}`);
      } catch (err) {
        debugLog(`[onboardUser] Error: ${err}`);
        continue;
      }
    }
    if (attempt < attempts - 1) {
      debugLog(`[onboardUser] Waiting ${delayMs}ms before next attempt...`);
      await wait(delayMs);
    }
  }
  debugLog(`[onboardUser] All attempts exhausted, returning undefined`);
  return;
}
async function fetchProjectContext(accessToken) {
  debugLog(`[fetchProjectContext] Starting...`);
  const cached = projectContextCache.get(accessToken);
  if (cached) {
    debugLog(`[fetchProjectContext] Returning cached result: ${JSON.stringify(cached)}`);
    return cached;
  }
  const loadPayload = await callLoadCodeAssistAPI(accessToken);
  if (loadPayload?.cloudaicompanionProject) {
    const projectId = extractProjectId(loadPayload.cloudaicompanionProject);
    debugLog(`[fetchProjectContext] loadCodeAssist returned project: ${projectId}`);
    if (projectId) {
      const result = { cloudaicompanionProject: projectId };
      projectContextCache.set(accessToken, result);
      debugLog(`[fetchProjectContext] Using loadCodeAssist project ID: ${projectId}`);
      return result;
    }
  }
  if (!loadPayload) {
    debugLog(`[fetchProjectContext] loadCodeAssist returned null, trying with fallback project ID`);
    const fallbackPayload = await callLoadCodeAssistAPI(accessToken, ANTIGRAVITY_DEFAULT_PROJECT_ID);
    const fallbackProjectId = extractProjectId(fallbackPayload?.cloudaicompanionProject);
    if (fallbackProjectId) {
      const result = { cloudaicompanionProject: fallbackProjectId };
      projectContextCache.set(accessToken, result);
      debugLog(`[fetchProjectContext] Using fallback project ID: ${fallbackProjectId}`);
      return result;
    }
    debugLog(`[fetchProjectContext] Fallback also failed, using default: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  const currentTierId = loadPayload.currentTier?.id;
  debugLog(`[fetchProjectContext] currentTier: ${currentTierId}, allowedTiers: ${JSON.stringify(loadPayload.allowedTiers)}`);
  if (currentTierId && !isFreeTier(currentTierId)) {
    debugLog(`[fetchProjectContext] PAID tier detected (${currentTierId}), using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  const defaultTierId = getDefaultTierId(loadPayload.allowedTiers);
  const tierId = defaultTierId ?? "free-tier";
  debugLog(`[fetchProjectContext] Resolved tierId: ${tierId}`);
  if (!isFreeTier(tierId)) {
    debugLog(`[fetchProjectContext] Non-FREE tier (${tierId}) without project, using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  debugLog(`[fetchProjectContext] FREE tier detected (${tierId}), calling onboardUser...`);
  const managedProjectId = await onboardManagedProject(accessToken, tierId);
  if (managedProjectId) {
    const result = {
      cloudaicompanionProject: managedProjectId,
      managedProjectId
    };
    projectContextCache.set(accessToken, result);
    debugLog(`[fetchProjectContext] Got managed project ID: ${managedProjectId}`);
    return result;
  }
  debugLog(`[fetchProjectContext] Failed to get managed project ID, using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
  return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
}
function clearProjectContextCache(accessToken) {
  if (accessToken) {
    projectContextCache.delete(accessToken);
  } else {
    projectContextCache.clear();
  }
}
function invalidateProjectContextByRefreshToken(_refreshToken) {
  projectContextCache.clear();
  debugLog(`[invalidateProjectContextByRefreshToken] Cleared all project context cache due to refresh token invalidation`);
}
// src/auth/antigravity/request.ts
function buildRequestHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
}
function extractModelFromBody(body) {
  const model = body.model;
  if (typeof model === "string" && model.trim()) {
    return model.trim();
  }
  return;
}
function extractModelFromUrl(url) {
  const match = url.match(/\/models\/([^:]+):/);
  if (match && match[1]) {
    return match[1];
  }
  return;
}
function extractActionFromUrl(url) {
  const match = url.match(/\/models\/[^:]+:(\w+)/);
  if (match && match[1]) {
    return match[1];
  }
  return;
}
function buildAntigravityUrl(baseEndpoint, action, streaming) {
  const query = streaming ? "?alt=sse" : "";
  return `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:${action}${query}`;
}
function getDefaultEndpoint() {
  return ANTIGRAVITY_ENDPOINT_FALLBACKS[0];
}
function generateRequestId() {
  return `agent-${crypto.randomUUID()}`;
}
function wrapRequestBody(body, projectId, modelName, sessionId) {
  const requestPayload = { ...body };
  delete requestPayload.model;
  return {
    project: projectId,
    model: modelName,
    userAgent: "antigravity",
    requestId: generateRequestId(),
    request: {
      ...requestPayload,
      sessionId
    }
  };
}
function debugLog2(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-request] ${message}`);
  }
}
function injectThoughtSignatureIntoFunctionCalls(body, signature) {
  const effectiveSignature = signature || SKIP_THOUGHT_SIGNATURE_VALIDATOR;
  debugLog2(`[TSIG][INJECT] signature=${effectiveSignature.substring(0, 30)}... (${signature ? "provided" : "default"})`);
  debugLog2(`[TSIG][INJECT] body keys: ${Object.keys(body).join(", ")}`);
  const contents = body.contents;
  if (!contents || !Array.isArray(contents)) {
    debugLog2(`[TSIG][INJECT] No contents array! Has messages: ${!!body.messages}`);
    return body;
  }
  debugLog2(`[TSIG][INJECT] Found ${contents.length} content blocks`);
  let injectedCount = 0;
  const modifiedContents = contents.map((content) => {
    if (!content.parts || !Array.isArray(content.parts)) {
      return content;
    }
    const modifiedParts = content.parts.map((part) => {
      if (part.functionCall && !part.thoughtSignature) {
        injectedCount++;
        return {
          ...part,
          thoughtSignature: effectiveSignature
        };
      }
      return part;
    });
    return { ...content, parts: modifiedParts };
  });
  debugLog2(`[TSIG][INJECT] injected signature into ${injectedCount} functionCall(s)`);
  return { ...body, contents: modifiedContents };
}
function isStreamingRequest(url, body) {
  const action = extractActionFromUrl(url);
  if (action === "streamGenerateContent") {
    return true;
  }
  if (body.stream === true) {
    return true;
  }
  return false;
}
function transformRequest(options) {
  const {
    url,
    body,
    accessToken,
    projectId,
    sessionId,
    modelName,
    endpointOverride,
    thoughtSignature
  } = options;
  const effectiveModel = modelName || extractModelFromBody(body) || extractModelFromUrl(url) || "gemini-3-pro-high";
  const streaming = isStreamingRequest(url, body);
  const action = streaming ? "streamGenerateContent" : "generateContent";
  const endpoint = endpointOverride || getDefaultEndpoint();
  const transformedUrl = buildAntigravityUrl(endpoint, action, streaming);
  const headers = buildRequestHeaders(accessToken);
  if (streaming) {
    headers["Accept"] = "text/event-stream";
  }
  const bodyWithSignature = injectThoughtSignatureIntoFunctionCalls(body, thoughtSignature);
  const wrappedBody = wrapRequestBody(bodyWithSignature, projectId, effectiveModel, sessionId);
  return {
    url: transformedUrl,
    headers,
    body: wrappedBody,
    streaming
  };
}
// src/auth/antigravity/response.ts
function extractUsageFromHeaders(headers) {
  const cached = headers.get("x-antigravity-cached-content-token-count");
  const total = headers.get("x-antigravity-total-token-count");
  const prompt = headers.get("x-antigravity-prompt-token-count");
  const candidates = headers.get("x-antigravity-candidates-token-count");
  if (!cached && !total && !prompt && !candidates) {
    return;
  }
  const usage = {};
  if (cached) {
    const parsed = parseInt(cached, 10);
    if (!isNaN(parsed)) {
      usage.cachedContentTokenCount = parsed;
    }
  }
  if (total) {
    const parsed = parseInt(total, 10);
    if (!isNaN(parsed)) {
      usage.totalTokenCount = parsed;
    }
  }
  if (prompt) {
    const parsed = parseInt(prompt, 10);
    if (!isNaN(parsed)) {
      usage.promptTokenCount = parsed;
    }
  }
  if (candidates) {
    const parsed = parseInt(candidates, 10);
    if (!isNaN(parsed)) {
      usage.candidatesTokenCount = parsed;
    }
  }
  return Object.keys(usage).length > 0 ? usage : undefined;
}
function extractRetryAfterMs(response, errorBody) {
  const retryAfterHeader = response.headers.get("Retry-After");
  if (retryAfterHeader) {
    const seconds = parseFloat(retryAfterHeader);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  const retryAfterMsHeader = response.headers.get("retry-after-ms");
  if (retryAfterMsHeader) {
    const ms = parseInt(retryAfterMsHeader, 10);
    if (!isNaN(ms) && ms > 0) {
      return ms;
    }
  }
  if (!errorBody) {
    return;
  }
  const error = errorBody.error;
  if (!error?.details || !Array.isArray(error.details)) {
    return;
  }
  const retryInfo = error.details.find((detail) => detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo");
  if (!retryInfo?.retryDelay || typeof retryInfo.retryDelay !== "string") {
    return;
  }
  const match = retryInfo.retryDelay.match(/^([\d.]+)s$/);
  if (match?.[1]) {
    const seconds = parseFloat(match[1]);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  return;
}
function parseErrorBody(text) {
  try {
    const parsed = JSON.parse(text);
    if (parsed.error && typeof parsed.error === "object") {
      const errorObj = parsed.error;
      return {
        message: String(errorObj.message || "Unknown error"),
        type: errorObj.type ? String(errorObj.type) : undefined,
        code: errorObj.code
      };
    }
    if (parsed.message && typeof parsed.message === "string") {
      return {
        message: parsed.message,
        type: parsed.type ? String(parsed.type) : undefined,
        code: parsed.code
      };
    }
    return;
  } catch {
    return {
      message: text || "Unknown error"
    };
  }
}
async function transformResponse(response) {
  const headers = new Headers(response.headers);
  const usage = extractUsageFromHeaders(headers);
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorBody(text);
    const retryAfterMs = extractRetryAfterMs(response, error ? { error } : undefined);
    let errorBody;
    try {
      errorBody = JSON.parse(text);
    } catch {
      errorBody = { error: { message: text } };
    }
    const retryMs = extractRetryAfterMs(response, errorBody) ?? retryAfterMs;
    if (retryMs) {
      headers.set("Retry-After", String(Math.ceil(retryMs / 1000)));
      headers.set("retry-after-ms", String(retryMs));
    }
    return {
      response: new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage,
      retryAfterMs: retryMs,
      error
    };
  }
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  if (!isJson) {
    return { response, usage };
  }
  try {
    const text = await response.text();
    const parsed = JSON.parse(text);
    let transformedBody = parsed;
    if (parsed.response !== undefined) {
      transformedBody = parsed.response;
    }
    return {
      response: new Response(JSON.stringify(transformedBody), {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage
    };
  } catch {
    return { response, usage };
  }
}
function transformSseLine(line) {
  if (!line.startsWith("data:")) {
    return line;
  }
  const json = line.slice(5).trim();
  if (!json || json === "[DONE]") {
    return line;
  }
  try {
    const parsed = JSON.parse(json);
    if (parsed.response !== undefined) {
      return `data: ${JSON.stringify(parsed.response)}`;
    }
    return line;
  } catch {
    return line;
  }
}
function createSseTransformStream() {
  const decoder2 = new TextDecoder;
  const encoder2 = new TextEncoder;
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder2.decode(chunk, { stream: true });
      const lines = buffer.split(`
`);
      buffer = lines.pop() || "";
      for (const line of lines) {
        const transformed = transformSseLine(line);
        controller.enqueue(encoder2.encode(transformed + `
`));
      }
    },
    flush(controller) {
      if (buffer) {
        const transformed = transformSseLine(buffer);
        controller.enqueue(encoder2.encode(transformed));
      }
    }
  });
}
async function transformStreamingResponse(response) {
  const headers = new Headers(response.headers);
  const usage = extractUsageFromHeaders(headers);
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorBody(text);
    let errorBody;
    try {
      errorBody = JSON.parse(text);
    } catch {
      errorBody = { error: { message: text } };
    }
    const retryAfterMs = extractRetryAfterMs(response, errorBody);
    if (retryAfterMs) {
      headers.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
      headers.set("retry-after-ms", String(retryAfterMs));
    }
    return {
      response: new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage,
      retryAfterMs,
      error
    };
  }
  const contentType = response.headers.get("content-type") ?? "";
  const isEventStream = contentType.includes("text/event-stream") || response.url.includes("alt=sse");
  if (!isEventStream) {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      let transformedBody2 = parsed;
      if (parsed.response !== undefined) {
        transformedBody2 = parsed.response;
      }
      return {
        response: new Response(JSON.stringify(transformedBody2), {
          status: response.status,
          statusText: response.statusText,
          headers
        }),
        usage
      };
    } catch {
      return {
        response: new Response(text, {
          status: response.status,
          statusText: response.statusText,
          headers
        }),
        usage
      };
    }
  }
  if (!response.body) {
    return { response, usage };
  }
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.set("content-type", "text/event-stream; charset=utf-8");
  const transformStream = createSseTransformStream();
  const transformedBody = response.body.pipeThrough(transformStream);
  return {
    response: new Response(transformedBody, {
      status: response.status,
      statusText: response.statusText,
      headers
    }),
    usage
  };
}
function isStreamingResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("text/event-stream") || response.url.includes("alt=sse");
}
// src/auth/antigravity/tools.ts
function normalizeToolsForGemini(tools) {
  if (!tools || tools.length === 0) {
    return;
  }
  const functionDeclarations = [];
  for (const tool of tools) {
    if (!tool || typeof tool !== "object") {
      continue;
    }
    const toolType = tool.type ?? "function";
    if (toolType === "function" && tool.function) {
      const declaration = {
        name: tool.function.name
      };
      if (tool.function.description) {
        declaration.description = tool.function.description;
      }
      if (tool.function.parameters) {
        declaration.parameters = tool.function.parameters;
      } else {
        declaration.parameters = { type: "object", properties: {} };
      }
      functionDeclarations.push(declaration);
    } else if (toolType !== "function" && process.env.ANTIGRAVITY_DEBUG === "1") {
      console.warn(`[antigravity-tools] Unsupported tool type: "${toolType}". Tool will be skipped.`);
    }
  }
  if (functionDeclarations.length === 0) {
    return;
  }
  return { functionDeclarations };
}
// src/auth/antigravity/thinking.ts
function shouldIncludeThinking(model) {
  if (!model || typeof model !== "string") {
    return false;
  }
  const lowerModel = model.toLowerCase();
  if (lowerModel.endsWith("-high")) {
    return true;
  }
  if (lowerModel.includes("thinking")) {
    return true;
  }
  return false;
}
function isThinkingPart(part) {
  if (part.thought === true) {
    return true;
  }
  if (part.type === "thinking" || part.type === "reasoning") {
    return true;
  }
  return false;
}
function extractThinkingBlocks(response) {
  const thinkingBlocks = [];
  if (response.candidates && Array.isArray(response.candidates)) {
    for (const candidate of response.candidates) {
      const parts = candidate.content?.parts;
      if (!parts || !Array.isArray(parts)) {
        continue;
      }
      for (let i = 0;i < parts.length; i++) {
        const part = parts[i];
        if (!part || typeof part !== "object") {
          continue;
        }
        if (isThinkingPart(part)) {
          const block = {
            text: part.text || "",
            index: thinkingBlocks.length
          };
          if (part.thought === true && part.thoughtSignature) {
            block.signature = part.thoughtSignature;
          } else if (part.signature) {
            block.signature = part.signature;
          }
          thinkingBlocks.push(block);
        }
      }
    }
  }
  if (response.content && Array.isArray(response.content)) {
    for (let i = 0;i < response.content.length; i++) {
      const item = response.content[i];
      if (!item || typeof item !== "object") {
        continue;
      }
      if (item.type === "thinking" || item.type === "reasoning") {
        thinkingBlocks.push({
          text: item.text || "",
          signature: item.signature,
          index: thinkingBlocks.length
        });
      }
    }
  }
  const combinedThinking = thinkingBlocks.map((b) => b.text).join(`

`);
  return {
    thinkingBlocks,
    combinedThinking,
    hasThinking: thinkingBlocks.length > 0
  };
}
function transformCandidateThinking(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return candidate;
  }
  const content = candidate.content;
  if (!content || typeof content !== "object" || !Array.isArray(content.parts)) {
    return candidate;
  }
  const thinkingTexts = [];
  const transformedParts = content.parts.map((part) => {
    if (part && typeof part === "object" && part.thought === true) {
      thinkingTexts.push(part.text || "");
      return {
        ...part,
        type: "reasoning",
        thought: undefined
      };
    }
    return part;
  });
  const result = {
    ...candidate,
    content: { ...content, parts: transformedParts }
  };
  if (thinkingTexts.length > 0) {
    result.reasoning_content = thinkingTexts.join(`

`);
  }
  return result;
}
function transformAnthropicThinking(content) {
  if (!content || !Array.isArray(content)) {
    return content;
  }
  return content.map((block) => {
    if (block && typeof block === "object" && block.type === "thinking") {
      return {
        type: "reasoning",
        text: block.text || "",
        ...block.signature ? { signature: block.signature } : {}
      };
    }
    return block;
  });
}
function transformResponseThinking(response) {
  if (!response || typeof response !== "object") {
    return response;
  }
  const result = { ...response };
  if (Array.isArray(result.candidates)) {
    result.candidates = result.candidates.map(transformCandidateThinking);
  }
  if (Array.isArray(result.content)) {
    result.content = transformAnthropicThinking(result.content);
  }
  return result;
}
// src/auth/antigravity/thought-signature-store.ts
var signatureStore = new Map;
var sessionIdStore = new Map;
function setThoughtSignature(sessionKey, signature) {
  if (sessionKey && signature) {
    signatureStore.set(sessionKey, signature);
  }
}
function getThoughtSignature(sessionKey) {
  return signatureStore.get(sessionKey);
}
function getOrCreateSessionId(fetchInstanceId, sessionId) {
  if (sessionId) {
    sessionIdStore.set(fetchInstanceId, sessionId);
    return sessionId;
  }
  const existing = sessionIdStore.get(fetchInstanceId);
  if (existing) {
    return existing;
  }
  const n = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const newSessionId = `-${n}`;
  sessionIdStore.set(fetchInstanceId, newSessionId);
  return newSessionId;
}
// src/auth/antigravity/message-converter.ts
function debugLog3(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-converter] ${message}`);
  }
}
function convertOpenAIToGemini(messages, thoughtSignature) {
  debugLog3(`Converting ${messages.length} messages, signature: ${thoughtSignature ? "present" : "none"}`);
  const contents = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      contents.push({
        role: "user",
        parts: [{ text: typeof msg.content === "string" ? msg.content : "" }]
      });
      continue;
    }
    if (msg.role === "user") {
      const parts = convertContentToParts(msg.content);
      contents.push({ role: "user", parts });
      continue;
    }
    if (msg.role === "assistant") {
      const parts = [];
      if (msg.content) {
        parts.push(...convertContentToParts(msg.content));
      }
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        for (const toolCall of msg.tool_calls) {
          let args = {};
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch {
            args = {};
          }
          const part = {
            functionCall: {
              name: toolCall.function.name,
              args
            }
          };
          part.thoughtSignature = thoughtSignature || SKIP_THOUGHT_SIGNATURE_VALIDATOR;
          debugLog3(`Injected signature into functionCall: ${toolCall.function.name} (${thoughtSignature ? "provided" : "default"})`);
          parts.push(part);
        }
      }
      if (parts.length > 0) {
        contents.push({ role: "model", parts });
      }
      continue;
    }
    if (msg.role === "tool") {
      let response = {};
      try {
        response = typeof msg.content === "string" ? JSON.parse(msg.content) : { result: msg.content };
      } catch {
        response = { result: msg.content };
      }
      const toolName = msg.name || "unknown";
      contents.push({
        role: "user",
        parts: [{
          functionResponse: {
            name: toolName,
            response
          }
        }]
      });
      continue;
    }
  }
  debugLog3(`Converted to ${contents.length} content blocks`);
  return contents;
}
function convertContentToParts(content) {
  if (!content) {
    return [{ text: "" }];
  }
  if (typeof content === "string") {
    return [{ text: content }];
  }
  const parts = [];
  for (const part of content) {
    if (part.type === "text" && part.text) {
      parts.push({ text: part.text });
    } else if (part.type === "image_url" && part.image_url?.url) {
      const url = part.image_url.url;
      if (url.startsWith("data:")) {
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }
    }
  }
  return parts.length > 0 ? parts : [{ text: "" }];
}
function hasOpenAIMessages(body) {
  return Array.isArray(body.messages) && body.messages.length > 0;
}
function convertRequestBody(body, thoughtSignature) {
  if (!hasOpenAIMessages(body)) {
    debugLog3("No messages array found, returning body as-is");
    return body;
  }
  const messages = body.messages;
  const contents = convertOpenAIToGemini(messages, thoughtSignature);
  const converted = { ...body };
  delete converted.messages;
  converted.contents = contents;
  debugLog3(`Converted body: messages \u2192 contents (${contents.length} blocks)`);
  return converted;
}
// src/auth/antigravity/fetch.ts
function debugLog4(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-fetch] ${message}`);
  }
}
function isRetryableError2(status) {
  if (status === 0)
    return true;
  if (status === 429)
    return true;
  if (status >= 500 && status < 600)
    return true;
  return false;
}
var GCP_PERMISSION_ERROR_PATTERNS = [
  "PERMISSION_DENIED",
  "does not have permission",
  "Cloud AI Companion API has not been used",
  "has not been enabled"
];
function isGcpPermissionError(text) {
  return GCP_PERMISSION_ERROR_PATTERNS.some((pattern) => text.includes(pattern));
}
function calculateRetryDelay2(attempt) {
  return Math.min(200 * Math.pow(2, attempt), 2000);
}
async function isRetryableResponse(response) {
  if (isRetryableError2(response.status))
    return true;
  if (response.status === 403) {
    try {
      const text = await response.clone().text();
      if (text.includes("SUBSCRIPTION_REQUIRED") || text.includes("Gemini Code Assist license")) {
        debugLog4(`[RETRY] 403 SUBSCRIPTION_REQUIRED detected, will retry with next endpoint`);
        return true;
      }
    } catch {}
  }
  return false;
}
async function attemptFetch(options) {
  const { endpoint, url, init, accessToken, projectId, sessionId, modelName, thoughtSignature } = options;
  debugLog4(`Trying endpoint: ${endpoint}`);
  try {
    const rawBody = init.body;
    if (rawBody !== undefined && typeof rawBody !== "string") {
      debugLog4(`Non-string body detected (${typeof rawBody}), signaling pass-through`);
      return "pass-through";
    }
    let parsedBody = {};
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = {};
      }
    }
    debugLog4(`[BODY] Keys: ${Object.keys(parsedBody).join(", ")}`);
    debugLog4(`[BODY] Has contents: ${!!parsedBody.contents}, Has messages: ${!!parsedBody.messages}`);
    if (parsedBody.contents) {
      const contents = parsedBody.contents;
      debugLog4(`[BODY] contents length: ${contents.length}`);
      contents.forEach((c, i) => {
        debugLog4(`[BODY] contents[${i}].role: ${c.role}, parts: ${JSON.stringify(c.parts).substring(0, 200)}`);
      });
    }
    if (parsedBody.tools && Array.isArray(parsedBody.tools)) {
      const normalizedTools = normalizeToolsForGemini(parsedBody.tools);
      if (normalizedTools) {
        parsedBody.tools = normalizedTools;
      }
    }
    if (hasOpenAIMessages(parsedBody)) {
      debugLog4(`[CONVERT] Converting OpenAI messages to Gemini contents`);
      parsedBody = convertRequestBody(parsedBody, thoughtSignature);
      debugLog4(`[CONVERT] After conversion - Has contents: ${!!parsedBody.contents}`);
    }
    const transformed = transformRequest({
      url,
      body: parsedBody,
      accessToken,
      projectId,
      sessionId,
      modelName,
      endpointOverride: endpoint,
      thoughtSignature
    });
    debugLog4(`[REQ] streaming=${transformed.streaming}, url=${transformed.url}`);
    const maxPermissionRetries = 10;
    for (let attempt = 0;attempt <= maxPermissionRetries; attempt++) {
      const response = await fetch(transformed.url, {
        method: init.method || "POST",
        headers: transformed.headers,
        body: JSON.stringify(transformed.body),
        signal: init.signal
      });
      debugLog4(`[RESP] status=${response.status} content-type=${response.headers.get("content-type") ?? ""} url=${response.url}`);
      if (response.status === 401) {
        debugLog4(`[401] Unauthorized response detected, signaling token refresh needed`);
        return "needs-refresh";
      }
      if (response.status === 403) {
        try {
          const text = await response.clone().text();
          if (isGcpPermissionError(text)) {
            if (attempt < maxPermissionRetries) {
              const delay = calculateRetryDelay2(attempt);
              debugLog4(`[RETRY] GCP permission error, retry ${attempt + 1}/${maxPermissionRetries} after ${delay}ms`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            debugLog4(`[RETRY] GCP permission error, max retries exceeded`);
          }
        } catch {}
      }
      if (!response.ok && await isRetryableResponse(response)) {
        debugLog4(`Endpoint failed: ${endpoint} (status: ${response.status}), trying next`);
        return null;
      }
      return response;
    }
    return null;
  } catch (error) {
    debugLog4(`Endpoint failed: ${endpoint} (${error instanceof Error ? error.message : "Unknown error"}), trying next`);
    return null;
  }
}
function extractSignatureFromResponse(parsed) {
  if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
    return;
  }
  for (const candidate of parsed.candidates) {
    const parts = candidate.content?.parts;
    if (!parts || !Array.isArray(parts)) {
      continue;
    }
    for (const part of parts) {
      const sig = part.thoughtSignature || part.thought_signature;
      if (sig && typeof sig === "string") {
        return sig;
      }
    }
  }
  return;
}
async function transformResponseWithThinking(response, modelName, fetchInstanceId) {
  const streaming = isStreamingResponse(response);
  let result;
  if (streaming) {
    result = await transformStreamingResponse(response);
  } else {
    result = await transformResponse(response);
  }
  if (streaming) {
    return result.response;
  }
  try {
    const text = await result.response.clone().text();
    debugLog4(`[TSIG][RESP] Response text length: ${text.length}`);
    const parsed = JSON.parse(text);
    debugLog4(`[TSIG][RESP] Parsed keys: ${Object.keys(parsed).join(", ")}`);
    debugLog4(`[TSIG][RESP] Has candidates: ${!!parsed.candidates}, count: ${parsed.candidates?.length ?? 0}`);
    const signature = extractSignatureFromResponse(parsed);
    debugLog4(`[TSIG][RESP] Signature extracted: ${signature ? signature.substring(0, 30) + "..." : "NONE"}`);
    if (signature) {
      setThoughtSignature(fetchInstanceId, signature);
      debugLog4(`[TSIG][STORE] Stored signature for ${fetchInstanceId}`);
    } else {
      debugLog4(`[TSIG][WARN] No signature found in response!`);
    }
    if (shouldIncludeThinking(modelName)) {
      const thinkingResult = extractThinkingBlocks(parsed);
      if (thinkingResult.hasThinking) {
        const transformed = transformResponseThinking(parsed);
        return new Response(JSON.stringify(transformed), {
          status: result.response.status,
          statusText: result.response.statusText,
          headers: result.response.headers
        });
      }
    }
  } catch {}
  return result.response;
}
function createAntigravityFetch(getAuth, client, providerId, clientId, clientSecret) {
  let cachedTokens = null;
  let cachedProjectId = null;
  const fetchInstanceId = crypto.randomUUID();
  return async (url, init = {}) => {
    debugLog4(`Intercepting request to: ${url}`);
    const auth = await getAuth();
    if (!auth.access || !auth.refresh) {
      throw new Error("Antigravity: No authentication tokens available");
    }
    const refreshParts = parseStoredToken(auth.refresh);
    if (!cachedTokens) {
      cachedTokens = {
        type: "antigravity",
        access_token: auth.access,
        refresh_token: refreshParts.refreshToken,
        expires_in: auth.expires ? Math.floor((auth.expires - Date.now()) / 1000) : 3600,
        timestamp: auth.expires ? auth.expires - 3600 * 1000 : Date.now()
      };
    } else {
      cachedTokens.access_token = auth.access;
      cachedTokens.refresh_token = refreshParts.refreshToken;
    }
    if (isTokenExpired(cachedTokens)) {
      debugLog4("Token expired, refreshing...");
      try {
        const newTokens = await refreshAccessToken(refreshParts.refreshToken, clientId, clientSecret);
        cachedTokens = {
          type: "antigravity",
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_in: newTokens.expires_in,
          timestamp: Date.now()
        };
        clearProjectContextCache();
        const formattedRefresh = formatTokenForStorage(newTokens.refresh_token, refreshParts.projectId || "", refreshParts.managedProjectId);
        await client.set(providerId, {
          access: newTokens.access_token,
          refresh: formattedRefresh,
          expires: Date.now() + newTokens.expires_in * 1000
        });
        debugLog4("Token refreshed successfully");
      } catch (error) {
        if (error instanceof AntigravityTokenRefreshError) {
          if (error.isInvalidGrant) {
            debugLog4(`[REFRESH] Token revoked (invalid_grant), clearing caches`);
            invalidateProjectContextByRefreshToken(refreshParts.refreshToken);
            clearProjectContextCache();
          }
          throw new Error(`Antigravity: Token refresh failed: ${error.description || error.message}${error.code ? ` (${error.code})` : ""}`);
        }
        throw new Error(`Antigravity: Token refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (!cachedProjectId) {
      const projectContext = await fetchProjectContext(cachedTokens.access_token);
      cachedProjectId = projectContext.cloudaicompanionProject || "";
      debugLog4(`[PROJECT] Fetched project ID: "${cachedProjectId}"`);
    }
    const projectId = cachedProjectId;
    debugLog4(`[PROJECT] Using project ID: "${projectId}"`);
    let modelName;
    if (init.body) {
      try {
        const body = typeof init.body === "string" ? JSON.parse(init.body) : init.body;
        if (typeof body.model === "string") {
          modelName = body.model;
        }
      } catch {}
    }
    const maxEndpoints = Math.min(ANTIGRAVITY_ENDPOINT_FALLBACKS.length, 3);
    const sessionId = getOrCreateSessionId(fetchInstanceId);
    const thoughtSignature = getThoughtSignature(fetchInstanceId);
    debugLog4(`[TSIG][GET] sessionId=${sessionId}, signature=${thoughtSignature ? thoughtSignature.substring(0, 20) + "..." : "none"}`);
    let hasRefreshedFor401 = false;
    const executeWithEndpoints = async () => {
      for (let i = 0;i < maxEndpoints; i++) {
        const endpoint = ANTIGRAVITY_ENDPOINT_FALLBACKS[i];
        const response = await attemptFetch({
          endpoint,
          url,
          init,
          accessToken: cachedTokens.access_token,
          projectId,
          sessionId,
          modelName,
          thoughtSignature
        });
        if (response === "pass-through") {
          debugLog4("Non-string body detected, passing through with auth headers");
          const headersWithAuth = {
            ...init.headers,
            Authorization: `Bearer ${cachedTokens.access_token}`
          };
          return fetch(url, { ...init, headers: headersWithAuth });
        }
        if (response === "needs-refresh") {
          if (hasRefreshedFor401) {
            debugLog4("[401] Already refreshed once, returning unauthorized error");
            return new Response(JSON.stringify({
              error: {
                message: "Authentication failed after token refresh",
                type: "unauthorized",
                code: "token_refresh_failed"
              }
            }), {
              status: 401,
              statusText: "Unauthorized",
              headers: { "Content-Type": "application/json" }
            });
          }
          debugLog4("[401] Refreshing token and retrying...");
          hasRefreshedFor401 = true;
          try {
            const newTokens = await refreshAccessToken(refreshParts.refreshToken, clientId, clientSecret);
            cachedTokens = {
              type: "antigravity",
              access_token: newTokens.access_token,
              refresh_token: newTokens.refresh_token,
              expires_in: newTokens.expires_in,
              timestamp: Date.now()
            };
            clearProjectContextCache();
            const formattedRefresh = formatTokenForStorage(newTokens.refresh_token, refreshParts.projectId || "", refreshParts.managedProjectId);
            await client.set(providerId, {
              access: newTokens.access_token,
              refresh: formattedRefresh,
              expires: Date.now() + newTokens.expires_in * 1000
            });
            debugLog4("[401] Token refreshed, retrying request...");
            return executeWithEndpoints();
          } catch (refreshError) {
            if (refreshError instanceof AntigravityTokenRefreshError) {
              if (refreshError.isInvalidGrant) {
                debugLog4(`[401] Token revoked (invalid_grant), clearing caches`);
                invalidateProjectContextByRefreshToken(refreshParts.refreshToken);
                clearProjectContextCache();
              }
              debugLog4(`[401] Token refresh failed: ${refreshError.description || refreshError.message}`);
              return new Response(JSON.stringify({
                error: {
                  message: refreshError.description || refreshError.message,
                  type: refreshError.isInvalidGrant ? "token_revoked" : "unauthorized",
                  code: refreshError.code || "token_refresh_failed"
                }
              }), {
                status: 401,
                statusText: "Unauthorized",
                headers: { "Content-Type": "application/json" }
              });
            }
            debugLog4(`[401] Token refresh failed: ${refreshError instanceof Error ? refreshError.message : "Unknown error"}`);
            return new Response(JSON.stringify({
              error: {
                message: refreshError instanceof Error ? refreshError.message : "Unknown error",
                type: "unauthorized",
                code: "token_refresh_failed"
              }
            }), {
              status: 401,
              statusText: "Unauthorized",
              headers: { "Content-Type": "application/json" }
            });
          }
        }
        if (response) {
          debugLog4(`Success with endpoint: ${endpoint}`);
          const transformedResponse = await transformResponseWithThinking(response, modelName || "", fetchInstanceId);
          return transformedResponse;
        }
      }
      const errorMessage = `All Antigravity endpoints failed after ${maxEndpoints} attempts`;
      debugLog4(errorMessage);
      return new Response(JSON.stringify({
        error: {
          message: errorMessage,
          type: "endpoint_failure",
          code: "all_endpoints_failed"
        }
      }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" }
      });
    };
    return executeWithEndpoints();
  };
}
// src/auth/antigravity/plugin.ts
var GOOGLE_PROVIDER_ID = "google";
function isOAuthAuth(auth) {
  return auth.type === "oauth";
}
async function createGoogleAntigravityAuthPlugin({
  client
}) {
  let cachedClientId = ANTIGRAVITY_CLIENT_ID;
  let cachedClientSecret = ANTIGRAVITY_CLIENT_SECRET;
  const authHook = {
    provider: GOOGLE_PROVIDER_ID,
    loader: async (auth, provider) => {
      const currentAuth = await auth();
      if (process.env.ANTIGRAVITY_DEBUG === "1") {
        console.log("[antigravity-plugin] loader called");
        console.log("[antigravity-plugin] auth type:", currentAuth?.type);
        console.log("[antigravity-plugin] auth keys:", Object.keys(currentAuth || {}));
      }
      if (!isOAuthAuth(currentAuth)) {
        if (process.env.ANTIGRAVITY_DEBUG === "1") {
          console.log("[antigravity-plugin] NOT OAuth auth, returning empty");
        }
        return {};
      }
      if (process.env.ANTIGRAVITY_DEBUG === "1") {
        console.log("[antigravity-plugin] OAuth auth detected, creating custom fetch");
      }
      cachedClientId = provider.options?.clientId || ANTIGRAVITY_CLIENT_ID;
      cachedClientSecret = provider.options?.clientSecret || ANTIGRAVITY_CLIENT_SECRET;
      if (process.env.ANTIGRAVITY_DEBUG === "1" && (cachedClientId !== ANTIGRAVITY_CLIENT_ID || cachedClientSecret !== ANTIGRAVITY_CLIENT_SECRET)) {
        console.log("[antigravity-plugin] Using custom credentials from provider.options");
      }
      const authClient = {
        set: async (providerId, authData) => {
          await client.auth.set({
            body: {
              type: "oauth",
              access: authData.access || "",
              refresh: authData.refresh || "",
              expires: authData.expires || 0
            },
            path: { id: providerId }
          });
        }
      };
      const getAuth = async () => {
        const authState = await auth();
        if (isOAuthAuth(authState)) {
          return {
            access: authState.access,
            refresh: authState.refresh,
            expires: authState.expires
          };
        }
        return {};
      };
      const antigravityFetch = createAntigravityFetch(getAuth, authClient, GOOGLE_PROVIDER_ID, cachedClientId, cachedClientSecret);
      return {
        fetch: antigravityFetch,
        apiKey: "antigravity-oauth"
      };
    },
    methods: [
      {
        type: "oauth",
        label: "OAuth with Google (Antigravity)",
        authorize: async () => {
          const serverHandle = startCallbackServer();
          const { url, verifier } = await buildAuthURL(undefined, cachedClientId, serverHandle.port);
          return {
            url,
            instructions: "Complete the sign-in in your browser. We'll automatically detect when you're done.",
            method: "auto",
            callback: async () => {
              try {
                const result = await serverHandle.waitForCallback();
                if (result.error) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error(`[antigravity-plugin] OAuth error: ${result.error}`);
                  }
                  return { type: "failed" };
                }
                if (!result.code) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error("[antigravity-plugin] No authorization code received");
                  }
                  return { type: "failed" };
                }
                const state = decodeState(result.state);
                if (state.verifier !== verifier) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error("[antigravity-plugin] PKCE verifier mismatch");
                  }
                  return { type: "failed" };
                }
                const tokens = await exchangeCode(result.code, verifier, cachedClientId, cachedClientSecret, serverHandle.port);
                try {
                  const userInfo = await fetchUserInfo(tokens.access_token);
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.log(`[antigravity-plugin] Authenticated as: ${userInfo.email}`);
                  }
                } catch {}
                const projectContext = await fetchProjectContext(tokens.access_token);
                const formattedRefresh = formatTokenForStorage(tokens.refresh_token, projectContext.cloudaicompanionProject || "", projectContext.managedProjectId);
                return {
                  type: "success",
                  access: tokens.access_token,
                  refresh: formattedRefresh,
                  expires: Date.now() + tokens.expires_in * 1000
                };
              } catch (error) {
                serverHandle.close();
                if (process.env.ANTIGRAVITY_DEBUG === "1") {
                  console.error(`[antigravity-plugin] OAuth flow failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
                return { type: "failed" };
              }
            }
          };
        }
      }
    ]
  };
  return {
    auth: authHook
  };
}
// src/google-auth.ts
var GoogleAntigravityAuthPlugin = async (ctx) => {
  return createGoogleAntigravityAuthPlugin(ctx);
};
var google_auth_default = GoogleAntigravityAuthPlugin;
export {
  google_auth_default as default
};
