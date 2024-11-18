function openTab(event, tabName) {
    // Esconde todas as abas
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }
    
    // Remove a classe 'active' de todos os botões
    let tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Mostra o conteúdo da aba selecionada e marca o botão como 'ativo'
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add("active");
}