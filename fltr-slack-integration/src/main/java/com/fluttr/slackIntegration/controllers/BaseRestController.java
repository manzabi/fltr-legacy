package com.fluttr.slackIntegration.controllers;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class BaseRestController {

    private static final Logger logger = LoggerFactory.getLogger(BaseRestController.class);

    public static Logger getLogger() {
        return logger;
    }

}


