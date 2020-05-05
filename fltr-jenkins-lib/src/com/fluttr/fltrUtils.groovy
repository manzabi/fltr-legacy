package com.fluttr

import java.text.SimpleDateFormat

def getBuildTimestamp(Map parameters = [:], body) {
    def dateFormat = new SimpleDateFormat("yyyy_MM_dd")
    def date = new Date()
                    
    def buildTimestamp = "${BUILD_ID}_${dateFormat.format(date)}"

    return buildTimestamp
}
