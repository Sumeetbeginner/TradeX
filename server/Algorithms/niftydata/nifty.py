import requests
from bs4 import BeautifulSoup
import re

def fetch_nifty():
    url = "https://www.moneycontrol.com/indian-indices/nifty-50-9.html"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Response Status Code: {response.status_code}")
    if response.status_code != 200:
        return {"error": "Failed to fetch data from Moneycontrol"}
    
    soup = BeautifulSoup(response.content, "html.parser")
    print(soup.prettify()[:1000])  # Print a sample of the page to check if expected elements exist
    
    def safe_find_text(soup, tag, id_=None, class_=None):
        element = soup.find(tag, id=id_, class_=class_)
        if element is None:
            print(f"Missing element: tag={tag}, id={id_}, class={class_}")
        return element.text.strip().replace(',', '') if element else None
    
    curr_price_text = safe_find_text(soup, "span", id_="sp_val")
    curr_price = float(curr_price_text) if curr_price_text else None
    
    price_change_div = soup.find("div", id="sp_ch_prch", class_=re.compile(r"pricupdn (grn|red)"))
    if price_change_div is None:
        print("Missing price change element!")
    price_change_text = price_change_div.text.strip() if price_change_div else "0(0%)"
    price_change_value, price_change_percent = price_change_text.split("(")
    price_change_percent = price_change_percent.rstrip(")%")
    
    previous_close = safe_find_text(soup, "span", id_="sp_previousclose")
    day_high = safe_find_text(soup, "span", id_="sp_High")
    year_low = safe_find_text(soup, "span", id_="sp_yrlow")
    year_high = safe_find_text(soup, "span", id_="sp_yrhigh")
    
    ytd_change_element = soup.find("span", id="ytd", class_=re.compile(r"(grn|red) txt15"))
    if ytd_change_element is None:
        print("Missing YTD change element!")
    ytd_change = ytd_change_element.text.strip().replace('%', '') if ytd_change_element else None
    
    niftydata = {
        "currPrice": curr_price,
        "priceChange": float(price_change_value) if price_change_value else None,
        "priceChangePercent": float(price_change_percent) if price_change_percent else None,
        "previousClose": float(previous_close) if previous_close else None,
        "dayHigh": float(day_high) if day_high else None,
        "yearLow": float(year_low) if year_low else None,
        "yearHigh": float(year_high) if year_high else None,
        "ytdChange": float(ytd_change) if ytd_change else None
    }
    
    return niftydata


if __name__ == "__main__":
    print(fetch_nifty())
