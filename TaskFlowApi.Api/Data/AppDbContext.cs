using Microsoft.EntityFrameworkCore;
using TaskFlowApi.Api.Models;

namespace TaskFlowApi.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}