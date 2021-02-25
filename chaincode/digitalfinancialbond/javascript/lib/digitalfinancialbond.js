/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DigitalFinancialBond extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const digitalFinancialBonds = [
            {
                name: 'Bond1',
                value: '2000',
                owner: 'Peter M.',
            },
            {
                name: 'Bond2',
                value: '4000',
                owner: 'Mary H.',
            },
            {
                name: 'Bond3',
                value: '6000',
                owner: 'George J.',
            },
        ];

        for (let i = 0; i < digitalFinancialBonds.length; i++) {
            digitalFinancialBonds[i].docType = 'dfb';
            await ctx.stub.putState('DFB' + i, Buffer.from(JSON.stringify(digitalFinancialBonds[i])));
            console.info('Added <--> ', digitalFinancialBonds[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryDfb(ctx, dfbNumber) {
        const dfbAsBytes = await ctx.stub.getState(dfbNumber); // get the digital financial bond from chaincode state
        if (!dfbAsBytes || dfbAsBytes.length === 0) {
            throw new Error(`${dfbNumber} does not exist`);
        }
        console.log(dfbAsBytes.toString());
        return dfbAsBytes.toString();
    }

    async createDfb(ctx, dfbNumber, _name, _value, _owner) {
        console.info('============= START : Create Digital Financial Bond ===========');

        const dfb = {
            name: _name,
            docType: 'dfb',
            value: _value,
            owner: _owner,
        };
        
        console.log(dfbNumber);
        await ctx.stub.putState(dfbNumber, Buffer.from(JSON.stringify(dfb)));
        console.info('Added <--> ', dfb);
        console.info('============= END : Create Digital Financial Bond  ===========');
    }

    async queryAllDfbs(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeDfbOwner(ctx, dfbNumber, newOwner) {
        console.info('============= START : changeDfbOwner ===========');

        const dfbAsBytes = await ctx.stub.getState(dfbNumber); // get the dfb from chaincode state
        if (!dfbAsBytes || dfbAsBytes.length === 0) {
            throw new Error(`${dfbNumber} does not exist`);
        }
        const dfb = JSON.parse(dfbAsBytes.toString());
        dfb.owner = newOwner;

        await ctx.stub.putState(dfbNumber, Buffer.from(JSON.stringify(dfb)));
        console.info('============= END : changeDfbOwner ===========');
    }

}

module.exports = DigitalFinancialBond;
