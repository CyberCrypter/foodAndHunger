package com.foodandhunger.backend.services;

import com.foodandhunger.backend.repository.UserRepo;
import com.foodandhunger.backend.models.User;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

// UserDetailsService for Authentication
@Service
public class UserService {
    @Autowired
    private UserRepo userRepository;

    public String signup(User user) {
        LLogging.info("signup");
        if (userRepository.existsByEmail(user.getEmail())) {
            LLogging.warn("email already registered");
            return "email already registered";
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            LLogging.warn("username already registered");
            return "username already registered";
        }
        // Save password as plain text (not secure! for testing ONLY)
        userRepository.save(user);
        LLogging.info("successfully registered user");
        return "successfully registered user";
    }

    // login
    public boolean validateUser(String username, String password) {
        LLogging.info("validateUser");
        Optional<User> opt = userRepository.findByUsername(username);
        return opt.isPresent() && opt.get().getPassword().equals(password);
    }

    // getAllUsers
    public List<User> getAll(){
        LLogging.info("get all user");
        List<User> allUsers = userRepository.findAll();
        return allUsers;
    }

    // remove
    public boolean removeUser(int id){
        try{
            LLogging.info("user removed successfully with id: " + id);
            userRepository.deleteById(id);
            return true ;
        }catch (Exception e){
            LLogging.error(String.valueOf(e));
            return false;
        }
    }

    // update
    public boolean updateUser(int id , User user){
        LLogging.info("updateUser");
        try {
            User getUser = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
            getUser.setUsername(user.getUsername());
            getUser.setEmail(user.getEmail());
            getUser.setPassword(user.getPassword());
            LLogging.info("successfully updated user with id: " + id);
            return true;
        }
        catch (Exception e){
            LLogging.error(String.valueOf(e));
            return false;
        }
    }

    // update password
    public boolean updatePassword(String email, String newPassword){
        LLogging.info("updatePassword");
        try {
            User getUser = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found"));
            getUser.setPassword(newPassword);
            LLogging.info("password changed for user with email: "+email);
            return true;
        }catch (Exception e){
            LLogging.error(String.valueOf(e));
            return false;
        }
    }
}
