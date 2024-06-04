function isFull(){
    const submit = document.querySelector('#submit');

    for(const state in formStatus){
        if(formStatus[state] === true){
            send = false;
            break;
        } else {
            send = true;
        }
    }

    if(send){
        submit.classList.add('active');
    } else {
        submit.classList.remove('active');
    }
}

function onResponse(response){
    return response.json();
}

function onEmailJson(json){
    const result = json.exists;
    const email=document.querySelector('.email');

    if(result){
        email.querySelector('span').textContent="● Email already in use";
        email.querySelector('span').classList.add('error');
        formStatus['email'] = true;
    } else {
        email.querySelector('span').classList.remove('error');
        formStatus['email'] = false;
        isFull();
    }
}

function onUsernameJson(json){
    const result = json.exists;
    const username = document.querySelector('.username');

    if(result){
        username.querySelector('span').textContent="● Username already in use";
        username.querySelector('span').classList.add('error');
        formStatus['username'] = true;
    } else {
        username.querySelector('span').classList.remove('error');
        formStatus['username'] = false;
        isFull();
    }
}

function showPassword(event){
    const clicked = event.currentTarget;
    const input = clicked.parentNode.querySelector("input");
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.type = type;
    const source = input.getAttribute('type') === 'password' ? './pictures/view.png' : './pictures/hide.png';
    clicked.src = source;
}

function checkName(event){
    const name = event.currentTarget;

    if(name.value.length===0){
        name.parentNode.querySelector('span').classList.add('error');
    } else {
        name.parentNode.querySelector('span').classList.remove('error');
        formStatus['name'] = false;
        isFull();
    }
}

function checkLastName(event){
    const lastName = event.currentTarget;

    if(lastName.value.length===0){
        lastName.parentNode.querySelector('span').classList.add('error');
    } else {
        lastName.parentNode.querySelector('span').classList.remove('error');
        formStatus['lastname'] = false;
        isFull();
    }
}

function checkEmail(event){
    const email=event.currentTarget;

    if(email.value.length===0){
        email.parentNode.querySelector('span').textContent="● Insert email";
        email.parentNode.querySelector('span').classList.add('error');
        formStatus['email'] = true;
    } else {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value.toLowerCase())){
            email.parentNode.querySelector('span').textContent="● Email not valid";
            email.parentNode.querySelector('span').classList.add('error');
            isFull();
            formStatus['email'] = true;
        } else {
            fetch('check.php?q=email&value=' + encodeURIComponent(email.value.toLowerCase())).then(onResponse).then(onEmailJson);
        }
    }
}

function checkUsername(event){
    const username=event.currentTarget;

    if(username.value.length===0){
        username.parentNode.querySelector('span').textContent="● Insert username";
        username.parentNode.querySelector('span').classList.add('error');
    } else {
        if(!/^[a-zA-Z0-9-_.]{3,20}$/.test(username.value)){
            username.parentNode.querySelector('span').textContent="● Please use only letters, numbers, hyphens, underscores, and periods, with a length between 3 and 20 characters";
            username.parentNode.querySelector('span').classList.add('error');
            formStatus['username'] = true;
            isFull();
        } else {
            fetch('check.php?q=username&value=' + encodeURIComponent(username.value)).then(onResponse).then(onUsernameJson);
        }
    }
}

function checkPassword(event){
    const password = event.currentTarget;

    if(password.value.length < 8){
        password.parentNode.querySelector('span').classList.add('error');
    } else {
        password.parentNode.querySelector('span').classList.remove('error');
        formStatus['password'] = false;
        isFull();
    }
}

function checkConfirm(event){
    const confirm = event.currentTarget;
    const password = document.querySelector('.password input').value;

    if(confirm.value.length===0){
        confirm.parentNode.querySelector('span').textContent="● Confirm password";
        confirm.parentNode.querySelector('span').classList.add('error');
    } else {
        if(confirm.value!==password){
            confirm.parentNode.querySelector('span').textContent="● The passwords do not match";
            confirm.parentNode.querySelector('span').classList.add('error');
        } else {
            confirm.parentNode.querySelector('span').classList.remove('error');
            formStatus['confirm'] = false;
            isFull();
        }
    }
}

function sendForm(event){
    const form = document.querySelector('form');
    
    if(send){
        form.submit();
    } else {
        event.preventDefault();
    }
}

document.querySelector('.name input').addEventListener('blur', checkName);
document.querySelector('.lastname input').addEventListener('blur', checkLastName);
document.querySelector('.email input').addEventListener('blur', checkEmail);
document.querySelector('.username input').addEventListener('blur', checkUsername);
document.querySelector('.password input').addEventListener('blur', checkPassword);
document.querySelector('.confirm input').addEventListener('blur', checkConfirm);
document.querySelector(".password img").addEventListener('click', showPassword);
document.querySelector(".confirm img").addEventListener('click', showPassword);
document.querySelector("#submit").addEventListener('click', sendForm);

const formStatus = { 'name': true, 'lastname': true, 'email': true, 'username': true, 'password': true, 'confirm': true };
let send = false;