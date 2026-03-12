-- =============================================
-- CREATE DATABASE
-- =============================================
CREATE DATABASE HomeDecorShop;
GO

USE HomeDecorShop;
GO


-- =============================================
-- USERS (Đăng nhập / Admin / Customer)
-- =============================================
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    Role NVARCHAR(20) DEFAULT 'Customer',
    CreatedAt DATETIME DEFAULT GETDATE()
);


-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);


-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    CategoryId INT,
    Price DECIMAL(12,2) NOT NULL,
    OldPrice DECIMAL(12,2),
    Stock INT DEFAULT 0,
    IsPromotion BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (CategoryId)
    REFERENCES Categories(CategoryId)
);


-- =============================================
-- PRODUCT IMAGES
-- =============================================
CREATE TABLE ProductImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT,
    ImageUrl NVARCHAR(255),

    FOREIGN KEY (ProductId)
    REFERENCES Products(ProductId)
);


-- =============================================
-- REVIEWS / PRODUCT COMMENTS
-- =============================================
CREATE TABLE Reviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT,
    UserId INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ProductId)
    REFERENCES Products(ProductId),

    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);


-- =============================================
-- CART
-- =============================================
CREATE TABLE Cart (
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);


-- =============================================
-- CART ITEMS
-- =============================================
CREATE TABLE CartItems (
    CartItemId INT IDENTITY(1,1) PRIMARY KEY,
    CartId INT,
    ProductId INT,
    Quantity INT DEFAULT 1,

    FOREIGN KEY (CartId)
    REFERENCES Cart(CartId),

    FOREIGN KEY (ProductId)
    REFERENCES Products(ProductId)
);


-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT,
    TotalAmount DECIMAL(12,2),
    Status NVARCHAR(50) DEFAULT 'Pending',
    ShippingAddress NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);


-- =============================================
-- ORDER DETAILS
-- =============================================
CREATE TABLE OrderDetails (
    OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT,
    ProductId INT,
    Quantity INT,
    Price DECIMAL(12,2),

    FOREIGN KEY (OrderId)
    REFERENCES Orders(OrderId),

    FOREIGN KEY (ProductId)
    REFERENCES Products(ProductId)
);


-- =============================================
-- PROMOTIONS
-- =============================================
CREATE TABLE Promotions (
    PromotionId INT IDENTITY(1,1) PRIMARY KEY,
    PromotionName NVARCHAR(200),
    DiscountPercent INT,
    StartDate DATETIME,
    EndDate DATETIME
);


-- =============================================
-- PRODUCT PROMOTIONS
-- =============================================
CREATE TABLE ProductPromotions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT,
    PromotionId INT,

    FOREIGN KEY (ProductId)
    REFERENCES Products(ProductId),

    FOREIGN KEY (PromotionId)
    REFERENCES Promotions(PromotionId)
);


-- =============================================
-- FEEDBACK / CONTACT
-- =============================================
CREATE TABLE Feedback (
    FeedbackId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Email NVARCHAR(100),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);


-- =============================================
-- WEBSITE INFO (Google Maps / Contact Info)
-- =============================================
CREATE TABLE WebsiteInfo (
    Id INT PRIMARY KEY,
    StoreName NVARCHAR(200),
    Address NVARCHAR(255),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    GoogleMapEmbed NVARCHAR(MAX)
);


-- =============================================
-- POLICIES (Return / Warranty / Shipping)
-- =============================================
CREATE TABLE Policies (
    PolicyId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200),
    Content NVARCHAR(MAX),
    PolicyType NVARCHAR(50)
);


-- =============================================
-- INDEXES (Search & Sort Optimization)
-- =============================================
CREATE INDEX idx_product_name
ON Products(ProductName);

CREATE INDEX idx_product_price
ON Products(Price);

CREATE INDEX idx_category
ON Products(CategoryId);