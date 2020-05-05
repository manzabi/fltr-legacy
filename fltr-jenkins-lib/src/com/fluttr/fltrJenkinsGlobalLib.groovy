src/com/fluttr/fltrJenkinsGlobalLib.groovy

import java.text.SimpleDateFormat

def notifySlack(String buildStatus = 'STARTED') {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER} by `${getBuildUser()}`:\n${env.BUILD_URL}"
    slackSend(color: color, message: msg)

}

def notifySlackWithChannel(String buildStatus = 'STARTED', String channel = "#devops") {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER} by `${getBuildUser()}`:\n${env.BUILD_URL}"

    channel = channel ?: '#builds'

    slackSend(color: color, channel: channel, message: msg)

}

def notifySlackScheduledJob(String buildStatus = 'STARTED') {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "`Scheduled Job` - ${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER} :\n${env.BUILD_URL}"
    slackSend(color: color, message: msg)

}



def notifySlacScheduledJobkWithChannel(String buildStatus = 'STARTED', String channel = "#devops") {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "`Scheduled Job` - ${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER} :\n${env.BUILD_URL}"

    channel = channel ?: '#builds'

    slackSend(color: color, channel: channel, message: msg)

}

def buildTimestamp(String dateFormat = 'yyyy_MM_dd') {

    def df = new SimpleDateFormat(dateFormat)
    def date = new Date()

    def buildTimestamp = "${BUILD_ID}_${df.format(date)}"

    return buildTimestamp
}

@NonCPS
def getBuildUser() {

        def buildUser  = ""
        
        /*try{
            buildUser = currentBuild.rawBuild.getCause(Cause.UserIdCause).getUserId()
        } catch (e) {
            buildUser = currentBuild.getRawBuild().getCauses()[0].getUserName()
        } finally {
            buildUser = "Jenkins"
        }*/

        return "Jenkins"
}

def getArtifactLatestVersion(String artifactName = 'bizAroundRest') {

    def mvnRepoUrl  = "http://mvn.fluttr.in/artifactory/libs-snapshot-local"

    def mvnGroupId    = "com/bizaround"

    def mvnDepVer   = "1.0.0-SNAPSHOT"

    def process = [ 'bash', '-c', "curl -s "+mvnRepoUrl+"/"+mvnGroupId+"/"+artifactName+"/"+mvnDepVer+"/maven-metadata.xml | grep '<value>' | head -1 | grep -oP '>\\K.*?(?=<)'" ].execute()

    return mvnRepoUrl+"/"+mvnGroupId+"/"+artifactName+"/"+mvnDepVer+"/"+artifactName+"-"+process.text+" n.war"

}
