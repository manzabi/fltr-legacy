package com.fluttr.slackIntegration.utils;

import com.fluttr.slackIntegration.config.SlackConfig;
import com.fluttr.slackIntegration.constants.ApiConstants;
import com.fluttr.slackIntegration.domain.FltrAttachmentDTO;
import com.fluttr.slackIntegration.domain.FltrAttachmentItem;
import com.github.seratch.jslack.Slack;
import com.github.seratch.jslack.api.model.Attachment;
import com.github.seratch.jslack.api.webhook.Payload;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class SlackUtils {

    private static final Logger logger = LoggerFactory.getLogger(SlackUtils.class);

    enum Statuses {
        OK, KO
    }

    public static String sendSlackMessage(String message, String webhookURL){

        getLogger().info("sendSlackMessage with message: " + message + " and webhook " + webhookURL);

        String status = Statuses.KO.name();

        try {

            Payload payload = Payload.builder()
                    .text(message)
                    .build();


            status = Slack.getInstance().send(webhookURL, payload).getCode().toString();

            getLogger().info("sendSlackMessage response: " + status);


        }catch (Exception  e){

            getLogger().error("error :" + e.getMessage());

        }

        return status;
    }

    public static String sendSlackAttachment(FltrAttachmentDTO attachment, String webhookURL){

        getLogger().info("sendSlackAttachment with attachment: " + attachment.toString() + " and webhook " + webhookURL);

        String status = Statuses.KO.name();

        try {



            List<Attachment> attachments = new ArrayList<>();


            for (FltrAttachmentItem item : attachment.getAttachmentItemList()){
                Attachment att = Attachment.builder().build();
                att.setAuthorName(item.getAuthorName());
                att.setAuthorIcon(item.getAuthorIcon());
                att.setFooter(item.getFooter());
                att.setPretext(item.getPretext());
                att.setText(item.getText());
                att.setColor(item.getColor());
                attachments.add(att);
            }

            Payload payload = Payload.builder()
                    .text(attachment.getText())
                    .attachments(attachments)
                    .build();

            status = Slack.getInstance().send(webhookURL, payload).getCode().toString();

            getLogger().info("sendSlackAttachment response : " + status);


        }catch (Exception  e){

            getLogger().error("error :" + e.getMessage());

        }

        return status;
    }


    public static String exchangeSlackOauthInfo(String clientCode){

        getLogger().info("exchangeSlackOauthInfo with clientCode: " + clientCode);

        String status = Statuses.KO.name();

        try {

            HttpResponse<JsonNode> jsonResponse = Unirest.get(SlackConfig.getInstance().getOauthURL())
                    .header("accept", "application/json")
                    .queryString("code", clientCode)
                    .queryString("client_id", SlackConfig.getInstance().getClientID())
                    .queryString("client_secret", SlackConfig.getInstance().getClientSecret())
                    .asJson();

            getLogger().info("Slack OAuth response: " +  new GsonBuilder().setPrettyPrinting().create().toJson(new JsonParser().parse(jsonResponse.getBody().toString())));


            status = Statuses.OK.name();


        }catch (UnirestException ure){

            getLogger().error("error :" + ure.getMessage());

        }

        return status;

    }


    public static Logger getLogger() {
        return logger;
    }

    public static String getAddToSlackButton() {
        return ApiConstants.addToSlackButton;
    }
}
