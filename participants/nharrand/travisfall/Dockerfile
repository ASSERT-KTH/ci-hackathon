FROM openjdk:8-alpine

COPY target/travisfall-1.0-SNAPSHOT-jar-with-dependencies.jar /app/travisfall.jar

EXPOSE 80

CMD ["java","-jar","/app/travisfall.jar"]
