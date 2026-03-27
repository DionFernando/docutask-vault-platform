@echo off

echo Starting DocuTask Platform...

echo Starting Config Server...
start cmd /k "cd docutask-config-server && mvn spring-boot:run"
timeout /t 5

echo Starting Eureka Server...
start cmd /k "cd docutask-service-registry && mvn spring-boot:run"
timeout /t 5

echo Starting Microservices...
start cmd /k "cd docutask-user-service && mvn spring-boot:run"
start cmd /k "cd docutask-document-service && mvn spring-boot:run"
start cmd /k "cd docutask-task-service && mvn spring-boot:run"

timeout /t 5

echo Starting API Gateway...
start cmd /k "cd docutask-api-gateway && mvn spring-boot:run"

echo All services are starting...
pause