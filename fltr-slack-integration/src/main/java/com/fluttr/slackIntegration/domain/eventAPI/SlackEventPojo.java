package com.fluttr.slackIntegration.domain.eventAPI;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.ArrayList;

public class SlackEventPojo {


 public ArrayList<String> getAuthed_users() {
  return authed_users;
 }

 public void setAuthed_users(ArrayList<String> authed_users) {
  this.authed_users = authed_users;
 }

 ArrayList< String > authed_users = new ArrayList < > ();
 private String event_id;
 private String api_app_id;
 private String team_id;
 SlackEvent slackEvent;
 private String type;
 private float event_time;
 private String token;


 // Getter Methods 

 public String getEvent_id() {
  return event_id;
 }

 public String getApi_app_id() {
  return api_app_id;
 }

 public String getTeam_id() {
  return team_id;
 }

 public SlackEvent getSlackEvent() {
  return slackEvent;
 }

 public String getType() {
  return type;
 }

 public float getEvent_time() {
  return event_time;
 }

 public String getToken() {
  return token;
 }

 // Setter Methods 

 public void setEvent_id(String event_id) {
  this.event_id = event_id;
 }

 public void setApi_app_id(String api_app_id) {
  this.api_app_id = api_app_id;
 }

 public void setTeam_id(String team_id) {
  this.team_id = team_id;
 }

 public void setSlackEvent(SlackEvent slackEventObject) {
  this.slackEvent = slackEventObject;
 }

 public void setType(String type) {
  this.type = type;
 }

 public void setEvent_time(float event_time) {
  this.event_time = event_time;
 }

 public void setToken(String token) {
  this.token = token;
 }


 // reflection toString from apache commons
 @Override
 public String toString() {
  return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
 }

}
