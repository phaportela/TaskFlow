FROM node:22-alpine AS frontend-build
WORKDIR /web
COPY taskflow-web/package*.json ./
RUN npm ci
COPY taskflow-web/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /src
COPY TaskFlowApi.Api/TaskFlowApi.Api.csproj TaskFlowApi.Api/
RUN dotnet restore TaskFlowApi.Api/TaskFlowApi.Api.csproj
COPY TaskFlowApi.Api/ TaskFlowApi.Api/
RUN dotnet publish TaskFlowApi.Api/TaskFlowApi.Api.csproj -c Release --no-restore -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=api-build /app/publish ./
COPY --from=frontend-build /web/dist ./wwwroot
ENV ASPNETCORE_HTTP_PORTS=10000
ENTRYPOINT ["dotnet", "TaskFlowApi.Api.dll"]