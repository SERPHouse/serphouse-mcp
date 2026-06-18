export const guide = {
  auth: "Send SERPHOUSE_API: <api_key> on /mcp (not in tool args).",

  tools: {
    reference: [
      "serphouse_domain_list — valid domains (call before Yahoo)",
      "serphouse_language_list — language codes by engine",
      "serphouse_location_search — resolve loc_id for Google/Bing",
      "serphouse_account_info — balance and usage",
    ],
    google_serp: [
      "serphouse_google_web",
      "serphouse_google_image",
      "serphouse_google_news",
      "serphouse_google_shop",
      "serphouse_serp_google_advanced — SEO rankings, up to ~100 results (max_pages 1–10)",
    ],
    bing_serp: [
      "serphouse_bing_web",
      "serphouse_bing_image",
      "serphouse_bing_news",
    ],
    yahoo_serp: [
      "serphouse_yahoo_web",
      "serphouse_yahoo_image",
      "serphouse_yahoo_news",
    ],
    google_verticals: [
      "serphouse_google_jobs",
      "serphouse_google_autocomplete",
      "serphouse_google_videos",
      "serphouse_google_short_videos",
      "serphouse_google_forums",
      "serphouse_google_local",
    ],
  },

  pick_tool: {
    seo_rankings_or_top100: "serphouse_serp_google_advanced",
    google_web_top10: "serphouse_google_web",
    pattern: "serphouse_{google|bing|yahoo}_{web|image|news|shop}",
    domains_or_langs: "serphouse_domain_list / serphouse_language_list",
    resolve_location: "serphouse_location_search",
  },

  location:
    "Google, Bing, and Google verticals: exactly one of loc or loc_id — never both, never neither. Yahoo: optional.",

  domain: {
    google:
      "google.* matching country — google.com (US), google.co.uk (UK). Use serphouse_domain_list if unsure.",
    bing: "No domain field.",
    yahoo:
      "Regional yahoo.* from serphouse_domain_list only — not yahoo.com. e.g. uk.yahoo.com, fr.yahoo.com, de.yahoo.com.",
  },

  lang: {
    google: "en, fr (short codes)",
    bing: "en-US, fr-FR (locale)",
    yahoo: "lang_en, lang_fr",
  },
};

export const examples = {
  google_web: {
    tool: "serphouse_google_web",
    q: "coffee",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    loc: "Austin,Texas,United States",
  },
  seo_ranking: {
    tool: "serphouse_serp_google_advanced",
    q: "crm software",
    domain: "google.com",
    lang: "en",
    device: "desktop",
    loc: "Austin,Texas,United States",
    max_pages: 10,
  },
  bing_web: {
    tool: "serphouse_bing_web",
    q: "coffee shops",
    lang: "en-US",
    device: "desktop",
    loc: "Austin,Texas,United States",
  },
  yahoo_web: {
    tool: "serphouse_yahoo_web",
    q: "weather forecast",
    domain: "uk.yahoo.com",
    lang: "lang_en",
    device: "desktop",
  },
  location_search: {
    tool: "serphouse_location_search",
    q: "Austin, Texas",
    type: "google",
  },
};
