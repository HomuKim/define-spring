package com.example.definethebody.model;

public class IntroMessage {
	private String role;
	private String name;
	private String message;
	private String imageUrl;

	public IntroMessage(String role, String name, String message, String imageUrl) {
		this.role = role;
		this.name = name;
		this.message = message;
		this.imageUrl = imageUrl;
	}

	public String getRole() {
		return role;
	}

	public String getName() {
		return name;
	}

	public String getMessage() {
		return message;
	}

	public String getImageUrl() {
		return imageUrl;
	}
}
