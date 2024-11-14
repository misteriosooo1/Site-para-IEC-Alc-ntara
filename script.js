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

// Funções para abrir e fechar o modal
function openModal(imgElement) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("imgModal");
    var captionText = document.getElementById("caption");
    var modalText = document.getElementById("modalText");

    modal.style.display = "flex"; // Exibe o modal
    modalImg.src = imgElement.src; // Define a imagem do modal
    captionText.innerHTML = imgElement.alt; // Define a legenda com o texto alternativo da imagem
    modalText.innerHTML = imgElement.alt; // Define o texto no modal (mesmo que a legenda)
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none"; // Oculta o modal
}
