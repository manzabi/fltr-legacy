export function hasProcessATestType (processSteps, type) {
    if (processSteps == null){
        return false;
    }

    let found = false;
    processSteps.forEach(function(step) {
        console.log(step);
        if (step.type == type){
            found = true;
        }
    });

    return found;
}

export function getProcessStep (candidateProcess, step) {
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return null;
    }

    let found = null;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            found = candidateProcessStep;
        }
    });

    return found;
}

export function candidateProcess (candidateProcess) {
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return null;
    }

    return candidateProcess.steps[0];
}

export function isTalentCanSeeThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            found = true;
        }
    });

    return found;
}

export function isTalentCompletedPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking completed : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.done){
                found = true;
            }
        }
    });

    return found;
}

export function isTalentEnabledPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking completed : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.enabled){
                found = true;
            }
        }
    });

    return found;
}

export function isTalentAcceptedPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking completed : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.accepted != null && candidateProcessStep.accepted){
                found = true;
            }
        }
    });

    return found;
}

export function isTalentDeclinedPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking completed : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.accepted != null && !candidateProcessStep.accepted){
                found = true;
            }
        }
    });

    return found;
}

export function isTalentAceptedPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking completed : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.accepted !== null && candidateProcessStep.accepted){
                found = true;
            }
        }
    });

    return found;
}


export function canTalentPlayThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking can play : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.enabled && (candidateProcessStep.accepted == null || candidateProcessStep.accepted) && !candidateProcessStep.expired){
                found = true;
            }
        }
    });

    return found;
}

export function candidateDeclinedStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking can play : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.accepted === false){
                found = true;
            }
        }
    });

    return found;
}

export function isTalentExpiredThisStep(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){
            //console.log('checking can play : ' + JSON.stringify(candidateProcessStep));
            if (candidateProcessStep.expired === true){
                found = true;
            }
        }
    });

    return found;
}




/**
 * Is not enabled now, but in future it could be (not present)
 */
export function canPlayThisOnlyInFuture(candidateProcess, step){
    if (candidateProcess == null || candidateProcess.steps.length == 0){
        return false;
    }

    let found = false;
    candidateProcess.steps.forEach(function(candidateProcessStep) {
        if (candidateProcessStep.processId == step.id){

            if (!candidateProcessStep.enabled){
                found = false;
            } else {
                found = true;
            }
        }
    });

    return !found;
}
