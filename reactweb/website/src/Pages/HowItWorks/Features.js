const features = [
    {
        videos: {
            webm: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/challenge_creation_new.webm',
            mp4: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/challenge_creation_new.mp4',
            gif: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/challenge_creation_new.gif'
        },
        title: 'Add a challenge',
        id: 'challenge-section',
        description: [
            'A challenge is a job simulation. It’s a task you choose that allows your candidates to demonstrate that they have the skills required for the role. Set up your challenge and send it to your candidates.',
        ],
        features: [
            {
                title: 'Add your test',
                description: 'Add your own test if you have one or customize one of our templates. Set up deadlines for candidates. We’ll send them reminders.'
            },
            {
                title: 'Set up your team',
                description: [
                    'Add up to three people from your team who will review candidates’ responses',
                    'We’ll keep reminding them every time a new response comes in.',
                    'We’ll let you know if candidates are, or are not, recommended.'
                ]
            },
            {
                title: 'Invite your candidates',
                description: [
                    'After your challenge set up is complete we’ll give you a magic link that you can send to your candidates.',
                    'At this point your candidates will access Fluttr and complete your challenge. If certain candidates do not complete the challenge due to issues of motivation or capability then they are unsuitable for progression.'
                ]
            }
        ]
    },
    {
        videos: {
            webm: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.webm',
            mp4: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.mp4',
            gif: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.gif'
        },
        title: 'Assess your candidates with data',
        id: 'assess-section',
        description: ['We collect all the data about the assessment process, from CV evaluation, to challenge evaluation to candidate motivation.'],
        features: [
            {
                title: 'Candidates’ past experience',
                description: 'Review the CVs of the candidates you find relevant. Or, simply review the CVs of candidates who complete the challenge. You decide.'
            },
            {
                title: 'Candidates’ motivation',
                description: 'Thanks to gamification and Artificial Intelligence we can track candidates’ motivation for your open role. We find this a particularly good indicator for future performance in the workplace.'
            },
            {
                title: 'Candidates’ proven skills',
                description: 'We combine the feedback from your team and give you a fact-based picture of the competencies of a candidate'
            }
        ]
    },
    {
        videos: {
            webm: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.webm',
            mp4: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.mp4',
            gif: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/how_it_works/discover_fluttr_new.gif'
        },
        title: 'Rank your candidates',
        id: 'rank-section',
        description: ['Instead of relying on your intuition now you have a centralised data set. This gives you quantifiable insight on which candidates are best suited to meet your requirements.'],
        features: [
            {
                title: 'Our Recommendation Score',
                description: 'Using all data about previous hiring outcomes in our database, we can recommend which candidates are likely to represent stronger hires.'
            },
            {
                title: 'Discard candidates not fit for the role',
                description: 'You’ll find candidates not recommended by your experts or candidates that did not do the challenge. We recommend discarding and not progressing with these candidates. Once unsuitable applicants are discarded, your focus will be on viable candidates only.'
            },
            {
                title: 'Hire your first preference',
                description: 'Fluttr helps you filter and rank candidates based on their proven skills, measured motivation and past experience. But ultimately you are in charge and make the final decision based on industry expertise and quantifiable data.'
            }
        ]
    }
];

export default features;
