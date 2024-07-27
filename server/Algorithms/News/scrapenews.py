import requests
from bs4 import BeautifulSoup

def fetch_stock_news():
    url = f'https://www.businesstoday.in'
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    links = soup.find_all('a', class_='lst_lnk_txt')
    
    news_items = []
    for link in links:
        title = link.get('title')
        href = link.get('href')
        if title and href:
            news_items.append({
                'title': title,
                'href': href
            })
    
    return news_items
