const cart_buttons = document.querySelectorAll('.cart-button');
const buttons = document.querySelectorAll('.tasto');
const size_buttons = document.querySelectorAll('.size');

for (const el of size_buttons) {
    el.addEventListener('click', (event) => {
        const liElement = el.parentNode.parentNode;
        const allSizeButtons = liElement.querySelectorAll('.size');
        const selectedSize = el.textContent.trim();

        if (!el.classList.contains('empty')) {
            if (el.classList.contains('clicked')) {
                el.classList.remove('clicked');
                delete liElement.dataset.size;
            } else {
                allSizeButtons.forEach(button => button.classList.remove('clicked'));
                allSizeButtons.forEach(button => delete button.parentNode.parentNode.dataset.size);

                el.classList.add('clicked');
                liElement.dataset.size = selectedSize;
            }
        }
    });
}

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

for (const button of cart_buttons) {
    const li = button.parentNode.parentNode;
    const sizes = button.parentNode.parentNode.querySelectorAll('.size');

    button.addEventListener('click', (event) => {
        const errorMessage = button.parentNode.parentNode.querySelector('#error');
        errorMessage.style.opacity = '0';

        let selected = false;
        for(const size of sizes){
            if(size.classList.contains('clicked')){
                selected = true;
                console.log(selected);
                break;
            }
        }
        
        if (selected){
            const info = new FormData();
            info.append('id',li.dataset.id);
            info.append('size',li.dataset.size);
            console.log(li.dataset.id);
            console.log(li.dataset.size);
            fetch("add_product.php",{ method: 'post', body: info })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.ok) {
                        showNotification('Added to cart');
                        if (data.total_quantity !== undefined) {
                            const numberElement = document.querySelector('#number');
                            numberElement.style.display = "flex";
                            console.log(data.total_quantity);
                            numberElement.textContent = data.total_quantity;
                        }
                    } else {
                        showNotification(data.error_message);
                    }
                });
        } else {
            errorMessage.style.opacity = '1'; 
        }
    });
}

for (const item of buttons) {
    item.addEventListener('click', (event) => {
        const description = event.target.parentNode.parentNode.querySelector('.descrizione');
        const li = event.target.parentNode.parentNode;
        const tasto = event.target;

        if (description.style.display === 'none' || description.style.display === '') {
            li.classList.add('show');
            description.style.display = 'block';
            tasto.textContent = 'Show Less';
        } else {
            li.classList.remove('show');
            description.style.display = 'none';
            tasto.textContent = 'Show More';
        }
    });
}

function openPopup(event){
    const popup = document.getElementById('popup');
    popup.classList.toggle('hidden');
}

const userIcon = document.querySelector('#userIcon');
userIcon.addEventListener('click', openPopup);

const productImages = document.querySelectorAll('.product-image');
productImages.forEach(image => {
    const defaultSrc = image.src;
    const hoverSrc = image.getAttribute('data-hover-image');

    image.addEventListener('mouseover', () => {
        image.src = hoverSrc;
    });

    image.addEventListener('mouseout', () => {
        image.src = defaultSrc;
    });
});
