package com.foodandhunger.backend;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.time.LocalDateTime;
import java.util.Optional;

@SpringBootApplication
public class FoodandhungerApplication {
	public static void main(String[] args) {
		SpringApplication.run(FoodandhungerApplication.class, args);
	}
}

// 1. model class
@Entity
@Table(name="user_donors")
class UserDonor{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private int id;
    private String username;
    private String email;
    private String password;
    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // constructors
    public UserDonor(){}
    public UserDonor( String username, String email, String password){
        this.username = username;
        this.email = email;
        this.password = password;
    }
    public UserDonor( int id, String username, String email, String password){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    /* getters and setters */
    // getters
    String getUsername(){
        return username;
    }

    String getPassword(){
        return password;
    }

    String getEmail(){
        return email;
    }

    // setters
    void setUsername(String username){
        this.username = username;
    }

    void setEmail(String email){
        this.email = email;
    }

    void setPassword(String password){
        this.password = password;
    }
}

// 2. repository
@Repository
interface UserDonorRepository extends JpaRepository<UserDonor, Integer> {
    // Spring Data JPA automatically provides: save, findAll, findById, deleteById, etc.
    boolean existsByEmail(String email);
    boolean existsByUsername(String email);
    Optional<UserDonor> findByUsername(String username);
    Optional<UserDonor> findByEmail(String email);
}

// dto
class LoginRequest {
    private String username;
    private String password;
    // getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// UserDetailsService for Authentication
@Service
class UserDonorService {
    @Autowired
    private UserDonorRepository userDonorRepository;

    public String signup(UserDonor user) {
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

    public boolean validateUser(String username, String password) {
        Optional<UserDonor> opt = userDonorRepository.findByUsername(username);
        return opt.isPresent() && opt.get().getPassword().equals(password);
    }
}


// user_donor
    // signup
    // login
    // logout
// 3. controller
@RestController
@RequestMapping("/api/auth/donor")
class UserDonorController {
    @Autowired
    private UserDonorService userDonorService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDonor s) {
        String msg = userDonorService.signup(s);
        return ResponseEntity.ok(msg);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean success = userDonorService.validateUser(request.getUsername(), request.getPassword());
        if (success) {
            return ResponseEntity.ok("login successful for user: " + request.getUsername());
        } else {
            return ResponseEntity.status(401).body("invalid credentials");
        }
    }

    @GetMapping("/")
    public ResponseEntity<String> hello(){
        String str = "Welcome to food and hunger";
        return ResponseEntity.ok(str);
    }
}
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/donor/signup",
                                "/api/auth/donor/login",
                                "/api/auth/donor/"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())   // disable default login form
                .httpBasic(basic -> basic.disable()); // disable HTTP Basic auth

        return http.build();
    }
}
