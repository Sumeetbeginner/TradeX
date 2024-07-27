from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from Algorithms.Gainers.topgainers import fetch_top_gainers
from Algorithms.Gainers.toplosers import fetch_top_losers
from Algorithms.News.scrapenews import fetch_stock_news

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True, port=3000)
