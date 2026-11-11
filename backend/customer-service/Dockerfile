
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml /app/
COPY src /app/src/

RUN mvn clean -DskipTests package

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=build /app/target/customer-service-0.0.1-SNAPSHOT.jar /app/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "customer-service-0.0.1-SNAPSHOT.jar"]
