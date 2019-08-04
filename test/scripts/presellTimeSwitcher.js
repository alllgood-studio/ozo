const wvs = 10 ** 8;
require('dotenv').config();

describe('OZOTOP test suite', async function () {

    this.timeout(500000);
    const newDatePresell = new Date(process.env.NEW_TIME_PRESELL).getTime();
    const accounts = {};
    before(async function () {
        accounts.company = process.env.SEEDCOMPANY;    
       
        console.log('Script has been set')
    });

    it('can set endPresellDate as owner of contract', async function () {
        const iTxSet = invokeScript({
            dApp: address(accounts.company),
            fee: 0.09 * wvs,
            call: {
                function: "setEndPresellTime",
                args: [{ type: 'integer', value: newDatePresell }],
                payment: null
            },
        }, accounts.company);

        await broadcast(iTxSet);
        await waitForTx(iTxSet.id);
        expect(iTxSet.call.args[0].value).to.equal(newDatePresell);
    })
})      
