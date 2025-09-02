import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib  # Import joblib to save the model

# Load data
df = pd.read_csv("./TestForModel_reddit_comments3.csv")
df = df.dropna(subset=['Comments', 'Sentiment'])

# TF-IDF vectorization
vectorizer = TfidfVectorizer(max_features=5000, sublinear_tf=True, use_idf=True)
X = vectorizer.fit_transform(df['Comments'])
y = df['Sentiment']

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=True)

# Train the SVM Model
svm_model = SVC(kernel='linear', C=10.0, probability=True)
svm_model.fit(X_train, y_train)

# Save the trained model using joblib
joblib.dump(svm_model, 'sentiment_svm_model.joblib')  # Save model to file

# Save the vectorizer after training
joblib.dump(vectorizer, 'vectorizer.joblib')

# Predict on the test set
y_pred = svm_model.predict(X_test)

# Calculate and print the accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")
