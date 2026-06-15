export const capabilities = {
  service: "Serphouse",
  authentication: {
    header: "SERPHOUSE_API: <api_key>",
    env: ["SERPHOUSE_API_KEY", "SERPHOUSE_API_TOKEN"],
  },
  endpoints: [
    { tool: "serphouse_domain_list", method: "GET", path: "/domain/list" },
    { tool: "serphouse_language_list", method: "GET", path: "/language/list/{type}" },
    { tool: "serphouse_location_search", method: "GET", path: "/location/search" },
    { tool: "serphouse_account_info", method: "GET", path: "/account/info" },
    { tool: "serphouse_serp_live", method: "POST", path: "/serp/live" },
    { tool: "serphouse_serp_live_get", method: "GET", path: "/serp/live" },
    { tool: "serphouse_serp_schedule", method: "POST", path: "/serp/schedule" },
    { tool: "serphouse_serp_google_advanced", method: "POST", path: "/serp/google_advanced" },
    { tool: "serphouse_serp_google_advanced_scheduled", method: "POST", path: "/serp/google_advanced_scheduled" },
    { tool: "serphouse_task_check", method: "GET", path: "/serp/check" },
    { tool: "serphouse_task_get", method: "GET", path: "/serp/get" },
    { tool: "serphouse_schedule_and_wait", method: "COMPOSITE", path: "/serp/schedule -> /serp/check -> /serp/get" },
    { tool: "serphouse_google_jobs", method: "POST", path: "/google-jobs-api" },
    { tool: "serphouse_google_autocomplete", method: "POST", path: "/google-autocomplete-api" },
    { tool: "serphouse_google_videos", method: "POST", path: "/google-videos-api" },
    { tool: "serphouse_google_short_videos", method: "POST", path: "/google-short-videos-api" },
    { tool: "serphouse_google_forums", method: "POST", path: "/google-forums-api" },
    { tool: "serphouse_google_local", method: "POST", path: "/google-local-api" },
  ],
};

export const LocationSearchExamples = {
  serphouse_location_search: {
    q: "Austin, Texas",
    type: "google",
  },
};
export const Location =
  "Every SERP and Google vertical request must include exactly one location field: loc or loc_id. If the user provides a city/country, pass it as loc (for example Austin,Texas,United States). If you need an exact Serphouse id, call serphouse_location_search first and then pass loc_id. Never omit both fields and never send both fields together.";

export const constraints = {
  authentication: "Tool inputs do not include authentication fields. For HTTP deployments, send SERPHOUSE_API: <api_key> on /mcp. For stdio, configure SERPHOUSE_API_KEY or SERPHOUSE_API_TOKEN in the server environment.",
  location: "Location is mandatory for SERP and Google vertical APIs. Provide exactly one of loc or loc_id. Use loc for a human-readable location string or loc_id from serphouse_location_search for precise targeting.",
  advanced_google: "Google advanced and Google vertical endpoints only support Google domains and require exactly one of loc or loc_id.",
  schedule: "Scheduled endpoints send POST JSON as { data: [tasks] }. Serphouse recommends at most 100 tasks. Callback URLs must use HTTPS and cannot include embedded credentials.",
  live: "Live POST and GET accept q, domain, lang, device, serp_type, exactly one location field, and optional filters.",
  secrets: "Tool results redact api_key, api_token, token, and authorization fields.",
};

export const examples = {
  google_web_with_location_name: {
    tool: "serphouse_serp_live",
    q: "coffee",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    serp_type: "web",
    loc: "Austin,Texas,United States",
    num_result: 10,
  },
  live_serp_with_location_name: {
    tool: "serphouse_serp_live",
    q: "electric vehicles",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    serp_type: "news",
    loc: "New York,New York,United States",
    num_result: 10,
  },
  live_serp_with_location_id: {
    tool: "serphouse_serp_live",
    q: "national parks",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    serp_type: "image",
    loc_id: 2840,
    num_result: 10,
  },
  location_lookup_before_precise_targeting: {
    tool: "serphouse_location_search",
    q: "Austin, Texas",
    type: "google",
  },
  google_videos_with_location_name: {
    tool: "serphouse_google_videos",
    q: "Texas travel",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    loc: "Austin,Texas,United States",
    video_duration: "medium",
  },
};
