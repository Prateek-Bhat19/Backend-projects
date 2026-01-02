```md
# Smart Link Processor

A production-style backend system that processes URLs asynchronously to extract metadata using background jobs, Redis caching, and scheduled cron tasks.

This project is focused on **backend architecture**, not UI complexity.

---

## Problem Statement

Fetching and parsing metadata from external URLs is:
- Slow
- Unreliable
- Not suitable for request–response APIs

Doing this synchronously blocks the server, increases latency, and scales poorly.

---

## Solution

This project implements a **queue-based asynchronous backend** where:
- APIs enqueue work
- Workers process URLs in the background
- Redis handles coordination and caching
- Cron jobs handle periodic maintenance

The API remains fast and responsive regardless of workload.

---

## High-Level Architecture

```

Client
↓
Express API (Producer)
↓
Redis (BullMQ Queue + Cache)
↓
Worker Process
├─ Fetch HTML
├─ Extract metadata
└─ Cache result

```

Additional process:
```

Cron Scheduler
↓
Enqueues maintenance jobs

````

---

## Key Features

### 1. Asynchronous Background Processing
- URLs are processed using **BullMQ workers**
- API never blocks on external HTTP calls
- Jobs retry automatically on failure

### 2. Redis Caching & Deduplication
- Extracted metadata is cached in Redis
- Repeated requests for the same URL return instantly
- Cache entries use TTL to avoid stale data

### 3. Fault-Tolerant Metadata Extraction
- HTML parsing is **best-effort**
- Malformed or partial HTML does not crash the system
- Jobs return partial metadata when needed

### 4. Cron-Based Maintenance Jobs
- Periodic cron job reprocesses cached URLs
- Ensures metadata freshness over time
- Cron jobs enqueue work instead of executing logic directly

### 5. Clean Separation of Concerns
- API: request validation and job creation
- Worker: slow and unreliable operations
- Redis: queue + cache
- Cron: scheduling only

---

## API Endpoints

### `POST /links`

Submit a URL for processing.

**Request**
```json
{
  "url": "https://example.com"
}
````

**Responses**

* `202 Accepted` → Job queued for processing
* `200 OK` → Metadata served from cache

---

## Project Structure

```
src/
 ├─ app.ts              # Express API
 ├─ server.ts           # API bootstrap
 ├─ queue/              # Redis + BullMQ setup
 ├─ worker/             # Background worker logic
 ├─ cron/               # Scheduled jobs
 └─ utils/              # Helpers (URL normalization, etc.)
```

Each responsibility runs in its **own process**.

---

## How It Runs

The system runs as three independent processes:

```bash
npm run dev     # API server
npm run worker  # Background worker
npm run cron    # Scheduled jobs
```

This project demonstrates:

* Queue-based backend architecture
* Proper use of Redis beyond simple caching
* Resilient background job design
* Production-safe cron scheduling
* Cost and performance optimization techniques

---

```
