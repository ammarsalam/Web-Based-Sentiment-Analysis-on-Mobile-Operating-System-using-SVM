from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
from flask_cors import CORS
from flask_mysqldb import MySQL
import praw
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model and vectorizer
model = load('./svm_sentiment_model.pkl')
model2 = load('./svm_type_model.pkl')
nmf_model = load('./nmf_topic_model.pkl')
lda_model = load('./lda_topic_model.pkl')
vectorizer = load('./vectorizer.joblib')

# Initialize PRAW with your Reddit API credentials
reddit = praw.Reddit(
    client_id="aJ8-j404dFDqAQWXiENG-g",
    client_secret="KIosNOlyHRwVoQDzIAnNH4vMSEIpdA",
    user_agent="API Scraper App"
)

# Stop words for preprocessing
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# MySQL config (adjust to match your XAMPP MySQL settings)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''  # Set if you have a password
app.config['MYSQL_DB'] = 'fyp_project'

mysql = MySQL(app)

# Sentiment mapping (updated to match your labels)
sentiment_map = {-1: "Negative Sentiment", 0: "Neutral Sentiment", 1: "Positive Sentiment"}

# Preprocessing function
def preprocess_comment(text):
    text = text.lower()
    text = re.sub(r'http\S+|www\.\S+', '', text)  # remove URLs
    text = re.sub(r'/[ur]/[A-Za-z0-9_]+', '', text)  # remove Reddit mentions
    text = re.sub(r'<.*?>', '', text)  # remove HTML tags
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove punctuation and numbers
    text = ' '.join(text.split())  # normalize whitespace
    words = [word for word in text.split() if word not in stop_words]  # remove stopwords
    words = [lemmatizer.lemmatize(word) for word in words]  # lemmatize
    return ' '.join(words)

#Not use (Use below) This is for sentiment_svm_model.joblib and vectorizer.joblib
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Ensure the input contains a 'comment' key
        if 'comment' not in data:
            return jsonify({"error": "No comment provided"}), 400

        # Prepare the input comment as a DataFrame
        df = pd.DataFrame([data['comment']], columns=["comment"])

        # Transform the comment using the vectorizer
        X_new = vectorizer.transform(df['comment'])  # Transform the input text

        # Make prediction
        prediction = model.predict(X_new)[0]

        # Map prediction to sentiment label
        sentiment = sentiment_map.get(prediction, "unknown")
        #print(f"Prediction: {sentiment}")

        return jsonify({"sentiment": sentiment}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Prediction
@app.route('/prediction', methods=['POST'])
def prediction():
    try:
        data = request.json

        # Ensure the input contains a 'comment' key
        if 'comment' not in data:
            return jsonify({"error": "No comment provided"}), 400

        # Prepare the input comment as a DataFrame
        df = pd.DataFrame([data['comment']], columns=["comment"])

        # Transform the comment using the model's vectorizer and make prediction
        X_new = model.named_steps['tfidf'].transform(df['comment'])  # Transform the input text
        prediction = model.named_steps['svm'].predict(X_new)[0]  # Get the prediction

        # Map prediction to sentiment label
        sentiment = sentiment_map.get(prediction, "unknown")

        return jsonify({"sentiment": sentiment}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Predict type os
@app.route('/predictiontype', methods=['POST'])
def prediction_type():
    try:
        # Get data from the POST request
        data = request.json

        # Ensure the input contains a 'comment' key
        if 'comment' not in data:
            return jsonify({"error": "No comment provided"}), 400

        # Prepare the input comment as a DataFrame
        df = pd.DataFrame([data['comment']], columns=["Comments"])

        # Transform the comment using the model's vectorizer
        X_new = model2.named_steps['tfidf'].transform(df['Comments'])  # Transform the input text

        # Make prediction using the SVM model
        prediction = model2.named_steps['svm'].predict(X_new)[0]  # Get the predicted type

        # Return the prediction result
        return jsonify({"type": prediction}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Predict topic using LDA
@app.route('/topicpredict', methods=['POST'])
def topic_predict():
    try:
        # Get the data from the request
        data = request.json
        
        # Ensure the input contains a 'comment' key
        if 'comment' not in data:
            return jsonify({"error": "No comment provided"}), 400
        
        comment = data['comment']

        # Define the topic names corresponding to the index
        topic_names = [
            'App Ecosystem and Data Security',
            'Software Updates and User Frustration',
            'Device Features and Hardware Performance',
            'Brand Comparison and Consumer Trust',
            'User Experience and OS Changes'
        ]

        # Use the LDA model to predict the topic for the comment
        topic = lda_model.transform([comment])  # Get topic distribution
        predicted_topic_index = topic.argmax()  # Get the topic with the highest probability

        # Map the predicted topic index to the topic name
        predicted_topic_name = topic_names[predicted_topic_index]

        # Return the predicted topic name
        return jsonify({"predicted_topic": predicted_topic_name}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Predict topic using NMF
@app.route('/predictiontopicnmf', methods=['POST'])
def topic_predict_nmf():
    try:
        # Get the data from the request
        data = request.json
        
        # Ensure the input contains a 'comment' key
        if 'comment' not in data:
            return jsonify({"error": "No comment provided"}), 400
        
        comment = data['comment']

        # Define the topic names corresponding to the index from the NMF model
        topic_names = [
            'Device Experience and Performance',
            'Software Updates',
            'Security and Privacy Concerns'
        ]

        # Use the NMF model to predict the topic for the comment
        comment_vectorized = nmf_model.named_steps['vectorizer'].transform([comment])  # Transform the input comment
        topic_distribution = nmf_model.named_steps['nmf'].transform(comment_vectorized)  # Get topic distribution
        
        # Get the topic with the highest probability
        predicted_topic_index = topic_distribution.argmax()  # Index of the most likely topic

        # Map the predicted topic index to the topic name
        predicted_topic_name = topic_names[predicted_topic_index]

        # Return the predicted topic name
        return jsonify({"predicted_topic": predicted_topic_name}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Dashboard statictic on stat card
@app.route('/dashboardstats', methods=['GET'])
def get_sentiment_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT COUNT(*) AS total, SUM(label = 'Positive') AS positive, SUM(label = 'Negative') AS negative, SUM(label = 'Neutral') AS neutral
            FROM datasets; """)
        result = cur.fetchone()
        cur.close()

        stats = {
            "total": result[0],
            "positive": result[1],
            "negative": result[2],
            "neutral": result[3]
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Android statictic on stat card
@app.route('/androidstats', methods=['GET'])
def get_android_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT COUNT(*) AS total, SUM(label = 'Positive') AS positive, SUM(label = 'Negative') AS negative, SUM(label = 'Neutral') AS neutral
            FROM datasets WHERE type = 'Android'; """)
        result = cur.fetchone()
        cur.close()

        stats = {
            "total": result[0],
            "positive": result[1],
            "negative": result[2],
            "neutral": result[3]
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# IOS statictic on stat card
@app.route('/iosstats', methods=['GET'])
def get_ios_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT COUNT(*) AS total, SUM(label = 'Positive') AS positive, SUM(label = 'Negative') AS negative, SUM(label = 'Neutral') AS neutral
            FROM datasets WHERE type = 'iOS'; """)
        result = cur.fetchone()
        cur.close()

        stats = {
            "total": result[0],
            "positive": result[1],
            "negative": result[2],
            "neutral": result[3]
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# HarmonyOS statictic on stat card
@app.route('/harmonyosstats', methods=['GET'])
def get_harmonyos_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT COUNT(*) AS total, SUM(label = 'Positive') AS positive, SUM(label = 'Negative') AS negative, SUM(label = 'Neutral') AS neutral
            FROM datasets WHERE type = 'HarmonyOS'; """)
        result = cur.fetchone()
        cur.close()

        stats = {
            "total": result[0],
            "positive": result[1],
            "negative": result[2],
            "neutral": result[3]
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Total number each OS in dashboard table
@app.route('/platformstats', methods=['GET'])
def get_platform_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute(""" SELECT type, COUNT(*) AS total FROM datasets WHERE type IN ('Android', 'iOS', 'HarmonyOS') GROUP BY type; """)
        results = cur.fetchall()
        cur.close()

        stats = {row[0]: row[1] for row in results}

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Total number sentiment based on keyword in Android
@app.route('/androidkeywordstats', methods=['GET'])
def get_android_keyword_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT keyword_category, label, COUNT(DISTINCT id) AS total
            FROM (
                SELECT id, label,
                    CASE
                        WHEN LOWER(comments) LIKE '%security%' THEN 'Security'
                        WHEN LOWER(comments) LIKE '%privacy%' THEN 'Privacy'
                        WHEN LOWER(comments) LIKE '%update%' THEN 'Update'
                        ELSE 'Other'
                    END AS keyword_category
                FROM datasets
                WHERE type = 'Android'
            ) AS categorized
            WHERE keyword_category IN ('Security', 'Privacy', 'Update')
            GROUP BY keyword_category, label
            ORDER BY keyword_category, label;
        """)
        results = cur.fetchall()
        cur.close()

        # Only keep these three categories
        response = {
            "Security": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Privacy": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Update": {"Positive": 0, "Negative": 0, "Neutral": 0}
        }

        for row in results:
            topic = row[0]
            label = row[1]
            total = row[2]
            if topic in response:
                response[topic][label] = total

        # Convert to chart-friendly list
        chart_data = [
            {"name": topic, **sentiments}
            for topic, sentiments in response.items()
        ]

        return jsonify(chart_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Total number of sentiment based on keyword in iOS
@app.route('/ioskeywordstats', methods=['GET'])
def get_ios_keyword_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT keyword_category, label, COUNT(DISTINCT id) AS total
            FROM (
                SELECT id, label,
                    CASE
                        WHEN LOWER(comments) LIKE '%security%' THEN 'Security'
                        WHEN LOWER(comments) LIKE '%privacy%' THEN 'Privacy'
                        WHEN LOWER(comments) LIKE '%update%' THEN 'Update'
                        ELSE 'Other'
                    END AS keyword_category
                FROM datasets
                WHERE type = 'iOS'
            ) AS categorized
            WHERE keyword_category IN ('Security', 'Privacy', 'Update')
            GROUP BY keyword_category, label
            ORDER BY keyword_category, label;
        """)
        results = cur.fetchall()
        cur.close()

        # Only keep these three categories
        response = {
            "Security": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Privacy": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Update": {"Positive": 0, "Negative": 0, "Neutral": 0}
        }

        for row in results:
            topic = row[0]
            label = row[1]
            total = row[2]
            if topic in response:
                response[topic][label] = total

        # Convert to chart-friendly list
        chart_data = [
            {"name": topic, **sentiments}
            for topic, sentiments in response.items()
        ]

        return jsonify(chart_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Total number of sentiment based on keyword in HarmonyOS
@app.route('/harmonyoskeywordstats', methods=['GET'])
def get_harmonyos_keyword_stats():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT keyword_category, label, COUNT(DISTINCT id) AS total
            FROM (
                SELECT id, label,
                    CASE
                        WHEN LOWER(comments) LIKE '%security%' THEN 'Security'
                        WHEN LOWER(comments) LIKE '%privacy%' THEN 'Privacy'
                        WHEN LOWER(comments) LIKE '%update%' THEN 'Update'
                        ELSE 'Other'
                    END AS keyword_category
                FROM datasets
                WHERE type = 'HarmonyOS'
            ) AS categorized
            WHERE keyword_category IN ('Security', 'Privacy', 'Update')
            GROUP BY keyword_category, label
            ORDER BY keyword_category, label;
        """)
        results = cur.fetchall()
        cur.close()

        # Only keep these three categories
        response = {
            "Security": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Privacy": {"Positive": 0, "Negative": 0, "Neutral": 0},
            "Update": {"Positive": 0, "Negative": 0, "Neutral": 0}
        }

        for row in results:
            topic = row[0]
            label = row[1]
            total = row[2]
            if topic in response:
                response[topic][label] = total

        # Convert to chart-friendly list
        chart_data = [
            {"name": topic, **sentiments}
            for topic, sentiments in response.items()
        ]

        return jsonify(chart_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Show comments by OS type with optional sentiment filtering
@app.route('/comments/<platform>', methods=['GET'])
def get_comments_by_platform(platform):
    try:
        sentiment = request.args.get('sentiment')  # Optional query param

        cur = mysql.connection.cursor()

        if sentiment in ['Positive', 'Negative', 'Neutral']:
            query = "SELECT actual_comments, label FROM datasets WHERE type = %s AND label = %s"
            cur.execute(query, (platform, sentiment))
        else:
            query = "SELECT actual_comments, label FROM datasets WHERE type = %s"
            cur.execute(query, (platform,))

        rows = cur.fetchall()
        cur.close()

        # Return both comment and sentiment
        comments = [{"comment": row[0], "sentiment": row[1]} for row in rows]
        return jsonify(comments), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Show comments by OS type with optional sentiment and topic filtering
@app.route('/allcomments/<platform>', methods=['GET'])
def get_allcomments_by_platform(platform):
    try:
        sentiment = request.args.get('sentiment')  # Optional
        topic = request.args.get('topic')          # Optional

        cur = mysql.connection.cursor()

        if sentiment and topic:
            query = "SELECT actual_comments, label, topic_name FROM datasets WHERE type = %s AND label = %s AND topic_name = %s"
            cur.execute(query, (platform, sentiment, topic))
        elif sentiment:
            query = "SELECT actual_comments, label, topic_name FROM datasets WHERE type = %s AND label = %s"
            cur.execute(query, (platform, sentiment))
        elif topic:
            query = "SELECT actual_comments, label, topic_name FROM datasets WHERE type = %s AND topic_name = %s"
            cur.execute(query, (platform, topic))
        else:
            query = "SELECT actual_comments, label, topic_name FROM datasets WHERE type = %s"
            cur.execute(query, (platform,))

        rows = cur.fetchall()
        cur.close()

        comments = [{"comment": row[0], "sentiment": row[1], "topic": row[2]} for row in rows]
        return jsonify(comments), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get unique topics for a given platform
@app.route('/topics/<platform>', methods=['GET'])
def get_topics_by_platform(platform):
    try:
        cur = mysql.connection.cursor()
        query = "SELECT DISTINCT topic_name FROM datasets WHERE type = %s"
        cur.execute(query, (platform,))
        rows = cur.fetchall()
        cur.close()

        topics = [row[0] for row in rows if row[0] is not None]
        return jsonify(topics), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# To get number of comments based on date
@app.route('/datecount', methods=['GET'])
def get_date_count():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT DATE_FORMAT(STR_TO_DATE(comment_date, '%d-%m-%Y %H:%i:%s'), '%m-%Y') AS yearmonth, COUNT(*) AS total_count FROM datasets GROUP BY yearmonth ORDER BY STR_TO_DATE(CONCAT('01-', yearmonth), '%d-%m-%Y');
        """)
        results = cur.fetchall()
        cur.close()

        # Convert to list of dictionaries for JSON response
        date_counts = [{"month": row[0], "count": row[1]} for row in results]

        return jsonify(date_counts), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# To get number comments in positive, negative, neutral based on date
@app.route('/sentimenttrend', methods=['GET'])
def get_sentiment_trend():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT DATE_FORMAT(STR_TO_DATE(comment_date, '%d-%m-%Y %H:%i:%s'), '%m-%Y') AS yearmonth, label, COUNT(*) AS total FROM datasets GROUP BY yearmonth, label ORDER BY STR_TO_DATE(CONCAT('01-', yearmonth), '%d-%m-%Y');
        """)
        results = cur.fetchall()
        cur.close()

        # Organize results into structured format
        trend_data = {}
        for month, label, count in results:
            if month not in trend_data:
                trend_data[month] = {"Positive": 0, "Negative": 0, "Neutral": 0}
            trend_data[month][label] = count

        # Convert into list of objects for charting
        trend_list = []
        for month in sorted(trend_data.keys(), key=lambda x: tuple(map(int, x.split("-")[::-1]))):
            formatted = {
                "month": month,
                "Positive": trend_data[month]["Positive"],
                "Negative": trend_data[month]["Negative"],
                "Neutral": trend_data[month]["Neutral"]
            }
            trend_list.append(formatted)

        return jsonify(trend_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get the total comments by topic
@app.route('/commentsbytopic', methods=['GET'])
def get_comments_by_topic():
    try:
        cur = mysql.connection.cursor()

        # SQL query to get the total number of comments by sentiment for each topic
        cur.execute("""
            SELECT 
                topic_name, 
                SUM(label = 'Positive') AS positive,
                SUM(label = 'Negative') AS negative,
                SUM(label = 'Neutral') AS neutral,
                COUNT(*) AS total
            FROM datasets
            GROUP BY topic_name;
        """)

        results = cur.fetchall()
        cur.close()

        # Prepare the response data in the desired format
        topic_stats = []
        for row in results:
            topic_stats.append({
                "topic_name": row[0],
                "positive": row[1],
                "negative": row[2],
                "neutral": row[3],
                "total": row[4]
            })

        return jsonify(topic_stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Get the total comments by topic based on Android, iOS and HarmonyOS
@app.route('/topic_by_platform', methods=['GET'])
def get_topic_by_platform():
    try:
        platform = request.args.get('platform')  # Get platform type from query params
        
        # Validate the platform type
        if platform not in ['Android', 'iOS', 'HarmonyOS']:
            return jsonify({"error": "Invalid platform type. Please use 'Android', 'iOS', or 'HarmonyOS'."}), 400
        
        cur = mysql.connection.cursor()

        # SQL query to get the total number of comments by sentiment for each topic, filtered by platform
        cur.execute("""
            SELECT 
                topic_name, 
                SUM(label = 'Positive') AS positive,
                SUM(label = 'Negative') AS negative,
                SUM(label = 'Neutral') AS neutral,
                COUNT(*) AS total
            FROM datasets
            WHERE type = %s
            GROUP BY topic_name;
        """, (platform,))

        results = cur.fetchall()
        cur.close()

        # Prepare the response data in the desired format
        topic_stats = []
        for row in results:
            topic_stats.append({
                "topic_name": row[0],
                "positive": row[1],
                "negative": row[2],
                "neutral": row[3],
                "total": row[4]
            })

        return jsonify(topic_stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Real time sentiment analyzer
@app.route('/realtime', methods=['POST'])
def realtime_analyzer():
    try:
        data = request.get_json()
        link = data.get('link', '')
        if not link:
            return jsonify({'error': 'Missing link'}), 400

        submission = reddit.submission(url=link)
        submission.comments.replace_more(limit=0)

        results = []
        for comment in submission.comments.list():
            raw_comment = comment.body.strip()
            if raw_comment:
                preprocessed = preprocess_comment(raw_comment)
                results.append({
                    'original': raw_comment,
                    'preprocessed': preprocessed
                })

        return jsonify({'comments': results}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/')
def home():
    return "Welcome to the Sentiment Analysis API! Please send a POST request to /predict."

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
