const products = document.getElementById('products');
const categoriesNavbar = document.querySelector('#categories-navbar');
let priceArr = [];
let counter = 0;
const COUNTER = document.getElementById('counter');
const goToCart = document.getElementById('cart');

let allProducts = []; 

fetch('https://fakestoreapi.com/products/categories')
  .then(response => response.json())
  .then(categoryData => {
    categoryData.forEach(cat => {
      let navItem = document.createElement('li');
      navItem.classList.add('nav-item');

      let navLink = document.createElement('a');
      navLink.classList.add('nav-link');
      navLink.setAttribute('href', '#');
      navLink.innerText = cat;

      // اینجا درست و امنه
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        AllProducts(cat);
      });

      navItem.append(navLink);
      categoriesNavbar.append(navItem);
    });
  })
  .catch(error => console.error('Error fetching categories:', error));


document.addEventListener('DOMContentLoaded', () => {
    AllProducts('home');
});

const AllProducts = (categoryName) => {
    products.innerHTML = ''; 
    const homeContent = document.getElementById('home-content');

    if (categoryName === 'home') {
        homeContent.style.display = 'block';
    } else {
        homeContent.style.display = 'none';
        const url = categoryName === 'products' 
            ? 'https://fakestoreapi.com/products' 
            : `https://fakestoreapi.com/products/category/${categoryName}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allProducts = data; 
                displayProducts(allProducts); 
            })
            .catch(error => console.error('Error fetching products:', error));
    }
};

const displayProducts = (productsToShow) => {
    products.innerHTML = ''; 
    productsToShow.forEach(item => {
        createProductElement(item);
    });
};

const filterByPrice = () => {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
    const filteredProducts = allProducts.filter(item => item.price >= minPrice && item.price <= maxPrice);
    displayProducts(filteredProducts); 
};

const sortProducts = () => {
    const sortValue = document.getElementById('sort').value;
    let sortedProducts = [...allProducts]; 

    if (sortValue === 'asc') {
        sortedProducts.sort((a, b) => a.price - b.price); 
    } else if (sortValue === 'desc') {
        sortedProducts.sort((a, b) => b.price - a.price); 
    }

    displayProducts(sortedProducts); 
};

const createProductElement = (item) => {
    let DIV = document.createElement('div');
    DIV.classList.add('product', 'limited-scroll'); 

    let H1Elem = document.createElement('h6');
    H1Elem.innerText = `${item.title}`;

    let photo = document.createElement('img');
    photo.setAttribute('src', `${item.image}`);
    photo.setAttribute('alt', item.title); 

    let price = document.createElement('price');
    price.classList.add('price');
    price.innerText = `${item.price} $`;

    let btn = document.createElement('button');
    btn.setAttribute('onclick', 'getProductData(this)');
    btn.className = 'add-to-cart-btn';
    btn.innerText = 'Add To Cart';

    DIV.append(H1Elem);
    DIV.append(photo);
    DIV.append(price);
    DIV.append(btn); 
    products.append(DIV); 
};



const getProductData = (e) => {    
    counter++;
    let inp = Number(e.parentElement.querySelector('price').innerText.replace('$', '').trim()); 
    if(counter > 0){
        goToCart.style.display = 'inline-block';
    }
    priceArr.push(inp);
    COUNTER.innerText = counter;
    let priceStr = JSON.stringify(priceArr);
    localStorage.setItem('price', priceStr); 
}

