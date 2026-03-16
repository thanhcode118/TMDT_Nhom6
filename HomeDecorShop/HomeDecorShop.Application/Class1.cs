using HomeDecorShop.Domain;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

namespace HomeDecorShop.Application;

public sealed record UserView(
    int Id,
    string Email,
    string FullName,
    string Phone,
    string Role,
    DateTime CreatedAt,
    IReadOnlyCollection<Address> Addresses);

public sealed record RegisterUserInput(
    string Email,
    string FullName,
    string Phone,
    string Password,
    string Role);

public sealed record LoginInput(
    string Email,
    string Password);

public sealed record UpdateProfileInput(
    string FullName,
    string Phone);

public sealed record UpsertAddressInput(
    string FullName,
    string Phone,
    string Line1,
    string Ward,
    string District,
    string City,
    bool IsDefault);

public sealed record AuthResult(
    string Token,
    UserView User);

public interface IUserService
{
    IReadOnlyCollection<UserView> GetAll();
    AuthResult Register(RegisterUserInput input);
    AuthResult? Login(LoginInput input);
    UserView? GetByToken(string token);
    UserView? UpdateProfile(string token, UpdateProfileInput input);
    UserView? AddAddress(string token, UpsertAddressInput input);
}

public sealed class UserService(IUserRepository repository) : IUserService
{
    private static readonly ConcurrentDictionary<string, int> Sessions = new(StringComparer.Ordinal);

    public IReadOnlyCollection<UserView> GetAll() =>
        repository.GetAll().Select(MapUser).ToArray();

    public AuthResult Register(RegisterUserInput input)
    {
        var normalizedEmail = Normalize(input.Email);
        if (repository.GetByEmail(normalizedEmail) is not null)
        {
            throw new InvalidOperationException("Email đã tồn tại.");
        }

        var role = Normalize(input.Role) == "admin" ? UserRole.Admin : UserRole.Customer;
        var user = repository.Create(new User(
            0,
            normalizedEmail,
            input.FullName.Trim(),
            input.Phone.Trim(),
            role,
            input.Password,
            DateTime.UtcNow,
            []));

        var token = CreateSession(user.Id);
        return new AuthResult(token, MapUser(user));
    }

    public AuthResult? Login(LoginInput input)
    {
        var user = repository.GetByEmail(Normalize(input.Email));
        if (user is null || user.Password != input.Password)
        {
            return null;
        }

        var token = CreateSession(user.Id);
        return new AuthResult(token, MapUser(user));
    }

    public UserView? GetByToken(string token)
    {
        var user = ResolveUser(token);
        return user is null ? null : MapUser(user);
    }

    public UserView? UpdateProfile(string token, UpdateProfileInput input)
    {
        var user = ResolveUser(token);
        if (user is null)
        {
            return null;
        }

        var updated = user with
        {
            FullName = input.FullName.Trim(),
            Phone = input.Phone.Trim()
        };

        var saved = repository.Update(updated);
        return saved is null ? null : MapUser(saved);
    }

    public UserView? AddAddress(string token, UpsertAddressInput input)
    {
        var user = ResolveUser(token);
        if (user is null)
        {
            return null;
        }

        var nextId = user.Addresses.Count == 0 ? 1 : user.Addresses.Max(a => a.Id) + 1;
        var newAddress = new Address(
            nextId,
            input.FullName.Trim(),
            input.Phone.Trim(),
            input.Line1.Trim(),
            input.Ward.Trim(),
            input.District.Trim(),
            input.City.Trim(),
            input.IsDefault);

        var addresses = user.Addresses.ToList();
        if (newAddress.IsDefault)
        {
            addresses = addresses.Select(a => a with { IsDefault = false }).ToList();
        }
        addresses.Add(newAddress);

        var updated = user with { Addresses = addresses };
        var saved = repository.Update(updated);
        return saved is null ? null : MapUser(saved);
    }

    private static string CreateSession(int userId)
    {
        var token = Guid.NewGuid().ToString("N");
        Sessions[token] = userId;
        return token;
    }

    private User? ResolveUser(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        if (!Sessions.TryGetValue(token.Trim(), out var userId))
        {
            return null;
        }

        return repository.GetById(userId);
    }

    private static UserView MapUser(User user) =>
        new(
            user.Id,
            user.Email,
            user.FullName,
            user.Phone,
            user.Role.ToString().ToLowerInvariant(),
            user.CreatedAt,
            user.Addresses);

    private static string Normalize(string? value) =>
        (value ?? string.Empty).Trim().ToLowerInvariant();
}

public static class ApplicationDependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IUserService, UserService>();
        return services;
    }
}
