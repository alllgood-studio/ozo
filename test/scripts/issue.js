const wvs = 10 ** 8;
require('dotenv').config();

describe('OZOTOP test suite', async function () {

    this.timeout(500000);
    let dappTx;
    let freezeScript;
    let companyScript;
    let companyTx;
    let assetId;
    // let preSellScript;
    const countTokens = "112358132100000000";
    const countFreeze4Years = "19100882400000000"; // Math.floor(countTokens * 17/100)/wvs;
    const countFreeze5Years = "19100882400000000"; // Math.floor(countTokens * 17/100)/wvs;
    const countFreeze6Years = "19100882400000000"; // Math.floor(countTokens * 17/100)/wvs;
    const countCompany = Number(countTokens) - Number(countFreeze4Years) - Number(countFreeze5Years) - Number(countFreeze6Years);
    const endTimePresell = new Date(process.env.END_TIME_PRESELL).getTime();
    const timeIssue = new Date(process.env.TIME_ISSUE);
    const dayInMs = 86400000;
    const unfreeze4Date = timeIssue.setFullYear(timeIssue.getFullYear() + 3) + dayInMs;
    const unfreeze5Date = timeIssue.setFullYear(timeIssue.getFullYear() + 1) + dayInMs;
    const unfreeze6Date = timeIssue.setFullYear(timeIssue.getFullYear() + 1) + dayInMs;
    console.log('unfreeze4Date :', unfreeze4Date, unfreeze5Date, unfreeze6Date);
    
    const accounts = {};
    before(async function () {
        accounts.company = process.env.SEEDCOMPANY
        accounts.account17_4 = process.env.FREEZE4SEED
        accounts.account17_5 = process.env.FREEZE5SEED
        accounts.account17_6 = process.env.FREEZE6SEED
        
        console.log('address(account.company) :', address(accounts.company));
        companyScript = file('companyAccount.ride');
        const compiledCompany = compile(companyScript);
        freezeScript = file('freeze4Account.ride');
        companyTx = setScript({ script: compiledCompany, fee: 1400000 }, accounts.company);
        await broadcast(companyTx);
        await waitForTx(companyTx.id)
        console.log('Script has been set')
    });

    it('can success issue tokens', async function () {
        const ozoAddress = address(accounts.company)
        const scriptToken = file('tokenOzotop.ride')
            .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${ozoAddress}'`)
            let compiledScript = compile(scriptToken);
            const issueParam = {
            name: process.env.NAME_TOKEN, // + Math.random().toString(36).substring(2, 8).toUpperCase(), // process.env.NAME_TOKEN,
            description: `OZOTOP is the decentralized experts community and self-regulating society model with robonomic ecosystem.
                Read more https://ozotop.io`,
            quantity: countTokens,
            decimals: 8,
            reissuable: true,
            fee: 1.005 * wvs,
            script: compiledScript
        }
        const txIssue = issue(issueParam, accounts.company);
        await broadcast(txIssue);
        assetId = txIssue.id; 
        await waitForTx(txIssue.id);        
    })
  
    it('truly balance of the tokens', async function () {
        await assetBalance(assetId, address(accounts.company))
        .then((assetBal) => {
            expect(assetBal).to.equal(Number(countTokens));
        });
    });
    it('can set endPresellDate as owner of contract', async function () {
        const iTxSet = invokeScript({
            dApp: address(accounts.company),
            fee: 0.09 * wvs,
            call: {
                function: "setEndPresellTime",
                args: [{ type: 'integer', value: endTimePresell }],
                payment: null
            },
        }, accounts.company);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        console.dir(iTxSet.call.args[0].value);
        expect(iTxSet.call.args[0].value).to.equal(endTimePresell);
    })
    it('can set tokenId as owner of contract', async function () {
        const iTxSet = invokeScript({
            dApp: address(accounts.company),
            fee: 0.09 * wvs,
            call: {
                function: "setTokenId",
                args: [{ type: 'string', value: assetId }],
                payment: null
            },
        }, accounts.company);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        console.dir(iTxSet.call.args[0].value);
        expect(iTxSet.call.args[0].value).to.equal(assetId);
    })
    it('should be rejected when non owner try set endPresellDate ', async function () {
        const iTxSet = invokeScript({
            dApp: address(accounts.company),
            fee: 0.01 * wvs,
            call: {
                function: "setEndPresellTime",
                args: [{ type: 'integer', value: endTimePresell }],
                payment: null
            },
        }, accounts.account17_4);

        expect(broadcast(iTxSet)).rejectedWith();
    })
    it('success send 17% tokens for freeze 4 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_4),
            amount: countFreeze4Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.company);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_4))
        .then((assetBal) => {
            expect(assetBal).to.equal(Number(countFreeze4Years));
        });
    })

    it('success send 17% tokens for freeze 5 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_5),
            amount: countFreeze5Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.company);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_5))
        .then((assetBal) => {
            expect(assetBal).to.equal(Number(countFreeze5Years));
        });
    })

    it('success send 17% tokens for freeze 6 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_6),
            amount: countFreeze6Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.company);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_6))
        .then((assetBal) => {
            expect(assetBal).to.equal(Number(countFreeze6Years));
        });
    })

    it('should be 49% tokens on company account', async () => {
        await assetBalance(assetId, address(accounts.company))
        .then((assetBal) => {
            expect(assetBal).to.equal(countCompany);
        });
    })

    it('set freeze script for 4 year', async () => {
        let freeze4Script = freezeScript;
        freeze4Script = freeze4Script
         .replace(1659474001000, unfreeze4Date)
         .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${address(accounts.company)}'`);
        const compiled4Script =  compile(freeze4Script);
        const tx4 = setScript({ script: compiled4Script }, accounts.account17_4);
        await broadcast(tx4);
        await waitForTx(tx4.id)
        await assetBalance(assetId, address(accounts.account17_4))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze4Years);
        });
    })

    it('set freeze script for 5 year', async () => {
        let freeze5Script = freezeScript;
        freeze5Script = freeze5Script
         .replace(1659474001000, unfreeze5Date)
         .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${address(accounts.company)}'`);
        const compiled4Script =  compile(freeze5Script);
        const tx5 = setScript({ script: compiled4Script }, accounts.account17_5);
        await broadcast(tx5);
        await waitForTx(tx5.id)
        await assetBalance(assetId, address(accounts.account17_5))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze5Years);
        });
    })

    it('set freeze script for 6 year', async () => {
        let freeze6Script = freezeScript;
        freeze6Script = freeze6Script
         .replace(1659474001000, unfreeze6Date)
         .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${address(accounts.company)}'`);
        const compiled6Script =  compile(freeze6Script);
        const tx6 = setScript({ script: compiled6Script }, accounts.account17_6);
        await broadcast(tx6);
        await waitForTx(tx6.id)
        await assetBalance(assetId, address(accounts.account17_6))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze6Years);
        });
    })

    it('should be rejected for transfer before 4 years', async () => {
        const transferTx = {
            type: 4,
            recipient: address(accounts.company),
            amount: countFreeze4Years,
            // attachment: "unfreeze transfer for 4 years",
            // feeAssetId: string | null,
            assetId: assetId,
            timestamp: Date.now(),
            fee: 0.01 * wvs,
            version: 2
        }
        const tx = await transfer(transferTx, accounts.account17_4);
        await expect(broadcast(tx)).rejectedWith();
    })


    it('should be rejected for transfer before 5 years', async () => {
        const transferTx = {
            type: 4,
            recipient: address(accounts.company),
            amount: countFreeze4Years,
            // attachment: "unfreeze transfer for 5 years",
            // feeAssetId: string | null,
            assetId: assetId,
            timestamp: Date.now(),
            fee: 0.01 * wvs,
            version: 2
        }
        const tx = await transfer(transferTx, accounts.account17_5);
        await expect(broadcast(tx)).rejectedWith();
    })


    it('should be rejected for transfer before 6 years', async () => {
        const transferTx = {
            type: 4,
            recipient: address(accounts.company),
            amount: countFreeze4Years,
            // attachment: "unfreeze transfer for 6 years",
            // feeAssetId: string | null,
            assetId: assetId,
            timestamp: Date.now(),
            fee: 0.01 * wvs,
            version: 2
        }
        const tx = await transfer(transferTx, accounts.account17_6);
        await expect(broadcast(tx)).rejectedWith();
    })
  
 
})      
