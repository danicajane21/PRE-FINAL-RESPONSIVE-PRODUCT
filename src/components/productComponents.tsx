import './productComponents.css';
import { useState, type FormEvent } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  specification: string;
  price: number;
  rating: number;
  image: string;
};

type ProductForm = Omit<Product, 'id' | 'price' | 'rating'> & {
  price: string;
  rating: string;
};

type ProductFilter = 'All' | 'Burgers' | 'Spaghetti' | 'Carbonara';

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Cheesy Tomato Burger',
    category: 'Beef Burger',
    description: 'A delicious beef burger with fresh lettuce, tomato, and cheese.',
    specification: 'Beef patty, lettuce, tomato, and cheese.',
    price: 99,
    rating: 5,
    image:
      'https://static.vecteezy.com/system/resources/previews/066/396/891/non_2x/delicious-burger-with-cheese-tomato-and-lettuce-on-isolated-transparent-background-png.png',
  },
  {
    id: 2,
    name: 'Classic Burger',
    category: 'Beef Burger',
    description: 'A classic beef burger with fresh lettuce and a flavorful sauce.',
    specification: 'Beef patty, lettuce, and house sauce.',
    price: 85,
    rating: 4,
    image:
      'https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg',
  },
  {
    id: 3,
    name: 'Chicken Burger',
    category: 'Chicken Burger',
    description: 'A delicious chicken burger with fresh lettuce and tomato.',
    specification: 'Chicken patty, fresh lettuce, and tomato.',
    price: 95,
    rating: 4,
    image:
      'https://simplehomeedit.com/wp-content/uploads/2022/09/Southern-Fried-Chicken-Burger-1.webp',
  },
   {
    id: 4,
    name: 'Patty Melt Burger',
    category: 'Beef Burger',
    description: 'American grilled hamburger consisting of a ground beef patty topped with melted cheese and caramelized onions between two slices of griddled bread',
    specification: 'Beef patty, melted cheese, and caramelized onions on griddled bread.',
    price: 95,
    rating: 4,
    image:
      'https://theeburgerdude.com/wp-content/uploads/2023/06/Patty-Melt-Feature-02-1024x754.jpg',
  },
  {
    id: 5,
    name: 'Burger with Fries',
    category: 'Burgers',
    description: 'A juicy grilled burger served with a side of crispy golden fries.',
    specification: 'Beef patty, lettuce, tomato, cheese, house sauce, and fries.',
    price: 125,
    rating: 5,
    image:
      'https://friendlysrestaurants.com/assets/live/img/production/detail/menu/lunch-dinner_999-combohs_bacon-cheeseburger-fries.jpg',
  },
  {
    id: 6,
    name: 'Spaghetti',
    category: 'Spaghetti',
    description: 'Classic spaghetti tossed in a rich tomato sauce.',
    specification: 'Spaghetti pasta, tomato sauce, herbs, and parmesan.',
    price: 110,
    rating: 5,
    image:
      'https://curiousflavors.com/wp-content/uploads/2022/09/Untitled-design-2022-09-29T132112.477-1.jpg',
  },
  {
    id: 7,
    name: 'Carbonara',
    category: 'Carbonara',
    description: 'Creamy, comforting pasta with a savory parmesan sauce.',
    specification: 'Pasta, creamy parmesan sauce, bacon, and black pepper.',
    price: 120,
    rating: 5,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3XtvnO4710Gap390bRCg-nxE80oot54nUnvCSXNdcKQSQ7gU-k7EkIFA&s=10',
  },
];

const productFilters: ProductFilter[] = ['All', 'Burgers', 'Spaghetti', 'Carbonara'];

const emptyProductForm: ProductForm = {
  image: '',
  name: '',
  category: '',
  description: '',
  specification: '',
  price: '',
  rating: '',
};

export default function ProductComponent() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'menu' | 'contact' | 'cart' | 'add-product'>('home');
  const [products, setProducts] = useState(initialProducts);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('All');
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [formError, setFormError] = useState('');
  const cartCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  const itemsInCart = products.filter((product) => cartItems[product.id] > 0);
  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Burgers') return product.category.toLowerCase().includes('burger');
    return product.category.toLowerCase() === activeFilter.toLowerCase();
  });
  const cartTotal = itemsInCart.reduce(
    (total, product) => total + product.price * cartItems[product.id],
    0,
  );

  function updateQuantity(productId: number, change: number) {
    setCartItems((items) => {
      const quantity = (items[productId] ?? 0) + change;
      const updatedItems = { ...items };

      if (quantity <= 0) {
        delete updatedItems[productId];
      } else {
        updatedItems[productId] = quantity;
      }

      return updatedItems;
    });
  }

  function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const newProduct: Product = {
      id: Math.max(0, ...products.map((product) => product.id)) + 1,
      image: productForm.image.trim(),
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      description: productForm.description.trim(),
      specification: productForm.specification.trim(),
      rating: Number(productForm.rating),
      price: Number(productForm.price),
    };

    if (
      !newProduct.image ||
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.description ||
      !newProduct.specification
    ) {
      setFormError('Please complete every product field.');
      return;
    }

    setProducts((currentProducts) => [...currentProducts, newProduct]);
    setProductForm(emptyProductForm);
    setFormError('');
    form.reset();
    setActivePage('menu');
  }

  return (
    <>
      <header className="header">
        <button
          className="brand"
          type="button"
          aria-label="Tasty Burger home"
          onClick={() => setActivePage('home')}
        >
          <span className="brand-mark" aria-hidden="true">DJ</span>
          <span><strong>TASTY</strong><b>BURGER</b></span>
        </button>
        <nav className="navigation" aria-label="Main navigation">
          <button type="button" aria-current={activePage === 'menu' ? 'page' : undefined} onClick={() => setActivePage('menu')}>OUR MENU</button>
           <button type="button" aria-current={activePage === 'about' ? 'page' : undefined} onClick={() => setActivePage('about')}>ABOUT</button>
          <button type="button" aria-current={activePage === 'contact' ? 'page' : undefined} onClick={() => setActivePage('contact')}>CONTACT</button>
          <button
            className="add-product-nav-button"
            type="button"
            aria-current={activePage === 'add-product' ? 'page' : undefined}
            onClick={() => setActivePage('add-product')}
          >
            Add Product
          </button>
          <button
            className="cart-button"
            type="button"
            aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            aria-current={activePage === 'cart' ? 'page' : undefined}
            onClick={() => setActivePage('cart')}
          >
            <span aria-hidden="true">&#128722;</span>
            <span className="cart-count" aria-live="polite">{cartCount}</span>
          </button>
        </nav>
      </header>

      <main className="burger-page" id="top">
        {activePage === 'home' && (
          <section className="welcome-section">
            <h1>Ready to check delicious burgers?</h1>
            <p>Your Ultimate Burger Craving, Solved in Seconds.</p>
            <button
              className="proceed-button"
              type="button"
              onClick={() => setActivePage('menu')}
            >
              Proceed to see menu
            </button>
          </section>
        )}

        {activePage === 'about' && (
          <section className="about-section">
            <h1>About Tasty Burger</h1>
            <p className="about-tagline">We make delicious burgers with fresh ingredients and plenty of love.</p>
            <p className="about-description">
              Welcome to TASTY BURGER DJ, where your ultimate burger craving meets
              zero-friction ordering. We believe that getting a world-class burger
              should not require a compromise on time, quality, or customization.
              That is why we built a mobile-first experience designed entirely
              around the art of the perfect bite. Whether you are looking for a
              classic smash burger, a gourmet truffle-infused masterpiece, or a
              fully customized plant-based creation, TASTY BURGER DJ puts the
              grill right in your hands.
            </p>

            <div className="why-choose-section">
              <h2>Why Choose Us?</h2>
              <ul className="why-choose-list">
                <li>
                  <strong>Craving-First Customization</strong>
                  <p>
                    Modify ingredients, add extra cheese, layer on the bacon, or
                    swap sauces with a clean visual builder that lets you see
                    exactly what you are ordering.
                  </p>
                </li>
                <li>
                  <strong>Streamlined Ordering</strong>
                  <p>
                    Skip the lines. Our ultra-fast checkout gets your food from
                    the kitchen to your hands with just a few taps.
                  </p>
                </li>
                <li>
                  <strong>Real-Time Tracking</strong>
                  <p>
                    Follow your burger from the moment the patty hits the grill
                    to the second it arrives hot at your doorstep.
                  </p>
                </li>
              </ul>
            </div>
          </section>
        )}

        {activePage === 'menu' && (
          <section className="menu-section">
            <h1>Our Menu</h1>
            <h2>Delicious food made with love</h2>
            <div className="product-filters" role="group" aria-label="Filter menu by category">
              {productFilters.map((filter) => (
                <button
                  key={filter}
                  className="product-filter-button"
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'All' ? 'All Items' : filter}
                </button>
              ))}
            </div>
            <div className="burger-list">
              {filteredProducts.map((product) => (
                <div key={product.id} className="burger-card">
                  <img src={product.image} alt={product.name} />
                  <div className="burger-info">
                    <h2>{product.name}</h2>
                    <p className="product-category">{product.category}</p>
                    <p>{product.description}</p>
                    <p className="product-specification">{product.specification}</p>
                    <div className="burger-meta">
                      <span>Price: {product.price}</span>
                      <span>Rating: {'★'.repeat(product.rating)}</span>
                    </div>
                    <button
                      className="add-to-cart-button"
                      type="button"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'add-product' && (
          <section className="add-product-section" aria-labelledby="add-product-heading">
            <h1 id="add-product-heading">Add New Product</h1>
            <form className="add-product-form" onSubmit={handleAddProduct}>
              <label>
                Feature Image URL
                <input
                  type="url"
                  name="image"
                  required
                  value={productForm.image}
                  onChange={(event) => setProductForm({ ...productForm, image: event.target.value })}
                  placeholder="https://example.com/product.jpg"
                />
              </label>
              <label>
                Product Name
                <input
                  type="text"
                  name="name"
                  required
                  value={productForm.name}
                  onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                />
              </label>
              <label>
                Product Category
                <input
                  type="text"
                  name="category"
                  required
                  value={productForm.category}
                  onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                />
              </label>
              <label>
                Product Specification
                <textarea
                  name="specification"
                  required
                  rows={3}
                  value={productForm.specification}
                  onChange={(event) => setProductForm({ ...productForm, specification: event.target.value })}
                />
              </label>
              <label>
                Rating (1-5)
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  step="1"
                  required
                  value={productForm.rating}
                  onChange={(event) => setProductForm({ ...productForm, rating: event.target.value })}
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  required
                  value={productForm.price}
                  onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                />
              </label>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="add-product-submit" type="submit">Add Product</button>
            </form>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="contact-section">
            <h1>Contact</h1>
            <p>HI! feel free to reach out to us with any questions or feedback.</p>
            <p>Email: dellosadanicatastyburger@gmail.com</p>
            <p>Phone: (456) 789-123</p>
            <p>Facebook Page: TASTY BURGER DJ</p>
          </section>
        )}

        {activePage === 'cart' && <section className="cart-panel" id="shopping-cart" aria-labelledby="cart-heading">
          <div className="cart-header">
            <h2 id="cart-heading">Your Cart</h2>
            <button className="cart-close-button" type="button" onClick={() => setActivePage('menu')}>
              Back to Menu
            </button>
          </div>
          {itemsInCart.length === 0 ? (
            <p className="empty-cart">Your cart is empty. Go to menu to enjoy your day!.</p>
          ) : (
            <>
              <ul className="cart-items">
                {itemsInCart.map((product) => (
                  <li className="cart-item" key={product.id}>
                    <div className="cart-item-info">
                      <strong>{product.name}</strong>
                      <span>{product.price} each</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls" aria-label={`${product.name} quantity`}>
                        <button
                          className="quantity-button"
                          type="button"
                          aria-label={`Remove one ${product.name}`}
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          -
                        </button>
                        <span aria-live="polite">{cartItems[product.id]}</span>
                        <button
                          className="quantity-button"
                          type="button"
                          aria-label={`Add one ${product.name}`}
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-item-button"
                        type="button"
                        onClick={() => updateQuantity(product.id, -cartItems[product.id])}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="cart-total">Total: {cartTotal}</p>
            </>
          )}
        </section>}
      </main>
    </>
  );
}
