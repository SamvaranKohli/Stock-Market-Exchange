document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Username:', email);
    console.log('Password:', password);

    fetch('http://127.0.0.1:4000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            //console.error('Error:', error);
            alert('Login failed. Please check your credentials and try again.');
        });
});