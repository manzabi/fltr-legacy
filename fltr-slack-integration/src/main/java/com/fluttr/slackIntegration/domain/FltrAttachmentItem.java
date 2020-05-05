package com.fluttr.slackIntegration.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class FltrAttachmentItem {

    private String text;
    private String authorName;
    private String authorIcon;
    private String color;
    private String pretext;
    private String footer;
    private String imageUrl;

    public FltrAttachmentItem(@JsonProperty("text") String text, @JsonProperty("authorName") String authorName, @JsonProperty("authorIcon") String authorIcon, @JsonProperty("color") String color, @JsonProperty("pretext") String pretext, @JsonProperty("footer") String footer, @JsonProperty("imageUrl") String imageUrl) {
        this.text = text;
        this.authorName = authorName;
        this.authorIcon = authorIcon;
        this.color = color;
        this.pretext = pretext;
        this.footer = footer;
        this.imageUrl = imageUrl;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getFooter() {
        return footer;
    }

    public void setFooter(String footer) {
        this.footer = footer;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAuthorIcon() {
        return authorIcon;
    }

    public void setAuthorIcon(String authorIcon) {
        this.authorIcon = authorIcon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getPretext() {
        return pretext;
    }

    public void setPretext(String pretext) {
        this.pretext = pretext;
    }

    // reflection toString from apache commons
    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
