using TaskModelStatus = TaskFlowApi.Api.Models.TaskStatus;

namespace TaskFlowApi.Api.DTOs;

public record CreateTaskDto(string Title, string Description);

public record UpdateTaskDto(string Title, string Description, TaskModelStatus Status);