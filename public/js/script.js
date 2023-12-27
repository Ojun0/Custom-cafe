// Script for navigation bar
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginBtn = document.querySelector('.loginBtn');

loginBtn.addEventListener('click',()=>{
    wrapper.classList.add('active-popup');
});

registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active');
});

loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
});