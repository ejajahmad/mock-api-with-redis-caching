# Mock API with Redis Caching

This project demonstrates a simple Node.js API using Express and Redis for caching.

## Features

- **Simulated Database**: Product data is stored in a `products.json` file.
- **Simulated Latency**: Fetching data introduces a 1-second delay to mimic slow database responses.
- **Redis Caching**: Responses are cached in Redis for 10 minutes (600 seconds).
- **Graceful Error Handling**: If Redis is unavailable, the API fetches fresh data from the simulated database.
- **Graceful Shutdown**: The Redis connection is properly closed when the server shuts down.

## Prerequisites

Ensure the following are installed on your system:

- Node.js (v16 or later recommended)
- Redis (running locally or accessible remotely)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd mock-api-with-caching
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Redis server:
   ```bash
   redis-server
   ```

4. Create a `products.json` file in the project directory with the following content:
   ```json
   [
     { "id": 1, "name": "Product 1", "price": 100 },
     { "id": 2, "name": "Product 2", "price": 200 },
     { "id": 3, "name": "Product 3", "price": 300 }
   ]
   ```

5. Start the server:
   ```bash
   node server.js
   ```

## Usage

- Access the `/data` endpoint:
  ```bash
  curl http://localhost:3000/data
  ```

- **First Request**:
  - The server fetches data from the `products.json` file (with a 1-second delay) and caches it in Redis.

- **Subsequent Requests** (within 10 minutes):
  - Data is served instantly from the Redis cache.

## File Structure

```
mock-api-with-caching/
├── products.json      # Product data file
├── server.js          # Main server script
├── package.json       # Node.js dependencies and metadata
```

## Error Handling

- If Redis is unavailable, the API fetches fresh data from the `products.json` file but does not cache the response.

## Stopping the Server

To gracefully stop the server and close the Redis connection, use:
```bash
Ctrl + C
```

