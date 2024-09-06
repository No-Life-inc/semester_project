#!/bin/bash

# Convert line endings
dos2unix /entrypoint.sh

# Set execute permission on the entrypoint script
chmod +x /entrypoint.sh

# Start SQL Server
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to be ready
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -Q "SET NOCOUNT ON" -l 30 &> /dev/null
until [ $? -eq 0 ]; do
  echo "Waiting for SQL Server to be ready..."
  sleep 1
  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -Q "SET NOCOUNT ON" -l 30 &> /dev/null
done

# Execute the SQL script
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -i /create-db.sql

# Keep the container running
tail -f /dev/null
