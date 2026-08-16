package com.codetrack.backend.service;

import com.codetrack.backend.dto.AuthResponse;
import com.codetrack.backend.entity.User;
import com.codetrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse loginOrRegister(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        return userRepository.findByEmail(normalizedEmail)
                .map(user -> new AuthResponse(user.getId(), user.getEmail(), user.getSessionToken(), false))
                .orElseGet(() -> {
                    User newUser = new User(normalizedEmail);
                    userRepository.save(newUser);
                    return new AuthResponse(newUser.getId(), newUser.getEmail(), newUser.getSessionToken(), true);
                });
    }

    public User requireUserByToken(String token) {
        return userRepository.findBySessionToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired session"));
    }
}