import requests
from bs4 import BeautifulSoup
import re

def fetch_nifty():
    # URL of the webpage
    url = "https://www.moneycontrol.com/indian-indices/nifty-50-9.html"
    
    # Send a GET request to fetch the page content
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Scrape the required data
    price_change_div = soup.find("div", id="sp_ch_prch", class_=re.compile(r"pricupdn (grn|red)"))
    price_change_text = price_change_div.text.strip()
    price_change_value, price_change_percent = price_change_text.split("(")
    price_change_percent = price_change_percent.rstrip(")%")
    
    previous_close = soup.find("span", id="sp_previousclose").text.strip().replace(',', '')
    day_high = soup.find("span", id="sp_High").text.strip().replace(',', '')
    year_low = soup.find("span", id="sp_yrlow").text.strip().replace(',', '')
    year_high = soup.find("span", id="sp_yrhigh").text.strip().replace(',', '')
    ytd_change = soup.find("span", id="ytd", class_="grn txt15").text.strip().replace('%', '')
    
    curr_price = float(price_change_value.replace(',', '')) + float(previous_close)
    
    niftydata = {
        "currPrice": curr_price,
        "priceChange": float(price_change_value.replace(',', '')),
        "priceChangePercent": float(price_change_percent),
        "previousClose": float(previous_close),
        "dayHigh": float(day_high),
        "yearLow": float(year_low),
        "yearHigh": float(year_high),
        "ytdChange": float(ytd_change)
    }

    return niftydata
