package com.fluttr.slackIntegration.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

public class FltrAttachmentDTO {

    private List<FltrAttachmentItem> attachmentItemList;
    private String text;

    public List<FltrAttachmentItem> getAttachmentItemList() {
        return attachmentItemList;
    }

    public void setAttachmentItemList(List<FltrAttachmentItem> attachmentItemList) {
        this.attachmentItemList = attachmentItemList;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "FltrAttachmentDTO{" +
                "attachmentItemList=" + attachmentItemList +
                ", text='" + text + '\'' +
                '}';
    }
}
