import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2";
        
        // Test common passwords
        String[] passwords = {"123456", "admin", "password", "Admin@123", "admin123", "fashon", "fashon123"};
        
        for (String pwd : passwords) {
            boolean matches = encoder.matches(pwd, hash);
            System.out.println("Password: " + pwd + " -> " + matches);
        }
    }
}
