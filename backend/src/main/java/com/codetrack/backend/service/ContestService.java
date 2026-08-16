package com.codetrack.backend.service;

import com.codetrack.backend.dto.ContestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ContestService {

    @Value("${clist.username}")
    private String clistUsername;

    @Value("${clist.api-key}")
    private String clistApiKey;

    private final HttpClient http =
            HttpClient.newBuilder()
                    .followRedirects(
                            HttpClient.Redirect.NORMAL
                    )
                    .build();

    private final ObjectMapper mapper =
            new ObjectMapper();


    // ============================================================
    // CACHE
    // ============================================================

    private final Map<String, CachedMonth> cache =
            new ConcurrentHashMap<>();

    private static final long TTL_MS =
            5 * 60 * 1000L;


    // ============================================================
    // POPULAR PLATFORMS
    // ============================================================

    private static final Set<String> POPULAR_PLATFORMS =
            Set.of(
                    "leetcode",
                    "codechef",
                    "atcoder",
                    "hackerrank",
                    "hackerearth",
                    "geeksforgeeks",
                    "codingninjas",
                    "toph",
                    "codewars",
                    "codingame"
            );


    // ============================================================
    // PUBLIC METHOD
    // ============================================================

    public List<ContestDTO> getContestsForMonth(
            int year,
            int month
    ) {

        String cacheKey =
                year + "-" +
                        String.format("%02d", month);

        long now =
                System.currentTimeMillis();


        // --------------------------------------------------------
        // CACHE
        // --------------------------------------------------------

        CachedMonth cached =
                cache.get(cacheKey);

        if (cached != null
                && now < cached.expiry()) {

            System.out.println(
                    "[ContestService] Returning cached contests for "
                            + cacheKey
            );

            return cached.contests();
        }


        // --------------------------------------------------------
        // MONTH BOUNDARIES
        // --------------------------------------------------------

        YearMonth yearMonth =
                YearMonth.of(
                        year,
                        month
                );

        Instant monthStart =
                yearMonth
                        .atDay(1)
                        .atStartOfDay(
                                ZoneOffset.UTC
                        )
                        .toInstant();

        Instant monthEnd =
                yearMonth
                        .plusMonths(1)
                        .atDay(1)
                        .atStartOfDay(
                                ZoneOffset.UTC
                        )
                        .toInstant();


        System.out.println(
                "================================================"
        );

        System.out.println(
                "[ContestService] Loading contests for "
                        + cacheKey
        );

        System.out.println(
                "Month start: " + monthStart
        );

        System.out.println(
                "Month end:   " + monthEnd
        );

        System.out.println(
                "================================================"
        );


        List<ContestDTO> contests =
                new ArrayList<>();


        // ========================================================
        // 1. CODEFORCES DIRECT API
        // ========================================================

        contests.addAll(
                fetchFromCodeforces(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 2. CLIST
        //
        // IMPORTANT:
        //
        // CLIST IS NOT REMOVED.
        //
        // This guarantees that contests already appearing in
        // August from CLIST continue to be available.
        // ========================================================

        contests.addAll(
                fetchFromClist(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 3. LEETCODE DIRECT
        // ========================================================

        contests.addAll(
                fetchFromLeetCode(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 4. CODECHEF DIRECT
        // ========================================================

        contests.addAll(
                fetchFromCodeChef(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 5. ATCODER DIRECT
        // ========================================================

        contests.addAll(
                fetchFromAtCoder(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 6. HACKERRANK DIRECT
        // ========================================================

        contests.addAll(
                fetchFromHackerRank(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 7. HACKEREARTH DIRECT
        // ========================================================

        contests.addAll(
                fetchFromHackerEarth(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // 8. GEEKSFORGEEKS DIRECT
        // ========================================================

        contests.addAll(
                fetchFromGeeksForGeeks(
                        monthStart,
                        monthEnd
                )
        );


        // ========================================================
        // REMOVE DUPLICATES
        // ========================================================

        List<ContestDTO> finalContests =
                deduplicateContests(
                        contests
                );


        // ========================================================
        // SORT
        // ========================================================

        finalContests =
                finalContests
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        ContestDTO::getStartTime
                                )
                        )
                        .toList();


        // ========================================================
        // CACHE
        // ========================================================

        cache.put(
                cacheKey,
                new CachedMonth(
                        finalContests,
                        now + TTL_MS
                )
        );


        System.out.println(
                "================================================"
        );

        System.out.println(
                "[ContestService] Total contests loaded for "
                        + cacheKey
                        + ": "
                        + finalContests.size()
        );

        System.out.println(
                "================================================"
        );


        return finalContests;
    }


    // ============================================================
    // CODEFORCES
    // ============================================================

    private List<ContestDTO> fetchFromCodeforces(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();

        try {

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            "https://codeforces.com/api/contest.list"
                                    )
                            )
                            .header(
                                    "User-Agent",
                                    "CodeTrack Contest Calendar"
                            )
                            .GET()
                            .build();


            HttpResponse<String> response =
                    http.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                System.err.println(
                        "[Codeforces] HTTP error: "
                                + response.statusCode()
                );

                return result;
            }


            JsonNode root =
                    mapper.readTree(
                            response.body()
                    );


            if (!"OK".equals(
                    root.path("status").asText()
            )) {

                return result;
            }


            for (JsonNode contest :
                    root.path("result")) {

                String phase =
                        contest
                                .path("phase")
                                .asText();


                if (!"BEFORE".equals(phase)
                        && !"CODING".equals(phase)) {

                    continue;
                }


                long startSeconds =
                        contest
                                .path("startTimeSeconds")
                                .asLong();


                long durationSeconds =
                        contest
                                .path("durationSeconds")
                                .asLong();


                Instant start =
                        Instant.ofEpochSecond(
                                startSeconds
                        );

                Instant end =
                        start.plusSeconds(
                                durationSeconds
                        );


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                int id =
                        contest
                                .path("id")
                                .asInt();


                String name =
                        contest
                                .path("name")
                                .asText();


                result.add(
                        new ContestDTO(
                                "cf-" + id,
                                name,
                                "Codeforces",
                                start.toString(),
                                end.toString(),
                                "https://codeforces.com/contest/"
                                        + id,
                                durationSeconds
                        )
                );
            }


            System.out.println(
                    "[Codeforces] Contests found: "
                            + result.size()
            );

        } catch (Exception e) {

            System.err.println(
                    "[Codeforces] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // CLIST
    // ============================================================

    private List<ContestDTO> fetchFromClist(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();

        try {

            String start =
                    monthStart.toString();

            String end =
                    monthEnd.toString();


            int limit = 200;

            int offset = 0;

            boolean morePages = true;


            Map<String, Integer> platformCounts =
                    new HashMap<>();


            while (morePages) {

                String url =
                        "https://clist.by/api/v4/contest/"
                                + "?start__gte=" + start
                                + "&start__lt=" + end
                                + "&order_by=start"
                                + "&limit=" + limit
                                + "&offset=" + offset
                                + "&format=json";


                System.out.println(
                        "[CLIST] Request:"
                );

                System.out.println(url);


                HttpRequest request =
                        HttpRequest.newBuilder()
                                .uri(
                                        URI.create(url)
                                )
                                .header(
                                        "Authorization",
                                        "ApiKey "
                                                + clistUsername
                                                + ":"
                                                + clistApiKey
                                )
                                .header(
                                        "User-Agent",
                                        "CodeTrack Contest Calendar"
                                )
                                .GET()
                                .build();


                HttpResponse<String> response =
                        http.send(
                                request,
                                HttpResponse.BodyHandlers.ofString()
                        );


                System.out.println(
                        "[CLIST] HTTP status: "
                                + response.statusCode()
                );


                if (response.statusCode() < 200
                        || response.statusCode() >= 300) {

                    System.err.println(
                            "[CLIST] HTTP error: "
                                    + response.statusCode()
                    );

                    System.err.println(
                            response.body()
                    );

                    break;
                }


                JsonNode root =
                        mapper.readTree(
                                response.body()
                        );


                JsonNode objects =
                        root.path("objects");


                int pageSize =
                        objects.size();


                if (pageSize == 0) {
                    break;
                }


                System.out.println(
                        "[CLIST] Page returned: "
                                + pageSize
                                + " contests"
                );


                for (JsonNode contest :
                        objects) {

                    ContestDTO dto =
                            parseClistContest(
                                    contest,
                                    platformCounts
                            );

                    if (dto != null) {
                        result.add(dto);
                    }
                }


                if (pageSize < limit) {

                    morePages = false;

                } else {

                    offset += limit;
                }
            }


            System.out.println(
                    "[CLIST] Popular contests parsed: "
                            + result.size()
            );


            System.out.println(
                    "[CLIST] Platforms found: "
                            + platformCounts.keySet()
            );


        } catch (Exception e) {

            System.err.println(
                    "[CLIST ERROR] "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // PARSE CLIST
    // ============================================================

    private ContestDTO parseClistContest(
            JsonNode contest,
            Map<String, Integer> platformCounts
    ) {

        String resource =
                contest
                        .path("resource")
                        .asText();


        if (resource == null
                || resource.isBlank()) {

            return null;
        }


        String normalizedResource =
                normalizePlatform(
                        resource
                );


        if (!POPULAR_PLATFORMS.contains(
                normalizedResource
        )) {

            return null;
        }


        String title =
                contest
                        .path("event")
                        .asText();


        if (title == null
                || title.isBlank()) {

            return null;
        }


        /*
         * Remove non-English AtCoder contests.
         */

        if ("atcoder".equals(
                normalizedResource
        )
                && containsNonEnglishCharacters(title)) {

            System.out.println(
                    "[CLIST] Skipping non-English AtCoder: "
                            + title
            );

            return null;
        }


        String startIso =
                normalizeDateTime(
                        contest
                                .path("start")
                                .asText()
                );


        if (startIso == null
                || startIso.isBlank()) {

            return null;
        }


        String endIso =
                normalizeDateTime(
                        contest
                                .path("end")
                                .asText()
                );


        String href =
                contest
                        .path("href")
                        .asText();


        long durationSeconds =
                contest
                        .path("duration")
                        .asLong();


        String platform =
                friendlyPlatformName(
                        normalizedResource
                );


        platformCounts.merge(
                normalizedResource,
                1,
                Integer::sum
        );


        String id =
                "clist-"
                        + contest
                        .path("id")
                        .asText();


        return new ContestDTO(
                id,
                title,
                platform,
                startIso,
                endIso,
                href,
                durationSeconds
        );
    }


    // ============================================================
    // LEETCODE DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromLeetCode(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String query =
                    """
                    {
                      "query": "query { allContests { title titleSlug startTime duration } }"
                    }
                    """;


            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            "https://leetcode.com/graphql"
                                    )
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "User-Agent",
                                    "CodeTrack Contest Calendar"
                            )
                            .header(
                                    "Referer",
                                    "https://leetcode.com/contest/"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(query)
                            )
                            .build();


            HttpResponse<String> response =
                    http.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                System.err.println(
                        "[LeetCode] HTTP error: "
                                + response.statusCode()
                );

                return result;
            }


            JsonNode root =
                    mapper.readTree(
                            response.body()
                    );


            JsonNode contests =
                    root
                            .path("data")
                            .path("allContests");


            for (JsonNode contest :
                    contests) {

                long startSeconds =
                        contest
                                .path("startTime")
                                .asLong();


                long durationSeconds =
                        contest
                                .path("duration")
                                .asLong();


                if (startSeconds <= 0) {
                    continue;
                }


                Instant start =
                        Instant.ofEpochSecond(
                                startSeconds
                        );

                Instant end =
                        start.plusSeconds(
                                durationSeconds
                        );


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                String title =
                        contest
                                .path("title")
                                .asText();


                String slug =
                        contest
                                .path("titleSlug")
                                .asText();


                result.add(
                        new ContestDTO(
                                "lc-" + slug,
                                title,
                                "LeetCode",
                                start.toString(),
                                end.toString(),
                                "https://leetcode.com/contest/"
                                        + slug,
                                durationSeconds
                        )
                );
            }


            System.out.println(
                    "[LeetCode] Contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[LeetCode] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // CODECHEF DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromCodeChef(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String url =
                    "https://www.codechef.com/api/list/contests/all";


            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(url)
                            )
                            .header(
                                    "User-Agent",
                                    "CodeTrack Contest Calendar"
                            )
                            .GET()
                            .build();


            HttpResponse<String> response =
                    http.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                System.err.println(
                        "[CodeChef] HTTP error: "
                                + response.statusCode()
                );

                return result;
            }


            JsonNode root =
                    mapper.readTree(
                            response.body()
                    );


            /*
             * CodeChef normally exposes future/present contests.
             */

            parseCodeChefArray(
                    root.path("future_contests"),
                    monthStart,
                    monthEnd,
                    result
            );

            parseCodeChefArray(
                    root.path("present_contests"),
                    monthStart,
                    monthEnd,
                    result
            );


            System.out.println(
                    "[CodeChef] Contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[CodeChef] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    private void parseCodeChefArray(
            JsonNode contests,
            Instant monthStart,
            Instant monthEnd,
            List<ContestDTO> result
    ) {

        if (!contests.isArray()) {
            return;
        }


        for (JsonNode contest :
                contests) {

            try {

                String code =
                        firstText(
                                contest,
                                "contest_code",
                                "code",
                                "contestCode"
                        );


                String name =
                        firstText(
                                contest,
                                "contest_name",
                                "name",
                                "contestName"
                        );


                String startRaw =
                        firstText(
                                contest,
                                "contest_start_date",
                                "start_date",
                                "startDate"
                        );


                String endRaw =
                        firstText(
                                contest,
                                "contest_end_date",
                                "end_date",
                                "endDate"
                        );


                if (name == null
                        || startRaw == null) {

                    continue;
                }


                Instant start =
                        parseFlexibleDate(
                                startRaw
                        );


                Instant end =
                        endRaw == null
                                ? start.plusSeconds(
                                2 * 60 * 60
                        )
                                : parseFlexibleDate(
                                endRaw
                        );


                if (start == null
                        || end == null) {

                    continue;
                }


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                String id =
                        code == null
                                ? Integer.toHexString(
                                name.hashCode()
                        )
                                : code;


                long duration =
                        Math.max(
                                0,
                                end.getEpochSecond()
                                        - start.getEpochSecond()
                        );


                result.add(
                        new ContestDTO(
                                "cc-" + id,
                                name,
                                "CodeChef",
                                start.toString(),
                                end.toString(),
                                "https://www.codechef.com/"
                                        + id,
                                duration
                        )
                );

            } catch (Exception ignored) {
                // Skip malformed contest
            }
        }
    }


    // ============================================================
    // ATCODER DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromAtCoder(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String html =
                    fetchText(
                            "https://atcoder.jp/contests/"
                    );


            if (html == null
                    || html.isBlank()) {

                return result;
            }


            /*
             * AtCoder contest table rows contain:
             *
             * <a href="/contests/abc471">
             * Contest Name
             * </a>
             *
             * We locate contest links and then obtain the
             * corresponding row.
             */

            Pattern rowPattern =
                    Pattern.compile(
                            "<tr[^>]*>(.*?)</tr>",
                            Pattern.CASE_INSENSITIVE
                                    | Pattern.DOTALL
                    );


            Matcher rowMatcher =
                    rowPattern.matcher(html);


            while (rowMatcher.find()) {

                String row =
                        rowMatcher.group(1);


                if (!row.contains("/contests/")) {
                    continue;
                }


                Pattern linkPattern =
                        Pattern.compile(
                                "href=\"(/contests/([^\"]+))\"[^>]*>(.*?)</a>",
                                Pattern.CASE_INSENSITIVE
                                        | Pattern.DOTALL
                        );


                Matcher linkMatcher =
                        linkPattern.matcher(row);


                if (!linkMatcher.find()) {
                    continue;
                }


                String slug =
                        linkMatcher.group(2);


                String title =
                        stripHtml(
                                linkMatcher.group(3)
                        );


                if (containsNonEnglishCharacters(
                        title
                )) {

                    System.out.println(
                            "[AtCoder] Skipping non-English: "
                                    + title
                    );

                    continue;
                }


                /*
                 * Find datetime in the row.
                 */

                Pattern datePattern =
                        Pattern.compile(
                                "(\\d{4}-\\d{2}-\\d{2}\\s+"
                                        + "\\d{2}:\\d{2}:\\d{2})"
                                        + "\\+0900"
                        );


                Matcher dateMatcher =
                        datePattern.matcher(row);


                if (!dateMatcher.find()) {
                    continue;
                }


                String rawDate =
                        dateMatcher.group(1)
                                + "+0900";


                Instant start =
                        Instant.parse(
                                rawDate
                                        .replace(
                                                " ",
                                                "T"
                                        )
                        );


                /*
                 * Find duration HH:MM
                 */

                Pattern durationPattern =
                        Pattern.compile(
                                "(\\d{1,2}):(\\d{2})"
                        );


                Matcher durationMatcher =
                        durationPattern.matcher(row);


                long durationSeconds =
                        2 * 60 * 60;


                if (durationMatcher.find()) {

                    long hours =
                            Long.parseLong(
                                    durationMatcher.group(1)
                            );

                    long minutes =
                            Long.parseLong(
                                    durationMatcher.group(2)
                            );

                    durationSeconds =
                            hours * 3600
                                    + minutes * 60;
                }


                Instant end =
                        start.plusSeconds(
                                durationSeconds
                        );


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                result.add(
                        new ContestDTO(
                                "ac-" + slug,
                                title,
                                "AtCoder",
                                start.toString(),
                                end.toString(),
                                "https://atcoder.jp/contests/"
                                        + slug,
                                durationSeconds
                        )
                );
            }


            System.out.println(
                    "[AtCoder] Direct contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[AtCoder] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // HACKERRANK DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromHackerRank(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String html =
                    fetchText(
                            "https://www.hackerrank.com/contests"
                    );


            if (html == null) {
                return result;
            }


            /*
             * HackerRank contest pages are dynamically generated.
             *
             * We therefore scan the HTML for contest URLs and
             * nearby JSON metadata when available.
             */

            Pattern pattern =
                    Pattern.compile(
                            "\"(?:slug|contest_slug)\"\\s*:\\s*\"([^\"]+)\"",
                            Pattern.CASE_INSENSITIVE
                    );


            Matcher matcher =
                    pattern.matcher(html);


            Set<String> slugs =
                    new HashSet<>();


            while (matcher.find()) {

                slugs.add(
                        matcher.group(1)
                );
            }


            /*
             * Also detect normal contest URLs.
             */

            Pattern urlPattern =
                    Pattern.compile(
                            "/contests/([a-zA-Z0-9_-]+)",
                            Pattern.CASE_INSENSITIVE
                    );


            Matcher urlMatcher =
                    urlPattern.matcher(html);


            while (urlMatcher.find()) {

                slugs.add(
                        urlMatcher.group(1)
                );
            }


            /*
             * We only create a contest when date metadata is
             * actually available. This prevents fake calendar
             * entries.
             */

            Pattern jsonContestPattern =
                    Pattern.compile(
                            "\"name\"\\s*:\\s*\"([^\"]+)\""
                                    + ".*?"
                                    + "\"start(?:_time|Time)?\"\\s*:\\s*"
                                    + "\"([^\"]+)\""
                                    + ".*?"
                                    + "\"(?:end_time|endTime)\"\\s*:\\s*"
                                    + "\"([^\"]+)\"",
                            Pattern.CASE_INSENSITIVE
                                    | Pattern.DOTALL
                    );


            Matcher contestMatcher =
                    jsonContestPattern.matcher(html);


            while (contestMatcher.find()) {

                String title =
                        decodeHtml(
                                contestMatcher.group(1)
                        );

                Instant start =
                        parseFlexibleDate(
                                contestMatcher.group(2)
                        );

                Instant end =
                        parseFlexibleDate(
                                contestMatcher.group(3)
                        );


                if (start == null
                        || end == null) {

                    continue;
                }


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                String slug =
                        Integer.toHexString(
                                title.hashCode()
                        );


                result.add(
                        new ContestDTO(
                                "hr-" + slug,
                                title,
                                "HackerRank",
                                start.toString(),
                                end.toString(),
                                "https://www.hackerrank.com/contests",
                                Math.max(
                                        0,
                                        end.getEpochSecond()
                                                - start.getEpochSecond()
                                )
                        )
                );
            }


            System.out.println(
                    "[HackerRank] Direct contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[HackerRank] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // HACKEREARTH DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromHackerEarth(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String html =
                    fetchText(
                            "https://www.hackerearth.com/challenges/"
                    );


            if (html == null) {
                return result;
            }


            /*
             * Look for challenge/contest URLs.
             */

            Pattern pattern =
                    Pattern.compile(
                            "href=[\"']([^\"']*/challenge[^\"']*)[\"']",
                            Pattern.CASE_INSENSITIVE
                    );


            Matcher matcher =
                    pattern.matcher(html);


            Set<String> urls =
                    new HashSet<>();


            while (matcher.find()) {

                urls.add(
                        matcher.group(1)
                );
            }


            /*
             * Date extraction from embedded page data.
             */

            Pattern datePattern =
                    Pattern.compile(
                            "\"(?:start_time|startTime|start)\""
                                    + "\\s*:\\s*"
                                    + "\"([^\"]+)\""
                                    + ".*?"
                                    + "\"(?:end_time|endTime|end)\""
                                    + "\\s*:\\s*"
                                    + "\"([^\"]+)\"",
                            Pattern.CASE_INSENSITIVE
                                    | Pattern.DOTALL
                    );


            Matcher dateMatcher =
                    datePattern.matcher(html);


            while (dateMatcher.find()) {

                Instant start =
                        parseFlexibleDate(
                                dateMatcher.group(1)
                        );

                Instant end =
                        parseFlexibleDate(
                                dateMatcher.group(2)
                        );


                if (start == null
                        || end == null) {

                    continue;
                }


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                String id =
                        Integer.toHexString(
                                (
                                        dateMatcher
                                                .group(1)
                                                + dateMatcher
                                                .group(2)
                                ).hashCode()
                        );


                String href =
                        urls.isEmpty()
                                ? "https://www.hackerearth.com/challenges/"
                                : urls.iterator().next();


                result.add(
                        new ContestDTO(
                                "he-" + id,
                                "HackerEarth Contest",
                                "HackerEarth",
                                start.toString(),
                                end.toString(),
                                href,
                                Math.max(
                                        0,
                                        end.getEpochSecond()
                                                - start.getEpochSecond()
                                )
                        )
                );
            }


            System.out.println(
                    "[HackerEarth] Direct contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[HackerEarth] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // GEEKSFORGEEKS DIRECT
    // ============================================================

    private List<ContestDTO> fetchFromGeeksForGeeks(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        try {

            String html =
                    fetchText(
                            "https://www.geeksforgeeks.org/contests/"
                    );


            if (html == null) {

                /*
                 * GFG currently has contest/event pages rather
                 * than a stable public contest API.
                 *
                 * CLIST therefore remains an important fallback.
                 */

                return result;
            }


            Pattern pattern =
                    Pattern.compile(
                            "href=[\"']([^\"']*contest[^\"']*)[\"']",
                            Pattern.CASE_INSENSITIVE
                    );


            Matcher matcher =
                    pattern.matcher(html);


            Set<String> urls =
                    new HashSet<>();


            while (matcher.find()) {

                urls.add(
                        matcher.group(1)
                );
            }


            /*
             * Look for ISO timestamps.
             */

            Pattern datePattern =
                    Pattern.compile(
                            "(20\\d{2}-\\d{2}-\\d{2}"
                                    + "[T ]"
                                    + "\\d{2}:\\d{2}:\\d{2}"
                                    + "(?:\\.\\d+)?"
                                    + "(?:Z|[+-]\\d{2}:?\\d{2})?)",
                            Pattern.CASE_INSENSITIVE
                    );


            Matcher dateMatcher =
                    datePattern.matcher(html);


            List<Instant> dates =
                    new ArrayList<>();


            while (dateMatcher.find()) {

                Instant date =
                        parseFlexibleDate(
                                dateMatcher.group(1)
                        );

                if (date != null) {

                    dates.add(date);
                }
            }


            /*
             * Pair dates where possible.
             */

            for (int i = 0;
                 i + 1 < dates.size();
                 i += 2) {

                Instant start =
                        dates.get(i);

                Instant end =
                        dates.get(i + 1);


                if (end.isBefore(start)) {
                    continue;
                }


                if (end.isBefore(monthStart)
                        || !start.isBefore(monthEnd)) {

                    continue;
                }


                String href =
                        urls.isEmpty()
                                ? "https://www.geeksforgeeks.org/contests/"
                                : urls.iterator().next();


                String id =
                        Integer.toHexString(
                                (
                                        start.toString()
                                                + end.toString()
                                ).hashCode()
                        );


                result.add(
                        new ContestDTO(
                                "gfg-" + id,
                                "GeeksforGeeks Contest",
                                "GeeksforGeeks",
                                start.toString(),
                                end.toString(),
                                href,
                                Math.max(
                                        0,
                                        end.getEpochSecond()
                                                - start.getEpochSecond()
                                )
                        )
                );
            }


            System.out.println(
                    "[GeeksforGeeks] Direct contests found: "
                            + result.size()
            );


        } catch (Exception e) {

            System.err.println(
                    "[GeeksforGeeks] Fetch failed: "
                            + e.getMessage()
            );
        }


        return result;
    }


    // ============================================================
    // GENERIC HTTP GET
    // ============================================================

    private String fetchText(
            String url
    ) {

        try {

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(url)
                            )
                            .header(
                                    "User-Agent",
                                    "Mozilla/5.0 CodeTrack Contest Calendar"
                            )
                            .header(
                                    "Accept",
                                    "text/html,application/json"
                            )
                            .GET()
                            .build();


            HttpResponse<String> response =
                    http.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                System.err.println(
                        "[HTTP] "
                                + url
                                + " -> "
                                + response.statusCode()
                );

                return null;
            }


            return response.body();


        } catch (Exception e) {

            System.err.println(
                    "[HTTP] Failed: "
                            + url
                            + " : "
                            + e.getMessage()
            );

            return null;
        }
    }


    // ============================================================
    // DEDUPLICATION
    // ============================================================

    private List<ContestDTO> deduplicateContests(
            List<ContestDTO> contests
    ) {

        Map<String, ContestDTO> unique =
                new HashMap<>();


        for (ContestDTO contest :
                contests) {

            String key =
                    createDuplicateKey(
                            contest
                    );


            /*
             * Prefer the first source.
             *
             * Since CLIST is added before the direct sources,
             * an existing CLIST contest is preserved.
             */

            unique.putIfAbsent(
                    key,
                    contest
            );
        }


        return new ArrayList<>(
                unique.values()
        );
    }


    private String createDuplicateKey(
            ContestDTO contest
    ) {

        String platform =
                contest
                        .getPlatform()
                        .toLowerCase()
                        .trim();


        String title =
                contest
                        .getTitle()
                        .toLowerCase()
                        .trim()
                        .replaceAll(
                                "[^a-z0-9]+",
                                " "
                        )
                        .trim();


        String start =
                contest
                        .getStartTime();


        /*
         * Use platform + title + start.
         *
         * This catches the same contest when CLIST and a direct
         * API both provide it.
         */

        return platform
                + "|"
                + title
                + "|"
                + start;
    }


    // ============================================================
    // PLATFORM NORMALIZATION
    // ============================================================

    private String normalizePlatform(
            String resource
    ) {

        if (resource == null) {
            return "";
        }


        String value =
                resource
                        .toLowerCase()
                        .trim();


        if (value.contains("leetcode")) {
            return "leetcode";
        }


        if (value.contains("codechef")) {
            return "codechef";
        }


        if (value.contains("atcoder")) {
            return "atcoder";
        }


        if (value.contains("hackerrank")) {
            return "hackerrank";
        }


        if (value.contains("hackerearth")) {
            return "hackerearth";
        }


        if (value.contains("geeksforgeeks")
                || value.contains("geeks for geeks")) {

            return "geeksforgeeks";
        }


        if (value.contains("codingninjas")
                || value.contains("coding ninjas")) {

            return "codingninjas";
        }


        if (value.contains("toph")) {
            return "toph";
        }


        if (value.contains("codewars")) {
            return "codewars";
        }


        if (value.contains("codingame")
                || value.contains("coding game")) {

            return "codingame";
        }


        return value
                .replace(".com", "")
                .replace(".org", "")
                .replace(".io", "")
                .replace(".net", "")
                .replace(".jp", "")
                .replace(".in", "");
    }


    // ============================================================
    // FRIENDLY PLATFORM
    // ============================================================

    private String friendlyPlatformName(
            String platform
    ) {

        return switch (platform) {

            case "leetcode" ->
                    "LeetCode";

            case "codechef" ->
                    "CodeChef";

            case "atcoder" ->
                    "AtCoder";

            case "hackerrank" ->
                    "HackerRank";

            case "hackerearth" ->
                    "HackerEarth";

            case "geeksforgeeks" ->
                    "GeeksforGeeks";

            case "codingninjas" ->
                    "Coding Ninjas";

            case "toph" ->
                    "Toph";

            case "codewars" ->
                    "Codewars";

            case "codingame" ->
                    "CodinGame";

            default ->
                    platform;
        };
    }


    // ============================================================
    // REMOVE NON-ENGLISH ATCODER
    // ============================================================

    private boolean containsNonEnglishCharacters(
            String text
    ) {

        if (text == null) {
            return false;
        }


        return text.matches(
                ".*[\\p{IsHiragana}"
                        + "\\p{IsKatakana}"
                        + "\\p{IsHan}"
                        + "\\p{IsHangul}"
                        + "].*"
        );
    }


    // ============================================================
    // DATE NORMALIZATION
    // ============================================================

    private String normalizeDateTime(
            String raw
    ) {

        if (raw == null
                || raw.isBlank()) {

            return raw;
        }


        String value =
                raw.trim();


        value =
                value.replace(
                        " ",
                        "T"
                );


        if (!value.endsWith("Z")
                && !value.contains("+")) {

            value += "Z";
        }


        return value;
    }


    // ============================================================
    // FLEXIBLE DATE PARSER
    // ============================================================

    private Instant parseFlexibleDate(
            String raw
    ) {

        if (raw == null
                || raw.isBlank()) {

            return null;
        }


        try {

            String value =
                    raw.trim()
                            .replace(
                                    " ",
                                    "T"
                            );


            /*
             * Offset such as +0900
             * -> +09:00
             */

            if (value.matches(
                    ".*[+-]\\d{4}$"
            )) {

                value =
                        value.substring(
                                0,
                                value.length() - 5
                        )
                                + value.substring(
                                value.length() - 5,
                                value.length() - 2
                        )
                                + ":"
                                + value.substring(
                                value.length() - 2
                        );
            }


            if (!value.endsWith("Z")
                    && !value.matches(
                    ".*[+-]\\d{2}:\\d{2}$"
            )) {

                value += "Z";
            }


            return Instant.parse(
                    value
            );


        } catch (Exception ignored) {

            return null;
        }
    }


    // ============================================================
    // JSON HELPER
    // ============================================================

    private String firstText(
            JsonNode node,
            String... fields
    ) {

        for (String field :
                fields) {

            JsonNode value =
                    node.path(field);


            if (!value.isMissingNode()
                    && !value.isNull()) {

                String text =
                        value.asText();


                if (text != null
                        && !text.isBlank()) {

                    return text;
                }
            }
        }


        return null;
    }


    // ============================================================
    // HTML HELPERS
    // ============================================================

    private String stripHtml(
            String html
    ) {

        if (html == null) {
            return "";
        }


        return decodeHtml(
                html
                        .replaceAll(
                                "<[^>]*>",
                                " "
                        )
                        .replaceAll(
                                "\\s+",
                                " "
                        )
                        .trim()
        );
    }


    private String decodeHtml(
            String text
    ) {

        if (text == null) {
            return "";
        }


        return text
                .replace(
                        "&amp;",
                        "&"
                )
                .replace(
                        "&lt;",
                        "<"
                )
                .replace(
                        "&gt;",
                        ">"
                )
                .replace(
                        "&quot;",
                        "\""
                )
                .replace(
                        "&#39;",
                        "'"
                )
                .replace(
                        "&nbsp;",
                        " "
                );
    }


    // ============================================================
    // CACHE RECORD
    // ============================================================

    private record CachedMonth(
            List<ContestDTO> contests,
            long expiry
    ) {
    }
}