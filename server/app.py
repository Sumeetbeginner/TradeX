from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from Algorithms.Gainers.topgainers import fetch_top_gainers
from Algorithms.Gainers.toplosers import fetch_top_losers
from Algorithms.News.scrapenews import fetch_stock_news
from Algorithms.niftydata.nifty import fetch_nifty

app = Flask(__name__)

# Define CORS settings
CORS(app, resources={r"/*": {"origins": ["https://tradexs.vercel.app", "http://localhost:5173", "http://localhost:3000", "http://10.200.88.16:5173"]}})

@app.route('/', methods=['GET'])
def welcome():
    return jsonify('Hello To Trade X')

# Get Stock Info with the help of its ticker
@app.route('/stockinfo', methods=['POST'])
def stock_info():
    data = request.get_json()
    stockTickerName = data['stockTicker'] + '.NS'
    msft = yf.Ticker(stockTickerName)
    result = msft.info
    news = msft.news
    return jsonify({'result': result, 'news': news})

# Get Top Gainers
@app.route('/topgainers', methods=['GET'])
def top_gainers():
    try:
        top_gainers_list = fetch_top_gainers()
        return jsonify({'top_gainers': top_gainers_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get Top Losers
@app.route('/toplosers', methods=['GET'])
def top_losers():
    try:
        top_losers_list = fetch_top_losers()
        return jsonify({'top_losers': top_losers_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Get Stock News with the help of its ticker
@app.route('/stocknews', methods=['GET'])
def stock_news():
    try:
        news = fetch_stock_news()
        return jsonify({'news': news})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Get Nifty Data
@app.route('/niftydata', methods=['GET'])
def nifty_data():
    try:
        nifty_data = fetch_nifty()
        return jsonify({'nifty50data': nifty_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get Historical Data for a Stock
@app.route('/historicaldata', methods=['POST'])
def historical_data():
    try:
        data = request.get_json()
        stockTickerName = data['stockTicker'] + '.NS'
        period = data.get('period', '1mo')

        msft = yf.Ticker(stockTickerName)
        historical_data = msft.history(period=period)

        historical_data_json = historical_data.reset_index().to_dict(orient='records')
        
        return jsonify({'historical_data': historical_data_json})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
