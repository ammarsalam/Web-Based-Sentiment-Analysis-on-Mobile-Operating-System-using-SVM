import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF
from sklearn.pipeline import Pipeline
import joblib
import nltk
from nltk.corpus import stopwords

# Download stopwords if not already downloaded
nltk.download('stopwords')

# Load the preprocessed dataset
df = pd.read_csv("./ForModeling_Dataset.csv")
df = df.dropna(subset=['Comments'])  # Drop rows with missing comments

# Use built-in English stopwords and add custom ones
default_stopwords = set(stopwords.words('english'))
custom_stopwords = default_stopwords.union({
    'phone', 'device', 'apple', 'android', 'huawei', 'google', 'iphone', 'harmonyos', 'ios', 'io', 'china', 'chinese',
    'use', 'using', 'make', 'get', 'got', 'also', 'even', 'still', 'gt', 'rcs', 'im', 'one', 'would', 'next', 'think', 'know',
    'thing', 'something', 'anything', 'everything', 'nothing', 'thats', 'max', 'mate', 'global', 'good', 'youre', 'need', 'want',
    'people', 'ever', 'give', 'say', 'never'
})

# Text Data (comments)
X = df['Comments']

# Define NMF pipeline with custom stopwords
nmf_pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer(max_df=0.95, min_df=2, stop_words=list(custom_stopwords))),
    ('nmf', NMF(n_components=3, random_state=42))
])

# Fit NMF pipeline to the data
nmf_pipeline.fit(X)

# Save the model pipeline
joblib.dump(nmf_pipeline, "nmf_topic_model.pkl")

