package com.example.definethebody.service;

import com.example.definethebody.model.Event;
import com.example.definethebody.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
	@Autowired
	private EventRepository eventRepository;

	public List<Event> getAllEvents() {
		return eventRepository.findAll();
	}
}
