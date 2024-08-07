<!-- 1. Client Setup -->

<!-- 2. Setup React Routers for all Components and create components => Welcome, Signup, Login, Home, Portfolio, Wishlist, Wallet, Profile, Setting -->

<!-- 3. Firebase Setup & If user is not authenticated redirect to Welcome Page -->

<!-- 4. Welcome Page -->

<!-- 5. Signup Page with Auth and save data in firebase -->

<!-- 6. Login Page with Auth and retrieve data from firebase and store in global variable

7. When Page reloads and user is authenticated retrieve its data and store that into global variable -->

<!-- 8. Navbar with Element and active -> Home, Portfolio,Search, Wishlist, wallet, setting, profile -->

<!-- 9. Create a Search bar a on search page and search stock based on  nse csv file and store that stock file currStock Variable Global -->

<!-- 10. Setup flask and Start Flask Server and create an api to get currStockDetails with the help of stockticker with the help of yfinance api
and pass the stock data on stockinfo page var -->

<!-- 11. Filter More Imp Data to show on Dashboard -->

<!-- 12. Show Stock Name Price and Change and Navbar -->

<!-- 13. User Chartjs and show open, low, high , current on line chart -->

<!-- 14. Update Value Call server stock update Every 5 second and reload functionality -->

<!-- 15. Button Buy and Sell and imp info unscrollable on left side box -->

<!-- 16. All Other Data on right side stock box scrollable -->

<!-- 17. Create a Save functionality -->

<!-- 18. Fix a Bug in Saved functionality everything is working right but if its saved and at initialization it doesnt check -->

<!-- 19. Make Full Code Manageable with comments if needed... -->

<!-- 20. Show Saved Files in wishlist [stockname  stockPrice stockChange saveicon] in this format -->

<!-- 21. Apply CSS to Wishlist -->

<!-- 22. Handle remove from saved Icon -->

<!-- 23. Handle on click name of stock open stockinfo -->

<!-- 24. Create Wallet Dashboard ONLY UI -> Last 5 transaction analytics graph , Last 30 Transactions History, last 30 transactions pie graph profit/loss, Wallet (Balance) -->

<!-- 25. Create Right Wallet UI -->

<!-- 26. Create a Buy Functionality and save transaction if less than 30 length of transaction array remove oldest transaction and push new transaction else push transaction {transMess, transAmt, transStatus : {debit/credit}} AND Update Portfolio {stockticker , stockname, quantity, buyprice per stock} AND Update StockInfo and Wishlist every 5 seconds -->

<!-- 27. show all transactions hisory below wallet balance -->

<!-- 28. Show Last 5 Stock Analytics & and pie chart for debit and credit -->

<!-- 29. Show Portfolio on table {index, stockname, quantity, buyprice*quantity, currPrice*quantity, rupee change, percent change sell} -->

<!-- 30. Apply CSS on Portfolio -->

<!-- 31. Onclick ticker on portfolio open that stock info -->

<!-- 33. Apply Sell Functionality from stockinfo

34. Apply Sell Functionality from portfolio -->

<!-- 35. Fix Not Harmful Bug - After Portfolio length is empty it is not updating portfolio page only ui  -->

<!-- 36. Fix all New User Bug -->

<!-- 37. Get Top Gainers and Top Loser Today's Ticker using webscraping -->

<!-- 38. Create API for both top gainers and top losers and return the output in json -->

<!-- 39. On home page call the api for topgainers and store it in json object and then call stockinfo api for each ticker in object and store (stockname, stockticker, currentprice, perChange, priceC ) -->

<!-- 40. Fetch topgainers and toplosers simulataneously and show on home page -->

<!-- 41. Fix and Apply CSS To Home Page -->

<!-- 41. Create and test api for curr business news webscrape the news -->

<!-- 42. Move TopGainers and TopLosers to Search Page -->

<!-- 43. Keep Search bar at home page too -->

<!-- 44. Onclick stock open stockinfo in top gainers and toplosers -->

<!-- 45. Create Layout for home Page -->

<!-- 46. Show News on Righbar home page -->

<!-- 47. Fetch Nifty 50 Data and show graph and data on home page -->

<!-- 47. On Home Page -> Nifty Data,Show Wallet Balance, News -->

48. Setting Feature
    {
    <!-- 1. Create Setting UI -> Personal Details, Security -> Lock App, Setting, Themes, Wallet Setting -> Change Salary(Premium), Other Icons -->

    <!-- 2. Create Setting Update Functionality + Back Button -->

    <!-- 3. Change Theme Functionality -->

    <!-- 4. Other Icons UI -->

    <!-- 5. Wallet Setting Functionality -->

    <!-- 6. Show Premium Box when setShowPrem is True -->

    7. Security - Set Passcode for buying and selling stocks

    8. No Stock Found -> CSS

    9. Paymemt Integration for Buying Premium
}

49. News Feature in stock Info

<!-- 50. Download feature in stock info -->

51. Analytics feature in stock info

52. User Profile Feature

<!-- 53. Change Firebase Credential or new firebase acc and use env var and store that there  -->

0. Update Nifty 50 Data Every 5 Seconds

1. Uncomment update top gainers and toplosers every 5 seconds

2. Forgot Password functionality in login

3. Functionality : user can buy and sell stocks between 9.15 to 3.00pm (Monday to Friday)

4. Every Month update balance + salary

5. Optimization
   {

}

0. Updates
   {

}
