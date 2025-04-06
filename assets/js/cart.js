let prc = localStorage.getItem('price');
let prcArr = JSON.parse(prc) || []; 
const total = document.querySelector('#total');
const totalPrice = document.querySelector('#totalPrice');
const products = document.getElementById('products');
const categoriesNavbar = document.querySelector('#categories-navbar');

fetch('https://fakestoreapi.com/products/categories')
    .then(response => response.json())
    .then(categoryData => {
        categoryData.forEach(cat => {
            let navItem = document.createElement('li');
            navItem.classList.add('nav-item');

            let navLink = document.createElement('a');
            navLink.classList.add('nav-link');
            navLink.setAttribute('href', '#');
            navLink.setAttribute('onclick', `AllProducts('${cat}')`);
            navLink.innerText = `${cat}`;

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
        const url = categoryName === 'bestseller' 
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

/***/ 
function displayCartItems() {
    total.innerHTML = ""; 
    let SUM = 0;

   
    if (prcArr.length === 0) {
        totalPrice.innerText = "Your bag is empty";
        totalPrice.innerHTML = `
    <div style="text-align: center; margin-top: 20px;">
        <img src="assets/img/sad-face.png" alt="Empty Bag" style="width: 50px; height: 50px; margin-bottom: 10px;">
        <p>Your bag is empty</p>
    </div>
`;
        return; 
    }

    prcArr.forEach((element, index) => {
        let TR = document.createElement('tr');
        let TD = document.createElement('td');
        TD.innerText = `${element} $`;
        TR.appendChild(TD);

        let actionTD = document.createElement('td');
        actionTD.classList.add('action-cell');

        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `
            <img src="assets/img/cancel.png" alt="Remove" style="width: 10px; height: 10px; margin-bottom: 10px;">
        </div>
    `;
         
        deleteBtn.onclick = () => {
            removeItem(index);
            TR.remove();
        };

        actionTD.appendChild(deleteBtn);
        TR.appendChild(actionTD);
        total.appendChild(TR);
        
        SUM += element; 
    });

    
    if (SUM > 500) {
        totalPrice.innerHTML = `<p>Total Price is ${SUM} $</p>
            <p>with 10% discount: ${(SUM - (SUM * 0.1)).toFixed(2)} $ </p>
        `;
    } else {
        totalPrice.innerHTML = `Total Cart: ${SUM.toFixed(2)} $`;
    }
}


function removeItem(index) {
    prcArr.splice(index, 1);
    localStorage.setItem('price', JSON.stringify(prcArr)); 
    displayCartItems(); 
}


displayCartItems();
