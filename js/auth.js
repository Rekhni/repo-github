import { renderAddForm } from "./add-form.js";
import { getAndRenderComments } from "./comments.js";
import { validate } from "./service-functions.js";

export function renderAuthForm({ setToken, setUser }) {
    const container = document.querySelector('body>div.container');
    let isLoginForm = true;
    const renderForm = () => {
        container.innerHTML = `
        <ul class="comments" id="comments">
          <!-- Отрисовывается из массива JS -->
        </ul>
        <div class="auth-form add-form" id="auth-form">
            ${isLoginForm ? '' : `
            <input type="text" class="auth-form-name" placeholder="Write your name" id="login-name">
            `}
            <input type="text" class="auth-form-name" placeholder="Write your login" id="login-login">
            <input type="password" class="auth-form-name" placeholder="Write your password" id="login-password">
            
            <button class="add-form-button" id="button-login">${isLoginForm ? 'Sign in' : 'Register'}</button>
            <a class="anchor-buton" href=#>${isLoginForm ? 'Register' : 'Sign in'}</a>
            
        </div>
            `
        document.querySelector('.anchor-buton').addEventListener('click', (e) => {
            e.stopPropagation();
            isLoginForm = !isLoginForm;
            renderForm();

        });

        if (isLoginForm) {
            document.getElementById('button-login').addEventListener('click', () => {
                const loginInput = document.getElementById('login-login');
                const passwordInput = document.getElementById('login-password');

                if (validate(loginInput, 'your login') && validate(passwordInput, 'your password')) {
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    loginUser({ login, password })
                        .then((user) => {

                            const newToken = `Bearer ${user.user.token}`;
                            localStorage.setItem('currentToken', newToken);
                            setToken(newToken);

                            const newUser = user.user.name;
                            localStorage.setItem('currentUser', newUser);
                            setUser(newUser);
                            
                            getAndRenderComments(newToken);
                            renderAddForm('addForm');
                        })
                }
            })
        } else {
            document.getElementById('button-login').addEventListener('click', () => {
                const nameInput = document.getElementById('login-name');
                const loginInput = document.getElementById('login-login');
                const passwordInput = document.getElementById('login-password');
                if (validate(nameInput, 'your name') && validate(loginInput, 'your login') && validate(passwordInput, 'your password')) {
                    const name = nameInput.value;
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    registerUser({ login, password, name })
                        .then((user) => {
                            console.log(user);
                            console.log(user.user.token);
                            const newToken = `Bearer ${user.user.token}`;
                            setToken(newToken);
                            const newUser = user.user.name;
                            setUser(newUser);
                            getAndRenderComments(newToken);
                            renderAddForm('addForm');
                        })
                }
            });
        }
    }
    renderForm();
}

function loginUser({ login, password }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",

        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            switch (response.status) {
                case 201:
                    return response.json();
                case 400:
                    throw new Error('Wrong login or password');
                case 500:
                    throw new Error('Server is broken');
            }
        })
        .catch(error => alert(error.message))
}

function registerUser({ login, password, name }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user", {
        method: "POST",

        body: JSON.stringify({
            login,
            password,
            name,
        }),
    })
        .then((response) => {
            switch (response.status) {
                case 201:
                    return response.json();
                case 400:
                    throw new Error('User with this login already exists');
                case 500:
                    throw new Error('Server is broken');
            }
            return response.json();
        })
        .catch(error => alert(error.message))
}