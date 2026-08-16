package com.codetrack.backend.dto;

public class AuthResponse {
    private Long userId;
    private String email;
    private String sessionToken;
    private boolean newAccount;

    public AuthResponse(Long userId, String email, String sessionToken, boolean newAccount) {
        this.userId = userId;
        this.email = email;
        this.sessionToken = sessionToken;
        this.newAccount = newAccount;
    }

    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getSessionToken() { return sessionToken; }
    public boolean isNewAccount() { return newAccount; }
}