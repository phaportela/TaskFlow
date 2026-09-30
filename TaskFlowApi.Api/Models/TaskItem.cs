namespace TaskFlowApi.Api.Models;

public enum TaskStatus
{
    Pendente,
    EmProgresso,
    Concluido
}

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskStatus Status { get; set; } = TaskStatus.Pendente;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}