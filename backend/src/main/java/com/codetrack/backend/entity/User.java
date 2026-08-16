package com.codetrack.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String sessionToken;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public User() {}

    public User(String email) {
        this.email = email;
        this.sessionToken = UUID.randomUUID().toString();
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    public Instant getCreatedAt() { return createdAt; }
}