# 📊 Trabalho P2 — Simulador Visual Interativo: Quick Sort vs. Merge Sort

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Dependências](https://img.shields.io/badge/Depend%C3%AAncias-Zero%20(Python%20Puro)-2EA44F?style=flat-square)
![Fatec](https://img.shields.io/badge/Fatec%20Ribeir%C3%A3o%20Preto-ADS%202026.2-B91C1C?style=flat-square)

> **🎥 Vídeo Explicativo de Defesa Técnica:** [https://youtu.be/LHSrSUEhlSs?si=-Jj9xqdaAuTwrSDV]

---

## 👤 Identificação Acadêmica

- **Aluno(a):** [Jhenifer Vitoria Andrade Camargo]
- **RA:** [2840482521010]
- **Curso:** Análise e Desenvolvimento de Sistemas (ADS) — Fatec Ribeirão Preto
- **Disciplina:** Estrutura de Dados — Prof. Eduardo Cruz Araujo (Semestre 2026.2)
- **Tema Escolhido:** **Tema A** — Ordenação Dividir-para-Conquistar: *Quick Sort (Pivô Fixo) vs. Merge Sort*

---

## 📑 Sumário

- [1. Estrutura do Repositório](#-1-estrutura-do-repositório)
- [2. Como Executar](#-2-como-executar)
- [3. Resumo Teórico e Aplicações Reais](#-3-resumo-teórico-e-aplicações-reais)
- [4. Tabela Comparativa de Complexidade Assintótica (Big-O)](#-4-tabela-comparativa-de-complexidade-assintótica-big-o)
- [5. Análise Matemática: Pior Caso $O(n^2)$ vs. Garantia $\Theta(n \log n)$](#-5-análise-matemática-pior-caso-on2-vs-garantia-thetan-log-n)
- [6. Resultados Empíricos dos Testes (`src/algoritmo.py`)](#-6-resultados-empíricos-dos-testes-srcalgoritmopy)
- [7. Simulador Visual Interativo (`src/demo/`)](#-7-simulador-visual-interativo-srcdemo)
- [8. Diário de Engenharia com IA](#-8-diário-de-engenharia-com-ia)

---

## 🗂️ 1. Estrutura do Repositório

```text
trabalho-p2-ed/
├── README.md              # Documentação teórica, Big-O, Diário de IA e Link do Vídeo
└── src/
    ├── algoritmo.py       # Implementação em Python puro + métricas + 3 cenários de teste
    └── demo/
        ├── index.html     # Interface do simulador visual interativo
        ├── styles.css     # Estilização, código de cores didático e responsividade
        └── app.js         # Motor de snapshots passo a passo e telemetria
```

---

## 🚀 2. Como Executar

### 1. Implementação e Benchmarks em Python
Não há dependências externas; utiliza apenas a biblioteca padrão do Python 3.10+. A partir da raiz do projeto:

```bash
python src/algoritmo.py
```

### 2. Simulador Visual Interativo
Abra o arquivo `src/demo/index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox ou Safari). Não é necessário servidor backend ou instalação de pacotes.

---

## 🧩 3. Resumo Teórico e Aplicações Reais

Tanto o **Quick Sort** quanto o **Merge Sort** seguem o paradigma **Dividir-para-Conquistar** (*Divide and Conquer*), decompondo recursivamente o vetor de entrada até subproblemas triviais ($n \le 1$). Entretanto, eles distribuem o custo operacional de forma oposta entre as fases de **divisão** e **combinação**:

### Quick Sort — *"Divisão Pesada, Combinação Trivial"*
- **Como funciona:** Na fase de divisão (`_lomuto_partition`), o algoritmo elege o último elemento (`arr[high]`) como pivô fixo e reorganiza o subvetor *in-place* para que elementos $\le \text{pivô}$ fiquem à esquerda e elementos $> \text{pivô}$ fiquem à direita. Ao final dessa varredura linear, o pivô já ocupa sua posição definitiva e os dois subvetores resultantes são ordenados recursivamente sem necessidade de etapa de combinação ($O(1)$).
- **Aplicações no mundo real:**
  1. **Bibliotecas padrão para tipos primitivos:** O *Dual-Pivot QuickSort* é o algoritmo padrão de `Arrays.sort()` na JVM (OpenJDK) para arrays primitivos (`int[]`, `double[]`), onde estabilidade não é exigida e a alta localidade espacial maximiza acertos na memória cache (L1/L2).
  2. **Núcleo de algoritmos híbridos (IntroSort):** Implementações como `std::sort` (C++ STL) e `slice::sort_unstable` (Rust) utilizam Quick Sort como base pela baixa constante multiplicativa, alternando para Heap Sort caso a profundidade de recursão ultrapasse $2\lfloor \log_2 n \rfloor$.

### Merge Sort — *"Divisão Trivial, Combinação Pesada"*
- **Como funciona:** Divide o vetor ao meio em tempo constante $O(1)$ (`mid = left + (right - left) // 2`) sem inspecionar valores, até obter subvetores unitários. O trabalho principal ocorre na etapa de combinação (`_merge`), onde dois ponteiros intercalam ordenadamente os subvetores esquerdo e direito em buffers auxiliares, preservando a ordem relativa de elementos iguais (estabilidade) via comparação inclusiva (`<=`).
- **Aplicações no mundo real:**
  1. **Ordenação Externa (*External Sorting*) em Bancos de Dados e Big Data:** SGBDs (PostgreSQL, MySQL) e motores distribuídos (Apache Spark) usam variantes *k-way Merge Sort* para ordenar conjuntos de dados maiores que a memória RAM por meio de leitura e escrita sequencial em disco/SSD.
  2. **Ordenação estável de objetos em linguagens modernas:** É a base estrutural do **TimSort**, utilizado nativamente em `list.sort()` e `sorted()` do Python, `Arrays.sort(Object[])` do Java e `Array.prototype.sort()` em motores JavaScript (V8).

---

## 📐 4. Tabela Comparativa de Complexidade Assintótica (Big-O)

| Critério / Métrica | Quick Sort (Pivô Fixo à Direita) | Merge Sort |
| :--- | :---: | :---: |
| **Tempo — Melhor Caso** | $\Omega(n \log n)$ | $\Omega(n \log n)$ |
| **Tempo — Caso Médio** | $\Theta(n \log n)$ | $\Theta(n \log n)$ |
| **Tempo — Pior Caso** | $O(n^2)$ | $O(n \log n)$ |
| **Espaço Auxiliar** | $O(\log n)$ médio / $O(n)$ pior caso *(pilha)* | $O(n)$ *(vetores auxiliares + pilha)* |
| **Ordenação *In-Place*** | **Sim** | **Não** |
| **Estabilidade** | **Não** | **Sim** |

---

## 🧮 5. Análise Matemática: Pior Caso $O(n^2)$ vs. Garantia $\Theta(n \log n)$

### Por que o Pior Caso $O(n^2)$ ocorre no Quick Sort com Pivô Fixo?
Com o particionamento de Lomuto escolhendo sempre `arr[high]` como pivô, se o vetor já estiver **ordenado em ordem crescente** ($a_1 < a_2 < \dots < a_n$), o pivô escolhido será invariavelmente o **maior elemento** de cada subvetor ativo. Todas as $n - 1$ comparações `arr[j] <= pivot` serão verdadeiras, deslocando `i` até `high - 1`:

1. O pivô permanece no final do subvetor com **zero trocas efetivas**, mas após consumir $n - 1$ comparações.
2. O problema de tamanho $n$ é dividido de forma totalmente desbalanceada em um subproblema de tamanho **$n - 1$** e outro de tamanho **$0$**.

A árvore de recursão degenera em uma lista linear de altura $n$, obedecendo à recorrência:

$$
T(n) = T(n - 1) + T(0) + (n - 1)
$$

Expandindo até o caso base $T(1) = 0$:

$$
T(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2} = \Theta(n^2)
$$

Para $n = 15$ elementos ordenados, isso resulta exatamente em $\frac{15 \times 14}{2} = 105$ comparações (e profundidade de pilha $O(n)$).

### Contraste com a Estabilidade $\Theta(n \log n)$ e o Espaço $O(n)$ do Merge Sort
O Merge Sort ignora o conteúdo dos elementos durante a divisão, mantendo sempre partições balanceadas de tamanho $n/2$:

$$
T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n) \implies T(n) = \Theta(n \log n) \quad \text{(pelo Teorema Mestre)}
$$

Em contrapartida, a intercalação de dois subvetores ordenados exige alocação de memória auxiliar $O(n)$ (`left_part` e `right_part`) e $n$ escritas por nível da árvore ($\approx n \log_2 n$ movimentações).

---

## 📈 6. Resultados Empíricos dos Testes (`src/algoritmo.py`)

| Cenário Executado | Tamanho ($n$) | Quick Sort (Comp. / Trocas) | Merge Sort (Comp. / Mov.) | Comportamento Comprovado |
| :--- | :---: | :---: | :---: | :--- |
| **(a) Caso Médio (Aleatório)** | `15` | `48` / `15` *(Total: 63)* | `42` / `59` *(Total: 101)* | Ambos operam em $\Theta(n \log n)$; Quick Sort economiza movimentações. |
| **(b.1) Borda: Lista Vazia** | `0` | `0` / `0` *(Total: 0)* | `0` / `0` *(Total: 0)* | Tratamento seguro do caso base sem recursão. |
| **(b.2) Borda: Lista Unitária** | `1` | `0` / `0` *(Total: 0)* | `0` / `0` *(Total: 0)* | Retorno imediato em $O(1)$. |
| **(b.3) Borda: Repetidos** | `10` | `27` / `6` *(Total: 33)* | `23` / `34` *(Total: 57)* | Merge Sort mantém estabilidade via `<=`. |
| **(c) Pior Caso Quick Sort** | `15` | `105` / `0` *(Total: 105)* | `31` / `59` *(Total: 90)* | Quick Sort atinge $\frac{15 \times 14}{2} = 105$ comp. ($O(n^2)$). |

---

## 🖥️ 7. Simulador Visual Interativo (`src/demo/`)

- **Código de Cores:**
  - 🟦 **Ciano:** Sub-array ativo na chamada recursiva atual.
  - 🟪 **Roxo:** Pivô fixo atual (`arr[high]`) no Quick Sort.
  - 🟨 **Âmbar:** Elementos sendo comparados no passo atual.
  - 🟥 **Vermelho Coral:** Troca (*swap*) ou gravação na memória (*merge*).
  - 🟩 **Verde Esmeralda:** Elementos já consolidados em suas posições finais.
- **Controles:** *Executar (Play)*, *Pausar*, *Próximo Passo (Step)*, *Anterior*, *Reiniciar (Reset)*, controle de velocidade, carga rápida de cenários (*Caso Médio*, *Pior Caso*, *Invertido*), entrada de *Array Customizado* e painel em tempo real com **Comparações**, **Trocas/Escritas**, **Variáveis Auxiliares** (`low`, `high`, `pivot`, `i`, `j`, `left`, `mid`, `right`, `k`) e **Log Explicativo**.

---

## 🤖 8. Diário de Engenharia com IA

- **Ferramenta / Modelo Utilizado:** Google Gemini (modo raciocínio / engenharia de software).
- **3 Principais Prompts Utilizados:**
  1. *"Implemente em Python puro (sem sort(), sorted() ou bibliotecas externas) os algoritmos Quick Sort (usando o último elemento como pivô fixo para evidenciar o pior caso) e Merge Sort, com type hints, docstrings, classe de métricas para comparações e trocas, e 3 cenários de teste no bloco main."*
  2. *"Crie um Simulador Visual Interativo comparando Quick Sort e Merge Sort usando pré-gravação de snapshots para que o botão Step avance exatamente uma comparação ou troca por clique, com código de cores didático, painel de métricas, variáveis auxiliares e log em português."*
  3. *"Elabore a análise técnica e matemática explicando por que o pior caso O(n²) ocorre no Quick Sort com pivô fixo em arrays ordenados em contraste com a garantia Θ(n log n) e espaço auxiliar O(n) do Merge Sort."*
- **Limitações e Ajustes Manuais Realizados:**
  - **Separação de arquivos:** Na primeira geração do simulador, a IA entregou toda a interface em um único arquivo `index.html` embutido. Foi necessário desmembrar e organizar o código nos três arquivos exigidos pela estrutura do projeto (`src/demo/index.html`, `src/demo/styles.css` e `src/demo/app.js`).
  - **Evitar *self-swaps* na contagem:** Ajuste na condição `if i != j:` dentro de `_lomuto_partition` (tanto no Python quanto no JavaScript) para que trocas de um elemento consigo mesmo não inflassem artificialmente o contador de movimentações no pior caso ordenado.
  - **Exibição explícita de variáveis auxiliares:** Inclusão do card dedicado ao estado das variáveis internas (`i`, `j`, `low`, `high`, `pivot`, `left_part`, `right_part`) no painel lateral do simulador para alinhar a visualização exatamente com o fluxo do código Python.
