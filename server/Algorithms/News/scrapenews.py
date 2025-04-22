import requests
from bs4 import BeautifulSoup

def fetch_stock_news():
    url = 'https://www.businesstoday.in'
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    news_items = []

    # Locate the <li> items containing the news
    for item in soup.find_all('li', class_='lst_li'):
        try:
            img_tag = item.find('a', class_='lst_lnk_img').find('img')
            img_src = img_tag.get('data-src') or img_tag.get('src')

            title_tag = item.find('a', class_='lst_lnk_txt')
            title = title_tag.text.strip()
            href = title_tag.get('href')

            if title and href and img_src:
                news_items.append({
                    'title': title,
                    'href': href,
                    'img_src': img_src
                })
        except AttributeError:
            continue  # Skip malformed or incomplete items

    return news_items
