# AI Features API Documentation

## Overview

This document describes the API endpoints for the AI features implemented in the Optima Assist platform.

## Base URL

```
https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/
```

## Authentication

All functions support both authenticated and unauthenticated requests due to `verify_jwt = false` configuration. However, for production use, proper authentication should be implemented.

## Endpoints

### 1. AI Translation

**Endpoint**: `POST /ai-translation`

Translates text from one language to another in real-time during meetings.

#### Request Body

```json
{
  "meetingId": "uuid",
  "sourceText": "string",
  "sourceLanguage": "string", // Default: "en"
  "targetLanguage": "string", // Default: "es"
  "speaker": "string"
}
```

#### Response

```json
{
  "translatedText": "string",
  "sourceLanguage": "string",
  "targetLanguage": "string",
  "speaker": "string"
}
```

#### Example

```bash
curl -X POST "https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/ai-translation" \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "123e4567-e89b-12d3-a456-426614174000",
    "sourceText": "Hello, how are you?",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "speaker": "John Doe"
  }'
```

### 2. AI Notes

**Endpoint**: `POST /ai-notes`

Generates structured meeting notes from the meeting transcript and participant information.

#### Request Body

```json
{
  "meetingId": "uuid",
  "participants": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

#### Response

```json
{
  "notes": "string"
}
```

#### Example

```bash
curl -X POST "https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/ai-notes" \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "123e4567-e89b-12d3-a456-426614174000",
    "participants": [
      {"id": "1", "name": "John Doe"},
      {"id": "2", "name": "Jane Smith"}
    ]
  }'
```

### 3. QA Suggestions

**Endpoint**: `POST /ai-qa-suggestions`

Generates question-answer pairs based on meeting content to help with follow-up and clarification.

#### Request Body

```json
{
  "meetingId": "uuid",
  "participants": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

#### Response

```json
{
  "suggestions": [
    {
      "question": "string",
      "answer": "string",
      "category": "string"
    }
  ]
}
```

#### Example

```bash
curl -X POST "https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/ai-qa-suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "123e4567-e89b-12d3-a456-426614174000",
    "participants": [
      {"id": "1", "name": "John Doe"},
      {"id": "2", "name": "Jane Smith"}
    ]
  }'
```

## Health Check

All functions support GET requests for health checks:

```bash
curl "https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/ai-translation"
```

Response:
```json
{
  "status": "ok",
  "message": "AI Translation function is running",
  "timestamp": "2025-11-08T10:30:00.000Z"
}
```

## Error Handling

All functions return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid input)
- `405`: Method not allowed
- `500`: Internal server error

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```