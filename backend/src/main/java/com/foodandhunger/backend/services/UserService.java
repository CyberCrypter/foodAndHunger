package com.foodandhunger.backend.services;

import com.foodandhunger.backend.repository.UserRepo;
import com.foodandhunger.backend.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

// UserDetailsService for Authentication
@Service
public class UserService {
    @Autowired
    private UserRepo userDonorRepository;

    public String signup(UserModel user) {
        if (userDonorRepository.existsByEmail(user.getEmail())) {
            return "email already registered";
        }
        if (userDonorRepository.existsByUsername(user.getUsername())) {
            return "username already registered";
        }
        // Save password as plain text (not secure! for testing ONLY)
        userDonorRepository.save(user);
        return "successfully registered user";
    }

    // login
    public boolean validateUser(String username, String password) {
        Optional<UserModel> opt = userDonorRepository.findByUsername(username);
        return opt.isPresent() && opt.get().getPassword().equals(password);
    }
}
