"use strict";

// =======================================================
// 1. CLASSE DE LÓGICA DE SORTEIO (Lottery Class)
//    - Responsabilidade: Gerar números aleatórios dentro de um range,
//      com ou sem repetição. Totalmente independente da UI.
// =======================================================
class Lottery {
  /**
   * Construtor para inicializar a piscina de números e as configurações do sorteio.
   * @param {number} start - O número inicial do intervalo.
   * @param {number} end - O número final do intervalo.
   * @param {number} amount - A quantidade de números a serem sorteados.
   * @param {boolean} allowRepeats - Define se números podem ser repetidos.
   */
  constructor(start, end, amount, allowRepeats) {
    // Validação básica interna para garantir dados válidos antes de criar o pool
    if (start >= end) {
      throw new Error(
        "O número inicial (start) deve ser menor que o final (end)."
      );
    }
    if (amount <= 0) {
      throw new Error(
        "A quantidade de números a sortear (amount) deve ser maior que zero."
      );
    }
    if (!allowRepeats && amount > end - start + 1) {
      throw new Error(
        "A quantidade de números excede o intervalo disponível sem repetição."
      );
    }

    // Cria o array de todos os números possíveis no intervalo.
    this.pool = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    this.amount = amount;
    this.allowRepeats = allowRepeats;
  }

  /**
   * Realiza o sorteio de números com base nas configurações da instância.
   * @returns {number[]} Um array contendo os números sorteados.
   */
  draw() {
    const result = [];
    // Cria uma cópia da piscina de números para manipulação interna do sorteio,
    // preservando o pool original para futuras chamadas de draw se necessário.
    const currentPool = [...this.pool];

    while (result.length < this.amount) {
      // Gera um índice aleatório válido para a piscina atual.
      const randomIndex = Math.floor(Math.random() * currentPool.length);

      // Adiciona o número sorteado ao array de resultados.
      result.push(currentPool[randomIndex]);

      // Se a repetição não for permitida, remove o número sorteado da piscina atual
      // para evitar que seja sorteado novamente.
      if (!this.allowRepeats) {
        currentPool.splice(randomIndex, 1);
      }
    }
    return result;
  }
}

// =======================================================
// 2. FUNÇÕES DE VALIDAÇÃO DE INPUTS
//    - Responsabilidade: Verificar a validade dos dados inseridos pelo usuário.
//    - Separação da lógica de validação da lógica de sorteio ou UI.
// =======================================================
/**
 * Valida os valores de entrada para o sorteio.
 * @param {string} amountStr - Valor string da quantidade a sortear.
 * @param {string} startStr - Valor string do número inicial.
 * @param {string} endStr - Valor string do número final.
 * @returns {object|boolean} Um objeto com os valores parseados se válido, ou false se inválido.
 */
function validateInputs(amountStr, startStr, endStr) {
  // Verifica se todos os campos estão preenchidos.
  if (!amountStr || !startStr || !endStr) {
    alert("Por favor, preencha todos os campos!");
    return false;
  }

  // Converte os valores para inteiros.
  const amount = parseInt(amountStr);
  const start = parseInt(startStr);
  const end = parseInt(endStr);

  // Verifica se a conversão resultou em NaN (não é um número).
  if (isNaN(amount) || isNaN(start) || isNaN(end)) {
    alert("Por favor, insira apenas números válidos nos campos.");
    return false;
  }

  // Verifica a lógica de intervalo: start deve ser menor que end.
  if (start >= end) {
    alert("O número inicial deve ser menor que o número final.");
    return false;
  }

  // Verifica se a quantidade a sortear é maior que o intervalo disponível sem repetição.
  // Esta validação é mais específica para o caso de não repetição, mas útil aqui.
  // A lógica de Lottery também valida isso internamente para robustez.
  if (amount > end - start + 1) {
    alert(
      "A quantidade de números a sortear é maior que o intervalo disponível."
    );
    return false;
  }
  if (amount <= 0) {
    alert("A quantidade de números a sortear deve ser maior que zero.");
    return false;
  }

  return { amount, start, end }; // Retorna os valores parseados se tudo OK.
}

// =======================================================
// 3. FUNÇÕES DE RENDERIZAÇÃO DA INTERFACE (UI Rendering)
//    - Responsabilidade: Manipular o DOM para exibir resultados e controles.
//    - Totalmente dependente do DOM.
// =======================================================
const UI_CONSTANTS = {
  ANIMATION_INTERVAL: 2000, // Tempo em ms entre a exibição de cada número.
  BUTTON_FADE_IN_DELAY: 50, // Tempo em ms para o botão aparecer.
};

/**
 * Renderiza os números sorteados com uma animação sequencial.
 * @param {number[]} numbers - Array de números a serem exibidos.
 * @param {HTMLElement} container - O elemento DOM onde os números serão renderizados.
 * @param {number} attempt - O número da tentativa de sorteio.
 * @param {function} onRetry - Callback para ser chamado quando o botão "Sortear Novamente" é clicado.
 */
function renderDrawResults(numbers, container, attempt, onRetry) {
  // Limpa o container e ajusta classes para a nova renderização.
  container.innerHTML = "";
  container.classList.remove("grid"); // Assume que 'grid' é uma classe de layout anterior.

  // Cria o invólucro principal para os resultados.
  const wrapper = document.createElement("div");
  wrapper.classList.add("space", "container");

  // Cria e adiciona o título do resultado.
  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `
    <h1 class="result">Resultado do Sorteio</h1>
    <h2 class="sub-title">${attempt}º Sorteio</h2>
  `;

  // Cria o container específico para os números sorteados.
  const numbersContainer = document.createElement("div");
  numbersContainer.classList.add("div-sorted-numbers");

  wrapper.append(titleDiv, numbersContainer);
  container.append(wrapper);

  let i = 0;
  // Animação para exibir os números um por um.
  const intervalId = setInterval(() => {
    if (i < numbers.length) {
      const numberSpan = document.createElement("span");
      numberSpan.textContent = numbers[i];
      numberSpan.classList.add("number-sorted");

      const animateDiv = document.createElement("div");
      animateDiv.classList.add("animation-number");
      animateDiv.append(numberSpan);

      numbersContainer.append(animateDiv);
      i++;
    } else {
      // Quando todos os números foram exibidos, limpa o intervalo e mostra o botão de retry.
      clearInterval(intervalId);
      createRetryButton(container, onRetry);
    }
  }, UI_CONSTANTS.ANIMATION_INTERVAL);
}

/**
 * Cria e adiciona um botão de "Sortear Novamente" ao container.
 * @param {HTMLElement} container - O elemento DOM onde o botão será adicionado.
 * @param {function} onClick - Função de callback a ser executada no clique do botão.
 */
function createRetryButton(container, onClick) {
  const btn = document.createElement("button");
  btn.classList.add("appear-button");
  btn.innerHTML = `SORTEAR NOVAMENTE <img src="./assets/Frame.svg" alt="rotate arrow">`;
  btn.style.opacity = 0; // Inicia invisível para efeito de fade-in.

  // Adiciona um pequeno atraso para o efeito de fade-in.
  setTimeout(() => (btn.style.opacity = 1), UI_CONSTANTS.BUTTON_FADE_IN_DELAY);
  btn.onclick = onClick; // Atribui a função de callback ao evento de clique.

  container.append(btn);
}

// =======================================================
// 4. LÓGICA DE CONTROLE PRINCIPAL (Event Handling & Orchestration)
//    - Responsabilidade: Ligar tudo, lidar com eventos do usuário, gerenciar o fluxo da aplicação.
// =======================================================
let currentLotteryInstance = null; // Armazena a instância da Loteria atual.
let drawAttemptCount = 0; // Contador de sorteios.

/**
 * Lida com o evento de submit do formulário.
 * Orquestra a validação, o sorteio e a renderização dos resultados.
 * @param {Event} event - O objeto do evento de submit.
 */
function handleSubmit(event) {
  event.preventDefault(); // Previne o recarregamento da página.

  // 1. Coleta os valores dos inputs.
  const amountInput = document.getElementById("draw");
  const initialInput = document.getElementById("initial");
  const finalInput = document.getElementById("final");
  // O checkbox `checked` retorna true se marcado. Queremos `allowRepeats = true` se marcado.
  // Sua lógica anterior `!document.querySelector("input[type='checkbox']").checked`
  // estava invertida se o objetivo era "permitir repetição" quando o checkbox está marcado.
  // Assumindo que o checkbox é "Permitir Repetição", então `checked` deve ser `allowRepeat`.
  const allowRepeatsCheckbox = document.querySelector('input[type="checkbox"]');
  const allowRepeats = allowRepeatsCheckbox
    ? allowRepeatsCheckbox.checked
    : false;

  // 2. Valida os inputs.
  const validatedValues = validateInputs(
    amountInput.value,
    initialInput.value,
    finalInput.value
  );

  if (!validatedValues) {
    return; // Interrompe se a validação falhar.
  }

  const { amount, start, end } = validatedValues;

  try {
    // 3. Cria (ou recria) a instância da Lottery para o sorteio atual.
    // Isso garante que se os parâmetros mudarem, uma nova Lottery seja configurada.
    currentLotteryInstance = new Lottery(start, end, amount, allowRepeats);

    // 4. Realiza o sorteio.
    const sortedNumbers = currentLotteryInstance.draw();

    // 5. Incrementa o contador de sorteios.
    drawAttemptCount++;

    // 6. Renderiza os resultados.
    const mainContainer = document.querySelector("main");
    renderDrawResults(sortedNumbers, mainContainer, drawAttemptCount, () => {
      // Callback para o botão "Sortear Novamente".
      // Usa a instância `currentLotteryInstance` para fazer um novo sorteio.
      // Isso garante que os mesmos parâmetros de intervalo e repetição sejam usados.
      if (currentLotteryInstance) {
        const nextSortedNumbers = currentLotteryInstance.draw();
        drawAttemptCount++; // Incrementa para o novo sorteio.
        renderDrawResults(
          nextSortedNumbers,
          mainContainer,
          drawAttemptCount,
          this
        ); // 'this' refere-se ao callback atual para recursividade.
      }
    });
  } catch (error) {
    // Captura erros da classe Lottery (ex: quantidade > pool sem repetição).
    alert("Erro no sorteio: " + error.message);
    console.error("Lottery Error:", error);
  }
}

// =======================================================
// 5. CONFIGURAÇÃO INICIAL (Event Listeners & Input Mask)
//    - Responsabilidade: Configurar a aplicação ao carregar a página.
// =======================================================

// Aplica uma máscara de entrada para permitir apenas dígitos numéricos nos campos de texto.
document.querySelectorAll("input[type='text']").forEach((input) => {
  input.addEventListener("input", () => {
    // Remove caracteres não numéricos e espaços em branco.
    input.value = input.value.replace(/[^0-9]/g, "").trim();
  });
});

// Adiciona o event listener para o envio do formulário.
document.querySelector("form").addEventListener("submit", handleSubmit);
