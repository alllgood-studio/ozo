# OZOTOP

OZOTOP is the decentralized experts community and self-regulating society model with robonomic ecosystem.
Read more https://ozotop.io


1. Install Waves Keeper [https://chrome.google.com/webstore/detail/waves-keeper/lpilbniiabackdjcionkobglmddfbcjo]
2. Create accounts in Waves Keeper for Company and for freeze4, freeze5, freeze6 and write seeds.
3. Send 5 Waves to Company account and 1 Waves to freeze4, freeze5, freeze6 for pay     comission

## Install and run command
1. Run command:
```
npm install
cp .sm-env .env

```

2. Fill variables in file .env for example: 
```
SEEDCOMPANY="seed 1..."
FREEZE4SEED="seed 2..."
FREEZE5SEED="seed 3..."
FREEZE6SEED="seed 4..."
END_TIME_PRESELL="November 01, 2019 00:00:01"
TIME_ISSUE="August 02, 2019 00:00:01"
NAME_TOKEN="QWERTY"

```

3. Deploy token and transfer from company account to freeze4, freeze5, freeze6 by command:
```
npm run deploy
```

4. Open Waves Keeper and press button "Wallet"
![keeper](https://user-images.githubusercontent.com/11519562/62214504-d96ca180-b3ad-11e9-99f3-33d576684dea.png)

5. Choice tab wallet ![wall1](https://user-images.githubusercontent.com/11519562/62214910-a1b22980-b3ae-11e9-9c80-38e18b587d02.png)


6. For issued token OD97UH see info: 
![issue_info](https://user-images.githubusercontent.com/11519562/62215233-39177c80-b3af-11e9-981e-fc673e516f66.png)

7. Press link "View Transaction" in the opened popup window:
![info_token](https://user-images.githubusercontent.com/11519562/62215486-bcd16900-b3af-11e9-95f1-7c58a074e225.png)

8. The link redirected to new a window of the browser with the transaction:
![explorer-tx-info](https://user-images.githubusercontent.com/11519562/62215969-94963a00-b3b0-11e9-81f5-d503ba6e0f03.png)

9. Transactions after issue 1123581321 LRM8RL tokens on company account and sent tokens for freeze:
[https://wavesexplorer.com/testnet/address/3N9fzexZxi7HrPcfizpvpFcaAnvpyuuMKPg]
10. Account freeze4 get 191008824 LRM8RL tokens [https://wavesexplorer.com/testnet/address/3N15pqgAHbMviVmeoseJ7H6AGW8mSoMgpdn]
11. Account freeze5 get 191008824 LRM8RL tokens [https://wavesexplorer.com/testnet/address/3N15pqgAHbMviVmeoseJ7H6AGW8mSoMgpdn]
12. Account freeze6 get 191008824 LRM8RL tokens [https://wavesexplorer.com/testnet/address/3NB1Mapksm5wFdW6tboDPT8NAXVbsqpqUVc]
13. Company balance 550 554 849 LRM8RL: 
![company-balance](https://user-images.githubusercontent.com/11519562/62228506-73d8df00-b3c6-11e9-9d8a-6103318fcab8.png)
14. Success set script for freeze of the account freeze4 [https://wavesexplorer.com/testnet/tx/ARvHAZaxkuDcX6GmZ9doa5SuPG2YbyJ5nZZkyY5yiRMH]
15. Success set script for freeze of the account freeze5 [https://wavesexplorer.com/testnet/tx/2C9T4uyi2ikAeXPH9QwhSQvr2nbxweZTbdLtuddxX1SH]
16. Success set script for freeze of the account freeze6 [https://wavesexplorer.com/testnet/tx/3zDCQCA4PqZFchrccQL7Gu1oYdPnNzPsABV4DTUh3Pe1]
17. Company account can send order sell/buy on dex:
![listingDex](https://user-images.githubusercontent.com/11519562/62228985-653ef780-b3c7-11e9-9d1a-bf4bef40ffd3.png)


## For testing
1. Set in file surfboard.config.json seed of an account which pay comissions in devnet or testnet
2. Replace in 25 string of file surfboard.config.json "testnet" to "devnet"
3. run tests:
```
npm run ozo-test
```