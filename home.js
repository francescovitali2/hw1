const prodotti = [
  { imgSrc: './pictures/Prodotto1.jpg', hoverSrc: './pictures/prodotto5.jpg', titolo: 'SWEATERS', prezzo: { minimo: 50, massimo: 80 }},
  { imgSrc: './pictures/Prodotto2.jpg', hoverSrc: './pictures/prodotto6.jpg', titolo: 'DENIM', prezzo: { minimo: 40, massimo: 150 }},
  { imgSrc: './pictures/Prodotto3.jpg', hoverSrc: './pictures/prodotto7.jpg', titolo: 'TOP', prezzo: { minimo: 10, massimo: 60 }},
  { imgSrc: './pictures/Prodotto4.jpg', hoverSrc: './pictures/prodotto8.jpg', titolo: 'BOTTOM', prezzo: { minimo: 40, massimo: 90 }}
];

function showNotification(message) {
  const notification = document.querySelector('#notification');
  if (message === 'Added to cart'){
      notification.style.backgroundColor = '#007706cf';
  } else {
      notification.style.backgroundColor = '#ff0000cf';
  }
  notification.textContent = message;
  notification.classList.add('show-notification');

  setTimeout(() => {
      notification.classList.remove('show-notification'); 
  }, 1500);
}

let isConvertedToUSD = false; 

async function convertiPrezziUSD() {
  const prezzoContainers = document.querySelectorAll('.prodotto-prezzo');

  if (!isConvertedToUSD) {
    const response = await fetch("get_exchange_rate.php");
    const exchangeRate = await response.json();

    if (exchangeRate) {
      prezzoContainers.forEach(prezzoContainer => {
        const prezzoEURText = prezzoContainer.querySelector('.prezzo-eur').textContent;
        const prezzoEUR = parsePrezzo(prezzoEURText);

        if (prezzoEUR) {
          const prezzoMinUSD = prezzoEUR.minimo * exchangeRate;
          const prezzoMaxUSD = prezzoEUR.massimo * exchangeRate;

          const prezzoUSDText = `${prezzoMinUSD.toFixed(2)}$ - ${prezzoMaxUSD.toFixed(2)}$`;
          prezzoContainer.querySelector('.prezzo-usd').textContent = prezzoUSDText;
          prezzoContainer.querySelector('.prezzo-eur').style.display = 'none';
        } else {
          prezzoContainer.querySelector('.prezzo-usd').textContent = 'Prezzo non disponibile';
        }
      });

      isConvertedToUSD = true;
      convertButton.textContent = 'Convert to EUR';
    }
  } else {
    prezzoContainers.forEach(prezzoContainer => {
      prezzoContainer.querySelector('.prezzo-usd').textContent = '';
      prezzoContainer.querySelector('.prezzo-eur').style.display = 'inline';
    });

    isConvertedToUSD = false;
    convertButton.textContent = 'Convert to USD';
  }
}

function parsePrezzo(prezzoText) {
  const match = prezzoText.match(/(\d+(\.\d+)?)€ - (\d+(\.\d+)?)€/);
  if (match) {
    return {
      minimo: parseFloat(match[1]),
      massimo: parseFloat(match[3])
    };
  }
  return null;
}

const listaProdotti = document.getElementById('listaProdotti');
prodotti.forEach(prodotto => {
  const nuovoElemento = document.createElement('li');
  nuovoElemento.setAttribute('data-category', prodotto.titolo);
  nuovoElemento.classList.add('home');

  const imgElement = document.createElement('img');
  imgElement.src = prodotto.imgSrc;
  imgElement.setAttribute('data-hover-src', prodotto.hoverSrc);
  nuovoElemento.appendChild(imgElement);

  const titoloContainer = document.createElement('div');
  const titolo = document.createElement('h3');
  titolo.textContent = prodotto.titolo;
  titoloContainer.appendChild(titolo);

  const prezzoContainer = document.createElement('div');
  const prezzoEUR = prodotto.prezzo;
  const prezzoEURText = `${prezzoEUR.minimo}€ - ${prezzoEUR.massimo}€`;
  const prezzoEURSpan = document.createElement('span');
  prezzoEURSpan.textContent = prezzoEURText;
  prezzoEURSpan.classList.add('prezzo-eur');
  prezzoContainer.appendChild(prezzoEURSpan);

  const prezzoUSDContainer = document.createElement('span');
  prezzoUSDContainer.classList.add('prezzo-usd');
  prezzoContainer.appendChild(prezzoUSDContainer);

  prezzoContainer.classList.add('prodotto-prezzo');
  titoloContainer.appendChild(prezzoContainer);

  nuovoElemento.appendChild(titoloContainer);

  imgElement.addEventListener('mouseover', () => {
      imgElement.src = imgElement.getAttribute('data-hover-src');
  });

  imgElement.addEventListener('mouseout', () => {
      imgElement.src = prodotto.imgSrc;
  });

  nuovoElemento.addEventListener('click', () => {
    const categoriaSelezionata = nuovoElemento.getAttribute('data-category');
    
    window.location.href = `products.php?category=${categoriaSelezionata}`;
  });

  listaProdotti.appendChild(nuovoElemento);
});

function openPopup(event){
  const popup = document.getElementById('popup');
  popup.classList.toggle('hidden');
}

const convertButton = document.getElementById('convertButton');
convertButton.addEventListener('click', convertiPrezziUSD);
const userIcon = document.querySelector('#userIcon');

userIcon.addEventListener('click', openPopup);

function onJson(json) {
  const risultatiSection = document.querySelector('#risultati');
  risultatiSection.innerHTML = '';
  risultatiSection.style.display = 'block';

  document.querySelector('.principale').style.display = 'none';
  document.querySelector('.prodotti_cat').style.display = 'none';

  const heading = document.createElement('h1');
  heading.textContent = 'Results for: ' + document.querySelector('#searchBar').value;
  risultatiSection.appendChild(heading);
  const listaRisultati = document.createElement('ul');
  listaRisultati.id = 'listaRisultati';

  for (const productId in json) {
    const product = json[productId];

    const listItem = document.createElement('li');
    listItem.style.cursor = 'default';
    listItem.setAttribute('data-id', product.id);

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.setAttribute('data-hover-image', product.hover_image);
    productImage.classList.add('product-image');
    listItem.appendChild(productImage);
    productImage.addEventListener('mouseover', () => {
      productImage.src = productImage.getAttribute('data-hover-image');
    });
    productImage.addEventListener('mouseout', () => {
      productImage.src = product.image;
    });

    const infoContainer = document.createElement('div');
    infoContainer.id = 'info';

    const productName = document.createElement('h3');
    productName.textContent = product.name;
    infoContainer.appendChild(productName);

    const priceContainer = document.createElement('div');
    priceContainer.classList.add('prodotto-prezzo');
    priceContainer.textContent = `${product.price}€`;
    infoContainer.appendChild(priceContainer);

    listItem.appendChild(infoContainer);

    const description = document.createElement('p');
    description.classList.add('descrizione', 'hidden');
    description.textContent = product.description;
    listItem.appendChild(description);

    const errorMessage = document.createElement('span');
    errorMessage.id = 'error';
    errorMessage.textContent = 'Please select a size';
    listItem.appendChild(errorMessage);

    const sizesContainer = document.createElement('div');
    sizesContainer.id = 'sizes';

    const sizes = ['S', 'M', 'L'];
    sizes.forEach(size => {
      const sizeElement = document.createElement('div');
      sizeElement.classList.add('size');
      if (!product.sizes[size] || product.sizes[size] <= 0) {
        sizeElement.classList.add('empty');
      }
      sizeElement.textContent = size;
      sizesContainer.appendChild(sizeElement);

      sizeElement.addEventListener('click', (event) => {
        const allSizeButtons = listItem.querySelectorAll('.size');
        const selectedSize = sizeElement.textContent.trim();

        if (!sizeElement.classList.contains('empty')) {
          if (sizeElement.classList.contains('clicked')) {
            sizeElement.classList.remove('clicked');
            delete listItem.dataset.size;
          } else {
            allSizeButtons.forEach(sizeElement => sizeElement.classList.remove('clicked'));
            allSizeButtons.forEach(sizeElement => delete listItem.dataset.size);

            sizeElement.classList.add('clicked');
            listItem.dataset.size = selectedSize;
          }
        }
      });
    });

    listItem.appendChild(sizesContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'tasti';

    const showMoreButton = document.createElement('div');
    showMoreButton.classList.add('tasto');
    showMoreButton.textContent = 'Show More';
    buttonsContainer.appendChild(showMoreButton);
    showMoreButton.addEventListener('click', function(){
      if (description.style.display === 'none' || description.style.display === '') {
        listItem.classList.add('show');
        description.style.display = 'block';
        showMoreButton.textContent = 'Show Less';
      } else {
        listItem.classList.remove('show');
        description.style.display = 'none';
        showMoreButton.textContent = 'Show More';
      }
    });

    const cartButton = document.createElement('div');
    cartButton.classList.add('cart-button');
    buttonsContainer.appendChild(cartButton);
    cartButton.addEventListener('click', () => {
      errorMessage.style.opacity = '0';
    
      let selected = false;
      listItem.querySelectorAll('.size').forEach(sizeBtn => {
        if (sizeBtn.classList.contains('clicked')) {
          selected = true;
        }
      });
    
      if (selected) {
        const info = new FormData();
        info.append('id', listItem.dataset.id);
        info.append('size', listItem.dataset.size);
        fetch("add_product.php", { method: 'post', body: info })
          .then(response => response.json())
          .then(data => {
            if (data.ok) {
              showNotification('Added to cart');
              if (data.total_quantity !== undefined) {
                const numberElement = document.querySelector('#number');
                if (numberElement) {
                  numberElement.style.display = "flex";
                  numberElement.textContent = data.total_quantity;
                }
              }
            } else {
              showNotification(data.error_message);
            }
          });
      } else {
        errorMessage.style.opacity = '1'; 
      }
    });
    

    listItem.appendChild(buttonsContainer);

    listaRisultati.appendChild(listItem);
  }

  risultatiSection.appendChild(listaRisultati);

  const backButton = document.createElement('div');
  backButton.id = 'backButton';
  backButton.textContent = '⬅︎ Back';
  backButton.addEventListener('click', () => {
    document.querySelector('.principale').style.display = 'flex';
    document.querySelector('.prodotti_cat').style.display = 'block';
    risultatiSection.innerHTML = '';
    risultatiSection.style.display = 'none';

    searchBar.value = '';
    searchBar.classList.remove('visible');
    searchIcon.style.display = 'block';
  });

  risultatiSection.appendChild(backButton);
}

function onResponse(response){
  return response.json();
}

const searchIcon = document.getElementById('searchIcon');
const searchBar = document.getElementById('searchBar');
searchIcon.addEventListener('click', function() {
  searchIcon.style.display = 'none';
  searchBar.classList.toggle('visible');
  if (searchBar.classList.contains('visible')) {
    searchBar.focus();
  }
});
searchBar.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const product = searchBar.value;
    fetch("search.php?q=" + encodeURIComponent(product)).then(onResponse).then(onJson);
  }
});


