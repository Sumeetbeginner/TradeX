import requests
from bs4 import BeautifulSoup
import json
from fuzzywuzzy import process, fuzz

def fetch_top_gainers():
    def fetch_data(url):
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.text

    def parse_top_gainers(html):
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table', {'class': 'tb10Table'})
        if not table:
            raise ValueError("Table not found on the page")
        rows = table.find('tbody').find_all('tr')
        tickers = []
        for row in rows:
            td = row.find('a', {'class': 'mtp438CompanyName'})
            if td:
                company_name = td.get_text(strip=True)
                tickers.append(company_name)
        return tickers[:10]

    def load_ticker_mapping(json_file):
        with open(json_file, 'r') as file:
            data = json.load(file)
        ticker_map = {item['NAME OF COMPANY']: item['SYMBOL'] for item in data}
        return ticker_map

    def convert_to_tickers(company_names, ticker_map):
        filtered_tickers = []
        for name in company_names:
            closest_match, score = process.extractOne(name, ticker_map.keys(), scorer=fuzz.ratio)
            if score >= 50:
                filtered_tickers.append(ticker_map.get(closest_match, 'Ticker Not Found'))
            else:
                filtered_tickers.append('Ticker Not Found')
        return filtered_tickers

    top_gainers_url = 'https://groww.in/markets/top-gainers?index=GIDXNIFTY500'
    json_file_path = './nse.json'
    top_gainers_html = fetch_data(top_gainers_url)
    top_gainers_names = parse_top_gainers(top_gainers_html)
    ticker_mapping = load_ticker_mapping(json_file_path)
    top_gainers_tickers = convert_to_tickers(top_gainers_names, ticker_mapping)
    return top_gainers_tickers
