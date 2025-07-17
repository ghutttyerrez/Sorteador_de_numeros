"use strict";

// Seleciona os elementos do DOM
const form = document.querySelector("form");
const aside = document.querySelector("aside"); // O <aside> contém o formulário
const quantityInput = document.getElementById("draw");
const minInput = document.getElementById("initial");
const maxInput = document.getElementById("final");
const uniqueCheckbox = document.getElementById("check");
const drawButton = document.querySelector(".draw-one");

let drawCount = 0;

// Função para realizar o sorteio
function performDraw() {
  // Converte os valores dos inputs para números inteiros
  const quantity = parseInt(quantityInput.value);
  const min = parseInt(minInput.value);
  const max = parseInt(maxInput.value);

  // Validação dos dados
  if (min >= max) {
    alert("O valor inicial deve ser menor que o valor final.");
    return;
  }
  if (quantity <= 0) {
    alert("A quantidade de números a sortear deve ser maior que zero.");
    return;
  }
  if (uniqueCheckbox.checked && quantity > max - min + 1) {
    alert(
      "Não é possível sortear essa quantidade de números únicos no intervalo definido."
    );
    return;
  }

  // Gera os números sorteados
  const drawnNumbers = generateNumbers(
    quantity,
    min,
    max,
    uniqueCheckbox.checked
  );

  // Incrementa o contador de sorteios
  drawCount++;

  // Exibe os números na tela com animação sequencial
  displayResultsWithAnimation(drawnNumbers);
}

// Adiciona um ouvinte de evento para o envio do formulário
form.addEventListener("submit", (event) => {
  // Previne o comportamento padrão do formulário (recarregar a página)
  event.preventDefault();
  performDraw();
});

// Adiciona um ouvinte de evento para o botão de sorteio
drawButton.addEventListener("click", (event) => {
  event.preventDefault();
  performDraw();
});

/**
 * Gera uma lista de números aleatórios.
 * @param {number} quantity - A quantidade de números a serem gerados.
 * @param {number} min - O valor mínimo do intervalo.
 * @param {number} max - O valor máximo do intervalo.
 * @param {boolean} isUnique - Se os números devem ser únicos.
 * @returns {number[]} - Uma lista com os números gerados.
 */
function generateNumbers(quantity, min, max, isUnique) {
  const numbers = new Set();
  if (isUnique) {
    while (numbers.size < quantity) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  } else {
    const result = [];
    for (let i = 0; i < quantity; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      result.push(randomNumber);
    }
    return result;
  }
}

/**
 * Exibe os resultados do sorteio na tela com animação sequencial.
 * @param {number[]} numbers - A lista de números sorteados.
 */
function displayResultsWithAnimation(numbers) {
  // Limpa o conteúdo do <aside>
  aside.innerHTML = "";

  // Adiciona a classe 'space' ao <aside> para aplicar o estilo do resultado
  aside.classList.add("space");
  aside.classList.remove("grid"); // Garante que a classe grid seja removida

  // Cria o título
  const title = document.createElement("h1");
  title.className = "result";
  title.textContent = "RESULTADO DO SORTEIO";

  // Cria o contador de resultados
  const countDisplay = document.createElement("h2");
  countDisplay.className = "sub-title";
  countDisplay.textContent = `${drawCount}º resultado`;

  // Cria a área para os números
  const numbersArea = document.createElement("div");
  numbersArea.className = "div-sorted-numbers";

  // Cria o botão "Sortear Novamente" (inicialmente oculto)
  const drawAgainButton = document.createElement("button");
  drawAgainButton.className = "draw-one appear-button";
  drawAgainButton.innerHTML = `SORTEAR NOVAMENTE <img src="./assets/icons/play.svg" alt="" class="rotate-icon">`;
  drawAgainButton.addEventListener("click", performDraw);

  // Adiciona os elementos ao <aside>
  aside.appendChild(title);
  aside.appendChild(countDisplay);
  aside.appendChild(numbersArea);
  aside.appendChild(drawAgainButton);

  // Função para adicionar números com animação sequencial (padrão anterior)
  function addNumberWithDelay(index) {
    if (index >= numbers.length) {
      // Todos os números foram adicionados, mostrar o botão
      setTimeout(() => {
        drawAgainButton.classList.add("show");
      }, 500); // Aguarda 500ms após o último número
      return;
    }

    // Cria o wrapper de animação para o número atual
    const animationWrapper = document.createElement("div");
    animationWrapper.className = "animation-number";

    const numberSpan = document.createElement("span");
    numberSpan.className = "number-sorted";
    numberSpan.textContent = numbers[index];

    animationWrapper.appendChild(numberSpan);
    numbersArea.appendChild(animationWrapper);

    // Adiciona o próximo número após um delay (padrão anterior)
    setTimeout(() => {
      addNumberWithDelay(index + 1);
    }, 800); // Delay entre cada número
  }

  // Inicia a sequência de animação
  setTimeout(() => {
    addNumberWithDelay(0);
  }, 300);
}

/**
 * Exibe os resultados do sorteio na tela, usando as classes do draw.css.
 * @param {number[]} numbers - A lista de números sorteados.
 */
function displayResults(numbers) {
  // Limpa o conteúdo do <aside>
  aside.innerHTML = "";

  // Adiciona a classe 'space' ao <aside> para aplicar o estilo do resultado
  aside.classList.add("space");
  aside.classList.remove("grid"); // Garante que a classe grid seja removida

  // Cria o título
  const title = document.createElement("h1");
  title.className = "result";
  title.textContent = "RESULTADO DO SORTEIO";

  // Cria o contador de resultados
  const countDisplay = document.createElement("h2");
  countDisplay.className = "sub-title";
  countDisplay.textContent = `${drawCount}º resultado`;

  // Cria a área para os números
  const numbersArea = document.createElement("div");
  numbersArea.className = "div-sorted-numbers";

  // Adiciona cada número sorteado à área com a estrutura e classes corretas
  numbers.forEach((num) => {
    const animationWrapper = document.createElement("div");
    animationWrapper.className = "animation-number";

    const numberSpan = document.createElement("span");
    numberSpan.className = "number-sorted";
    numberSpan.textContent = num;

    animationWrapper.appendChild(numberSpan);
    numbersArea.appendChild(animationWrapper);
  });

  // Cria o botão "Sortear Novamente"
  const drawAgainButton = document.createElement("button");
  drawAgainButton.className = "draw-one";
  drawAgainButton.innerHTML = `SORTEAR NOVAMENTE <img src="./assets/icons/play.svg" alt="">`;
  drawAgainButton.addEventListener("click", performDraw);

  // Adiciona os elementos ao <aside>
  aside.appendChild(title);
  aside.appendChild(countDisplay);
  aside.appendChild(numbersArea);
  aside.appendChild(drawAgainButton);
}

// Lógica para permitir apenas números nos inputs (código original)
const allInputs = document.querySelectorAll("input[type='text']");
allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    let value = input.value.replace(/[^0-9]/g, "");
    input.value = value.trim();
  });
});
