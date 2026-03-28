@echo off

REM Set GCP credentials
set "GOOGLE_APPLICATION_CREDENTIALS=D:\IJSE - GDSE 69\18. Cloud Architecture\docutask-vault-491622-5ae1a221eb56.json"

echo Starting DocuTask Platform...

echo Starting Config Server...
start cmd /k "cd /d docutask-backend-platform\docutask-config-server && mvn spring-boot:run"
timeout /t 5

echo Starting Eureka Server...
start cmd /k "cd /d docutask-backend-platform\docutask-eureka-server && mvn spring-boot:run"
timeout /t 5

echo Starting Microservices...
start cmd /k "cd /d docutask-backend-services\docutask-user-service && mvn spring-boot:run"
start cmd /k "cd /d docutask-backend-services\docutask-document-service && mvn spring-boot:run"
start cmd /k "cd /d docutask-backend-services\docutask-task-service && mvn spring-boot:run"

timeout /t 5

echo Starting API Gateway...
start cmd /k "cd /d docutask-backend-platform\docutask-api-gateway && mvn spring-boot:run"

echo All services are starting...
pause