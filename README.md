# OZO

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

## For testing
1. Set in file surfboard.config.json seed of an account which pay comissions in devnet or testnet
2. run tests:
```
npm run ozo-test
```
