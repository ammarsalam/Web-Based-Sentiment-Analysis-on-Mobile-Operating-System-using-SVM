import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.pipeline import Pipeline
import joblib

# Load preprocessed dataset
df = pd.read_csv("./ForModeling_Dataset.csv")
df = df.dropna(subset=['Comments'])

# Text Data
X = df['Comments']

# Define LDA Pipeline
lda_pipeline = Pipeline([
    ('vectorizer', CountVectorizer(max_df=0.95, min_df=3, stop_words='english')),
    ('lda', LatentDirichletAllocation(n_components=5, random_state=42, learning_method='online'))
])

# Fit LDA pipeline to all available text
lda_pipeline.fit(X)

# Save the pipeline
joblib.dump(lda_pipeline, "lda_topic_model.pkl")
