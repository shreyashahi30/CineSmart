from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

app = Flask(__name__)

# Load the dataset (ensure this path is correct)
data = pd.read_csv('final_data.csv')

# Combine relevant features into a single column for recommendation
data['comb'] = (data['director_name'] * 3) + ' ' + data['actor_1_name'] + ' ' + data['genres']

# Vectorize the combined feature column using TF-IDF
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
X_vectorized = vectorizer.fit_transform(data['comb'])

# Calculate cosine similarity between all movies
cosine_sim = cosine_similarity(X_vectorized, X_vectorized)

# TMDB API key (replace this with a secure method in production)
apiKey = 'd8fb378b6567392adbfae7049c722249'

# Function to get recommendations based on cosine similarity
def get_recommendations(movie_title, cosine_sim=cosine_sim):
    if movie_title not in data['movie_title'].values:
        return pd.Series(["Movie not found in the dataset."])

    # Get the index of the movie that matches the title
    idx = data.index[data['movie_title'] == movie_title][0]
    
    # Get the pairwise similarity scores of all movies with the input movie
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort the movies based on the similarity scores (highest first)
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the indices of the top 10 most similar movies
    sim_scores = sim_scores[1:11]  # Exclude the first movie (itself)
    movie_indices = [i[0] for i in sim_scores]

    # Return the top 10 most similar movies
    return data['movie_title'].iloc[movie_indices]

# Function to fetch movie details from TMDB by title
def fetch_tmdb_movie(movie_title):
    search_url = f"https://api.themoviedb.org/3/search/movie?api_key={apiKey}&query={movie_title}"
    response = requests.get(search_url)
    if response.ok:
        data = response.json()
        if data['results']:
            return data['results'][0]  # Return the first matching movie
    return None

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if query:
        # Get movie recommendations based on the query
        recommendations = get_recommendations(query)
        
        # Fetch details from TMDB for recommended movies
        recommended_movies_details = []
        for title in recommendations:
            tmdb_movie = fetch_tmdb_movie(title)
            if tmdb_movie:
                recommended_movies_details.append(tmdb_movie)
                
        return jsonify(recommended_movies_details)  # Return detailed movie recommendations as JSON
    return jsonify([])  # Return an empty list if no query is provided

@app.route('/mi', methods=['GET'])
def mi():
    return render_template('mi.html')  # Serve the mi.html file for the search UI

@app.route('/popular')
def popular():
    return render_template('popular.html')

@app.route('/top_rated')
def top_rated():
    return render_template('top_rated.html')

@app.route('/upcoming')
def upcoming():
    return render_template('upcoming.html')

@app.route('/action')
def action():
    return render_template('action.html')

@app.route('/adventure')
def adventure():
    return render_template('adventure.html')

@app.route('/animation')
def animation():
    return render_template('animation.html')

@app.route('/comedy')
def comedy():
    return render_template('comedy.html')

@app.route('/drama')
def drama():
    return render_template('drama.html')

@app.route('/fantasy')
def fantasy():
    return render_template('fantasy.html')

@app.route('/horror')
def horror():
    return render_template('horror.html')

@app.route('/mystery')
def mystery():
    return render_template('mystery.html')

@app.route('/romance')
def romance():
    return render_template('romance.html')

@app.route('/scifi')
def scifi():
    return render_template('scifi.html')

# Add more routes as needed for other pages...

if __name__ == '__main__':
    app.run(debug=True)
