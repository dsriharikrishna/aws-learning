package com.portfolio.springapp.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Task task = new Task(
                request.title(),
                request.description(),
                request.status(),
                request.priority()
        );
        Task saved = taskRepository.save(task);
        return TaskResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> listTasks(int page, int limit, String search, TaskStatus status) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Task> taskPage = taskRepository.searchTasks(search, status, pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("data", taskPage.getContent().stream().map(TaskResponse::from).toList());
        response.put("total", taskPage.getTotalElements());
        response.put("page", page);
        response.put("limit", limit);
        response.put("totalPages", taskPage.getTotalPages());

        return response;
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task '" + id + "' not found"));
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse updateTask(String id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task '" + id + "' not found"));

        if (request.title() != null && !request.title().isBlank()) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }

        Task updated = taskRepository.save(task);
        return TaskResponse.from(updated);
    }

    @Transactional
    public void deleteTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task '" + id + "' not found"));
        taskRepository.delete(task);
    }
}

