package com.fluttr.slackIntegration.domain.eventAPI;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class SlackEvent {
 private String client_msg_id;
 private String event_ts;
 private String channel;
 private String text;
 private String type;



 private String bot_id;


 private String subtype;
 private String channel_type;
 private String user;
 private String ts;


 // Getter Methods 

 public String getClient_msg_id() {
  return client_msg_id;
 }

 public String getEvent_ts() {
  return event_ts;
 }

 public String getChannel() {
  return channel;
 }

 public String getText() {
  return text;
 }

 public String getType() {
  return type;
 }

 public String getChannel_type() {
  return channel_type;
 }

 public String getUser() {
  return user;
 }

 public String getTs() {
  return ts;
 }

 // Setter Methods 

 public void setClient_msg_id(String client_msg_id) {
  this.client_msg_id = client_msg_id;
 }

 public void setEvent_ts(String event_ts) {
  this.event_ts = event_ts;
 }

 public void setChannel(String channel) {
  this.channel = channel;
 }

 public void setText(String text) {
  this.text = text;
 }

 public void setType(String type) {
  this.type = type;
 }

 public void setChannel_type(String channel_type) {
  this.channel_type = channel_type;
 }

 public void setUser(String user) {
  this.user = user;
 }

 public void setTs(String ts) {
  this.ts = ts;
 }

 public String getSubtype() {
  return subtype;
 }

 public void setSubtype(String subtype) {
  this.subtype = subtype;
 }

 public String getBot_id() {
  return bot_id;
 }

 public void setBot_id(String bot_id) {
  this.bot_id = bot_id;
 }

 // reflection toString from apache commons
 @Override
 public String toString() {
  return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
 }

}