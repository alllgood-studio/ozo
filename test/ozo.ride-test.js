const wvs = 10 ** 8;
require('dotenv').config();

describe('wallet test suite', async function () {

    this.timeout(500000);
    let dappTx;
    let freezeScript;
    let companyScript;
    let companyTx;
    let assetId;
    let preSellScript;
    const countTokens = 1123581321;
    const countFreeze4Years = Math.floor(countTokens * 17/100);
    const countFreeze5Years = Math.floor(countTokens * 17/100);
    const countFreeze6Years = Math.floor(countTokens * 17/100);
    const countCompany = countTokens - countFreeze4Years - countFreeze5Years - countFreeze6Years;
    const currentTime = new Date();
    const unfreeze4Date = currentTime.setFullYear(currentTime.getFullYear() + 3);
    const unfreeze5Date = currentTime.setFullYear(currentTime.getFullYear() + 4);
    const unfreeze6Date = currentTime.setFullYear(currentTime.getFullYear() + 5);
    

    before(async function () {
        await setupAccounts(
            {
                caller1: 10.05 * wvs,
                caller2: 200.05 * wvs,
                ozo: 15 * wvs,
                account1: 5 * wvs,
                account25: 10 * wvs,
                account17_4: 5 * wvs,
                account17_5: 5 * wvs,
                account17_6: 5 * wvs,
                wallet: 10.05 * wvs
            }
        );
        const walletAddress = address(accounts.wallet)
        preSellScript = file('dexSell1.ride');
        const scriptDapp = file('ozo.ride');
        companyScript = file('companyAccount.ride');

        const compiledScriptDapp = compile(scriptDapp);
        const tx = await transfer({
            recipient: '3FcnGmACQVYgWGzLEFoQt8G4TZhUxvn3sPV',
            amount: 199 * wvs
        }, accounts.caller2);
        await broadcast(tx);
        await waitForTx(tx.id)
        const scriptPrice = compile(file('ozo.ride'));
        const compiledCompany = compile(companyScript);
        freezeScript = file('freezeAccount.ride');
        companyTx = setScript({ script: compiledCompany }, accounts.account1);
        const ssTx = setScript({ script: scriptPrice }, accounts.ozo);
        // dappTx = setScript({ script: compiledScriptDapp }, accounts.ozo);
        await broadcast(ssTx);
        await waitForTx(ssTx.id)
        console.log('Script has been set')
    });

   
   
   
    it('can success issue tokens', async function () { 
        /* const scriptToken = file('smartToken.ride')
            .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${walletAddress}'`)
            let data = scriptToken;
            let buff = new Buffer(data);
            let base64data = buff.toString('base64');
            console.log('base64data :',base64data); */
            const issueParam = {
            name: Math.random().toString(36).substring(2, 8),
            description: Math.random().toString(36).substring(2, 15),
            quantity: countTokens,
            decimals: 2,
            reissuable: true,
            fee: 1.005 * wvs
            // script: base64data
        }
        const txIssue = issue(issueParam, accounts.ozo);
        await broadcast(txIssue);
        assetId = txIssue.id; 
        await waitForTx(txIssue.id);        
    })
  
    it('truly balance of the tokens', async function () {
        await assetBalance(assetId, address(accounts.ozo))
        .then((assetBal) => {
            expect(assetBal).to.equal(countTokens);
        });
    });

    it('sucsess send 17% tokens for freeze 4 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_4),
            amount: countFreeze4Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.ozo);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_4))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze4Years);
        });
    })

    it('sucsess send 17% tokens for freeze 5 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_5),
            amount: countFreeze5Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.ozo);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_5))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze5Years);
        });
    })

    it('sucsess send 17% tokens for freeze 6 year', async () => {
        const tx = await transfer({
            recipient: address(accounts.account17_6),
            amount: countFreeze6Years,
            assetId: assetId,
            fee: 0.05 * wvs
        }, accounts.ozo);
        await broadcast(tx);
        await waitForTx(tx.id)
        await assetBalance(assetId, address(accounts.account17_6))
        .then((assetBal) => {
            expect(assetBal).to.equal(countFreeze6Years);
        });
    })

    it('should be 49% tokens on ozo account', async () => {
        await assetBalance(assetId, address(accounts.ozo))
        .then((assetBal) => {
            expect(assetBal).to.equal(countCompany);
        });
    })

    it('set freeze script for 4 year', async () => {
        let time4 = Date.now();
        time4 = time4 + 18000;
        let freeze4Script = freezeScript;
        freeze4Script = freeze4Script
         .replace(1234567, time4);
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
         .replace(1234567, unfreeze5Date);
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
         .replace(1234567, unfreeze6Date);
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
            recipient: address(accounts.ozo),
            amount: countFreeze4Years,
            //attachment: 'unfreeze transfer for 4 years',
            // feeAssetId: string | null,
            assetId: assetId,
            timestamp: Date.now(),
            fee: 0.01 * wvs,
            version: 2
        }
        const tx = await transfer(transferTx, accounts.account17_4);
        await expect(broadcast(tx)).rejectedWith();
    })

  

    it('should success set script to ozo account for dex presell', async () => {
        const sellerAddress = address(accounts.ozo) || process.env.OZOADDRESS;
        const endTimePresell = Date.now() + 10000;
        let script1 = preSellScript
            .replace(`base58'3MvHSFKcaY71wp62waNAqj2NPikV8fK5nh1'`, `base58'${sellerAddress}'`);
        script1 = script1 
           .replace('12345', endTimePresell);
        const compiledScript1Precent = compile(script1);
        const ssTx = setScript({ script: compiledScript1Precent }, accounts.ozo);
        await broadcast(ssTx);
        await waitForTx(ssTx.id)
    })
   
    
    it('should success for transfer after 4 years', async () => {
        const oneMsAfterunfreeze4Date = unfreeze4Date + 1;
        const transferTx = {
            type: 4,
            recipient: address(accounts.ozo),
            amount: countFreeze4Years,
            //attachment: 'unfreeze transfer for 4 years',
            // feeAssetId: string | null,
            assetId: assetId,
            // timestamp: ,
            fee: 0.01 * wvs,
            version: 2
        }
        const tx4 = await transfer(transferTx, accounts.account17_4); 
        await broadcast(tx4);
        await waitForTx(tx4.id);
    })
    it('should null balance for transfer after 4 years', async () => {
        await assetBalance(assetId, address(accounts.account17_4))
        .then((assetBal) => {
            expect(assetBal).to.equal(0);
        });
    })
    it('can success deploy dapp', async function () {
        await broadcast(dappTx);
        await waitForTx(dappTx.id)
        console.log('dappTx :', dappTx);
    })
    it('can set price for different accounts', async function () {
        const price = 3;
        const price1 = 4;
        const iTxSet = invokeScript({
            dApp: address(accounts.ozo),
            fee: 0.09 * wvs,
            call: {
                function: "setPresellPrice",
                args: [{ type: 'integer', value: price }],
                payment: null
            },
        }, accounts.ozo);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        console.dir(iTxSet.call.args[0].value);
        expect(iTxSet.call.args[0].value).to.equal(price);

        const iTxSet1 = invokeScript({
            dApp: address(accounts.ozo),
            fee: 0.09 * wvs,
            call: {
                function: "setPresellPrice",
                args: [{ type: 'integer', value: price1 }],
                payment: null
            },
        }, accounts.ozo);

        await broadcast(iTxSet1);
        await waitForTx(iTxSet1.id);
        expect(iTxSet1.call.args[0].value).to.equal(price1);
    })

    it('check price', async () => {
        const checkingPrice = 3;
        const addCaller = address(accounts.caller1);
        await accountData(address(accounts.account1))
            .then((data) => {
                console.log('data :', data);
                expect(data[addCaller].value).to.equal(checkingPrice)
            });
    })

    it('can update price', async () => {

        const newPrice = 2;
        const iTxSet = invokeScript({
            dApp: address(accounts.account1),
            call: {
                function: "setPresellPrice",
                args: [{ type: 'integer', value: newPrice }],
                payment: null
            },
        }, accounts.account1);
        // await expect(broadcast(iTxSet)).rejectedWith();
        await broadcast(iTxSet);
        await waitForTx(iTxSet.id)
    })
    it('check  new price', async () => {
        const checkingPrice = 2;
        const addCaller = address(accounts.caller1);
        await accountData(address(accounts.account1))
            .then((data) => {
                expect(data[addCaller].value).to.equal(checkingPrice)
            });
    })
    it('succes compiled Company smart account', async function () {
        await broadcast(companyTx);
        console.log('companyTx :', companyTx);
        await waitForTx(companyTx.id)
    }); 
    /* it('can success sell expensive then bought', async function () {
        const sellOrder = {
            orderType: 'sell',
            assetPair: {
                amountAsset: string | null,
                priceAsset: string | null,
            },
            price: 2,
            amount: 4,
            timestamp: number,
            expiration: number,
            matcherFee: number,
            matcherPublicKey: string
        }
        const buyOrder = {
            orderType: 'buy',
            assetPair: {
                amountAsset: string | null,
                priceAsset: string | null,
            },
            price: 2,
            amount: 3,
            timestamp: number,
            expiration: number,
            matcherFee: number,
            matcherPublicKey: string
        }
        const exchTx = {
            type: 7,
            order1: sellOrder,
            order2: buyOrder,
            price: 2,
            amount: 1,
            buyMatcherFee: 0.003,
            sellMatcherFee: 0.003
        }

    }) */
})      
