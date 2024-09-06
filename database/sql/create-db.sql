USE master;
GO

CREATE DATABASE books;
GO

USE books;
GO

CREATE TABLE authors(
    author_id INT IDENTITY PRIMARY KEY,
    author_guid UNIQUEIDENTIFIER,
    created_at DATETIME
);
GO

INSERT INTO authors (author_guid, created_at) VALUES (NEWID(), GETDATE());
GO