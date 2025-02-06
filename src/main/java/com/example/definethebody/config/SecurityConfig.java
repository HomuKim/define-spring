package com.example.definethebody.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/css/**", "/js/**", "/images/**", "/api/admin/login")
				.permitAll().requestMatchers("/admin/**").hasRole("ADMIN").anyRequest().permitAll())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
						.invalidSessionUrl("/api/admin/status").maximumSessions(1).maxSessionsPreventsLogin(false))
				.logout(logout -> logout.logoutUrl("/api/admin/logout").logoutSuccessUrl("/")
						.invalidateHttpSession(true).deleteCookies("JSESSIONID"))
				.exceptionHandling(ex -> ex.authenticationEntryPoint(
						(request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
						.accessDeniedHandler((request, response, accessDeniedException) -> response
								.sendError(HttpServletResponse.SC_FORBIDDEN)))
				.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
						.ignoringRequestMatchers("/api/admin/login"));

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

}
