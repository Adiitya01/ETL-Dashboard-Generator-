import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

def generate_raw_data():
    # Ensure data directory exists
    os.makedirs('data/raw', exist_ok=True)
    
    # 1. Sales Data
    dates = [datetime.now() - timedelta(days=x) for x in range(100)]
    products = ['Laptop', 'Smartphone', 'Headphones', 'Tablet', 'Smartwatch']
    categories = ['Electronics', 'Electronics', 'Audio', 'Electronics', 'Wearables']
    
    sales_data = []
    for _ in range(500):
        date = random.choice(dates)
        product = random.choice(products)
        idx = products.index(product)
        category = categories[idx]
        quantity = random.randint(1, 5)
        price = random.uniform(50, 1500)
        
        sales_data.append({
            'transaction_id': f'T-{random.randint(10000, 99999)}',
            'date': date.strftime('%Y-%m-%d'),
            'product': product,
            'category': category,
            'quantity': quantity,
            'unit_price': round(price, 2),
            'total_amount': round(quantity * price, 2),
            'customer_id': f'C-{random.randint(100, 999)}'
        })
    
    df_sales = pd.DataFrame(sales_data)
    df_sales.to_csv('data/raw/sales_data.csv', index=False)
    
    # 2. Customer Reviews (for Sentiment Analysis)
    reviews = [
        "Excellent product, very fast!",
        "Poor battery life, disappointed.",
        "Value for money, highly recommended.",
        "The screen is amazing but it's a bit heavy.",
        "Stopped working after two days. Terrible experience.",
        "Decent performance for the price.",
        "Best purchase of the year!",
        "Customer support was unhelpful, but the product is okay.",
        "Overpriced for what it offers.",
        "Sleek design and great features."
    ]
    
    review_data = []
    for _ in range(200):
        review_data.append({
            'review_id': f'R-{random.randint(1000, 9999)}',
            'product': random.choice(products),
            'review_text': random.choice(reviews),
            'rating': random.randint(1, 5),
            'date': random.choice(dates).strftime('%Y-%m-%d')
        })
        
    df_reviews = pd.DataFrame(review_data)
    df_reviews.to_csv('data/raw/reviews_data.csv', index=False)
    
    print("Raw data generated in data/raw/")

if __name__ == "__main__":
    generate_raw_data()
