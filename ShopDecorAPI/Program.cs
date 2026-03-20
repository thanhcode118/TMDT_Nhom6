using Microsoft.EntityFrameworkCore;
using ShopDecorAPI;

var builder = WebApplication.CreateBuilder(args);

// 👉 Add Controller
builder.Services.AddControllers();

// 👉 Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 👉 Add Database InMemory
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("ShopDb"));

var app = builder.Build();

// 👉 Enable Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 👉 HTTPS
app.UseHttpsRedirection();

// 👉 Map Controller
app.MapControllers();

app.Run();