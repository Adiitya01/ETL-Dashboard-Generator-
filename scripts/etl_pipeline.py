import pandas as pd
import sqlite3
import os

def run_etl():
    print("Starting ETL Process...")
    
    # Paths
    raw_sales_path = 'data/raw/sales_data.csv'
    raw_reviews_path = 'data/raw/reviews_data.csv'
    output_db = 'data/business_data.db'
    
    if not os.path.exists(raw_sales_path) or not os.path.exists(raw_reviews_path):
        print("Error: Raw data files not found. Run generate_data.py first.")
        return

    # 1. EXTRACT
    df_sales = pd.read_csv(raw_sales_path)
    df_reviews = pd.read_csv(raw_reviews_path)

    # 2. TRANSFORM
    # Sales Transformations
    df_sales['date'] = pd.to_datetime(df_sales['date'])
    daily_sales = df_sales.groupby('date')['total_amount'].sum().reset_index()
    category_sales = df_sales.groupby('category')['total_amount'].sum().reset_index()
    
    # Sentiment (Mock transformation for now, could use a light model or just ratings)
    # We'll calculate average rating as a proxy for sentiment
    product_performance = df_reviews.groupby('product')['rating'].mean().reset_index()
    product_performance.rename(columns={'rating': 'avg_rating'}, inplace=True)
    
    # Merge sales and performance
    product_sales = df_sales.groupby('product')['total_amount'].sum().reset_index()
    final_product_analytics = pd.merge(product_sales, product_performance, on='product', how='left')

    # 3. LOAD
    conn = sqlite3.connect(output_db)
    
    # Save processed tables
    daily_sales.to_sql('daily_sales', conn, if_exists='replace', index=False)
    category_sales.to_sql('category_sales', conn, if_exists='replace', index=False)
    final_product_analytics.to_sql('product_analytics', conn, if_exists='replace', index=False)
    
    # Keep raw tables for deep dives if needed
    df_sales.to_sql('raw_sales', conn, if_exists='replace', index=False)
    df_reviews.to_sql('raw_reviews', conn, if_exists='replace', index=False)
    
    conn.close()
    print(f"ETL completed successfully. Processed data saved to {output_db}")

if __name__ == "__main__":
    run_etl()
