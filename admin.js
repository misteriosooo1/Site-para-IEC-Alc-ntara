// Importando o Firebase e suas funções
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAf1EfbohLx-0cTRdMSheZ3io7D8NqXo3k",
    authDomain: "ieca-c6c22.firebaseapp.com",
    databaseURL: "https://ieca-c6c22-default-rtdb.firebaseio.com",
    projectId: "ieca-c6c22",
    storageBucket: "ieca-c6c22.firebasestorage.app",
    messagingSenderId: "360000245007",
    appId: "1:360000245007:web:67b28c9d6352846bd6c27a"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, ref, set, get, remove, update, storage, storageRef, uploadBytes, getDownloadURL };

try {
    console.log("Firebase conectado com sucesso!");
} catch (error) {
    console.error("Erro ao conectar ao Firebase:", error);
}

import { db, ref, set, get, remove, update } from './admin.js';

// Função para adicionar um evento
document.addEventListener("DOMContentLoaded", function() {
    const adicionarEventoForm = document.querySelector("form[action='adicionar-evento.php']");
    if (adicionarEventoForm) {
        adicionarEventoForm.addEventListener("submit", async function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            const titulo = document.getElementById("titulo").value;
            const data = document.getElementById("data").value;
            const descricao = document.getElementById("descricao").value;

            try {
                const eventoId = new Date().getTime().toString();  // Gerar ID único

                // Referência para adicionar o evento no Firebase Realtime Database
                const eventoRef = ref(db, 'eventos/' + eventoId);

                // Adicionar evento ao Firebase
                await set(eventoRef, {
                    titulo: titulo,
                    data: data,
                    descricao: descricao
                });

                console.log("Evento adicionado com sucesso!");
                alert("Evento adicionado com sucesso!");
                adicionarEventoForm.reset(); // Limpa os campos do formulário
                carregarEventos(); // Atualiza a lista de eventos
            } catch (error) {
                console.error("Erro ao adicionar evento:", error);
            }
        });
    }

    // Função para carregar eventos do Firebase
    async function carregarEventos() {
        const listaEventos = document.getElementById("lista-eventos");
        listaEventos.innerHTML = ''; // Limpa a lista de eventos antes de preencher

        try {
            const eventosRef = ref(db, 'eventos');
            const snapshot = await get(eventosRef);

            if (snapshot.exists()) {
                const eventos = snapshot.val();
                for (let eventoId in eventos) {
                    const evento = eventos[eventoId];
                    const eventoElement = document.createElement("div");
                    eventoElement.classList.add("evento-item");
                    eventoElement.innerHTML = `
                        <h3>${evento.titulo}</h3>
                        <p>${evento.data}</p>
                        <p>${evento.descricao}</p>
                        <button class="btn-editar" data-id="${eventoId}">Editar</button>
                        <button class="btn-excluir" data-id="${eventoId}">Excluir</button>
                    `;
                    listaEventos.appendChild(eventoElement);
                }
            } else {
                console.log("Nenhum evento encontrado.");
            }
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    }

    // Função para excluir um evento
    document.addEventListener("click", async function(event) {
        if (event.target.classList.contains("btn-excluir")) {
            const eventoId = event.target.getAttribute("data-id");
            const confirmacao = confirm("Tem certeza que deseja excluir este evento?");
            if (confirmacao) {
                try {
                    const eventoRef = ref(db, 'eventos/' + eventoId);
                    await remove(eventoRef);
                    console.log("Evento excluído com sucesso!");
                    alert("Evento excluído com sucesso!");
                    event.target.closest(".evento-item").remove(); // Remove o evento da lista
                } catch (error) {
                    console.error("Erro ao excluir evento:", error);
                }
            }
        }

        // Função para editar um evento
        if (event.target.classList.contains("btn-editar")) {
            const eventoId = event.target.getAttribute("data-id");

            // Buscar o evento no Firebase usando o ID
            const eventoRef = ref(db, 'eventos/' + eventoId);
            const snapshot = await get(eventoRef);

            if (snapshot.exists()) {
                const evento = snapshot.val();
                document.getElementById("editar-titulo").value = evento.titulo;
                document.getElementById("editar-data").value = evento.data;
                document.getElementById("editar-descricao").value = evento.descricao;

                // Mostrar o formulário de edição
                document.getElementById("editar-evento").style.display = "block";

                // Quando o formulário for enviado, atualiza o evento
                const editarEventoForm = document.getElementById("editar-evento-form");
                editarEventoForm.onsubmit = async function(e) {
                    e.preventDefault(); // Impede o envio padrão do formulário

                    const titulo = document.getElementById("editar-titulo").value;
                    const data = document.getElementById("editar-data").value;
                    const descricao = document.getElementById("editar-descricao").value;

                    // Atualizar o evento no Firebase
                    await update(eventoRef, {
                        titulo: titulo,
                        data: data,
                        descricao: descricao
                    });

                    alert("Evento atualizado com sucesso!");
                    carregarEventos(); // Atualiza a lista de eventos
                    document.getElementById("editar-evento").style.display = "none"; // Esconde o formulário de edição
                };
            } else {
                alert("Evento não encontrado!");
            }
        }
    });

    // Cancelar a edição
    document.getElementById("cancelar-edicao").addEventListener("click", function() {
        document.getElementById("editar-evento").style.display = "none"; // Esconde o formulário de edição
    });

    // Carregar eventos ao inicializar a página
    carregarEventos();

    document.getElementById("form-cadastro").addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            console.log("Usuário criado com sucesso!", userCredential.user);
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar usuário:", error.message);
            alert("Erro ao criar usuário: " + error.message);
        }
    });
    
    document.getElementById("form-login").addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const email = document.getElementById("email-login").value;
        const senha = document.getElementById("senha-login").value;
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            console.log("Usuário logado com sucesso!", userCredential.user);
            alert("Login bem-sucedido!");
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            alert("Erro ao fazer login: " + error.message);
        }
    });
    
});
