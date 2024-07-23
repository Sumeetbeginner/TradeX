
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def welcome():
    return jsonify('Hello To Trade X')


# Get Stock Info with the help of its ticker
# {
#     "stockTicker" : "ZOMATO"
# }
@app.route('/stockinfo', methods=['POST'])
def stock_info():
    data = request.get_json()
    stockTickerName = data['stockTicker'] + '.NS'
    msft = yf.Ticker(stockTickerName)
    result = msft.info
    news = msft.news
    return jsonify({'result': result, 'news': news}) 

if __name__ == '__main__':
    app.run(debug=True, port = 3000)