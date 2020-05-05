'use strict';

const { expect } = require('chai');

const attitudeLogic = require('../businesslogic/attitude.js');


describe('attitude test testing', () => {

    describe('getId', () => {
        let props;

        it('should return the props.id on existing both props.id and props.match.params.id', () => {
            const id = Math.round(1000 * Math.random()).toString();
            const opportunityId = Math.round(10 * Math.random()).toString();

            props = {
                id,
                match: {
                    params: {
                        opportunityId
                    }
                }
            };

            const result = attitudeLogic.getId(props);

            expect(result).to.be.a('string');
            expect(parseInt(result)).to.equal(parseInt(result));
            expect(result).to.equal(props.id);
            expect(result).not.to.equal(props.match.params.opportunityId);
        });

        it('should return the props.id on existing props.id', () => {
            const id = Math.round(1000 * Math.random()).toString();

            props = {
                id
            };

            const result = attitudeLogic.getId(props);

            expect(result).to.be.a('string');
            expect(parseInt(result)).to.equal(parseInt(result));
            expect(result).to.equal(props.id);
        });

        it('should return props.match.params.id on nonexisting props.id', () => {
            const opportunityId = Math.round(10 * Math.random()).toString();

            props = {
                match: {
                    params: {
                        opportunityId
                    }
                }
            };

            const result = attitudeLogic.getId(props);

            expect(result).to.be.a('string');
            expect(parseInt(result)).to.equal(parseInt(result));
            expect(result).not.to.equal(props.id);
            expect(result).to.equal(props.match.params.opportunityId);
        });

        it('should throw error on non-number props.id', () => {
            const id = 'hola';

            props = {
                id
            };

            try {
                attitudeLogic.getId(props);
            } catch ({ message }) {
                expect(message).to.equal('props.id must be a string of a number');
            }
        });

        it('should throw error on non-number props.match.params.opportunityId', () => {
            const opportunityId = 'hola';

            props = {
                match: {
                    params: {
                        opportunityId
                    }
                }
            };

            try {
                attitudeLogic.getId(props);
            } catch ({ message }) {
                expect(message).to.equal('props.match.params.opportunityId must be a string of a number');
            }
        });

        it('should throw error on no id of any kind', () => {
            props = {
                match: {
                    params: {}
                }
            };

            try {
                attitudeLogic.getId(props);
            } catch ({ message }) {
                expect(message).to.equal('props.params.match.opportunityId must be a string of a number');
            }
        });

    });

    describe('checkAll', () => {
        let state;
        it('should return true if all checked', () => {
            const totalQuestions = Math.round(300 * Math.random());
            const radios = Array(totalQuestions).fill('hola');

            state = {
                totalQuestions,
                radios
            };

            const result = attitudeLogic.checkAll(state);

            expect(result).to.exist;
            expect(result).to.be.true;
        });

        it('should return false if not all checked', () => {
            const totalQuestions = Math.round(300 * Math.random());
            const radios = Array(totalQuestions-1).fill('hola');

            state = {
                totalQuestions,
                radios
            };

            const result = attitudeLogic.checkAll(state);

            expect(result).to.exist;
            expect(result).to.be.false;
        });


    });
});