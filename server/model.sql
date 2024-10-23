CREATE DATABASE supermarket_db;
GO

USE supermarket_db;
GO

CREATE TABLE invoices (
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    ClientName VARCHAR(255),
    Amount DECIMAL(10, 2),
    Status VARCHAR(50),
    IsProcessing SMALLINT DEFAULT 0,
    ProcessedAt DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE()
);