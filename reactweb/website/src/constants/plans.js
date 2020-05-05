import {FREEMIUM, GRO, PRO, SAAS_BASIC} from './planType';

export const HP_DEV = '04a2bf08-e4e8-4bb2-831d-75098c609338';
export const HP_PROD = {
    growth: 'e6b6a03d-0a6d-4acb-bfc3-fbdcb0574f38',
    pro: 'e6b6a03d-0a6d-4acb-bfc3-fbdcb0574f38',
    enterprise: '4acb9f7e-4c6f-4701-83d1-c8bb55dc8b6b'
};

const planTypes = {
    PRO_A_M: 'pro_month_a_asc',
    PRO_A_Y: 'pro_year_a_bcv',
    PRO_B_M: 'pro_month_b_csk',
    PRO_B_Y: 'pro_year_b_prt',
    GROWTH_A_M: 'growth_month_a_uxc',
    GROWTH_A_Y: 'growth_year_a_mns',
    GROWTH_B_M: 'growth_month_b_dio',
    GROWTH_B_Y: 'growth_year_b_mio',
    TEAM_A_M: 'team_month_a_lol',
    TEAM_A_Y: 'team_year_a_pop' 
};

const featuresBasic = {
    candidates: 30,
    concurrentChallenges: 1,
    users: 4,
    templateType: 'test',
    templates: 3,
    ATSIntegration: false
};

const featuresTeam = {
    candidates: 250,
    concurrentChallenges: 2,
    users: 30,
    templateType: 'test',
    templates: 'Infinity',
    ATSIntegration: false
};

const featuresGrowth = {
    candidates: 500,
    concurrentChallenges: 3,
    users: 50,
    templateType: 'pro',
    templates: 'Infinity',
    ATSIntegration: false
};

const featuresPro = {
    candidates: 1000,
    concurrentChallenges: 5,
    users: 90,
    templateType: 'pro',
    templates: 'Infinity',
    ATSIntegration: true
};

const monthlyPlans = [
    {
        name: 'Basic',
        planStyle: 'green',
        styleInverse: false,
        buttonLabel: 'Sign up free',
        externalId: 'freemium',
        id: FREEMIUM,
        features: featuresBasic,
        abId: 'any',
        prize: '0',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Get to know Fluttr'
    },
    {
        name: 'Team',
        planStyle: 'green',
        styleInverse: false,
        buttonLabel: 'Sign up free',
        externalId: planTypes.TEAM_A_M,
        id: SAAS_BASIC,
        features: featuresTeam,
        abId: 'any',
        prize: '79',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Skill testing for small teams'
    },
    {
        name: 'Growth',
        planStyle: 'green',
        buttonLabel: 'Contact us',
        styleInverse: true,
        externalId: planTypes.GROWTH_A_M,
        id: GRO,
        features: featuresGrowth,
        abId: 'a',
        prize: '290',
        actionType: 'hubspot',
        showPricing: false,
        description: 'More power and personalization'
        // badge: {
        //     message: 'recommended'
        // }
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Contact us',
        styleInverse: true,
        externalId: planTypes.PRO_A_M,
        id: PRO,
        features: featuresPro,
        abId: 'a',
        prize: '790',
        actionType: 'hubspot',
        showPricing: false,
        description: 'Advanced features'
    },
    {
        name: 'Growth',
        planStyle: 'orange',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.GROWTH_A_M,
        id: GRO,
        features: featuresGrowth,
        abId: 'A',
        prize: '290',
        actionType: 'getStarted',
        showPricing: true,
        description: 'More power and personalization',
        badge: {
            message: 'recommended'
        }
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Contact us',
        styleInverse: false,
        externalId: planTypes.PRO_A_M,
        id: PRO,
        features: featuresPro,
        abId: 'A',
        prize: '790',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Advanced features'
    },
    {
        name: 'Growth',
        planStyle: 'orange',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.GROWTH_B_M,
        id: GRO,
        features: featuresGrowth,
        abId: 'b',
        prize: '349',
        actionType: 'getStarted',
        showPricing: true,
        description: 'More power and personalization',
        badge: {
            message: 'recommended'
        }
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.PRO_B_M,
        id: PRO,
        features: featuresPro,
        abId: 'b',
        prize: '1.290',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Advanced features'
    }
];

const yearlyPlans = [
    {
        name: 'Basic',
        planStyle: 'green',
        styleInverse: false,
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: 'freemium',
        id: FREEMIUM,
        features: featuresBasic,
        abId: 'any',
        prize: '0',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Get to know Fluttr'
    },
    {
        name: 'Team',
        planStyle: 'green',
        styleInverse: false,
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.TEAM_A_Y,
        id: SAAS_BASIC,
        features: featuresTeam,
        abId: 'any',
        prize: '59',
        save: '240',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Skill testing for small teams'
    },
    {
        name: 'Growth',
        planStyle: 'green',
        buttonLabel: 'Contact us',
        styleInverse: true,
        externalId: planTypes.GROWTH_A_Y,
        id: GRO,
        features: featuresGrowth,
        abId: 'a',
        prize: '249',
        save: '490',
        actionType: 'hubspot',
        showPricing: false,
        description: 'More power and personalization'
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Contact us',
        styleInverse: true,
        externalId: planTypes.PRO_A_Y,
        id: PRO,
        features: featuresPro,
        abId: 'a',
        prize: '690',
        save: '1.200',
        actionType: 'hubspot',
        showPricing: false,
        description: 'Advanced features'
    },
    {
        name: 'Growth',
        planStyle: 'orange',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.GROWTH_A_Y,
        id: GRO,
        features: featuresGrowth,
        abId: 'A',
        prize: '249',
        save: '490',
        actionType: 'getStarted',
        showPricing: true,
        description: 'More power and personalization',
        badge: {
            message: 'recommended'
        }
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.PRO_A_Y,
        id: PRO,
        features: featuresPro,
        abId: 'A',
        prize: '690',
        save: '1.200',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Advanced features'
    },
    {
        name: 'Growth',
        planStyle: 'orange',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.GROWTH_B_Y,
        id: GRO,
        features: featuresGrowth,
        abId: 'b',
        prize: '290',
        save: '700',
        actionType: 'getStarted',
        showPricing: true,
        description: 'More power and personalization',
        badge: {
            message: 'recommended'
        }
    },
    {
        name: 'PRO',
        planStyle: 'green',
        buttonLabel: 'Sign up free',
        styleInverse: false,
        externalId: planTypes.PRO_B_Y,
        id: PRO,
        features: featuresPro,
        abId: 'b',
        prize: '990',
        save: '3.600',
        actionType: 'getStarted',
        showPricing: true,
        description: 'Advanced features'
    }
];


export const getPricing = (abId = 'a') => {
    const env = process.env.NODE_ENV;
    let envPrefix = '';
    if (env === 'development') {envPrefix = 'dev_';}
    else if (env === 'staging') {envPrefix = 'stg_';}
    else if (env === 'qa') {envPrefix = 'qa_';}
    else if (env === 'production') {envPrefix = 'prod_';}
    const month = monthlyPlans.map((plan) => {
        const planType = plan.externalId;
        return {
            ...plan,
            externalId: `${envPrefix}${planType || plan.externalId}`
        };
    });
    const yearly = yearlyPlans.map((plan) => {
        const planType = plan.externalId;
        return {
            ...plan,

            externalId: `${envPrefix}${planType || plan.externalId}`
        };
    });

    return {
        monthly: month.filter((plan) => plan.abId === abId || plan.abId === 'any'),
        yearly: yearly.filter((plan) => plan.abId === abId || plan.abId === 'any')
    };
};