# AI Resume Evaluator 📝🤖

An AI-powered resume evaluator built with NestJS and LangChain, featuring streaming responses, error handling, and complete API documentation.

## 🚀 Features
- AI-powered resume evaluation using Gemini-Pro
- Streaming responses via Server-Sent Events (SSE)
- Secure file upload handling (PDF only)
- Graceful error handling and logging
- API documentation with Swagger
- Docker support for easy deployment

---

## 🛠️ Setup Instructions

### 1 Clone the Repository
```sh
git clone https://github.com/EyaAbbassi/ai-resume-evaluator
cd ai-resume-evaluator
```

### 2 Strat the application
```sh
npm run start:dev
```

### 3 Access the API Documentation
```
http://localhost:3000/api/docs
```

### 4 Access the UI
```
http://localhost:3000/index.html
```
### 5 🐳 Docker Setup
```
docker build -t ai-resume-evaluator .
docker run -p 3000:3000 ai-resume-evaluator
```
### 6 📌 Project Structure
src/
│-- modules/
│   ├── evaluation/
│   │   ├── evaluation.controller.ts
│   │   ├── evaluation.service.ts
│   │   ├── evaluation.module.ts
│   │   ├── dto/
│-- main.ts
│-- app.module.ts
│-- .env
│-- README.md
