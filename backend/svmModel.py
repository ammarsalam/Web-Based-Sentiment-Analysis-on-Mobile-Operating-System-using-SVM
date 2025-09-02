import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
import joblib 

# Load Dataset
df = pd.read_csv("C:/Users/LENOVO/Documents/FYP Project/DataSet/TestForModel_reddit_comments3.csv")
df = df.dropna(subset=['Comments', 'Sentiment'])

# Split Data
X = df['Comments']
y = df['Sentiment']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define Final Model Pipeline
best_c = 1.94 

model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, sublinear_tf=True, use_idf=True)),
    ('svm', LinearSVC(C=best_c, max_iter=5000))
])

# Train the Final Model
model_pipeline.fit(X_train, y_train)

# Save the Model
joblib.dump(model_pipeline, "svm_sentiment_model.pkl")

# Evaluate
accuracy = model_pipeline.score(X_test, y_test)
print("Test Accuracy:", accuracy)
