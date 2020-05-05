package com.fluttr.slackIntegration;

import java.util.Collections;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fluttr.slackIntegration.config.SlackConfig;
import com.fluttr.slackIntegration.constants.ApiConstants;
import com.fluttr.slackIntegration.utils.SlackUtils;
import com.fluttr.slackIntegration.utils.YamlPropertySourceFactory;
import com.github.seratch.jslack.Slack;
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
@EnableRetry
@PropertySource(factory = YamlPropertySourceFactory.class, value = "classpath:slackconfig.yml")
public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);



    public static void main(String[] args) {
        final SpringApplication springApplication =
            new SpringApplication(Application.class);
        // ir is being added here for LOCAL run ONLY , spring profiles should be be run time parameters when run spring boot jar
        springApplication.setDefaultProperties(Collections.singletonMap("spring.profiles.default","LOCAL"));
        springApplication.addListeners(new ApplicationPidFileWriter());

        ConfigurableApplicationContext ctx = springApplication.run(args);

        setSlackProperties(ctx.getEnvironment());


    }

    private static void setSlackProperties(ConfigurableEnvironment env){

        SlackConfig sc = SlackConfig.getInstance();

        sc.setOauthURL(env.getProperty(ApiConstants.SLACK_OAUTH_ACCESS_TOKEN_URL));

        sc.setClientID(env.getProperty(ApiConstants.FLUTTR_SLACK_APP_CLIENT_ID));

        sc.setClientSecret(env.getProperty(ApiConstants.FLUTTR_SLACK_APP_CLIENT_SECRET));

        sc.setRequestedParameterToExchangeForOauth(env.getProperty(ApiConstants.SLACK_PARAMETER_NAME));

        sc.setRequestedParameterToExchangeForEventApi(env.getProperty(ApiConstants.SLACK_EVENT_API_CHALLENGE));

        logger.info("oauth url: " + sc.getOauthURL());
        //logger.info("client id: " + sc.getClientID());
        //logger.info("client secret: " + sc.getClientSecret());
        logger.info("req parameter for oauth: " + sc.getRequestedParameterToExchangeForOauth());
        logger.info("req parameter for event api: " + sc.getRequestedParameterToExchangeForEventApi());

    }

    /**
     *
     * Avoid Jackson mapping exception when passing a null object as parameter
     *
     *
     * @return
     */
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        MappingJackson2HttpMessageConverter converter =
                new MappingJackson2HttpMessageConverter(mapper);
        return converter;
    }

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

}
