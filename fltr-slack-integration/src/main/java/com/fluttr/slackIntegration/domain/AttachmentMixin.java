package com.fluttr.slackIntegration.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class AttachmentMixin {
    @JsonCreator
    public AttachmentMixin(
            @JsonProperty("text")String text,@JsonProperty("authorName") String authorName,@JsonProperty("footer") String footer,@JsonProperty("imageUrl") String imageUrl) {

    }
}