const numProblemas = 5;
let respostasCorretas = [];
let tempo = 0;
let intervalo;
let rodada = 1;

function gerarProblemas() {
    clearInterval(intervalo);
    tempo = 0;
    document.getElementById("tempo").innerText = tempo;
    document.getElementById("rodada").innerText = rodada;

    intervalo = setInterval(() => {
        tempo++;
        document.getElementById("tempo").innerText = tempo;
    }, 1000);

    const container = document.getElementById("problemas");
    const gabaritoDiv = document.getElementById("gabarito");
    container.innerHTML = "";
    gabaritoDiv.innerHTML = "";
    respostasCorretas = [];

    // Aumento exponencial da dificuldade
    let dificuldade = Math.pow(2, rodada);

    for (let i = 0; i < numProblemas; i++) {
        const tipo = Math.floor(Math.random() * 8);  // Agora temos 8 tipos de problemas
        let questao, resposta;

        switch (tipo) {
            case 0: // Aritmética
                let a = Math.floor(Math.random() * dificuldade) + 1;
                let b = Math.floor(Math.random() * dificuldade) + 1;
                let operador = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
                resposta = operador === "/" ? (a / b) : eval(`${a} ${operador} ${b}`);
                if (operador === "/") resposta = arredondarResposta(resposta); // Ajustar a divisão
                questao = `${a} ${operador} ${b} = ?`;
                break;

            case 1: // Álgebra
                let x = Math.floor(Math.random() * dificuldade) + 1;
                resposta = x;
                questao = `Se ${dificuldade}x = ${dificuldade * x}, então x = ?`;
                break;

            case 2: // Geometria
                let base = Math.floor(Math.random() * dificuldade) + 1;
                let altura = Math.floor(Math.random() * dificuldade) + 1;
                resposta = (base * altura) / 2;
                questao = `Área do triângulo de base ${base} e altura ${altura} = ?`;
                break;

            case 3: // Funções
                let coefA = Math.floor(Math.random() * dificuldade) + 1;
                let coefB = Math.floor(Math.random() * dificuldade) + 1;
                let valorX = Math.floor(Math.random() * dificuldade) + 1;
                resposta = coefA * valorX + coefB;
                questao = `Se f(x) = ${coefA}x + ${coefB}, quanto vale f(${valorX})?`;
                break;

            case 4: // Expressões
                let n1 = Math.floor(Math.random() * dificuldade) + 1;
                let n2 = Math.floor(Math.random() * dificuldade) + 1;
                let n3 = Math.floor(Math.random() * dificuldade) + 1;
                let op1 = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
                let op2 = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
                resposta = eval(`${n1} ${op1} ${n2} ${op2} ${n3}`);
                questao = `Resolva: ${n1} ${op1} ${n2} ${op2} ${n3} = ?`;
                break;

            case 5: // Igualdades
                let n4 = Math.floor(Math.random() * dificuldade) + 1;
                let n5 = Math.floor(Math.random() * dificuldade) + 1;
                let n6 = Math.floor(Math.random() * dificuldade) + 1;
                resposta = n4 + n5;
                questao = `Complete a igualdade: ${n4} + ${n5} = ?`;
                break;

            case 6: // Equação do segundo grau
                let a2 = Math.floor(Math.random() * (dificuldade / 2)) + 1;
                let b2 = Math.floor(Math.random() * dificuldade) + 1;
                let c2 = Math.floor(Math.random() * dificuldade) + 1;
                // Fórmula de Bhaskara
                let delta = b2 * b2 - 4 * a2 * c2;
                if (delta >= 0) {
                    let x1 = (-b2 + Math.sqrt(delta)) / (2 * a2);
                    let x2 = (-b2 - Math.sqrt(delta)) / (2 * a2);
                    resposta = `x1 = ${arredondarResposta(x1)}, x2 = ${arredondarResposta(x2)}`;
                    questao = `Resolvendo a equação: ${a2}x² + ${b2}x + ${c2} = 0, encontre as raízes.`;
                } else {
                    // Para simplificar, vamos evitar gerar equações com delta negativo
                    i--; // Repetir a iteração caso o delta seja negativo
                    continue;
                }
                break;
        }

        respostasCorretas.push(resposta);

        const problemaDiv = document.createElement("div");
        problemaDiv.classList.add("problema");
        problemaDiv.innerHTML = `
            <span>${i + 1}. ${questao}</span>
            <input type="text" id="resposta${i}">
        `;
        container.appendChild(problemaDiv);
    }
}

function arredondarResposta(resposta) {
    // Verifica se a resposta é um número com casas decimais
    if (Number.isInteger(resposta)) {
        return resposta; // Se for inteiro, retorna sem casas decimais
    } else {
        return resposta.toFixed(1); // Arredonda para uma casa decimal
    }
}

function finalizar() {
    clearInterval(intervalo);
    let gabaritoHTML = `<h2>Gabarito</h2><p>Tempo total: ${tempo} segundos</p>`;
    let acertos = 0;

    for (let i = 0; i < numProblemas; i++) {
        const respostaUser = document.getElementById(`resposta${i}`).value.trim().toLowerCase(); // Tratamento de resposta
        const respostaCorreta = respostasCorretas[i].toString().toLowerCase().trim(); // Normalizando a resposta correta

        // Comparação mais flexível
        let resultado = respostaUser === respostaCorreta;
        if (resultado) {
            acertos++;
        }

        // Melhora na mensagem do gabarito
        gabaritoHTML += `<p>${i + 1}: ${respostasCorretas[i]} (Sua resposta: ${respostaUser})`;
        gabaritoHTML += resultado ? " <span style='color: green;'>✔️ Acertou!</span>" : " <span style='color: red;'>❌ Errou</span>";
        gabaritoHTML += `</p>`;
    }

    gabaritoHTML += `<p>Acertos: ${acertos} de ${numProblemas}</p>`;

    if (acertos === numProblemas) {
        rodada++;
        gabaritoHTML += `<p>🎉 Você acertou tudo! Dificuldade aumentada.</p>`;
    } else {
        rodada = Math.max(1, rodada - 1);
        gabaritoHTML += `<p>⚠ Você errou algumas. Dificuldade ajustada.</p>`;
    }

    document.getElementById("gabarito").innerHTML = gabaritoHTML;
}

// Inicia o jogo
gerarProblemas();
