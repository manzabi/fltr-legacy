package com.fluttr.slackIntegration.config;

public class SlackConfig {

    private String oauthURL;
    private String clientID;
    private String clientSecret;
    private String requestedParameterToExchangeForOauth;
    private String requestedParameterToExchangeForEventApi;

    private String apiClientBasicAuthUsername;
    private String apiClientBasicAuthPassword;


    private static SlackConfig instance = null;

    public static SlackConfig getInstance()
    {
        if (instance == null)
            instance = new SlackConfig();

        return instance;
    }

    public String getOauthURL() {
        return oauthURL;
    }

    public void setOauthURL(String oauthURL) {
        this.oauthURL = oauthURL;
    }

    public String getClientID() {
        return clientID;
    }

    public void setClientID(String clientID) {
        this.clientID = clientID;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getRequestedParameterToExchangeForOauth() {
        return requestedParameterToExchangeForOauth;
    }

    public void setRequestedParameterToExchangeForOauth(String requestedParameterToExchangeForOauth) {
        this.requestedParameterToExchangeForOauth = requestedParameterToExchangeForOauth;
    }

    public String getRequestedParameterToExchangeForEventApi() {
        return requestedParameterToExchangeForEventApi;
    }

    public void setRequestedParameterToExchangeForEventApi(String requestedParameterToExchangeForEventApi) {
        this.requestedParameterToExchangeForEventApi = requestedParameterToExchangeForEventApi;
    }

    public String getApiClientBasicAuthUsername() {
        return apiClientBasicAuthUsername;
    }

    public void setApiClientBasicAuthUsername(String apiClientBasicAuthUsername) {
        this.apiClientBasicAuthUsername = apiClientBasicAuthUsername;
    }

    public String getApiClientBasicAuthPassword() {
        return apiClientBasicAuthPassword;
    }

    public void setApiClientBasicAuthPassword(String apiClientBasicAuthPassword) {
        this.apiClientBasicAuthPassword = apiClientBasicAuthPassword;
    }
}