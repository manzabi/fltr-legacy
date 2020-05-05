package com.fluttr.slackIntegration.controllers;


import com.fluttr.slackIntegration.config.SlackConfig;
import com.fluttr.slackIntegration.domain.FltrAttachmentDTO;
import com.fluttr.slackIntegration.domain.eventAPI.SlackEventPojo;
import com.fluttr.slackIntegration.utils.SlackUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * https://api.slack.com/tutorials/app-creation-and-oauth
 *
 * You server’s task is to receive this code and send it back along with the Client ID and Client Secret
 * as parameters to the OAuth Access Token URL: https://slack.com/api/oauth.access
 */

@RestController()
@RequestMapping("/slack")
@Api(value = "Fluttr Slack Integration API")
public class SlackController extends BaseRestController {

    /**
     * When a user clicks your Add to Slack button, a request is sent to Slack’s servers.
     * The Client ID sent via the button click is validated and a code is sent as a GET
     * request to your Redirect URL. The code is in a JSON object named query of the request, i.e. req.query.code
     *
     * You server’s task is to receive this code and send it back along with the Client ID and Client Secret
     *  as parameters to the OAuth Access Token URL: https://slack.com/api/oauth.access
     *
     * @param req
     * @return
     */
    @RequestMapping(value = "/oauth", method = RequestMethod.GET)
    @ResponseBody
    @ApiOperation(value = "Exchange slack code for access token")
    public String getSlackAuthCode(HttpServletRequest req){

        return SlackUtils.exchangeSlackOauthInfo(req.getParameter(SlackConfig.getInstance().getRequestedParameterToExchangeForOauth()));

    }

    /**
     *
     *
     * @return
     */
    @RequestMapping(value = "/button", method = RequestMethod.GET)
    @ResponseBody
    @ApiOperation(value = "Get the Add to slack button")
    public String getAddToSlackButton() {
        return     SlackUtils.getAddToSlackButton();
    }

    /**
     *
     * @param message
     * @param webhookURL
     * @return
     */
    @RequestMapping(value = "/sendMessage", method = RequestMethod.GET)
    @ApiOperation(value = "Send message to slack webhook")
    public String sendMessageToSlackWebhook(@RequestParam String message, @RequestParam String webhookURL){

        getLogger().info("invoked sendMessage with parameters: " + message + " " +  webhookURL);

        return SlackUtils.sendSlackMessage(message, webhookURL);

    }

    @RequestMapping(value = "/sendAttachment", method = RequestMethod.POST)
    @ApiOperation(value = "Send attachment to slack webhook")
    public String sendAttachmentToSlackWebhook(@RequestBody FltrAttachmentDTO attachment, @RequestParam String webhookURL){

        getLogger().info("invoked sendAttachment with parameters: " + attachment.toString() + " " +  webhookURL);

        return SlackUtils.sendSlackAttachment(attachment, webhookURL);

    }


    @RequestMapping(value = "/receiveSlackEvent", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    @ApiOperation(value = "Receive slack event")
    public String postReceiveSlackEvent(@RequestBody SlackEventPojo slackEvent){

        getLogger().info("invoked postReceiveSlackEvent with body : " + slackEvent.toString());

        if ((slackEvent.getSlackEvent().getType().compareTo("message") == 0) &&
                            slackEvent.getSlackEvent().getText().startsWith("fltr")) {
            SlackUtils.sendSlackMessage("xexi", "https://hooks.slack.com/services/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");
        }

        return ResponseEntity.status(HttpStatus.OK).toString();

    }
}


