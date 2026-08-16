package com.codetrack.backend.dto;

public class ContestDTO {

    private String id;
    private String title;
    private String platform;
    private String startTime;   // ISO-8601 UTC string
    private String endTime;     // ISO-8601 UTC string
    private String url;
    private long   durationSeconds;

    public ContestDTO() {}

    public ContestDTO(
            String id,
            String title,
            String platform,
            String startTime,
            String endTime,
            String url,
            long   durationSeconds
    ) {
        this.id              = id;
        this.title           = title;
        this.platform        = platform;
        this.startTime       = startTime;
        this.endTime         = endTime;
        this.url             = url;
        this.durationSeconds = durationSeconds;
    }

    public String getId()              { return id; }
    public String getTitle()           { return title; }
    public String getPlatform()        { return platform; }
    public String getStartTime()       { return startTime; }
    public String getEndTime()         { return endTime; }
    public String getUrl()             { return url; }
    public long   getDurationSeconds() { return durationSeconds; }

    public void setId(String id)                          { this.id = id; }
    public void setTitle(String title)                    { this.title = title; }
    public void setPlatform(String platform)              { this.platform = platform; }
    public void setStartTime(String startTime)            { this.startTime = startTime; }
    public void setEndTime(String endTime)                { this.endTime = endTime; }
    public void setUrl(String url)                        { this.url = url; }
    public void setDurationSeconds(long durationSeconds)  { this.durationSeconds = durationSeconds; }
}
