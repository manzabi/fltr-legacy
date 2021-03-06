package com.fluttr.slackIntegration.exceptions;

/**
 * This exception should be thrown in all cases when a resource cannot be found
 *
 * @author biagi
 */
public class NotAllowedOperationException extends RuntimeException {

    /**
     *
     * @param message the message
     */
    public NotAllowedOperationException(final String message) {
        super(message);
    }
}
