// Abrir e fechar o menu lateral
document.getElementById('menu-btn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// Fechar o menu lateral ao clicar em um item
document.querySelectorAll('.sidebar nav ul li a').forEach(item => {
    item.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });
});
