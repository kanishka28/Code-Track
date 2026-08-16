package com.codetrack.backend.dto;

public class CategoryCounts {

    private int total;
    private int neetcode150;
    private int blind75;
    private int striver;
    private int cses;

    public CategoryCounts() {}

    public CategoryCounts(int total, int neetcode150, int blind75, int striver, int cses) {
        this.total = total;
        this.neetcode150 = neetcode150;
        this.blind75 = blind75;
        this.striver = striver;
        this.cses = cses;
    }

    public int getTotal() { return total; }
    public int getNeetcode150() { return neetcode150; }
    public int getBlind75() { return blind75; }
    public int getStriver() { return striver; }
    public int getCses() { return cses; }
}