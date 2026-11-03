import { useEffect, useState } from 'react';
import './App.scss';

interface Product {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
}

const PRODUCTS_URL = '/api/produtos';

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
          throw new Error('Não foi possível carregar os produtos.');
        }

        const data = await response.json();
        setProducts(data.products);
      } catch {
        setError('Não foi possível carregar os produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const visibleProducts = Array.from(
    { length: Math.min(4, products.length) },
    (_, index) => products[(startIndex + index) % products.length]
  ).filter(Boolean);

  function nextProducts() {
    setStartIndex((current) => (current + 1) % products.length);
  }

  function previousProducts() {
    setStartIndex((current) =>
      (current - 1 + products.length) % products.length
    );
  }

  return (
    <main className="page">
      <section className="products-section" aria-labelledby="products-title">
        <div className="section-heading">
          <span />
          <h1 id="products-title">Produtos relacionados</h1>
          <span />
        </div>

        <nav className="categories" aria-label="Categorias de produtos">
          <button className="active" type="button">CELULAR</button>
          <button type="button">ACESSÓRIOS</button>
          <button type="button">TABLETS</button>
          <button type="button">NOTEBOOKS</button>
          <button type="button">TVS</button>
          <button type="button">VER TODOS</button>
        </nav>

        {loading && <p className="message">Carregando produtos...</p>}

        {error && <p className="message error">{error}</p>}

        {!loading && !error && (
          <div className="carousel">
            <button
              className="arrow arrow-left"
              type="button"
              onClick={previousProducts}
              aria-label="Produtos anteriores"
            >
              ‹
            </button>

            <div className="products-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={`${product.productName}-${index}`}>
                  <button
                    className="product-image-button"
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`Ver detalhes de ${product.productName}`}
                  >
                    <img
                      src={product.photo}
                      alt={product.productName}
                      className="product-image"
                    />
                  </button>

                  <button
                    className="product-description"
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.descriptionShort}
                  </button>

                 <p className="current-price">{formatPrice(product.price)}</p>

                  <button
                    className="buy-button"
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                  >
                    COMPRAR
                  </button>
                </article>
              ))}
            </div>

            <button
              className="arrow arrow-right"
              type="button"
              onClick={nextProducts}
              aria-label="Próximos produtos"
            >
              ›
            </button>
          </div>
        )}
      </section>

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
          role="presentation"
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-modal"
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Fechar modal"
            >
              ×
            </button>

            <img
              src={selectedProduct.photo}
              alt={selectedProduct.productName}
              className="modal-image"
            />

            <div className="modal-info">
              <p className="modal-label">DETALHES DO PRODUTO</p>
              <h2 id="modal-title">{selectedProduct.productName}</h2>
              <p>{selectedProduct.descriptionShort}</p>
              <strong className="modal-price">
                {formatPrice(selectedProduct.price)}
              </strong>
              <p className="free-shipping">Frete grátis</p>
              <button
                className="buy-button"
                type="button"
                onClick={() => setSelectedProduct(null)}
              >
                CONTINUAR COMPRANDO
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;