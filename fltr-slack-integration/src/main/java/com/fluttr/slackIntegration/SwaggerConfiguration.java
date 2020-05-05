package com.fluttr.slackIntegration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

import static com.google.common.collect.Lists.newArrayList;

/**
 * Configuration class which enables Swagger
 *
 * @author biagi
 */
@Configuration
@EnableSwagger2
public class SwaggerConfiguration {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.fluttr.slackIntegration.controllers"))
                .paths(PathSelectors.any())
                .build()
                .securitySchemes(Collections.singletonList(new BasicAuth("xBasic")))
                .securityContexts(Collections.singletonList(xBasicSecurityContext()))
//                .securitySchemes(newArrayList(
//                        //apiKey(),
//                        new BasicAuth("basic")
//                        , new springfox.documentation.service.OAuth("open",
//                                newArrayList(new AuthorizationScope("all", "access to all")),
//                                newArrayList(
//                                        (GrantType) new ClientCredentialsGrant("URL_TOK")
////                                    ,   new AuthorizationCodeGrant(new TokenRequestEndpoint("URL_TRE", "C_ID", "C_SE"), new TokenEndpoint("URL_TEP", "TOKNAM"))
//                                )
//                        )
//                ))
                //.securitySchemes(Collections.singletonList(apiKey()))
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        ApiInfo apiInfo = new ApiInfo(
                "Fluttr Slack Integration API",
                "Fluttr Slack Integration API documentation.",
                "API 1.0",
                "Terms of service based into company terms of use",
                new Contact("Fluttr", null, "info@fluttr.in"),
                "License of API for Fluttr use only", null, Collections.emptyList());
        return apiInfo;
    }

    private ApiKey apiKey() {
        return new ApiKey("mykey", "Authorization", "header");
    }

    private SecurityContext xBasicSecurityContext() {
        return SecurityContext.builder()
                .securityReferences(Collections.singletonList(new SecurityReference("xBasic", new AuthorizationScope[0])))
                .build();
    }


}
