package com.example.definethebody.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 웹 설정 클래스 정적 리소스(CSS, 이미지, JavaScript)의 위치를 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {

	// 정적 리소스 핸들러를 추가. CSS, 이미지, JavaScript 파일의 위치를 지정
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// CSS 파일 위치 설정
		registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
		// 이미지 파일 위치 설정
		registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/");
		// JavaScript 파일 위치 설정
		registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
		// 이미지 업로드 경로 설정
	}

}
