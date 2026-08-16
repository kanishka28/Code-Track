package com.codetrack.backend.service;

import com.codetrack.backend.dto.ContestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DirectContestService {

    private final HttpClient http =
            HttpClient.newBuilder()
                    .followRedirects(
                            HttpClient.Redirect.NORMAL
                    )
                    .build();

    private final ObjectMapper mapper =
            new ObjectMapper();


    // ============================================================
    // MAIN METHOD
    // ============================================================

    public List<ContestDTO> fetchAllDirectSources(
            Instant monthStart,
            Instant monthEnd
    ) {

        List<ContestDTO> result =
                new ArrayList<>();


        /*
         * Every source is isolated.
         *
         * If one website fails, the others continue.
         *
         * Most importantly:
         *
         * CLIST is NOT affected.
         */

        result.addAll(
                safeFetch(
                        "CodeChef",
                        () -> fetchCodeChef(
                                monthStart,
                                monthEnd
                        )
                )
        );


        result.addAll(
                safeFetch(
                        "LeetCode",
                        () -> fetchLeetCode(
                                monthStart,
                                monthEnd
                        )
                )
        );


        result.addAll(
        safeFetch(
                "AtCoder",
                () -> fetchAtCoder(
                        monthStart,
                        monthEnd
                )
        )
);


        result.addAll(
                safeFetch(
                        "HackerRank",
                        () -> fetchHackerRank(
                                monthStart,
                                monthEnd
                        )
                )
        );


        result.addAll(
                safeFetch(
                        "HackerEarth",
                        () -> fetchHackerEarth(
                                monthStart,
                                monthEnd
                        )
                )
        );


        result.addAll(
                safeFetch(
                        "GeeksforGeeks",
                        () -> fetchGeeksforGeeks(
                                monthStart,
                                monthEnd
                        )
                )
        );


        System.out.println(
                "[DIRECT] Total direct contests: "
                        + result.size()
        );


        return result;
    }


    // ============================================================
    // SAFE FETCH
    // ============================================================

    private List<ContestDTO> safeFetch(
            String platform,
            ContestFetcher fetcher
    ) {

        try {

            List<ContestDTO> result =
                    fetcher.fetch();


            System.out.println(
                    "[DIRECT] "
                            + platform
                            + " contests: "
                            + result.size()
            );


            return result;

        } catch (Exception e) {

            System.err.println(
                    "[DIRECT] "
                            + platform
                            + " failed: "
                            + e.getMessage()
            );


            return new ArrayList<>();
        }
    }


    // ============================================================
    // CODECHEF
    // ============================================================

    private List<ContestDTO> fetchCodeChef(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        String url =
                "https://www.codechef.com/api/list/contests/all"
                        + "?sort_by=START"
                        + "&sorting_order=asc"
                        + "&offset=0"
                        + "&mode=all";


        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(url)
                        )
                        .header(
                                "Accept",
                                "application/json"
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

            throw new RuntimeException(
                    "HTTP "
                            + response.statusCode()
            );
        }


        JsonNode root =
                mapper.readTree(
                        response.body()
                );


        JsonNode future =
                root.path(
                        "future_contests"
                );


        for (JsonNode contest :
                future) {

            String start =
                    contest
                            .path(
                                    "contest_start_date_iso"
                            )
                            .asText();


            String end =
                    contest
                            .path(
                                    "contest_end_date_iso"
                            )
                            .asText();


            if (start.isBlank()) {

                continue;
            }


            Instant startInstant =
                    Instant.parse(
                            start
                    );


            Instant endInstant =
                    end.isBlank()
                            ? startInstant
                            : Instant.parse(end);


            if (!overlapsMonth(
                    startInstant,
                    endInstant,
                    monthStart,
                    monthEnd
            )) {

                continue;
            }


            String code =
                    contest
                            .path(
                                    "contest_code"
                            )
                            .asText();


            String title =
                    contest
                            .path(
                                    "contest_name"
                            )
                            .asText();


            if (title.isBlank()) {

                continue;
            }


            long duration =
                    contest
                            .path(
                                    "contest_duration"
                            )
                            .asLong();


            result.add(
                    new ContestDTO(
                            "direct-codechef-"
                                    + code,

                            title,

                            "CodeChef",

                            startInstant.toString(),

                            endInstant.toString(),

                            "https://www.codechef.com/"
                                    + code,

                            duration * 60
                    )
            );
        }


        return result;
    }


    // ============================================================
    // LEETCODE
    // ============================================================

    private List<ContestDTO> fetchLeetCode(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        /*
         * LeetCode currently exposes contest information
         * through its GraphQL endpoint.
         *
         * This query returns the next two contests.
         *
         * CLIST remains responsible for additional
         * LeetCode contests if available.
         */

        String query =
                """
                query topTwoContests {
                    topTwoContests {
                        title
                        titleSlug
                        startTime
                        duration
                    }
                }
                """;


        String body =
                mapper.writeValueAsString(
                        new GraphQLRequest(
                                query,
                                "topTwoContests"
                        )
                );


        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(
                                URI.create(
                                        "https://leetcode.com/graphql/"
                                )
                        )
                        .header(
                                "Content-Type",
                                "application/json"
                        )
                        .header(
                                "User-Agent",
                                "Mozilla/5.0"
                        )
                        .POST(
                                HttpRequest.BodyPublishers.ofString(
                                        body
                                )
                        )
                        .build();


        HttpResponse<String> response =
                http.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );


        if (response.statusCode() < 200
                || response.statusCode() >= 300) {

            throw new RuntimeException(
                    "HTTP "
                            + response.statusCode()
            );
        }


        JsonNode root =
                mapper.readTree(
                        response.body()
                );


        JsonNode contests =
                root
                        .path("data")
                        .path("topTwoContests");


        if (!contests.isArray()) {

            return result;
        }


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


            Instant start =
                    Instant.ofEpochSecond(
                            startSeconds
                    );


            Instant end =
                    start.plusSeconds(
                            durationSeconds
                    );


            if (!overlapsMonth(
                    start,
                    end,
                    monthStart,
                    monthEnd
            )) {

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
                            "direct-leetcode-"
                                    + slug,

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


        return result;
    }


    // ============================================================
    // ATCODER
    // ============================================================

    private List<ContestDTO> fetchAtCoder(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        Document document =
                Jsoup.connect(
                                "https://atcoder.jp/contests/"
                        )
                        .userAgent(
                                "Mozilla/5.0"
                        )
                        .timeout(
                                15000
                        )
                        .get();


        Elements rows =
                document.select(
                        "table tr"
                );


        for (Element row :
                rows) {

            Elements cells =
                    row.select("td");


            if (cells.size() < 3) {

                continue;
            }


            String dateText =
                    cells
                            .get(0)
                            .text()
                            .trim();


            String contestTitle =
                    cells
                            .get(1)
                            .text()
                            .trim();


            Element link =
                    cells
                            .get(1)
                            .selectFirst(
                                    "a[href]"
                            );


            String href =
                    link == null
                            ? ""
                            : link.attr("href");


            String durationText =
                    cells
                            .get(2)
                            .text()
                            .trim();


            if (dateText.isBlank()
                    || contestTitle.isBlank()
                    || href.isBlank()) {

                continue;
            }


            Instant start =
                    parseAtCoderDate(
                            dateText
                    );


            if (start == null) {

                continue;
            }


            long durationSeconds =
                    parseDuration(
                            durationText
                    );


            Instant end =
                    start.plusSeconds(
                            durationSeconds
                    );


            if (!overlapsMonth(
                    start,
                    end,
                    monthStart,
                    monthEnd
            )) {

                continue;
            }


            /*
             * Remove non-English AtCoder contests.
             */

            if (containsNonEnglishCharacters(
                    contestTitle
            )) {

                System.out.println(
                        "[DIRECT] Skipping non-English AtCoder: "
                                + contestTitle
                );

                continue;
            }


            if (href.startsWith("/")) {

                href =
                        "https://atcoder.jp"
                                + href;
            }


            String contestId =
                    href
                            .replace(
                                    "https://atcoder.jp/contests/",
                                    ""
                            )
                            .replace(
                                    "/",
                                    ""
                            );


            result.add(
                    new ContestDTO(
                            "direct-atcoder-"
                                    + contestId,

                            contestTitle,

                            "AtCoder",

                            start.toString(),

                            end.toString(),

                            href,

                            durationSeconds
                    )
            );
        }


        return result;
    }


    // ============================================================
    // HACKERRANK
    // ============================================================

    private List<ContestDTO> fetchHackerRank(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        Document document =
                Jsoup.connect(
                                "https://www.hackerrank.com/contests"
                        )
                        .userAgent(
                                "Mozilla/5.0"
                        )
                        .timeout(
                                15000
                        )
                        .get();


        /*
         * HackerRank's contest page can change its
         * HTML structure.
         *
         * We therefore search all links containing
         * /contests/.
         */

        Elements links =
                document.select(
                        "a[href*=/contests/]"
                );


        for (Element link :
                links) {

            String href =
                    link.attr("href");


            String title =
                    link.text()
                            .trim();


            if (href.isBlank()
                    || title.isBlank()) {

                continue;
            }


            if (href.equals(
                    "/contests"
            )
                    || href.equals(
                            "https://www.hackerrank.com/contests"
                    )) {

                continue;
            }


            if (title.length() < 3) {

                continue;
            }


            if (href.startsWith("/")) {

                href =
                        "https://www.hackerrank.com"
                                + href;
            }


            /*
             * Fetch the individual contest page.
             *
             * This gives us a chance to find exact
             * start/end timestamps.
             */

            ContestDTO contest =
                    parseHackerRankContestPage(
                            href,
                            title,
                            monthStart,
                            monthEnd
                    );


            if (contest != null) {

                result.add(contest);
            }
        }


        return result;
    }


    private ContestDTO parseHackerRankContestPage(
            String href,
            String fallbackTitle,
            Instant monthStart,
            Instant monthEnd
    ) {

        try {

            Document document =
                    Jsoup.connect(
                                    href
                            )
                            .userAgent(
                                    "Mozilla/5.0"
                            )
                            .timeout(
                                    12000
                            )
                            .get();


            String text =
                    document.text();


            /*
             * Try to find ISO timestamps first.
             */

            Pattern isoPattern =
                    Pattern.compile(
                            "(20\\d{2}-\\d{2}-\\d{2}"
                                    + "T"
                                    + "\\d{2}:\\d{2}:\\d{2}"
                                    + "(?:\\.\\d+)?"
                                    + "(?:Z|[+-]\\d{2}:?\\d{2}))"
                    );


            Matcher matcher =
                    isoPattern.matcher(text);


            if (!matcher.find()) {

                return null;
            }


            Instant start =
                    Instant.parse(
                            matcher.group(1)
                    );


            /*
             * Try to find a second timestamp.
             */

            Instant end =
                    start.plusSeconds(
                            24 * 60 * 60
                    );


            if (!overlapsMonth(
                    start,
                    end,
                    monthStart,
                    monthEnd
            )) {

                return null;
            }


            return new ContestDTO(
                    "direct-hackerrank-"
                            + slugFromUrl(href),

                    fallbackTitle,

                    "HackerRank",

                    start.toString(),

                    end.toString(),

                    href,

                    24 * 60 * 60
            );


        } catch (Exception e) {

            return null;
        }
    }


    // ============================================================
    // HACKEREARTH
    // ============================================================

    private List<ContestDTO> fetchHackerEarth(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        String[] pages = {

                "https://www.hackerearth.com/challenges/",
                "https://www.hackerearth.com/challenges/hackathon/",
                "https://www.hackerearth.com/challenges/hiring/",
                "https://www.hackerearth.com/challenges/college/"
        };


        for (String page :
                pages) {

            try {

                Document document =
                        Jsoup.connect(page)
                                .userAgent(
                                        "Mozilla/5.0"
                                )
                                .timeout(
                                        15000
                                )
                                .get();


                Elements links =
                        document.select(
                                "a[href*=/challenges/]"
                        );


                for (Element link :
                        links) {

                    String href =
                            link.attr("href");


                    String title =
                            link.text()
                                    .trim();


                    if (href.isBlank()
                            || title.isBlank()) {

                        continue;
                    }


                    if (title.length() < 3) {

                        continue;
                    }


                    if (href.startsWith("/")) {

                        href =
                                "https://www.hackerearth.com"
                                        + href;
                    }


                    ContestDTO contest =
                            parseHackerEarthContest(
                                    href,
                                    title,
                                    monthStart,
                                    monthEnd
                            );


                    if (contest != null) {

                        result.add(contest);
                    }
                }


            } catch (Exception ignored) {

                /*
                 * One HackerEarth category failing
                 * should not stop the others.
                 */
            }
        }


        return result;
    }


    private ContestDTO parseHackerEarthContest(
            String href,
            String fallbackTitle,
            Instant monthStart,
            Instant monthEnd
    ) {

        try {

            Document document =
                    Jsoup.connect(href)
                            .userAgent(
                                    "Mozilla/5.0"
                            )
                            .timeout(
                                    12000
                            )
                            .get();


            String text =
                    document.text();


            Pattern pattern =
                    Pattern.compile(
                            "(?i)starts on:\\s*"
                                    + "([A-Za-z]{3}\\s+\\d{1,2},\\s+\\d{4},\\s+"
                                    + "\\d{2}:\\d{2}\\s+[AP]M\\s+UTC)"
                                    + ".*?"
                                    + "ends on:\\s*"
                                    + "([A-Za-z]{3}\\s+\\d{1,2},\\s+\\d{4},\\s+"
                                    + "\\d{2}:\\d{2}\\s+[AP]M)"
                    );


            Matcher matcher =
                    pattern.matcher(text);


            if (!matcher.find()) {

                return null;
            }


            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                            "MMM d, yyyy, hh:mm a 'UTC'",
                            Locale.ENGLISH
                    );


            OffsetDateTime startDate =
                    OffsetDateTime.parse(
                            matcher.group(1),
                            formatter.withZone(
                                    ZoneOffset.UTC
                            )
                    );


            Instant start =
                    startDate.toInstant();


            /*
             * HackerEarth's page may omit the timezone
             * from the end text. The start is enough to
             * establish month membership.
             *
             * Use 24h fallback duration.
             */

            Instant end =
                    start.plusSeconds(
                            24 * 60 * 60
                    );


            if (!overlapsMonth(
                    start,
                    end,
                    monthStart,
                    monthEnd
            )) {

                return null;
            }


            return new ContestDTO(
                    "direct-hackerearth-"
                            + slugFromUrl(href),

                    fallbackTitle,

                    "HackerEarth",

                    start.toString(),

                    end.toString(),

                    href,

                    24 * 60 * 60
            );


        } catch (Exception e) {

            return null;
        }
    }


    // ============================================================
    // GEEKSFORGEEKS
    // ============================================================

    private List<ContestDTO> fetchGeeksforGeeks(
            Instant monthStart,
            Instant monthEnd
    ) throws Exception {

        List<ContestDTO> result =
                new ArrayList<>();


        /*
         * GFG currently states that its Weekly Coding
         * Contest is temporarily paused.
         *
         * We still keep this scraper because when GFG
         * resumes, this source can automatically start
         * contributing contests.
         */

        Document document =
                Jsoup.connect(
                                "https://www.geeksforgeeks.org/events"
                        )
                        .userAgent(
                                "Mozilla/5.0"
                        )
                        .timeout(
                                15000
                        )
                        .get();


        String text =
                document.text();


        if (text.toLowerCase()
                .contains(
                        "weekly coding contest is temporarily paused"
                )) {

            System.out.println(
                    "[DIRECT] GFG weekly contest currently paused"
            );

            return result;
        }


        /*
         * Search event links.
         */

        Elements links =
                document.select(
                        "a[href*=/events/]"
                );


        for (Element link :
                links) {

            String href =
                    link.attr("href");


            String title =
                    link.text()
                            .trim();


            if (href.isBlank()
                    || title.isBlank()) {

                continue;
            }


            if (href.startsWith("/")) {

                href =
                        "https://www.geeksforgeeks.org"
                                + href;
            }


            /*
             * GFG currently doesn't expose enough
             * future contest timing information on
             * the general events page.
             *
             * Therefore don't invent dates.
             */

            if (!href.contains(
                    "/events/rec/"
            )) {

                continue;
            }


            /*
             * At present this source normally returns
             * zero because the weekly contest is paused.
             */
        }


        return result;
    }


    // ============================================================
    // DATE HELPERS
    // ============================================================

    private Instant parseAtCoderDate(
            String value
    ) {

        try {

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                            "yyyy-MM-dd HH:mm:ssxx"
                    );


            return OffsetDateTime
                    .parse(
                            value,
                            formatter
                    )
                    .toInstant();

        } catch (
                DateTimeParseException e
        ) {

            return null;
        }
    }


    private long parseDuration(
            String value
    ) {

        try {

            String[] parts =
                    value.split(":");


            if (parts.length != 2) {

                return 0;
            }


            long hours =
                    Long.parseLong(
                            parts[0]
                    );


            long minutes =
                    Long.parseLong(
                            parts[1]
                    );


            return hours * 3600
                    + minutes * 60;

        } catch (Exception e) {

            return 0;
        }
    }


    private boolean overlapsMonth(
            Instant start,
            Instant end,
            Instant monthStart,
            Instant monthEnd
    ) {

        return !end.isBefore(monthStart)
                && start.isBefore(monthEnd);
    }


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
                        + "\\p{IsHangul}].*"
        );
    }


    private String slugFromUrl(
            String url
    ) {

        if (url == null
                || url.isBlank()) {

            return "unknown";
        }


        String clean =
                url
                        .replaceAll(
                                "/+$",
                                ""
                        );


        int slash =
                clean.lastIndexOf('/');


        if (slash < 0) {

            return clean;
        }


        return clean.substring(
                slash + 1
        );
    }


    // ============================================================
    // FUNCTIONAL INTERFACE
    // ============================================================

    @FunctionalInterface
    private interface ContestFetcher {

        List<ContestDTO> fetch()
                throws Exception;
    }


    // ============================================================
    // GRAPHQL REQUEST
    // ============================================================

    private record GraphQLRequest(
            String query,
            String operationName
    ) {
    }
}