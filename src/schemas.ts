import * as z from "zod/v4";

const nonEmptyString = z.string().trim().min(1);
const locIdSchema = z.union([
  z.coerce.number().int().positive(),
  nonEmptyString.regex(/^\d+$/),
]);
const pageSchema = z.coerce.number().int().positive();
const bitFlagSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
]);
const secureCallbackUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "Callback URLs must use HTTPS and must not include embedded credentials.");

const locationShape = {
  loc: nonEmptyString
    .describe(
      "Required unless loc_id is provided. Location name, for example Austin,Texas,United States. Provide exactly one of loc or loc_id.",
    )
    .optional(),
  loc_id: locIdSchema
    .describe(
      "Required unless loc is provided. Serphouse location id from serphouse_location_search. Provide exactly one of loc_id or loc.",
    )
    .optional(),
};

const commonSerpShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: nonEmptyString
    .default("google.com")
    .describe(
      "Search engine domain, for example google.com, bing.com, or yahoo.com.",
    ),
  lang: nonEmptyString
    .default("en")
    .describe("Language code, for example en or fr."),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  serp_type: z.enum(["web", "news", "image", "shop"]).default("web"),
  ...locationShape,
  verbatim: bitFlagSchema
    .optional()
    .describe("Google verbatim search flag, 0 or 1."),
  gfilter: bitFlagSchema
    .optional()
    .describe("Google omitted/similar results filter flag, 0 or 1."),
  page: pageSchema.optional(),
  num_result: z.coerce.number().int().min(1).max(10).optional(),
  date_range: nonEmptyString
    .optional()
    .describe("Date range as YYYY-MM-DD,YYYY-MM-DD or one of h, d, w, m, y."),
};

const scheduleExtrasShape = {
  postback_url: secureCallbackUrlSchema.optional(),
  pingback_url: secureCallbackUrlSchema.optional(),
};

const googleDomainSchema = nonEmptyString.refine(
  (domain) => domain.toLowerCase().startsWith("google."),
  "This endpoint only supports Google domains, for example google.com.",
);

const googleBaseShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: googleDomainSchema.default("google.com"),
  lang: nonEmptyString.default("en"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  ...locationShape,
  date_range: nonEmptyString
    .optional()
    .describe("Date range as YYYY-MM-DD,YYYY-MM-DD or one of h, d, w, m, y."),
  page: pageSchema.optional(),
};

const videoFilterShape = {
  video_quality: z.literal("high").optional(),
  video_captions: z.literal("captioned").optional(),
};

const noTraceSchema = z
  .union([
    z.literal(0),
    z.literal(1),
    z.literal("0"),
    z.literal("1"),
    z.literal("true"),
    z.literal("false"),
    z.literal(true),
    z.literal(false),
  ])
  .optional()
  .describe(
    "Enterprise only. Enables NoTrace mode when set to 1 or true.",
  );

const yahooDomainSchema = nonEmptyString.refine(
  (domain) => domain.toLowerCase().includes("yahoo"),
  "Use a supported regional Yahoo domain from serphouse_domain_list, for example uk.yahoo.com or de.yahoo.com. yahoo.com is not supported.",
);

const googleWebSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: googleDomainSchema.default("google.com"),
  lang: nonEmptyString.default("en"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  ...locationShape,
  page: pageSchema.optional(),
  date_range: nonEmptyString
    .optional()
    .describe("Date range as YYYY-MM-DD,YYYY-MM-DD or one of h, d, w, m, y."),
  verbatim: bitFlagSchema.optional(),
  gfilter: bitFlagSchema.optional(),
  num_result: z.coerce.number().int().min(1).max(10).optional(),
  no_trace: noTraceSchema,
};

const googleImageSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: googleDomainSchema.default("google.com"),
  lang: nonEmptyString.default("en"),
  ...locationShape,
  page: pageSchema.optional(),
  date_range: nonEmptyString.optional(),
  no_trace: noTraceSchema,
};

const googleNewsSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: googleDomainSchema.default("google.com"),
  lang: nonEmptyString.default("en"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  ...locationShape,
  page: pageSchema.optional(),
  date_range: nonEmptyString.optional(),
  no_trace: noTraceSchema,
};

const googleShopSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: googleDomainSchema.default("google.com"),
  lang: nonEmptyString.default("en"),
  ...locationShape,
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

const bingWebSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  lang: nonEmptyString
    .default("en-US")
    .describe("Language code, for example en-US or fr-FR."),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  ...locationShape,
  page: pageSchema.optional(),
  date_range: nonEmptyString.optional(),
  no_trace: noTraceSchema,
};

const bingImageSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  lang: nonEmptyString.default("en-US"),
  ...locationShape,
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

const bingNewsSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  lang: nonEmptyString.default("en-US"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  ...locationShape,
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

const yahooWebSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: yahooDomainSchema
    .default("uk.yahoo.com")
    .describe(
      "Regional Yahoo domain from serphouse_domain_list, for example uk.yahoo.com or fr.yahoo.com. Do not use yahoo.com.",
    ),
  lang: nonEmptyString
    .default("lang_en")
    .describe("Yahoo language code, for example lang_en or lang_fr."),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

const yahooImageSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: yahooDomainSchema
    .default("uk.yahoo.com")
    .describe(
      "Regional Yahoo domain from serphouse_domain_list, for example uk.yahoo.com or fr.yahoo.com. Do not use yahoo.com.",
    ),
  lang: nonEmptyString.default("lang_en"),
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

const yahooNewsSearchShape = {
  q: nonEmptyString.describe("Search phrase to query."),
  domain: yahooDomainSchema
    .default("uk.yahoo.com")
    .describe(
      "Regional Yahoo domain from serphouse_domain_list, for example uk.yahoo.com or fr.yahoo.com. Do not use yahoo.com.",
    ),
  lang: nonEmptyString.default("lang_en"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  page: pageSchema.optional(),
  no_trace: noTraceSchema,
};

export const emptyInputSchema = z.object({});

export const languageListInputSchema = z.object({
  type: z
    .enum(["google", "bing", "yahoo"])
    .describe("Search engine language catalog to fetch."),
});

export const locationSearchInputSchema = z.object({
  q: nonEmptyString.describe(
    "Location search term, for example texas or london.",
  ),
  type: z.enum(["google", "bing"]).default("google"),
});

export const idInputSchema = z.object({
  id: z
    .union([nonEmptyString, z.coerce.number().int().positive()])
    .describe("Serphouse task id."),
});

export const serpLiveInputSchema = z
  .object({ ...commonSerpShape })
  .superRefine(requireExactlyOneLocation);

export const scheduleSerpTaskSchema = z
  .object({
    ...commonSerpShape,
    ...scheduleExtrasShape,
  })
  .superRefine(requireExactlyOneLocation);

export const scheduleSerpInputSchema = z.object({
  tasks: z
    .array(scheduleSerpTaskSchema)
    .min(1)
    .max(100)
    .describe("Tasks to schedule. Serphouse recommends up to 100 tasks."),
});

export const googleAdvancedInputSchema = z
  .object({
    ...googleBaseShape,
    serp_type: z
      .enum(["web", "news", "image", "shop"])
      .default("web")
      .optional(),
    verbatim: bitFlagSchema.optional(),
    gfilter: bitFlagSchema.optional(),
    max_pages: z.coerce.number().int().min(1).max(10).default(10),
  })
  .superRefine(requireExactlyOneLocation);

export const googleAdvancedScheduledTaskSchema = z
  .object({
    ...googleBaseShape,
    ...scheduleExtrasShape,
    verbatim: bitFlagSchema.optional(),
    gfilter: bitFlagSchema.optional(),
    max_pages: z.coerce.number().int().min(1).max(10).default(10),
  })
  .superRefine(requireExactlyOneLocation);

export const googleAdvancedScheduledInputSchema = z.object({
  tasks: z
    .array(googleAdvancedScheduledTaskSchema)
    .min(1)
    .max(100)
    .describe("Google advanced tasks to schedule."),
});

export const scheduleAndWaitInputSchema = z.object({
  task: scheduleSerpTaskSchema,
  poll_interval_ms: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(60_000)
    .default(5_000),
  max_wait_ms: z.coerce.number().int().min(1_000).max(600_000).default(120_000),
});

export const googleJobsInputSchema = z
  .object({
    q: nonEmptyString,
    domain: googleDomainSchema.default("google.com"),
    lang: nonEmptyString.default("en"),
    ...locationShape,
    date_range: nonEmptyString.optional(),
  })
  .superRefine(requireExactlyOneLocation);

export const googleAutocompleteInputSchema = z.object({
  q: nonEmptyString,
  lang: nonEmptyString.default("en"),
  loc: nonEmptyString.describe("Location name used to localize suggestions."),
  client: z
    .enum([
      "chrome",
      "chrome-omni",
      "home_page",
      "safari",
      "firefox",
      "youtube",
    ])
    .default("chrome")
    .optional(),
});

export const googleVideosInputSchema = z
  .object({
    ...googleBaseShape,
    video_duration: z.enum(["short", "medium", "long"]).optional(),
    ...videoFilterShape,
  })
  .superRefine(requireExactlyOneLocation);

export const googleShortVideosInputSchema = z
  .object({
    ...googleBaseShape,
    ...videoFilterShape,
  })
  .superRefine(requireExactlyOneLocation);

export const googleForumsInputSchema = z
  .object({
    ...googleBaseShape,
    verbatim: bitFlagSchema.optional(),
  })
  .superRefine(requireExactlyOneLocation);

export const googleLocalInputSchema = z
  .object({
    q: nonEmptyString,
    domain: googleDomainSchema.default("google.com"),
    lang: nonEmptyString.default("en"),
    ...locationShape,
    page: pageSchema.optional(),
  })
  .superRefine(requireExactlyOneLocation);

export const googleWebSearchInputSchema = z
  .object(googleWebSearchShape)
  .superRefine(requireExactlyOneLocation);

export const googleImageSearchInputSchema = z
  .object(googleImageSearchShape)
  .superRefine(requireExactlyOneLocation);

export const googleNewsSearchInputSchema = z
  .object(googleNewsSearchShape)
  .superRefine(requireExactlyOneLocation);

export const googleShopSearchInputSchema = z
  .object(googleShopSearchShape)
  .superRefine(requireExactlyOneLocation);

export const bingWebSearchInputSchema = z
  .object(bingWebSearchShape)
  .superRefine(requireExactlyOneLocation);

export const bingImageSearchInputSchema = z
  .object(bingImageSearchShape)
  .superRefine(requireExactlyOneLocation);

export const bingNewsSearchInputSchema = z
  .object(bingNewsSearchShape)
  .superRefine(requireExactlyOneLocation);

export const yahooWebSearchInputSchema = z.object(yahooWebSearchShape);

export const yahooImageSearchInputSchema = z.object(yahooImageSearchShape);

export const yahooNewsSearchInputSchema = z.object(yahooNewsSearchShape);

function requireExactlyOneLocation(
  value: { loc?: string; loc_id?: string | number },
  ctx: z.RefinementCtx,
): void {
  const hasLoc = typeof value.loc === "string" && value.loc.trim().length > 0;
  const hasLocId = value.loc_id !== undefined && value.loc_id !== "";

  if (hasLoc === hasLocId) {
    ctx.addIssue({
      code: "custom",
      message:
        "Location is required. Provide exactly one of loc or loc_id. Use serphouse_location_search first if you need a loc_id.",
      path: ["loc"],
    });
  }
}
