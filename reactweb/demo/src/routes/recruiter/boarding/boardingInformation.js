import boardingSvg from './boardingSvg';
export default {
    steps: [
        {
            name: 'Add company information',
            number: 1,
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-1-0.jpg',
            description: {
                title: 'Input your company information and let your potential candidates get to know you',
                body: []
            },
            chilldren: null
        },
        {
            name: 'Add job specifications',
            number: 2,
            custom: true,
            image: boardingSvg(),
            description: null,
            chilldren: [
                {
                    name: 'Add job description ',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-2-1.jpg',
                    number: 1,
                    description: {
                        title: 'Add the job title and specifications of the open position.\n It will only take a few minutes!',
                        body: []
                    }
                },
                {
                    name: 'Add tags (required skills)',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-2-2.jpg',
                    number: 2,
                    description: {
                        title: 'What skills are critical for the job? Add them!',
                        body: []
                    }
                },
                {
                    name: 'Publish',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-2-3.jpg',
                    number: 3,
                    description: {
                        title: 'Your company profile and job posting have been published!',
                        body: [
                            'Now you can add a challenge to screen your candidates better and faster!']
                    }
                }
            ]
        },
        {
            name: 'Create a challenge',
            number: 3,
            description: {
                title: 'What is a Challenge?',
                body: ['Test your applicants through completing a job-task specific to the role they applied to, and have experts analyze and screen the candidates answers.']
            },
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-3-0.jpg',
            chilldren: [
                {
                    name: 'Invite experts ',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-3-1.jpg',
                    number: 1,
                    description: {
                        title: 'Invite the hiring manager or other experts on this role to blindly evaluate all candidates\' responses.',
                        body: []
                    }
                },
                {
                    name: 'Create challenge',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-3-2.jpg',
                    number: 2,
                    description: {
                        title: 'Add the challenge or ask one of your experts to do it for you.',
                        body: ['Don\'t you have a challenge? Get in touch with us and we will help you!']
                    }
                },
                {
                    name: 'Invite applicants',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-3-3.jpg',
                    number: 3,
                    description: {
                        title: 'Your challenge has been published!',
                        body: [
                            'Your challenge has been published! Find and invite your candidates!',
                            'Now all you have to do is to invite candidates and wait for their responses.'
                        ]
                    }
                }
            ]
        },
        {
            name: 'Rank candidates',
            number: 4,
            description: {
                title: 'View and see the status of all of your candidates on our intuitive dashboard.',
                body: []
            },
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-4-0.jpg',
            chilldren: [
                {
                    name: 'Measure the experience ',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-4-1.jpg',
                    number: 1,
                    description: {
                        title: 'Evaluate each candidates CV’s and leave your personal notes.',
                        body: []
                    }
                },
                {
                    name: 'Measure the skills',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-4-2.jpg',
                    number: 2,
                    description: {
                        title: 'View the experts feedback on your candidates challenge results',
                        body: []
                    }
                },
                {
                    name: 'Recommendation score',
                    image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/image-onboarding-4-3.jpg',
                    number: 3,
                    description: {
                        title: 'Using artificial intelligence, each candidates recommendation score also includes their motivation level!',
                        body: []
                    }
                }
            ]
        }
    ]
};
