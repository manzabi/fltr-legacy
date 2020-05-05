import { agreeableness } from './personality/agreeableness';
import { conscientiousness } from './personality/conscientiousness';
import { extraversion } from './personality/extraversion';
import { neuroticism } from './personality/neuroticism';
import { openess } from './personality/openess';

export function getResult(score, count) {
    const average = score / count;
    let result = 'neutral';
    if (average > 3) {
        result = 'high';
    } else if (average < 3) {
        result = 'low';
    }
    return result;
}

export function reduceFactors(a, b) {
    if (!a[b.domain]) {
        a[b.domain] = { score: 0, count: 0, result: 'neutral', facet: {} };
    }

    a[b.domain].score += parseInt(b.score || 0, 10);
    a[b.domain].count += 1;
    a[b.domain].result = getResult(a[b.domain].score, a[b.domain].count);

    if (b.facet) {
        if (!a[b.domain].facet[b.facet]) {
            a[b.domain].facet[b.facet] = { score: 0, count: 0, result: 'neutral' };
        }
        a[b.domain].facet[b.facet].score += parseInt(b.score || 0, 10);
        a[b.domain].facet[b.facet].count += 1;
        a[b.domain].facet[b.facet].result = getResult(a[b.domain].facet[b.facet].score, a[b.domain].facet[b.facet].count);
    }

    return a;
}

export function calculateScore(data) {
    if (!data) {
        return { error: 'Missing required input' };
    }

    if (!Array.isArray(data)) {
        return { error: 'Wrong format. Data must be an array' };
    }

    return data.reduce(reduceFactors, {});
}

export function findDomain(answers) {
    const domainResults = Object.keys(answers).map(key => {
        const answer = answers[key];
        const answerFacets = answer['facet'];
        const domain = getDomain(key);
        // console.log('Key : ' + key + ' Domain : ' + domain);
        const facetMapper = facet => {
            const answerFacet = answerFacets[facet.facet.toString()] || {};
            return Object.assign(facet, { scoreText: answerFacet.result, score: answerFacet.score, count: answerFacet.count });
        };
        const facets = domain.facets.map(facetMapper).map(facet => Object.assign({ facet: facet.facet, title: facet.title, text: facet.text, score: facet.score, count: facet.count, scoreText: facet.scoreText }));
        const result = domain.results.find(r => r.score === answer.result);
        // console.log(results)
        return {
            domain: domain.domain,
            title: domain.title,
            shortDescription: domain.shortDescription,
            description: domain.description,
            scoreText: result.score,
            count: answer.count,
            score: answer.score,
            facets: facets.filter(f => f.score),
            text: result.text
        };
    });
    return domainResults;
}

export function getDomain(key) {
    switch (key) {
        case 'A':
            return agreeableness;
        case 'C':
            return conscientiousness;
        case 'E':
            return extraversion;
        case 'N':
            return neuroticism;
        case 'O':
            return openess;
    }
}
