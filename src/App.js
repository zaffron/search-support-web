import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const searchByQuery = async () => {
    const params = new URLSearchParams({ q: query, n: 10 });
    try {
      const response = await axios.get('http://localhost:8000/app/find-documents-by-query', {
        params,
      });
      let data = response.data;
      if (typeof data === 'string') {
        data = data.replace(/NaN/g, "\"\"")
        data = JSON.parse(data);
      }
      setProducts(data.result)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onProductClick = async (sku) => {
    const params = new URLSearchParams({ sku, n: 10 });
    try {
      const response = await axios.get('http://localhost:8000/app/find-similar-documents-by-sku', {
        params,
      });
      let data = response.data;
      if (typeof data === 'string') {
        data = data.replace(/NaN/g, "\"\"")
        data = JSON.parse(data);
      }
      setSuggestedProducts(data.result)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  const renderSuggestedProducts = () => {
    return (
      <div className="image-container">
        {suggestedProducts && suggestedProducts.length ? suggestedProducts.map((product) => {
          const imagesString = product.images;
          // eslint-disable-next-line no-useless-escape
          const cleanedString = imagesString.replace(/[\[\]']/g, '');
          const imagesArray = cleanedString.split(',');
          const firstImage = imagesArray[0];
          return (
            <div key={product.sku} className="image-item" onClick={() => onProductClick(product.sku)}>
              <img className="image" src={firstImage} alt={product.name} />
              <p><b>{product.title}</b></p>
              <p>{product.longDescription}</p>
              <p>Matching keywords: {product.matchingKeywords}</p>
            </div>
          );
        }) : null}
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <div className="input-container">
          <form onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images..."
            />
            <button type="submit" onClick={searchByQuery}>Search</button>
          </form>
        </div>

        <div className="image-container">
          {products && products.length ? products.map((product) => {
            const imagesString = product.images;
            // eslint-disable-next-line no-useless-escape
            const cleanedString = imagesString.replace(/[\[\]']/g, '');
            const imagesArray = cleanedString.split(',');
            const firstImage = imagesArray[0];
            return (
              <div key={product.sku} className="image-item" onClick={() => onProductClick(product.sku)}>
                <img className="image" src={firstImage} alt={product.name} />
                <p><b>{product.title}</b></p>
                <p>{product.longDescription}</p>
              </div>
            );
          }) : null}
        </div>
      </div>

      <div className="container">
        <h2>Suggested Products</h2>
        {suggestedProducts && suggestedProducts.length ? (<div>
          {renderSuggestedProducts()}
        </div>) : null}
      </div>
    </>
  );
};

export default App;
