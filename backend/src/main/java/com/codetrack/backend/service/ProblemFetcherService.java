package com.codetrack.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProblemFetcherService {

    private final WebClient webClient;

    private final ObjectMapper objectMapper =
            new ObjectMapper();


    public ProblemFetcherService(WebClient.Builder webClientBuilder) {

        this.webClient =
                webClientBuilder.build();
    }


    /*
     * =========================================================
     * MAIN METHOD
     * =========================================================
     *
     * Takes a problem URL and returns the actual problem
     * statement.
     *
     * Example:
     *
     * https://leetcode.com/problems/valid-anagram/
     *
     * ->
     *
     * actual Valid Anagram problem statement
     *
     * =========================================================
     */

    public String fetchProblemStatement(String url) {

        if (url == null || url.isBlank()) {

            return "";
        }


        try {

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "FETCHING PROBLEM FROM URL"
            );

            System.out.println(
                    url
            );

            System.out.println(
                    "========================================"
            );


            /*
             * -------------------------------------------------
             * LEETCODE
             * -------------------------------------------------
             */

            if (url.contains("leetcode.com")) {

                return fetchLeetCodeProblem(url);
            }


            /*
             * -------------------------------------------------
             * GENERIC WEBSITE
             * -------------------------------------------------
             */

            return fetchGenericProblem(url);


        } catch (Exception e) {

            System.err.println(
                    "Could not fetch problem statement."
            );

            e.printStackTrace();

            return "";
        }
    }


    /*
     * =========================================================
     * LEETCODE
     * =========================================================
     */

    private String fetchLeetCodeProblem(String url) {

        try {

            /*
             * -------------------------------------------------
             * GET TITLE SLUG
             *
             * Example:
             *
             * /problems/valid-anagram/
             *
             * becomes:
             *
             * valid-anagram
             * -------------------------------------------------
             */

            String titleSlug =
                    extractLeetCodeSlug(url);


            if (titleSlug == null ||
                    titleSlug.isBlank()) {

                System.err.println(
                        "Could not extract LeetCode slug."
                );

                return "";
            }


            System.out.println(
                    "LeetCode slug: " + titleSlug
            );


            /*
             * -------------------------------------------------
             * LEETCODE GRAPHQL QUERY
             * -------------------------------------------------
             */

            String query = """
                    query questionContent($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            title
                            difficulty
                            content
                        }
                    }
                    """;


            /*
             * -------------------------------------------------
             * VARIABLES
             * -------------------------------------------------
             */

            Map<String, Object> variables =
                    new HashMap<>();

            variables.put(
                    "titleSlug",
                    titleSlug
            );


            /*
             * -------------------------------------------------
             * REQUEST BODY
             * -------------------------------------------------
             */

            Map<String, Object> requestBody =
                    new HashMap<>();

            requestBody.put(
                    "query",
                    query
            );

            requestBody.put(
                    "variables",
                    variables
            );


            /*
             * -------------------------------------------------
             * CALL LEETCODE
             * -------------------------------------------------
             */

            String response =
                    webClient
                            .post()
                            .uri("https://leetcode.com/graphql")
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "User-Agent",
                                    "Mozilla/5.0"
                            )
                            .header(
                                    "Referer",
                                    url
                            )
                            .bodyValue(requestBody)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();


            if (response == null ||
                    response.isBlank()) {

                System.err.println(
                        "LeetCode returned empty response."
                );

                return "";
            }


            /*
             * -------------------------------------------------
             * PARSE JSON
             * -------------------------------------------------
             */

            JsonNode root =
                    objectMapper.readTree(response);


            JsonNode question =
                    root
                            .path("data")
                            .path("question");


            if (question.isMissingNode() ||
                    question.isNull()) {

                System.err.println(
                        "LeetCode question was not found."
                );

                System.err.println(
                        "LeetCode response: " + response
                );

                return "";
            }


            /*
             * -------------------------------------------------
             * GET CONTENT
             * -------------------------------------------------
             */

            String title =
                    question
                            .path("title")
                            .asText("");


            String difficulty =
                    question
                            .path("difficulty")
                            .asText("");


            String htmlContent =
                    question
                            .path("content")
                            .asText("");


            if (htmlContent.isBlank()) {

                System.err.println(
                        "LeetCode content was empty."
                );

                return "";
            }


            /*
             * -------------------------------------------------
             * HTML -> CLEAN TEXT
             * -------------------------------------------------
             */

            Document document =
                    Jsoup.parse(htmlContent);


            String cleanContent =
                    document
                            .text();


            /*
             * -------------------------------------------------
             * FINAL PROBLEM STATEMENT
             * -------------------------------------------------
             */

            StringBuilder result =
                    new StringBuilder();


            result.append(
                    "Problem: "
            ).append(title);


            if (!difficulty.isBlank()) {

                result.append(
                        "\nDifficulty: "
                ).append(difficulty);
            }


            result.append(
                    "\n\nProblem Statement:\n"
            );


            result.append(
                    cleanContent
            );


            System.out.println(
                    "Successfully fetched LeetCode problem:"
            );

            System.out.println(
                    title
            );


            return result.toString();


        } catch (Exception e) {

            System.err.println(
                    "Error fetching LeetCode problem."
            );

            e.printStackTrace();

            return "";
        }
    }


    /*
     * =========================================================
     * EXTRACT LEETCODE SLUG
     * =========================================================
     */

    private String extractLeetCodeSlug(String url) {

        try {

            URI uri =
                    URI.create(url);


            String path =
                    uri.getPath();


            if (path == null ||
                    path.isBlank()) {

                return "";
            }


            String[] parts =
                    path.split("/");


            for (int i = 0;
                 i < parts.length;
                 i++) {

                if ("problems".equals(parts[i])
                        && i + 1 < parts.length) {

                    return parts[i + 1];
                }
            }


        } catch (Exception e) {

            System.err.println(
                    "Could not parse LeetCode URL."
            );
        }


        return "";
    }


    /*
     * =========================================================
     * GENERIC WEBSITE
     * =========================================================
     *
     * This is a fallback for URLs that are not LeetCode.
     *
     * It opens the webpage using Jsoup and extracts readable
     * text from the page.
     *
     * =========================================================
     */

    private String fetchGenericProblem(String url) {

        try {

            Document document =
                    Jsoup
                            .connect(url)
                            .userAgent(
                                    "Mozilla/5.0"
                            )
                            .timeout(15000)
                            .get();


            /*
             * Remove elements that are not useful for
             * understanding the problem.
             */

            document
                    .select(
                            "script, style, nav, footer, header"
                    )
                    .remove();


            /*
             * Try common problem containers first.
             */

            Element main =
                    document.selectFirst(
                            "main"
                    );


            String text;


            if (main != null) {

                text =
                        main.text();

            } else {

                text =
                        document.body().text();
            }


            if (text == null) {

                return "";
            }


            return text.trim();


        } catch (Exception e) {

            System.err.println(
                    "Could not fetch generic problem URL."
            );

            e.printStackTrace();

            return "";
        }
    }
}