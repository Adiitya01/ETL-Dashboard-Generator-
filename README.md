# ETL & GenAI Business Dashboard

A premium, result-driven business dashboard powered by an ETL pipeline and Google Gemini for strategic insights.

## 🚀 Features
- **Automated ETL Pipeline**: Processes raw sales and review data into actionable business metrics.
- **Glassmorphic Design**: Modern, premium UI built with Next.js, Framer Motion, and Tailwind CSS.
- **AI-Driven Insights**: Integration with Google Gemini to provide executive summaries and actionable recommendations based on processed data.
- **Interactive Analytics**: Real-time charts using Recharts for sales trends and category performance.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python), Pandas, SQLite, SQLAlchemy.
- **Frontend**: Next.js 14+ (App Router), TypeScript, Framer Motion, Recharts.
- **GenAI**: Google Generative AI (Gemini 1.5 Flash).

## 🏃‍♂️ How to Run

### 1. Prerequisites
- Python 3.8+
- Node.js 18+
- Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### 2. Setup Backend
```bash
cd backend
# Create a .env file and add your GEMINI_API_KEY
echo "GEMINI_API_KEY=your_key_here" > .env
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8001
```

### 3. Run ETL Pipeline (Optional - Data is already pre-generated)
```bash
python scripts/generate_data.py
python scripts/etl_pipeline.py
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```


## 📁 Project Structure
- `data/`: Contains raw CSVs and the processed SQLite database.
- `scripts/`: Python scripts for data generation and ETL transformations.
- `backend/`: FastAPI server for data serving and GenAI integration.
- `frontend/`: Next.js dashboard application.
