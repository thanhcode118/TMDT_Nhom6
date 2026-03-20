using Microsoft.EntityFrameworkCore;
using ShopDecorAPI;   // 👈 QUAN TRỌNG: để nhận AppDbContext

var builder = WebApplication.CreateBuilder(args);

// ================== SERVICES ==================

// Controller
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database InMemory
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("ShopDecorDB"));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// ================== MIDDLEWARE ==================

// Swagger (luôn bật)
app.UseSwagger();
app.UseSwaggerUI();

// CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

// Map controller
app.MapControllers();

app.Run();