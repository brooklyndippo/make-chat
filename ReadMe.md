# Make Chat

A very cool dockerized project that gives AOL Instant Messenger vibes. 

## Command Reference

### To use Docker Compose

```bash
docker-compose up --build 
```

### To use Docker

1. [Build the Image](#build-the-image)
2. [Run the Container](#build-the-container)
3. [Access via Browser](#access-via-browsers)

### 1. Build the Image

```bash
docker build -t make-chat .
```

### 2. Run the Container Locally

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Access via Browser

http://localhost:3001/