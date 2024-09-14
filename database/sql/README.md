rightclick on folder -> open in terminal

docker build -t mssql-books-collection .

docker run -d -p 1433:1433 --name mssql-books-collection mssql-books-collection

Check i bunden om der står CRLF, hvis ja så skift til LF

if container exits imidiately, delete "chmod +x /entrypoint.sh" from dockerfile