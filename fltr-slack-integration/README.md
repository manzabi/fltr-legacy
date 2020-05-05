# The SlackIntegration Project

## About
Fluttr Slack Integration

## Technical Stack
- Java 1.8+
- Maven 3.5+
- Spring boot 2.1.0.RELEASE+
- Spotify Dockerfile Maven 1.4.10
- Lombok abstraction
- JPA with H2 for explanation
- Swagger 2 API documentation
- Spring retry and circuit breaker for external service call
- REST API model validation 
- Spring cloud config for external configuration on GIT REPO
- Cucumber and Spring Boot test for integration test
- Jenkins Pipeline for multi branch project
- Basic auth configured for API
- Continuous delivery and integration standards with Sonar check and release management
- Support retry in sanity checks  

## Installation
To run locally , you need to configure the run configuration by passing :
1. VM parameter: -DLOG_PATH=../log
2. Set SPRING profile to LOCAL

## Build and push Docker image
Build your image with mvn package and push it with mvn deploy

## Urls
- API message : http://localhost:8090/slack/sendMessage?webhookURL=https://hooks.slack.com/services/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&message=helloworld
- API button : http://localhost:8090/slack/
- swagger : http://localhost:8090/v2/api-docs
- swagger UI : http://localhost:8090/swagger-ui.html#!/
- Slack incoming webhooks list : https://api.slack.com/apps/AFZ9HMATW/incoming-webhooks

## Credentials
Basic auth : fluttrIntegration / fluttrpassword

## Contacts
- alessandro@fluttr.in 
- biagio@fluttr.in

## License
This software is licensed under the [BSD License][BSD]. For more information, read the file [LICENSE](LICENSE).

[BSD]: https://opensource.org/licenses/BSD-3-Clause
