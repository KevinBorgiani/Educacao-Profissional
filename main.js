if (window.location.pathname.includes('/mod/page/')) {
  async function showCorrectAnswers() {
    // Pega todos os iframes
    const iframes = document.querySelectorAll('iframe');
    
    for (const iframe of iframes) {
        try {
            const src = iframe.src;
            console.log('Processando:', src);
            
            // Faz a requisição
            const response = await fetch(src);
            const html = await response.text();
            
            // Procura pelo H5PIntegration
            const h5pMatch = html.match(/H5PIntegration\s*=\s*({[\s\S]*?});/);
            
            if (h5pMatch && h5pMatch[1]) {
                const h5pData = JSON.parse(h5pMatch[1]);
                
                if (h5pData.contents) {
                    Object.entries(h5pData.contents).forEach(([key, content]) => {
                        if (content.jsonContent) {
                            const exerciseData = JSON.parse(content.jsonContent);
                            
                            // Pega apenas respostas corretas
                            const correctAnswers = exerciseData.answers.filter(answer => answer.correct);
                            
                            if (correctAnswers.length > 0) {
                                // Cria div para resposta
                                const answerDiv = document.createElement('div');
                                answerDiv.style.cssText = `
                                    margin: 5px 0;
                                    padding: 8px 15px;
                                    background-color: #d4edda;
                                    border-left: 4px solid #28a745;
                                    color: #155724;
                                    font-weight: bold;
                                    border-radius: 3px;
                                `;
                                
                                // Texto da resposta
                                correctAnswers.forEach(answer => {
                                    const text = answer.text.replace(/<[^>]*>/g, '').trim();
                                    answerDiv.textContent = `✓ ${text}`;
                                });
                                
                                // Insere antes do iframe
                                iframe.parentElement.insertBefore(answerDiv, iframe);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log('Erro ao processar:', e);
        }
    }
}

// Cria botão
const button = document.createElement('button');
button.textContent = 'Mostrar Respostas';
button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

// Efeito hover
button.onmouseover = () => button.style.backgroundColor = '#218838';
button.onmouseout = () => button.style.backgroundColor = '#28a745';

// Clique
button.onclick = () => {
    showCorrectAnswers();
    button.disabled = true;
    button.style.backgroundColor = '#6c757d';
    button.textContent = 'Respostas Exibidas by @KevinBorgiani';
};

// Adiciona botão
document.body.appendChild(button);
}
