document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById('grid-container');
    const loadMoreButton = document.getElementById('load-more');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    let products = [];
    let filteredProducts = [];
    let currentIndex = 0;
    const itemsPerPage = 6;

    const fetchData = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            filteredProducts = [...products];
            displayProducts();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    function filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
        if (selectedCategories.length > 0) {
            filteredProducts = products.filter(product => selectedCategories.includes(product.category));
        } else {
            filteredProducts = [...products];
        }
        currentIndex = 0;
        productContainer.innerHTML = '';
        displayProducts();
    }

    const displayProducts = () => {
        const nextProducts = filteredProducts.slice(currentIndex, currentIndex + itemsPerPage);
        console.log('nextProducts', nextProducts);
        nextProducts.forEach(item => {
            const productElement = document.createElement('div');
            productElement.classList.add('grid-item');
            productElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <h4>${item.price}</h4>
            `;
            productContainer.appendChild(productElement);
        });
        currentIndex += itemsPerPage;
        if (currentIndex >= filteredProducts.length) {
            loadMoreButton.style.display = 'none';
        }
    };

    const searchProducts = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
        console.log("search data", filteredProducts);
        resetDisplay();
    };

    const sortProducts = () => {
        const sortBy = sortSelect.value;
        if (sortBy === 'title') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'price') {
            filteredProducts.sort((a, b) => a.price - b.price);
        }
        resetDisplay();
    };

    const resetDisplay = () => {
        productContainer.innerHTML = '';
        currentIndex = 0;
        loadMoreButton.style.display = 'block';
        displayProducts();
    };

    loadMoreButton.addEventListener('click', displayProducts);
    searchInput.addEventListener('input', searchProducts);
    sortSelect.addEventListener('change', sortProducts);

    fetchData();
});
