function showNotification(message) {
    const notification = document.querySelector('#notification');
    if (message === 'Added to cart') {
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

function onJson(json) {
    console.log(json);
    const listaProdotti = document.getElementById('listaProdotti');
    const riepilogo = document.getElementById('riepilogo');
    const riepilogoContainer = document.querySelector('.left');
    listaProdotti.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (json.length === 0) {
        riepilogo.style.display = 'none';
        const empty = document.createElement('div');
        empty.classList.add('empty');
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'The cart is empty';
        empty.appendChild(emptyMessage);
        listaProdotti.appendChild(empty);
        return;
    }

    for (const result of json) {
        const nuovoElemento = document.createElement('li');

        const imgElement = document.createElement('img');
        imgElement.src = result.hover_image;
        nuovoElemento.appendChild(imgElement);

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info');
        const titolo = document.createElement('h3');
        titolo.textContent = result.name;
        const taglia = document.createElement('div');
        taglia.textContent = result.size;
        taglia.classList.add('size');
        const spacer = document.createElement('div');
        spacer.classList.add('spacer');
        const prezzo = document.createElement('div');
        prezzo.textContent = (result.price * parseInt(result.quantity)).toFixed(2) + '€';
        prezzo.classList.add('price');
        infoContainer.appendChild(titolo);
        infoContainer.appendChild(taglia);
        infoContainer.appendChild(spacer);
        infoContainer.appendChild(prezzo);
        nuovoElemento.appendChild(infoContainer);

        const total = document.createElement('div');
        total.classList.add('total');
        const rimuovi = document.createElement('div');
        rimuovi.classList.add('tasto');
        rimuovi.addEventListener('click', function () {
            const info = new FormData();
            info.append('id', result.id);
            info.append('size', result.size);
            info.append('quantity', parseInt(numberDisplay.textContent));
            info.append('action', 'delete');
            fetch("remove_product.php", { method: 'post', body: info })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.ok) {
                        nuovoElemento.style.display = 'none';
                        updateSummary(-parseInt(numberDisplay.textContent), -(result.price) * parseInt(numberDisplay.textContent));
                    }
                });
        });
        const quantita = document.createElement('div');
        quantita.classList.add('counter');
        const minusButton = document.createElement('div');
        minusButton.classList.add('minus');
        minusButton.textContent = '-';
        const plusButton = document.createElement('div');
        plusButton.classList.add('plus');
        plusButton.textContent = '+';
        const numberDisplay = document.createElement('div');
        numberDisplay.classList.add('number');
        numberDisplay.textContent = result.quantity;
        minusButton.addEventListener('click', function () {
            let currentValue = parseInt(numberDisplay.textContent);
            const info = new FormData();
            info.append('id', result.id);
            info.append('size', result.size);
            info.append('quantity', parseInt(numberDisplay.textContent));
            info.append('action', 'decrement');
            fetch("remove_product.php", { method: 'post', body: info })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        numberDisplay.textContent = currentValue - 1;
                        const updatedPrice = (result.price * parseInt(numberDisplay.textContent)).toFixed(2) + '€';
                        prezzo.textContent = updatedPrice;
                        updateSummary(-1, -result.price);
                        if (numberDisplay.textContent === '0') {
                            nuovoElemento.style.display = 'none';
                        }
                        if (data.total_quantity !== 0 && data.total_quantity !== '') {
                            plusButton.classList.remove('disabled');
                        }
                    }
                });
        });
        plusButton.addEventListener('click', function () {
            let currentValue = parseInt(numberDisplay.textContent);
            const info = new FormData();
            info.append('id', result.id);
            info.append('size', result.size);
            fetch("add_product.php", { method: 'post', body: info })
                .then(response => response.json())
                .then(data => {
                    if (!data.ok) {
                        showNotification(data.error_message);
                        if (data.error_message === 'Out of stock') {
                            plusButton.classList.add('disabled');
                            numberDisplay.textContent = currentValue;
                        }
                    } else {
                        numberDisplay.textContent = currentValue + 1;
                        const updatedPrice = (result.price * parseInt(numberDisplay.textContent)).toFixed(2) + '€';
                        prezzo.textContent = updatedPrice;
                        updateSummary(1, result.price);
                    }
                });
        });
        quantita.appendChild(minusButton);
        quantita.appendChild(numberDisplay);
        quantita.appendChild(plusButton);
        total.appendChild(rimuovi);
        total.appendChild(quantita);
        nuovoElemento.appendChild(total);

        listaProdotti.appendChild(nuovoElemento);

        totalItems += parseInt(result.quantity);
        totalPrice += result.price * parseInt(result.quantity);
    }
    const totalItemsElement = document.querySelector('#totale-elementi');
    totalItemsElement.textContent = 'Items: ' + totalItems;
    const totalPriceElement = document.querySelector('#totale-prezzo');
    totalPriceElement.textContent = 'Subtotal: ' + totalPrice.toFixed(2) + '€';

    riepilogoContainer.appendChild(totalItemsElement);
    riepilogoContainer.appendChild(totalPriceElement);
    riepilogo.appendChild(riepilogoContainer);

    const checkoutButton = document.createElement('div');
    checkoutButton.setAttribute('id', 'checkout');
    checkoutButton.textContent = 'CHECKOUT';
    riepilogo.appendChild(checkoutButton);
}

function updateSummary(quantityChange, priceChange) {
    const totalItemsElement = document.querySelector('#totale-elementi');
    const totalPriceElement = document.querySelector('#totale-prezzo');

    let currentTotalItems = parseInt(totalItemsElement.textContent.replace('Items: ', ''));
    let currentTotalPrice = parseFloat(totalPriceElement.textContent.replace('Subtotal: ', '').replace('€', ''));

    totalItemsElement.textContent = 'Items: ' + (currentTotalItems + quantityChange);
    totalPriceElement.textContent = 'Subtotal: ' + (currentTotalPrice + parseFloat(priceChange)).toFixed(2) + '€';

    if (parseFloat(totalPriceElement.textContent.replace('Subtotal: ', '').replace('€', '')) === 0.00) {
        riepilogo.style.display = 'none';
        const empty = document.createElement('div');
        empty.classList.add('empty');
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'The cart is empty';
        empty.appendChild(emptyMessage);
        listaProdotti.appendChild(empty);
    }
}

function onResponse(response) {
    return response.json();
}

function loadCart() {
    fetch("added_to_cart.php").then(onResponse).then(onJson);
}

function openPopup(event) {
    const popup = document.getElementById('popup');
    popup.classList.toggle('hidden');
}

const userIcon = document.querySelector('#userIcon');
userIcon.addEventListener('click', openPopup);

loadCart();



