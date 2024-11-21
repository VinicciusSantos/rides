#!/bin/sh

DB_HOST=${DB_HOST:-db}
DB_USER=${POSTGRES_USER:-electio_db_user}
DB_NAME=${POSTGRES_DB:-electio_db}

echo "Waiting for the database to be available at $DB_HOST..."
while ! pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; do
  sleep 2
done

echo "Running migrations..."
npm run migrate:ts -- up

echo "Starting the server..."
exec "$@"
