-- NovaStore E-Ticaret Veri Yönetim Sistemi
-- Teslim Dosyası: Student_NovaStore_Proje.sql

-- =============================================
-- BÖLÜM 1: Veri Tabanı Tasarımı (DDL)
-- =============================================

CREATE DATABASE NovaStoreDB;
GO
USE NovaStoreDB;
GO

-- Kategoriler Tablosu
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(50) NOT NULL
);

-- Ürünler Tablosu
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Müşteriler Tablosu
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(50) NOT NULL,
    City VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL
);

-- Siparişler Tablosu
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Sipariş Detaylar Tablosu
CREATE TABLE OrderDetails (
    DetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

-- =============================================
-- BÖLÜM 2: Veri Girişi (DML)
-- =============================================

-- Kategoriler
INSERT INTO Categories (CategoryName) VALUES 
('Elektronik'), ('Giyim'), ('Kitap'), ('Kozmetik'), ('Ev ve Yaşam');

-- Ürünler
INSERT INTO Products (ProductName, Price, Stock, CategoryID) VALUES 
('Akıllı Telefon', 15000, 15, 1),
('Laptop', 25000, 5, 1),
('Kulaklık', 1200, 25, 1),
('T-Shirt', 400, 50, 2),
('Jean Pantolon', 800, 30, 2),
('Roman', 150, 100, 3),
('Yazılım Kitabı', 300, 10, 3),
('Ruj', 200, 40, 4),
('Parfüm', 1100, 12, 4),
('Koltuk', 5000, 8, 5),
('Lamba', 600, 22, 5),
('Halı', 2000, 18, 5);

-- Müşteriler
INSERT INTO Customers (FullName, City, Email) VALUES 
('Ahmet Yılmaz', 'İstanbul', 'ahmet@example.com'),
('Ayşe Demir', 'Ankara', 'ayse@example.com'),
('Mehmet Kaya', 'İzmir', 'mehmet@example.com'),
('Fatma Çelik', 'Bursa', 'fatma@example.com'),
('Can Özkan', 'Antalya', 'can@example.com'),
('Zeynep Aydın', 'İstanbul', 'zeynep@example.com');

-- Siparişler
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount) VALUES 
(1, '2026-01-10', 16200),
(2, '2026-02-15', 25000),
(3, '2026-03-05', 150),
(1, '2026-03-20', 1200),
(4, '2026-04-01', 1200),
(5, '2026-04-10', 6000),
(6, '2026-04-15', 1300),
(2, '2026-04-20', 400),
(3, '2026-04-25', 300),
(1, '2026-04-28', 15000);

-- Sipariş Detayları
INSERT INTO OrderDetails (OrderID, ProductID, Quantity) VALUES 
(1, 1, 1), (1, 3, 1),
(2, 2, 1),
(3, 6, 1),
(4, 3, 1),
(5, 3, 1),
(6, 10, 1), (6, 11, 1),
(7, 9, 1), (7, 8, 1),
(8, 4, 1),
(9, 7, 1),
(10, 1, 1);
GO

-- =============================================
-- BÖLÜM 3: Sorgulama ve Analiz
-- =============================================

-- 1. Stok miktarı 20'den az olan ürünler
SELECT ProductName, Stock FROM Products 
WHERE Stock < 20 
ORDER BY Stock ASC;

-- 2. Hangi müşteri, hangi tarihte sipariş vermiş?
SELECT C.FullName, C.City, O.OrderDate, O.TotalAmount 
FROM Customers C 
INNER JOIN Orders O ON C.CustomerID = O.CustomerID;

-- 3. Ahmet Yılmaz isimli müşterinin aldığı ürünler
SELECT P.ProductName, P.Price, Cat.CategoryName 
FROM Customers C 
JOIN Orders O ON C.CustomerID = O.CustomerID 
JOIN OrderDetails OD ON O.OrderID = OD.OrderID 
JOIN Products P ON OD.ProductID = P.ProductID 
JOIN Categories Cat ON P.CategoryID = Cat.CategoryID 
WHERE C.FullName = 'Ahmet Yılmaz';

-- 4. Kategori başına ürün sayısı
SELECT Cat.CategoryName, COUNT(P.ProductID) as ProductCount 
FROM Categories Cat 
LEFT JOIN Products P ON Cat.CategoryID = P.CategoryID 
GROUP BY Cat.CategoryName;

-- 5. Müşteri bazlı toplam ciro (Azalan sırada)
SELECT C.FullName, SUM(O.TotalAmount) as TotalRevenue 
FROM Customers C 
JOIN Orders O ON C.CustomerID = O.CustomerID 
GROUP BY C.FullName 
ORDER BY TotalRevenue DESC;

-- 6. Siparişlerin üzerinden kaç gün geçti?
SELECT OrderID, DATEDIFF(day, OrderDate, GETDATE()) as DaysPassed 
FROM Orders;
GO

-- =============================================
-- BÖLÜM 4: İleri Seviye Nesneler
-- =============================================

-- view oluşturma
GO
CREATE VIEW vw_SiparisOzet AS
SELECT C.FullName, O.OrderDate, P.ProductName, OD.Quantity
FROM Customers C
JOIN Orders O ON C.CustomerID = O.CustomerID
JOIN OrderDetails OD ON O.OrderID = OD.OrderID
JOIN Products P ON OD.ProductID = P.ProductID;
GO

-- Yedekleme komutu örneği
-- BACKUP DATABASE NovaStoreDB TO DISK = 'C:\Yedek\NovaStoreDB.bak';
