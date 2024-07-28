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
        
        # Find the img tag inside the a tag
        img_tag = link.find('img')
        img_src = img_tag['src'] if img_tag else None
        
        if title and href:
            news_items.append({
                'title': title,
                'href': href,
                'img_src': img_src
            })
    
    return news_items

