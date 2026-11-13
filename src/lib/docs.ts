/**
 * ERIX API docs content (moved from the API server's /docs). Public API and SDK
 * only. In text, `code` is inline code, **bold** is bold and [label](href) a link.
 */

export type DocBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; title: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | {
      kind: "endpoint";
      id: string;
      method: string;
      path: string;
      purpose: string;
      params: { name: string; type: string; required: boolean; text: string }[];
      note?: string;
    };

export interface CodeSample {
  label: string;
  /** One tab is a plain block; `ts` + `curl` tabs follow the reader's language choice. */
  tabs: { lang: string; label: string; code: string }[];
}

export interface DocSection {
  id: string;
  group: string;
  eyebrow: string;
  /** Automation sections (AI-adjacent) carry the purple eyebrow. */
  ai: boolean;
  title: string;
  blocks: DocBlock[];
  code: CodeSample[];
}

export const API_BASE_URL = "https://api.ecodrix.com/v1/api";
export const CONSOLE_URL = "https://console.ecodrix.com";

/** The developer area's pages, in header and footer order. */
export const DEV_NAV = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "/status", label: "Status" },
];

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "auth",
    group: "Getting started",
    title: "Authentication",
    eyebrow: "Getting started",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Every request belongs to one workspace. Create keys in the dashboard under **Settings → Developer**. There are two kinds:",
      },
      {
        kind: "list",
        items: [
          "**Workspace key.** Send `x-api-key` and `x-client-code`. Full access to the workspace: it acts as the owner.",
          "**Scoped key.** `erix_<scope>_…` sent as `Authorization: Bearer`. Limited to one module (`crm`, `flow`, `connect`, `storage`) or a sub-scope such as `erix_connect_whatsapp_…`. Revocable, and the right choice for integrations. Scoped keys can’t perform admin-only actions.",
        ],
      },
      {
        kind: "note",
        title: "Keep keys on your server.",
        text: "Never put a key in browser code or in a `NEXT_PUBLIC_*` variable. In a browser, use the SDK’s proxy mode: requests go to your own route, which checks your user and adds the key server-side.",
      },
      {
        kind: "p",
        text: "**Base URL:** `https://api.ecodrix.com/v1/api`. Paths are grouped by domain: `/product/erix/*` (CRM, events, invoices), `/product/flow/*` (automations), `/platform/inbox/*` (inbox), `/infra/connect/*` (channels, Meet) and `/infra/storage/*` (files). The SDK sets the base URL for you.",
      },
    ],
    code: [
      {
        label: "Headers",
        tabs: [
          {
            lang: "text",
            label: "Headers",
            code: "# Workspace key\nx-api-key: YOUR_API_KEY\nx-client-code: ERIX_CLNT_XXXXXX\n\n# Scoped key\nAuthorization: Bearer erix_crm_YOUR_SECRET",
          },
        ],
      },
      {
        label: "Browser (proxy mode)",
        tabs: [
          {
            lang: "text",
            label: "Browser (proxy mode)",
            code: '// No key in the page\nconst ecod = new ECODrIxAPI({\n  proxy: {\n    url: "/api/erix", // your server route adds x-api-key / x-client-code\n    ticket: () => fetch("/api/erix/ticket").then((r) => r.text()), // optional, for realtime\n  },\n});',
          },
        ],
      },
    ],
  },
  {
    id: "quickstart",
    group: "Getting started",
    title: "Quick start",
    eyebrow: "Getting started",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Install the SDK (Node.js 18 or later), then create a lead and fire your own event. Every active flow that listens for that event starts a run.",
      },
      {
        kind: "p",
        text: "Prefer plain HTTP? Every sample on this page has a cURL tab; your choice is remembered.",
      },
    ],
    code: [
      {
        label: "Terminal",
        tabs: [
          {
            lang: "text",
            label: "Terminal",
            code: "pnpm add @ecodrix/erix-api   # or: npm install @ecodrix/erix-api",
          },
        ],
      },
      {
        label: "Quick start",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'import { ECODrIxAPI } from "@ecodrix/erix-api";\n\nconst ecod = new ECODrIxAPI({\n  apiKey: process.env.ECOD_API_KEY,         // server-side only\n  clientCode: process.env.ECOD_CLIENT_CODE, // e.g. ERIX_CLNT_XXXXXX\n});\n\n// 1. Save an enquiry as a lead\nconst { data: lead } = await ecod.product.erix.leads.create({\n  firstName: "Asha",\n  phone: "+91XXXXXXXXXX",\n  source: "website",\n});\n\n// 2. Fire your own event\nawait ecod.product.erix.events.trigger({\n  trigger: "enquiry_received",\n  phone: "+91XXXXXXXXXX",\n  variables: { product: "Annual plan" },\n});',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/crm/leads \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"firstName":"Asha","phone":"+91XXXXXXXXXX","source":"website"}\'',
          },
        ],
      },
    ],
  },
  {
    id: "errors",
    group: "Getting started",
    title: "Errors and limits",
    eyebrow: "Getting started",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: 'Responses are JSON. Success is `{ "success": true, "data": … }`. Failures carry `success: false`, a readable `message` and a machine code in `error` or `code`. Validation failures add `fieldErrors`.',
      },
      {
        kind: "table",
        head: ["Status", "Meaning"],
        rows: [
          ["400", "Invalid input. See `fieldErrors`."],
          ["401", "Missing, invalid or revoked key."],
          ["403", "The key lacks the scope or role, or the feature isn’t on your plan."],
          ["404", "Not found in this workspace."],
          ["429", "Rate limit or monthly quota reached. Back off and retry."],
        ],
      },
      {
        kind: "list",
        items: [
          "**Rate limits** are per workspace. Current usage comes back in the standard `RateLimit` and `RateLimit-Policy` headers.",
          "**Retries.** Send an `Idempotency-Key` header on channel sends, invoice and storage writes; a retry with the same key isn’t applied twice. `/events/trigger` takes `idempotencyKey` in the body.",
          "**SDK errors.** Failed calls throw `APIError` (with `status` and `code`), with `AuthenticationError` and `RateLimitError` subclasses. The SDK retries 429s and network errors up to 3 times with backoff.",
        ],
      },
    ],
    code: [
      {
        label: "Error response",
        tabs: [
          {
            lang: "text",
            label: "Error response",
            code: '{\n  "success": false,\n  "error": "INVALID_KEY",\n  "message": "Invalid, expired, or revoked API key."\n}',
          },
        ],
      },
      {
        label: "Handling errors",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'import { APIError, RateLimitError } from "@ecodrix/erix-api";\n\ntry {\n  await ecod.product.erix.leads.create({ firstName: "Asha", phone: "+91XXXXXXXXXX" });\n} catch (err) {\n  if (err instanceof RateLimitError) {\n    // back off, then retry\n  } else if (err instanceof APIError) {\n    console.error(err.status, err.code, err.message);\n  }\n}',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -i https://api.ecodrix.com/v1/api/product/erix/crm/leads \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"\n# -i prints the status line and RateLimit headers',
          },
        ],
      },
    ],
  },
  {
    id: "leads",
    group: "CRM",
    title: "Leads",
    eyebrow: "CRM",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Contacts in your pipelines. Creating a lead logs a “Lead created” activity and starts any flow listening for new leads.",
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-leads",
        method: "POST",
        path: "/v1/api/product/erix/crm/leads",
        purpose: "Create a lead in a pipeline.",
        params: [
          {
            name: "firstName",
            type: "string",
            required: true,
            text: "Contact’s first name.",
          },
          {
            name: "phone",
            type: "string",
            required: true,
            text: "Mobile number with country code, e.g. `+91XXXXXXXXXX`.",
          },
          {
            name: "lastName",
            type: "string",
            required: false,
            text: "Contact’s last name.",
          },
          {
            name: "email",
            type: "string",
            required: false,
            text: "Email address.",
          },
          {
            name: "source",
            type: "string",
            required: false,
            text: "Where the lead came from, e.g. `website`.",
          },
          {
            name: "pipelineId",
            type: "string",
            required: false,
            text: "Defaults to your default pipeline.",
          },
          {
            name: "stageId",
            type: "string",
            required: false,
            text: "Defaults to the pipeline’s first stage.",
          },
          {
            name: "value",
            type: "number",
            required: false,
            text: "Deal value.",
          },
          {
            name: "metadata",
            type: "object",
            required: false,
            text: "Your own key/value data.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-leads-upsert",
        method: "POST",
        path: "/v1/api/product/erix/crm/leads/upsert",
        purpose: "Find a lead by phone, then update it or create it. Best for forms and webhooks.",
        params: [
          {
            name: "leadData",
            type: "object",
            required: true,
            text: "Lead fields; must include `phone`.",
          },
          {
            name: "refs",
            type: "object",
            required: false,
            text: 'Your own ids, e.g. `{ "orderId": "…" }`. Saved on the lead for lookups.',
          },
          {
            name: "pipelineId",
            type: "string",
            required: false,
            text: "Pipeline for a new lead.",
          },
          {
            name: "stageId",
            type: "string",
            required: false,
            text: "Stage to create in, or move an existing lead to.",
          },
          {
            name: "trigger",
            type: "string",
            required: false,
            text: "A label for what caused the upsert, saved on the lead.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-leads",
        method: "GET",
        path: "/v1/api/product/erix/crm/leads",
        purpose: "Paginated, filterable list of leads.",
        params: [
          {
            name: "search",
            type: "string",
            required: false,
            text: "Matches name, phone or email.",
          },
          {
            name: "status",
            type: "string",
            required: false,
            text: "Lead status.",
          },
          {
            name: "pipelineId / stageId",
            type: "string",
            required: false,
            text: "Limit to a pipeline or stage.",
          },
          {
            name: "source / tags",
            type: "string",
            required: false,
            text: "Filter by source or tag.",
          },
          {
            name: "startDate / endDate",
            type: "ISO date",
            required: false,
            text: "Created within this range.",
          },
          {
            name: "page / limit",
            type: "number",
            required: false,
            text: "Pagination.",
          },
          {
            name: "sortBy / sortDir",
            type: "string",
            required: false,
            text: "Sort field and `asc` or `desc`.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-leads-leadid",
        method: "GET",
        path: "/v1/api/product/erix/crm/leads/:leadId",
        purpose: "Get one lead.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-leads-phone-phone",
        method: "GET",
        path: "/v1/api/product/erix/crm/leads/phone/:phone",
        purpose: "Look up a lead by phone number.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-patch-product-erix-crm-leads-leadid",
        method: "PATCH",
        path: "/v1/api/product/erix/crm/leads/:leadId",
        purpose: "Update a lead’s fields.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-patch-product-erix-crm-leads-leadid-move",
        method: "PATCH",
        path: "/v1/api/product/erix/crm/leads/:leadId/move",
        purpose: "Move a lead to another stage. Won and lost stages update its status.",
        params: [
          {
            name: "stageId",
            type: "string",
            required: true,
            text: "Target stage.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-patch-product-erix-crm-leads-leadid-tags",
        method: "PATCH",
        path: "/v1/api/product/erix/crm/leads/:leadId/tags",
        purpose: "Add or remove tags.",
        params: [
          {
            name: "add",
            type: "string[]",
            required: false,
            text: "Tags to add.",
          },
          {
            name: "remove",
            type: "string[]",
            required: false,
            text: "Tags to remove.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-delete-product-erix-crm-leads-leadid",
        method: "DELETE",
        path: "/v1/api/product/erix/crm/leads/:leadId",
        purpose: "Archive a lead (soft delete).",
        params: [],
      },
    ],
    code: [
      {
        label: "Leads",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const { data: lead } = await ecod.product.erix.leads.upsert({\n  leadData: { firstName: "Asha", phone: "+91XXXXXXXXXX" },\n  refs: { orderId: "ORD-1001" },\n});\n\nconst { data: page } = await ecod.product.erix.leads.list({\n  search: "Asha",\n  limit: 20,\n});\n\nawait ecod.product.erix.leads.move(lead.id, "STAGE_ID");\nawait ecod.product.erix.leads.tags(lead.id, { add: ["vip"] });',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/crm/leads/upsert \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"leadData":{"firstName":"Asha","phone":"+91XXXXXXXXXX"},"refs":{"orderId":"ORD-1001"}}\'\n\ncurl "https://api.ecodrix.com/v1/api/product/erix/crm/leads?search=Asha&limit=20" \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "pipelines",
    group: "CRM",
    title: "Pipelines and stages",
    eyebrow: "CRM",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "A workspace can run several pipelines (sales, support, onboarding), each with ordered stages.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-pipelines",
        method: "GET",
        path: "/v1/api/product/erix/crm/pipelines",
        purpose: "List all pipelines with their stages.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-pipelines",
        method: "POST",
        path: "/v1/api/product/erix/crm/pipelines",
        purpose: "Create a pipeline.",
        params: [
          {
            name: "name",
            type: "string",
            required: true,
            text: "Pipeline name.",
          },
          {
            name: "stages",
            type: "string[]",
            required: true,
            text: 'Stage names in order, e.g. `["New", "Won"]`.',
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-pipelines-pipelineid-board",
        method: "GET",
        path: "/v1/api/product/erix/crm/pipelines/:pipelineId/board",
        purpose: "Kanban view: stages with their leads.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-pipelines-pipelineid-stages",
        method: "POST",
        path: "/v1/api/product/erix/crm/pipelines/:pipelineId/stages",
        purpose: "Add a stage to a pipeline.",
        params: [],
      },
    ],
    code: [
      {
        label: "Pipelines",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const { data: pipelines } = await ecod.product.erix.pipelines.list();\n\nawait ecod.product.erix.pipelines.create({\n  name: "Sales",\n  stages: ["New", "Quoted", "Won"],\n});',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl https://api.ecodrix.com/v1/api/product/erix/crm/pipelines \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "activities",
    group: "CRM",
    title: "Notes and activity",
    eyebrow: "CRM",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Every lead has a timeline. Log calls, emails and meetings against it, or add notes for your team.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-leads-leadid-timeline",
        method: "GET",
        path: "/v1/api/product/erix/crm/leads/:leadId/timeline",
        purpose: "Everything that happened to a lead, newest first.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-leads-leadid-activities",
        method: "POST",
        path: "/v1/api/product/erix/crm/leads/:leadId/activities",
        purpose: "Log an activity (call, email, meeting) on the timeline.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-leads-leadid-notes",
        method: "POST",
        path: "/v1/api/product/erix/crm/leads/:leadId/notes",
        purpose: "Add a note to a lead.",
        params: [
          {
            name: "content",
            type: "string",
            required: true,
            text: "The note text.",
          },
        ],
      },
    ],
    code: [
      {
        label: "Notes",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'await ecod.product.erix.activities.notes.create(leadId, {\n  content: "Asked for a quote",\n});\n\nconst { data: timeline } = await ecod.product.erix.activities.timeline(leadId);',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/crm/leads/LEAD_ID/notes \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"content":"Asked for a quote"}\'',
          },
        ],
      },
    ],
  },
  {
    id: "scoring",
    group: "CRM",
    title: "Lead scoring",
    eyebrow: "CRM",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Scores update from activity and deal progress. You can tune the weights and force a recalculation.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-scoring",
        method: "GET",
        path: "/v1/api/product/erix/crm/scoring",
        purpose: "Get the current scoring weights.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-patch-product-erix-crm-scoring",
        method: "PATCH",
        path: "/v1/api/product/erix/crm/scoring",
        purpose: "Update the scoring weights.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-crm-scoring-leadid-recalculate",
        method: "POST",
        path: "/v1/api/product/erix/crm/scoring/:leadId/recalculate",
        purpose: "Recalculate one lead’s score now.",
        params: [],
      },
    ],
    code: [
      {
        label: "Lead scoring",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: "const { data: config } = await ecod.product.erix.scoring.getConfig();\nawait ecod.product.erix.scoring.recalculate(leadId);",
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/crm/scoring/LEAD_ID/recalculate \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "analytics",
    group: "CRM",
    title: "Analytics",
    eyebrow: "CRM",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "The numbers behind the dashboard, for your own reports.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-analytics-overview",
        method: "GET",
        path: "/v1/api/product/erix/crm/analytics/overview",
        purpose: "Headline numbers: leads, conversion, pipeline value.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-analytics-funnel",
        method: "GET",
        path: "/v1/api/product/erix/crm/analytics/funnel",
        purpose: "Stage-by-stage conversion for a pipeline.",
        params: [
          {
            name: "pipelineId",
            type: "string",
            required: true,
            text: "Query parameter: the pipeline to analyse.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-analytics-sources",
        method: "GET",
        path: "/v1/api/product/erix/crm/analytics/sources",
        purpose: "Leads and wins by source.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-crm-analytics-team",
        method: "GET",
        path: "/v1/api/product/erix/crm/analytics/team",
        purpose: "Performance per team member.",
        params: [],
      },
    ],
    code: [
      {
        label: "Analytics",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: "const { data: overview } = await ecod.product.erix.analytics.overview();\nconst { data: funnel } = await ecod.product.erix.analytics.funnel(pipelineId);",
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl https://api.ecodrix.com/v1/api/product/erix/crm/analytics/overview \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "events",
    group: "Automation",
    title: "Fire an event",
    eyebrow: "Automation (Flow)",
    ai: true,
    blocks: [
      {
        kind: "p",
        text: "Flow is the automation engine. Your system tells it something happened (“order placed”, “form submitted”) and every active flow whose trigger matches starts a run. This is the only way to fire an event from outside.",
      },
      {
        kind: "p",
        text: "Built-in events (payment captured, stage changed, …) are fired by ECODrIx itself and are rejected here with `RESERVED_TRIGGER`. Define your own under [custom events](#custom-events). A scoped key needs the `flow:events` or `flow` scope. Each run counts toward your plan’s monthly runs.",
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-events-trigger",
        method: "POST",
        path: "/v1/api/product/erix/events/trigger",
        purpose:
          "Fire an event. Returns `trigger`, `idempotencyKey` and, when a contact was found or created, `leadId`.",
        params: [
          {
            name: "trigger",
            type: "string",
            required: true,
            text: "Your event name. No spaces, max 100 characters.",
          },
          {
            name: "phone / email",
            type: "string",
            required: true,
            text: "The contact. One is required unless your plan includes Flow v1.",
          },
          {
            name: "variables",
            type: "object",
            required: false,
            text: "Flat key/value pairs available to the flow’s steps.",
          },
          {
            name: "data",
            type: "object",
            required: false,
            text: "Any extra payload.",
          },
          {
            name: "leadData",
            type: "object",
            required: false,
            text: "`firstName`, `lastName`, `source` for a new contact.",
          },
          {
            name: "createLeadIfMissing",
            type: "boolean",
            required: false,
            text: "Find or create the CRM contact and attach it to the run.*",
          },
          {
            name: "delaySeconds / delayMinutes / runAt",
            type: "number / ISO date",
            required: false,
            text: "Run later, up to 30 days ahead. Use only one.*",
          },
          {
            name: "idempotencyKey",
            type: "string",
            required: false,
            text: "Same key, same event: safe to retry.",
          },
        ],
        note: "* Needs Flow v1 on your plan. Without it these fields are ignored and listed in `data.ignored`.",
      },
    ],
    code: [
      {
        label: "Fire an event",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'await ecod.product.erix.events.trigger({\n  trigger: "order_placed",\n  phone: "+91XXXXXXXXXX",\n  variables: { orderId: "ORD-1001", amount: "4999" },\n  idempotencyKey: "ORD-1001",\n});',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/events/trigger \\\n  -H "Authorization: Bearer erix_flow_YOUR_SECRET" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"trigger":"order_placed","phone":"+91XXXXXXXXXX","variables":{"orderId":"ORD-1001"}}\'',
          },
        ],
      },
    ],
  },
  {
    id: "custom-events",
    group: "Automation",
    title: "Custom events",
    eyebrow: "Automation (Flow)",
    ai: true,
    blocks: [
      {
        kind: "p",
        text: "Define the event names your system will fire, so they show up as triggers in the Flow builder. Creating and deleting needs a workspace key or an admin session.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-flow-config-triggers",
        method: "GET",
        path: "/v1/api/product/flow/config/triggers",
        purpose: "Every trigger a flow can start on: built-ins plus your custom events.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-flow-config-triggers",
        method: "POST",
        path: "/v1/api/product/flow/config/triggers",
        purpose: "Create a custom event.",
        params: [
          {
            name: "name",
            type: "string",
            required: true,
            text: "Lowercase letters, digits and `_ . -`, e.g. `appointment_confirm`.",
          },
          {
            name: "displayName",
            type: "string",
            required: true,
            text: "Name shown in the Flow builder.",
          },
          {
            name: "description",
            type: "string",
            required: false,
            text: "What the event means.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-delete-product-flow-config-triggers-id",
        method: "DELETE",
        path: "/v1/api/product/flow/config/triggers/:id",
        purpose: "Delete a custom event.",
        params: [],
      },
    ],
    code: [
      {
        label: "Custom events",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'await ecod.product.erix.events.createCustomEvent({\n  name: "order_placed",\n  displayName: "Order placed",\n});\n\nconst { data } = await ecod.product.erix.events.listCustomEvents();',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/flow/config/triggers \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"name":"order_placed","displayName":"Order placed"}\'',
          },
        ],
      },
    ],
  },
  {
    id: "flows",
    group: "Automation",
    title: "Flows and runs",
    eyebrow: "Automation (Flow)",
    ai: true,
    blocks: [
      {
        kind: "p",
        text: "Build flows in the dashboard. Over the API you can list them, start a run by hand and follow runs. Scoped keys need the `flow` scope. The SDK has no typed Flow methods yet; use the raw `ecod.request()`, which keeps auth and retries.",
      },
      {
        kind: "endpoint",
        id: "ep-get-product-flow-workflows",
        method: "GET",
        path: "/v1/api/product/flow/workflows",
        purpose: "List your flows.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-flow-workflows-id-run",
        method: "POST",
        path: "/v1/api/product/flow/workflows/:id/run",
        purpose: "Start a run now. Drafts can be test-run; archived flows return 409.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-flow-runs",
        method: "GET",
        path: "/v1/api/product/flow/runs",
        purpose: "List recent runs.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-flow-runs-runid",
        method: "GET",
        path: "/v1/api/product/flow/runs/:runId",
        purpose: "One run with its step status.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-flow-runs-runid-logs",
        method: "GET",
        path: "/v1/api/product/flow/runs/:runId/logs",
        purpose: "Step-by-step log for debugging.",
        params: [],
      },
    ],
    code: [
      {
        label: "Flows and runs",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const { data: flows } = await ecod.request("GET", "/product/flow/workflows");\nconst { data: run } = await ecod.request("GET", `/product/flow/runs/${runId}`);',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl https://api.ecodrix.com/v1/api/product/flow/runs \\\n  -H "Authorization: Bearer erix_flow_YOUR_SECRET"',
          },
        ],
      },
    ],
  },
  {
    id: "inbox",
    group: "Messaging",
    title: "Unified inbox",
    eyebrow: "Messaging",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "One inbox holds your WhatsApp and phone-call conversations; Instagram, email and web chat are coming soon. A reply goes out on the conversation’s own channel.",
      },
      {
        kind: "endpoint",
        id: "ep-get-platform-inbox-conversations",
        method: "GET",
        path: "/v1/api/platform/inbox/conversations",
        purpose: "List conversations (cursor pagination, filter by status).",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-platform-inbox-conversations-id-messages",
        method: "GET",
        path: "/v1/api/platform/inbox/conversations/:id/messages",
        purpose: "Messages in a thread.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-platform-inbox-conversations-id-messages",
        method: "POST",
        path: "/v1/api/platform/inbox/conversations/:id/messages",
        purpose: "Reply in a thread.",
        params: [
          {
            name: "text",
            type: "string",
            required: false,
            text: "Message text. Send `text`, `media` or both.",
          },
          {
            name: "media",
            type: "object",
            required: false,
            text: "A file you uploaded: `{ key, mimeType, fileName }`.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-patch-platform-inbox-conversations-id-lead",
        method: "PATCH",
        path: "/v1/api/platform/inbox/conversations/:id/lead",
        purpose: "Link the thread to an existing lead.",
        params: [
          {
            name: "leadId",
            type: "string",
            required: true,
            text: "The lead to link.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-platform-inbox-conversations-id-read",
        method: "POST",
        path: "/v1/api/platform/inbox/conversations/:id/read",
        purpose: "Mark a thread as read.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-platform-inbox-unread",
        method: "GET",
        path: "/v1/api/platform/inbox/unread",
        purpose: "Unread counts.",
        params: [],
      },
    ],
    code: [
      {
        label: "Unified inbox",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const { data: threads } = await ecod.product.erix.chat.conversations.list({\n  status: "open",\n  limit: 20,\n});\n\nawait ecod.product.erix.chat.messages.send({\n  conversationId: threads[0].id,\n  text: "Thanks! Your quote is on the way.",\n});\n\nawait ecod.product.erix.chat.conversations.linkLead(conversationId, leadId);',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/platform/inbox/conversations/CONVERSATION_ID/messages \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"text":"Thanks! Your quote is on the way."}\'',
          },
        ],
      },
    ],
  },
  {
    id: "send",
    group: "Messaging",
    title: "Direct send",
    eyebrow: "Messaging",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Send one message on a channel without an existing conversation: an OTP, an order update, a reminder. One endpoint per channel, plus a multi-channel fallback. Scoped keys need `connect` or the channel sub-scope (`erix_connect_whatsapp_…`). Bulk sends are Flow campaigns, not this endpoint.",
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-send-whatsapp",
        method: "POST",
        path: "/v1/api/infra/connect/send/whatsapp",
        purpose: "Send one WhatsApp message.",
        params: [
          {
            name: "phone",
            type: "string",
            required: true,
            text: "Recipient with country code.",
          },
          {
            name: "templateName",
            type: "string",
            required: false,
            text: "An approved template. Send this or `text`.",
          },
          {
            name: "language",
            type: "string",
            required: false,
            text: "Template language, e.g. `en`.",
          },
          {
            name: "variables",
            type: "string[]",
            required: false,
            text: "Template variables, in order.",
          },
          {
            name: "text",
            type: "string",
            required: false,
            text: "Free text. Needs an open 24-hour window.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-send-email",
        method: "POST",
        path: "/v1/api/infra/connect/send/email",
        purpose: "Send one email.",
        params: [
          {
            name: "to",
            type: "string",
            required: true,
            text: "Recipient address.",
          },
          {
            name: "subject",
            type: "string",
            required: false,
            text: "Required unless you send `templateId`.",
          },
          {
            name: "html",
            type: "string",
            required: false,
            text: "Email body.",
          },
          {
            name: "templateId",
            type: "string",
            required: false,
            text: "A saved email template.",
          },
          {
            name: "variables",
            type: "object",
            required: false,
            text: "Template variables.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-send-telegram",
        method: "POST",
        path: "/v1/api/infra/connect/send/telegram",
        purpose: "Send one Telegram message.",
        params: [
          {
            name: "chatId",
            type: "string",
            required: true,
            text: "Telegram chat id.",
          },
          {
            name: "text",
            type: "string",
            required: true,
            text: "Message text.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-send",
        method: "POST",
        path: "/v1/api/infra/connect/send",
        purpose: "Try channels in order until one succeeds.",
        params: [
          {
            name: "to",
            type: "string",
            required: true,
            text: "Recipient: phone or email.",
          },
          {
            name: "message",
            type: "string",
            required: false,
            text: "Text. Send this or `template`.",
          },
          {
            name: "template",
            type: "string",
            required: false,
            text: "Template name.",
          },
          {
            name: "channelPreference",
            type: "string[]",
            required: false,
            text: 'Order to try. Default `["whatsapp", "email"]`.',
          },
        ],
      },
    ],
    code: [
      {
        label: "Direct send",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: '// WhatsApp template\nawait ecod.product.erix.chat.messages.sendTemplate({\n  to: "+91XXXXXXXXXX",\n  templateName: "order_update",\n  language: "en",\n  variables: ["Asha", "ORD-1001"],\n});\n\n// Email: no typed method yet, so use the raw request\nawait ecod.request("POST", "/infra/connect/send/email", {\n  to: "customer@example.com",\n  subject: "Your invoice",\n  html: "<p>Thanks for your order.</p>",\n});',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/infra/connect/send/whatsapp \\\n  -H "Authorization: Bearer erix_connect_whatsapp_YOUR_SECRET" \\\n  -H "Idempotency-Key: ORD-1001-update" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"phone":"+91XXXXXXXXXX","templateName":"order_update","language":"en","variables":["Asha","ORD-1001"]}\'',
          },
        ],
      },
    ],
  },
  {
    id: "templates",
    group: "Messaging",
    title: "WhatsApp templates",
    eyebrow: "Messaging",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Templates approved on your WhatsApp Business account. Business-initiated messages outside the 24-hour window must use one.",
      },
      {
        kind: "endpoint",
        id: "ep-get-infra-connect-whatsapp-templates",
        method: "GET",
        path: "/v1/api/infra/connect/whatsapp/templates",
        purpose: "List templates and their approval status.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-whatsapp-templates-sync",
        method: "POST",
        path: "/v1/api/infra/connect/whatsapp/templates/sync",
        purpose: "Pull the latest templates from Meta.",
        params: [],
      },
    ],
    code: [
      {
        label: "WhatsApp templates",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: "const { data: templates } = await ecod.infra.connect.whatsapp.templates.list();\nawait ecod.infra.connect.whatsapp.templates.sync();",
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl https://api.ecodrix.com/v1/api/infra/connect/whatsapp/templates \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "meet",
    group: "Platform",
    title: "Google Meet",
    eyebrow: "Platform",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Book meetings against a lead; online meetings get a Meet link from your connected Google account. Flows can react to the meeting-created and meeting-rescheduled events, for reminders for example.",
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-connect-meet",
        method: "POST",
        path: "/v1/api/infra/connect/meet",
        purpose: "Book a meeting.",
        params: [
          {
            name: "leadId",
            type: "string",
            required: true,
            text: "The lead the meeting is for.",
          },
          {
            name: "participantName",
            type: "string",
            required: true,
            text: "Who you’re meeting.",
          },
          {
            name: "participantPhone",
            type: "string",
            required: true,
            text: "Their phone number.",
          },
          {
            name: "startTime / endTime",
            type: "ISO date",
            required: true,
            text: "When it starts and ends.",
          },
          {
            name: "participantEmails",
            type: "string[]",
            required: false,
            text: "Calendar invitees.",
          },
          {
            name: "meetingMode",
            type: "string",
            required: false,
            text: "`online` (Meet link) or `offline`.",
          },
          {
            name: "type / amount",
            type: "string / number",
            required: false,
            text: "`free` or `paid`, and the fee.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-infra-connect-meet",
        method: "GET",
        path: "/v1/api/infra/connect/meet",
        purpose: "List meetings (filter by `leadId`, `status`).",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-infra-connect-meet-id",
        method: "GET",
        path: "/v1/api/infra/connect/meet/:id",
        purpose: "Get one meeting.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-patch-infra-connect-meet-id",
        method: "PATCH",
        path: "/v1/api/infra/connect/meet/:id",
        purpose: "Reschedule or cancel a meeting.",
        params: [
          {
            name: "startTime / endTime",
            type: "ISO date",
            required: false,
            text: "New time.",
          },
          {
            name: "status",
            type: "string",
            required: false,
            text: "`cancelled` to cancel.",
          },
        ],
      },
    ],
    code: [
      {
        label: "Google Meet",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const meeting = await ecod.infra.connect.meet.create({\n  leadId,\n  participantName: "Asha",\n  participantPhone: "+91XXXXXXXXXX",\n  startTime: "2026-11-02T10:00:00+05:30",\n  endTime: "2026-11-02T10:30:00+05:30",\n  meetingMode: "online",\n});\n\nawait ecod.infra.connect.meet.reschedule(meetingId, { startTime, endTime });\nawait ecod.infra.connect.meet.delete(meetingId); // sets status "cancelled"',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X PATCH https://api.ecodrix.com/v1/api/infra/connect/meet/MEETING_ID \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"status":"cancelled"}\'',
          },
        ],
      },
    ],
  },
  {
    id: "storage",
    group: "Platform",
    title: "Storage and media",
    eyebrow: "Platform",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Files live in your workspace’s own storage, organised by folder. Post small files to `/media`. For large files, get a presigned URL, upload straight to storage, then confirm.",
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-storage-media",
        method: "POST",
        path: "/v1/api/infra/storage/media",
        purpose: "Upload files (multipart). Large images are compressed.",
        params: [
          {
            name: "file",
            type: "file",
            required: true,
            text: "Up to 50 files, 100 MB each.",
          },
          {
            name: "folder",
            type: "string",
            required: false,
            text: "Destination folder.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-infra-storage-media",
        method: "GET",
        path: "/v1/api/infra/storage/media",
        purpose: "List media in a folder (`?folder=`).",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-delete-infra-storage-media",
        method: "DELETE",
        path: "/v1/api/infra/storage/media",
        purpose: "Delete a file by `?key=`.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-storage-files-upload-url",
        method: "POST",
        path: "/v1/api/infra/storage/files/upload-url",
        purpose: "Get a presigned upload URL (plan feature).",
        params: [
          {
            name: "folder",
            type: "string",
            required: true,
            text: "Destination folder.",
          },
          {
            name: "filename",
            type: "string",
            required: true,
            text: "File name with extension.",
          },
          {
            name: "contentType",
            type: "string",
            required: true,
            text: "MIME type, e.g. `application/pdf`.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-storage-files-confirm-upload",
        method: "POST",
        path: "/v1/api/infra/storage/files/confirm-upload",
        purpose: "Confirm a presigned upload; returns the file’s URL and type.",
        params: [
          {
            name: "key",
            type: "string",
            required: true,
            text: "The key returned with the upload URL.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-post-infra-storage-files-download-url",
        method: "POST",
        path: "/v1/api/infra/storage/files/download-url",
        purpose: "Short-lived download URL for a file.",
        params: [
          {
            name: "key",
            type: "string",
            required: true,
            text: "The file’s key.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-infra-storage-files-usage",
        method: "GET",
        path: "/v1/api/infra/storage/files/usage",
        purpose: "Bytes used against your quota.",
        params: [],
      },
    ],
    code: [
      {
        label: "Storage",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: '// Presign, upload straight to storage, and confirm in one call\nconst { data: file } = await ecod.infra.storage.media.upload(buffer, {\n  folder: "invoices",\n  filename: "INV-1001.pdf",\n  contentType: "application/pdf",\n});',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/infra/storage/media \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE" \\\n  -F "folder=documents" -F "file=@./brochure.pdf"',
          },
        ],
      },
    ],
  },
  {
    id: "invoices",
    group: "Platform",
    title: "Invoices and payments (coming soon)",
    eyebrow: "Platform",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Coming soon in the app. GST-ready invoices tied to a lead. Create one, attach a payment link from your connected payment gateway, and send it on WhatsApp or email. When the customer pays, the invoice is marked paid and flows can react.",
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-commerce-invoices",
        method: "POST",
        path: "/v1/api/product/erix/commerce/invoices",
        purpose: "Create an invoice.",
        params: [
          {
            name: "clientName",
            type: "string",
            required: true,
            text: "Who the invoice is for.",
          },
          {
            name: "items",
            type: "object[]",
            required: true,
            text: "Line items: `description`, `quantity`, `rate`.",
          },
          {
            name: "leadId",
            type: "string",
            required: false,
            text: "Link to a lead.",
          },
          {
            name: "currency",
            type: "string",
            required: false,
            text: "3-letter code, e.g. `INR`.",
          },
          {
            name: "taxRate / discount",
            type: "number",
            required: false,
            text: "GST rate in percent, and discount.",
          },
          {
            name: "dueDate",
            type: "ISO date",
            required: false,
            text: "Payment due date.",
          },
          {
            name: "clientGstin / placeOfSupply",
            type: "string",
            required: false,
            text: "15-character GSTIN and 2-digit state code.",
          },
        ],
      },
      {
        kind: "endpoint",
        id: "ep-get-product-erix-commerce-invoices",
        method: "GET",
        path: "/v1/api/product/erix/commerce/invoices",
        purpose: "List invoices (`page`, `limit`, `status`).",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-commerce-invoices-id-payment-link",
        method: "POST",
        path: "/v1/api/product/erix/commerce/invoices/:id/payment-link",
        purpose: "Create a payment link; the invoice moves to “sent”.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-commerce-invoices-id-send-whatsapp",
        method: "POST",
        path: "/v1/api/product/erix/commerce/invoices/:id/send-whatsapp",
        purpose: "Send the invoice on WhatsApp.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-post-product-erix-commerce-invoices-id-send-email",
        method: "POST",
        path: "/v1/api/product/erix/commerce/invoices/:id/send-email",
        purpose: "Send the invoice by email.",
        params: [],
      },
    ],
    code: [
      {
        label: "Invoices",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: 'const { data: invoice } = await ecod.product.erix.invoices.create({\n  clientName: "Asha",\n  leadId,\n  currency: "INR",\n  taxRate: 18,\n  items: [{ description: "Annual plan", quantity: 1, rate: 4999 }],\n});\n\nawait ecod.request("POST", `/product/erix/commerce/invoices/${invoice.id}/payment-link`);\nawait ecod.product.erix.invoices.sendViaWhatsApp(invoice.id);',
          },
          {
            lang: "curl",
            label: "cURL",
            code: 'curl -X POST https://api.ecodrix.com/v1/api/product/erix/commerce/invoices/INVOICE_ID/payment-link \\\n  -H "x-api-key: $ECOD_API_KEY" -H "x-client-code: $ECOD_CLIENT_CODE"',
          },
        ],
      },
    ],
  },
  {
    id: "realtime",
    group: "Platform",
    title: "Realtime",
    eyebrow: "Platform",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "The SDK keeps a socket open to your workspace, so you get changes as they happen instead of polling. After a reconnect, missed events are replayed; a `resync` event means “refetch”. Keep handlers idempotent.",
      },
      {
        kind: "p",
        text: "In a browser, get a 5-minute socket ticket from your server via `POST /v1/api/platform/realtime/ticket` (see proxy mode under [Authentication](#auth)).",
      },
    ],
    code: [
      {
        label: "TypeScript SDK",
        tabs: [
          {
            lang: "text",
            label: "TypeScript SDK",
            code: 'ecod.on("inbox.message", (event) => {\n  // a message arrived or was sent in the unified inbox\n});\n\nprocess.on("SIGTERM", () => ecod.disconnect());',
          },
        ],
      },
    ],
  },
  {
    id: "health",
    group: "Platform",
    title: "Health",
    eyebrow: "Platform",
    ai: false,
    blocks: [
      {
        kind: "p",
        text: "Check the API before a batch job, or watch it from your monitoring.",
      },
      {
        kind: "endpoint",
        id: "ep-get-health",
        method: "GET",
        path: "/v1/api/health",
        purpose: "Machine-readable API status. No key needed.",
        params: [],
      },
      {
        kind: "endpoint",
        id: "ep-get-site-health",
        method: "GET",
        path: "/health",
        purpose: "The public [status page](/status). Send `Accept: application/json` for JSON.",
        params: [],
      },
    ],
    code: [
      {
        label: "Health",
        tabs: [
          {
            lang: "ts",
            label: "TypeScript SDK",
            code: "const status = await ecod.platform.health.system();",
          },
          {
            lang: "curl",
            label: "cURL",
            code: "curl https://api.ecodrix.com/v1/api/health",
          },
        ],
      },
    ],
  },
];

const plain = (text: string) => text.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** What the developer header's search looks through: every section and endpoint. */
export const DOC_SEARCH = DOC_SECTIONS.flatMap((s) => [
  {
    href: `/docs#${s.id}`,
    title: s.title,
    kind: s.group,
    hint: plain(s.blocks.find((b) => b.kind === "p")?.text ?? ""),
  },
  ...s.blocks.flatMap((b) =>
    b.kind === "endpoint" ? [{ href: `/docs#${b.id}`, title: b.path, kind: b.method, hint: plain(b.purpose) }] : [],
  ),
]);
