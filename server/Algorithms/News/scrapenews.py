import requests
from bs4 import BeautifulSoup

def fetch_stock_news():
    url = 'https://www.businesstoday.in'
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    links = soup.find_all('a', class_='lst_lnk_img')
    
    news_items = []
    for link in links:
        title = link.get('title')
        href = link.get('href')
        img_tag = link.find('img')
        img_src = img_tag.get('data-src') if img_tag.get('data-src') else img_tag.get('src')
        
        if title and href and img_src:
            news_items.append({
                'title': title,
                'href': href,
                'img_src': img_src
            })
    
    return news_items
