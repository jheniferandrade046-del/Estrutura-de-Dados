(() => {
  const PYTHON_SNIPPETS = {
    quick: [
      "def _lomuto_partition(arr, low, high, metrics):",
      "    pivot = arr[high]",
      "    i = low - 1",
      "    for j in range(low, high):",
      "        metrics.comparisons += 1",
      "        if arr[j] <= pivot:",
      "            i += 1",
      "            if i != j:",
      "                arr[i], arr[j] = arr[j], arr[i]",
      "                metrics.movements += 1",
      "    if i + 1 != high:",
      "        arr[i + 1], arr[high] = arr[high], arr[i + 1]",
      "        metrics.movements += 1",
      "    return i + 1",
    ],
    merge: [
      "def _merge(arr, left_idx, mid_idx, right_idx, metrics):",
      "    left_part = arr[left_idx : mid_idx + 1]",
      "    right_part = arr[mid_idx + 1 : right_idx + 1]",
      "    i = 0; j = 0",
      "    k = left_idx",
      "    while i < len(left_part) and j < len(right_part):",
      "        metrics.comparisons += 1",
      "        if left_part[i] <= right_part[j]:",
      "            arr[k] = left_part[i]; i += 1",
      "        else:",
      "            arr[k] = right_part[j]; j += 1",
      "        metrics.movements += 1; k += 1",
      "    while i < len(left_part): arr[k] = left_part[i]; ...",
      "    while j < len(right_part): arr[k] = right_part[j]; ...",
    ],
  };

  const state = {
    algorithm: "quick",
    baseArray: [42, 17, 85, 29, 63, 11, 94, 38, 50, 7, 76, 21],
    snapshots: [],
    currentIndex: 0,
    timerId: null,
    speedMs: 550,
  };

  const els = {
    btnAlgoQuick: document.getElementById("btn-algo-quick"),
    btnAlgoMerge: document.getElementById("btn-algo-merge"),
    btnPresetRandom: document.getElementById("btn-preset-random"),
    btnPresetWorst: document.getElementById("btn-preset-worst"),
    btnPresetReversed: document.getElementById("btn-preset-reversed"),
    btnPresetDuplicates: document.getElementById("btn-preset-duplicates"),
    arraySize: document.getElementById("array-size"),
    customForm: document.getElementById("custom-form"),
    customInput: document.getElementById("custom-array"),
    btnPlay: document.getElementById("btn-play"),
    btnPause: document.getElementById("btn-pause"),
    btnPrev: document.getElementById("btn-prev"),
    btnStep: document.getElementById("btn-step"),
    btnReset: document.getElementById("btn-reset"),
    stepScrubber: document.getElementById("step-scrubber"),
    speedSlider: document.getElementById("speed-slider"),
    speedLabel: document.getElementById("speed-label"),
    algoTitle: document.getElementById("current-algo-title"),
    algoComplexity: document.getElementById("current-algo-complexity"),
    stepCurrent: document.getElementById("step-current"),
    stepTotal: document.getElementById("step-total"),
    barsContainer: document.getElementById("bars-container"),
    memoryTitle: document.getElementById("memory-title"),
    memoryBadge: document.getElementById("memory-badge"),
    memoryBuffers: document.getElementById("memory-buffers"),
    codeFuncTag: document.getElementById("code-func-tag"),
    pythonCodeView: document.getElementById("python-code-view"),
    metricComparisons: document.getElementById("metric-comparisons"),
    metricMovements: document.getElementById("metric-movements"),
    metricTotal: document.getElementById("metric-total"),
    auxVarsContainer: document.getElementById("aux-vars-container"),
    stepLog: document.getElementById("step-log"),
    benchmarkN: document.getElementById("benchmark-n"),
    benchRowQuick: document.getElementById("bench-row-quick"),
    benchRowMerge: document.getElementById("bench-row-merge"),
    benchQComp: document.getElementById("bench-q-comp"),
    benchQMov: document.getElementById("bench-q-mov"),
    benchQTot: document.getElementById("bench-q-tot"),
    benchMComp: document.getElementById("bench-m-comp"),
    benchMMov: document.getElementById("bench-m-mov"),
    benchMTot: document.getElementById("bench-m-tot"),
    benchmarkVerdict: document.getElementById("benchmark-verdict"),
  };

  function createSnapshot({
    array,
    activeRange = [],
    pivotIndex = null,
    comparing = [],
    swapping = [],
    sorted = [],
    pointers = {},
    auxVars = {},
    buffers = null,
    codeLine = null,
    comparisons = 0,
    movements = 0,
    message = "",
  }) {
    return {
      array: [...array],
      activeRange: [...activeRange],
      pivotIndex,
      comparing: [...comparing],
      swapping: [...swapping],
      sorted: Array.from(sorted),
      pointers: { ...pointers },
      auxVars: { ...auxVars },
      buffers,
      codeLine,
      comparisons,
      movements,
      message,
    };
  }

  function generateQuickSortSnapshots(inputArray) {
    const arr = [...inputArray];
    const snaps = [];
    const sortedSet = new Set();
    let comparisons = 0;
    let movements = 0;

    snaps.push(
      createSnapshot({
        array: arr,
        auxVars: { low: "-", high: "-", pivot: "-", i: "-", j: "-" },
        codeLine: 1,
        message: `Vetor inicial com n = ${arr.length} elementos. O Quick Sort usará sempre o último elemento (arr[high]) como pivô fixo.`,
      })
    );

    function rangeIndices(low, high) {
      const res = [];
      for (let idx = low; idx <= high; idx++) res.push(idx);
      return res;
    }

    function partition(low, high) {
      const pivot = arr[high];
      let i = low - 1;
      const activeRange = rangeIndices(low, high);

      snaps.push(
        createSnapshot({
          array: arr,
          activeRange,
          pivotIndex: high,
          sorted: sortedSet,
          pointers: { [high]: "Pivô" },
          auxVars: { low, high, pivot: `${pivot} (idx ${high})`, i, j: "-" },
          codeLine: 2,
          comparisons,
          movements,
          message: `Particionando sub-array [${low}..${high}]. Pivô fixo eleito: arr[${high}] = ${pivot}.`,
        })
      );

      for (let j = low; j < high; j++) {
        comparisons++;
        const pointers = { [high]: "Pivô", [j]: "j" };
        if (i >= low) pointers[i] = pointers[i] ? `${pointers[i]},i` : "i";

        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            pivotIndex: high,
            comparing: [j, high],
            sorted: sortedSet,
            pointers,
            auxVars: { low, high, pivot: `${pivot} (idx ${high})`, i, j },
            codeLine: 6,
            comparisons,
            movements,
            message: `Comparação #${comparisons}: arr[${j}] (${arr[j]}) <= pivô (${pivot})? ${
              arr[j] <= pivot ? "Sim — avança fronteira i." : "Não — permanece à direita."
            }`,
          })
        );

        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            movements++;
            snaps.push(
              createSnapshot({
                array: arr,
                activeRange,
                pivotIndex: high,
                swapping: [i, j],
                sorted: sortedSet,
                pointers: { [high]: "Pivô", [i]: "i", [j]: "j" },
                auxVars: { low, high, pivot: `${pivot} (idx ${high})`, i, j },
                codeLine: 9,
                comparisons,
                movements,
                message: `Troca #${movements}: permuta arr[${i}] (${arr[i]}) com arr[${j}] (${arr[j]}).`,
              })
            );
          }
        }
      }

      const finalPivotIdx = i + 1;
      if (finalPivotIdx !== high) {
        [arr[finalPivotIdx], arr[high]] = [arr[high], arr[finalPivotIdx]];
        movements++;
        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            swapping: [finalPivotIdx, high],
            sorted: sortedSet,
            pointers: { [finalPivotIdx]: "Pivô" },
            auxVars: {
              low,
              high,
              pivot: `${pivot} -> idx ${finalPivotIdx}`,
              i,
              j: high,
            },
            codeLine: 12,
            comparisons,
            movements,
            message: `Troca #${movements}: posiciona o pivô ${pivot} em seu índice definitivo (${finalPivotIdx}).`,
          })
        );
      }

      sortedSet.add(finalPivotIdx);
      snaps.push(
        createSnapshot({
          array: arr,
          sorted: sortedSet,
          pointers: { [finalPivotIdx]: "Fixo" },
          auxVars: {
            low,
            high,
            pivot: `${pivot} (idx ${finalPivotIdx})`,
            i,
            j: high,
          },
          codeLine: 14,
          comparisons,
          movements,
          message: `Pivô ${pivot} consolidado no índice ${finalPivotIdx}. Sub-vetores esquerdo [${low}..${
            finalPivotIdx - 1
          }] e direito [${finalPivotIdx + 1}..${high}] seguem para recursão.`,
        })
      );

      return finalPivotIdx;
    }

    function quickSortRec(low, high) {
      if (low < high) {
        const p = partition(low, high);
        quickSortRec(low, p - 1);
        quickSortRec(p + 1, high);
      } else if (low === high && low >= 0 && low < arr.length) {
        sortedSet.add(low);
        snaps.push(
          createSnapshot({
            array: arr,
            sorted: sortedSet,
            auxVars: { low, high, pivot: "-", i: "-", j: "-" },
            codeLine: 1,
            comparisons,
            movements,
            message: `Sub-array unitário no índice ${low} (valor ${arr[low]}) atingiu o caso base da recursão.`,
          })
        );
      }
    }

    if (arr.length > 0) {
      quickSortRec(0, arr.length - 1);
    }

    for (let idx = 0; idx < arr.length; idx++) sortedSet.add(idx);

    snaps.push(
      createSnapshot({
        array: arr,
        sorted: sortedSet,
        auxVars: { low: "-", high: "-", pivot: "Concluído", i: "-", j: "-" },
        codeLine: 14,
        comparisons,
        movements,
        message: `Quick Sort concluído! Total: ${comparisons} comparações e ${movements} trocas.`,
      })
    );

    return snaps;
  }

  function generateMergeSortSnapshots(inputArray) {
    const arr = [...inputArray];
    const snaps = [];
    const finalSorted = new Set();
    let comparisons = 0;
    let movements = 0;

    snaps.push(
      createSnapshot({
        array: arr,
        auxVars: { left: "-", mid: "-", right: "-", k: "-" },
        buffers: { left: [], leftIdx: 0, right: [], rightIdx: 0 },
        codeLine: 1,
        message: `Vetor inicial com n = ${arr.length} elementos. O Merge Sort dividirá o intervalo ao meio até sub-arrays unitários.`,
      })
    );

    function rangeIndices(left, right) {
      const res = [];
      for (let idx = left; idx <= right; idx++) res.push(idx);
      return res;
    }

    function merge(left, mid, right, isRootMerge) {
      const leftPart = arr.slice(left, mid + 1);
      const rightPart = arr.slice(mid + 1, right + 1);
      const activeRange = rangeIndices(left, right);

      snaps.push(
        createSnapshot({
          array: arr,
          activeRange,
          sorted: finalSorted,
          pointers: { [left]: "L", [mid]: "M", [right]: "R" },
          auxVars: { left, mid, right, k: left },
          buffers: { left: leftPart, leftIdx: 0, right: rightPart, rightIdx: 0 },
          codeLine: 2,
          comparisons,
          movements,
          message: `Intercalando [${left}..${mid}] e [${mid + 1}..${right}]: alocados buffers auxiliares left_part (${leftPart.length}) e right_part (${rightPart.length}).`,
        })
      );

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftPart.length && j < rightPart.length) {
        comparisons++;
        const leftAbsIdx = left + i;
        const rightAbsIdx = mid + 1 + j;

        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            comparing: [leftAbsIdx, rightAbsIdx],
            sorted: finalSorted,
            pointers: { [k]: "k" },
            auxVars: { left, mid, right, k },
            buffers: { left: leftPart, leftIdx: i, right: rightPart, rightIdx: j },
            codeLine: 8,
            comparisons,
            movements,
            message: `Comparação #${comparisons}: left_part[${i}] (${leftPart[i]}) <= right_part[${j}] (${rightPart[j]})? ${
              leftPart[i] <= rightPart[j]
                ? `Sim — seleciona ${leftPart[i]} para arr[${k}].`
                : `Não — seleciona ${rightPart[j]} para arr[${k}].`
            }`,
          })
        );

        let chosenLine = 9;
        if (leftPart[i] <= rightPart[j]) {
          arr[k] = leftPart[i];
          i++;
        } else {
          arr[k] = rightPart[j];
          j++;
          chosenLine = 11;
        }
        movements++;
        if (isRootMerge) finalSorted.add(k);

        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            swapping: [k],
            sorted: finalSorted,
            pointers: { [k]: "k" },
            auxVars: { left, mid, right, k },
            buffers: { left: leftPart, leftIdx: i, right: rightPart, rightIdx: j },
            codeLine: chosenLine,
            comparisons,
            movements,
            message: `Escrita #${movements}: valor ${arr[k]} gravado na posição arr[${k}].`,
          })
        );
        k++;
      }

      while (i < leftPart.length) {
        arr[k] = leftPart[i];
        movements++;
        if (isRootMerge) finalSorted.add(k);

        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            swapping: [k],
            sorted: finalSorted,
            pointers: { [k]: "k" },
            auxVars: { left, mid, right, k },
            buffers: { left: leftPart, leftIdx: i + 1, right: rightPart, rightIdx: j },
            codeLine: 13,
            comparisons,
            movements,
            message: `Escrita #${movements} (restante esquerdo): copia ${arr[k]} para arr[${k}].`,
          })
        );
        i++;
        k++;
      }

      while (j < rightPart.length) {
        arr[k] = rightPart[j];
        movements++;
        if (isRootMerge) finalSorted.add(k);

        snaps.push(
          createSnapshot({
            array: arr,
            activeRange,
            swapping: [k],
            sorted: finalSorted,
            pointers: { [k]: "k" },
            auxVars: { left, mid, right, k },
            buffers: { left: leftPart, leftIdx: i, right: rightPart, rightIdx: j + 1 },
            codeLine: 14,
            comparisons,
            movements,
            message: `Escrita #${movements} (restante direito): copia ${arr[k]} para arr[${k}].`,
          })
        );
        j++;
        k++;
      }
    }

    function mergeSortRec(left, right) {
      if (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        mergeSortRec(left, mid);
        mergeSortRec(mid + 1, right);
        const isRoot = left === 0 && right === arr.length - 1;
        merge(left, mid, right, isRoot);
      }
    }

    if (arr.length > 1) {
      mergeSortRec(0, arr.length - 1);
    }

    for (let idx = 0; idx < arr.length; idx++) finalSorted.add(idx);

    snaps.push(
      createSnapshot({
        array: arr,
        sorted: finalSorted,
        auxVars: { left: 0, mid: "-", right: Math.max(0, arr.length - 1), k: "Concluído" },
        buffers: { left: [], leftIdx: 0, right: [], rightIdx: 0 },
        codeLine: 1,
        comparisons,
        movements,
        message: `Merge Sort concluído! Total: ${comparisons} comparações e ${movements} escritas em memória.`,
      })
    );

    return snaps;
  }

  function renderPythonCode(activeLine) {
    const lines = PYTHON_SNIPPETS[state.algorithm];
    els.codeFuncTag.textContent =
      state.algorithm === "quick" ? "_lomuto_partition()" : "_merge()";

    els.pythonCodeView.innerHTML = lines
      .map((text, idx) => {
        const lineNumber = idx + 1;
        const isActive = lineNumber === activeLine;
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<span class="code-line${isActive ? " active" : ""}"><span class="line-num">${String(
          lineNumber
        ).padStart(2, " ")}</span>${escaped}</span>`;
      })
      .join("");
  }

  function renderMemoryStrip(snap) {
    if (state.algorithm === "quick") {
      els.memoryTitle.textContent = "Uso de Memória Auxiliar: Ordenação In-Place";
      els.memoryBadge.textContent = "O(1) no Heap • Pilha O(log n) a O(n)";
      els.memoryBadge.className = "memory-badge";
      els.memoryBuffers.innerHTML = "";
      return;
    }

    els.memoryTitle.textContent = "Memória Auxiliar Alocada (Buffers Temporários de Intercalação)";
    els.memoryBadge.textContent = "Espaço Auxiliar O(n)";
    els.memoryBadge.className = "memory-badge warn";

    const buf = snap.buffers;
    if (!buf || (buf.left.length === 0 && buf.right.length === 0)) {
      els.memoryBuffers.innerHTML = `<span class="buffer-label">Nenhum buffer ativo neste passo.</span>`;
      return;
    }

    const renderGroup = (label, items, headIdx) => {
      const cells = items
        .map((val, idx) => {
          if (idx < headIdx) return "";
          const isHead = idx === headIdx;
          return `<span class="buffer-cell${isHead ? " head" : ""}">${val}</span>`;
        })
        .join("");
      return `<div class="buffer-group"><span class="buffer-label">${label}:</span>${
        cells || '<span class="buffer-cell">vazio</span>'
      }</div>`;
    };

    els.memoryBuffers.innerHTML =
      renderGroup("left_part", buf.left, buf.leftIdx) +
      renderGroup("right_part", buf.right, buf.rightIdx);
  }

  function updateComparativeBenchmark(quickSnaps, mergeSnaps) {
    const qFinal = quickSnaps[quickSnaps.length - 1];
    const mFinal = mergeSnaps[mergeSnaps.length - 1];
    const n = state.baseArray.length;

    els.benchmarkN.textContent = `n = ${n}`;
    els.benchQComp.textContent = qFinal.comparisons;
    els.benchQMov.textContent = qFinal.movements;
    els.benchQTot.innerHTML = `<strong>${qFinal.comparisons + qFinal.movements}</strong>`;

    els.benchMComp.textContent = mFinal.comparisons;
    els.benchMMov.textContent = mFinal.movements;
    els.benchMTot.innerHTML = `<strong>${mFinal.comparisons + mFinal.movements}</strong>`;

    els.benchRowQuick.classList.toggle("active-algo", state.algorithm === "quick");
    els.benchRowMerge.classList.toggle("active-algo", state.algorithm === "merge");

    const worstCaseComps = (n * (n - 1)) / 2;
    if (qFinal.comparisons === worstCaseComps && n >= 4) {
      els.benchmarkVerdict.innerHTML = `<strong>Alerta de Pior Caso O(n²):</strong> O Quick Sort atingiu exatamente <code>n(n-1)/2 = ${worstCaseComps}</code> comparações devido ao pivô fixo nas extremidades, enquanto o Merge Sort manteve <code>${mFinal.comparisons}</code> comparações em Θ(n log n).`;
    } else if (qFinal.movements < mFinal.movements) {
      els.benchmarkVerdict.textContent = `No caso atual, ambos operam em Θ(n log n), mas o Quick Sort realiza menos movimentações de memória (${qFinal.movements} trocas vs. ${mFinal.movements} escritas).`;
    } else {
      els.benchmarkVerdict.textContent = `O Merge Sort mantém número estável de comparações (${mFinal.comparisons}), ao custo de O(n) escritas em buffers auxiliares.`;
    }
  }

  function renderSnapshot() {
    const snap = state.snapshots[state.currentIndex];
    if (!snap) return;

    const maxVal = Math.max(...snap.array, 1);
    const lastIdx = Math.max(0, state.snapshots.length - 1);

    els.stepCurrent.textContent = state.currentIndex;
    els.stepTotal.textContent = lastIdx;
    els.stepScrubber.max = lastIdx;
    els.stepScrubber.value = state.currentIndex;

    els.metricComparisons.textContent = snap.comparisons;
    els.metricMovements.textContent = snap.movements;
    els.metricTotal.textContent = snap.comparisons + snap.movements;
    els.stepLog.textContent = snap.message;

    els.auxVarsContainer.innerHTML = "";
    Object.entries(snap.auxVars).forEach(([key, val]) => {
      const div = document.createElement("div");
      const isWide = key === "pivot";
      div.className = `var-badge${isWide ? " wide" : ""}`;
      div.innerHTML = `<span>${key}:</span><strong>${val}</strong>`;
      els.auxVarsContainer.appendChild(div);
    });

    els.barsContainer.innerHTML = "";
    snap.array.forEach((value, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "bar-wrapper";

      const bar = document.createElement("div");
      bar.className = "bar";
      const heightPct = Math.max(13, Math.round((value / maxVal) * 100));
      bar.style.height = `${heightPct}%`;
      bar.textContent = value;

      if (snap.swapping.includes(idx)) {
        bar.classList.add("swapping");
      } else if (snap.comparing.includes(idx)) {
        bar.classList.add("comparing");
      } else if (snap.pivotIndex === idx) {
        bar.classList.add("pivot");
      } else if (snap.sorted.includes(idx)) {
        bar.classList.add("sorted");
      } else if (snap.activeRange.includes(idx)) {
        bar.classList.add("active-range");
      }

      const indexTag = document.createElement("span");
      indexTag.className = "bar-index";
      indexTag.textContent = `[${idx}]`;

      wrapper.appendChild(bar);
      wrapper.appendChild(indexTag);

      if (snap.pointers[idx]) {
        const ptr = document.createElement("span");
        ptr.className = "bar-pointer";
        ptr.textContent = snap.pointers[idx];
        wrapper.appendChild(ptr);
      }

      els.barsContainer.appendChild(wrapper);
    });

    renderMemoryStrip(snap);
    renderPythonCode(snap.codeLine);

    const isAtStart = state.currentIndex === 0;
    const isAtEnd = state.currentIndex >= lastIdx;
    els.btnPrev.disabled = isAtStart;
    els.btnStep.disabled = isAtEnd;
    if (isAtEnd) pausePlayback();
  }

  function rebuildSimulation() {
    pausePlayback();
    const quickSnaps = generateQuickSortSnapshots(state.baseArray);
    const mergeSnaps = generateMergeSortSnapshots(state.baseArray);

    if (state.algorithm === "quick") {
      els.algoTitle.textContent = "Quick Sort — Particionamento de Lomuto (Pivô Fixo à Direita)";
      els.algoComplexity.textContent =
        "Tempo: Médio Θ(n log n) | Pior Caso O(n²) • Espaço Auxiliar: O(log n) a O(n)";
      state.snapshots = quickSnaps;
    } else {
      els.algoTitle.textContent = "Merge Sort — Divisão e Conquista Estável";
      els.algoComplexity.textContent =
        "Tempo: Melhor / Médio / Pior Caso Θ(n log n) • Espaço Auxiliar: O(n)";
      state.snapshots = mergeSnaps;
    }

    updateComparativeBenchmark(quickSnaps, mergeSnaps);
    state.currentIndex = 0;
    renderSnapshot();
  }

  function startPlayback() {
    if (state.timerId !== null) return;
    if (state.currentIndex >= state.snapshots.length - 1) {
      state.currentIndex = 0;
    }
    els.btnPlay.disabled = true;
    els.btnPause.disabled = false;

    state.timerId = setInterval(() => {
      if (state.currentIndex < state.snapshots.length - 1) {
        state.currentIndex++;
        renderSnapshot();
      } else {
        pausePlayback();
      }
    }, state.speedMs);
  }

  function pausePlayback() {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    els.btnPlay.disabled = false;
    els.btnPause.disabled = true;
  }

  function stepForward() {
    pausePlayback();
    if (state.currentIndex < state.snapshots.length - 1) {
      state.currentIndex++;
      renderSnapshot();
    }
  }

  function stepBackward() {
    pausePlayback();
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderSnapshot();
    }
  }

  function resetSimulation() {
    pausePlayback();
    state.currentIndex = 0;
    renderSnapshot();
  }

  function generateRandomArray(size) {
    const pool = Array.from({ length: 90 }, (_, i) => i + 10);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, size);
  }

  els.btnAlgoQuick.addEventListener("click", () => {
    state.algorithm = "quick";
    els.btnAlgoQuick.classList.add("active");
    els.btnAlgoQuick.setAttribute("aria-selected", "true");
    els.btnAlgoMerge.classList.remove("active");
    els.btnAlgoMerge.setAttribute("aria-selected", "false");
    rebuildSimulation();
  });

  els.btnAlgoMerge.addEventListener("click", () => {
    state.algorithm = "merge";
    els.btnAlgoMerge.classList.add("active");
    els.btnAlgoMerge.setAttribute("aria-selected", "true");
    els.btnAlgoQuick.classList.remove("active");
    els.btnAlgoQuick.setAttribute("aria-selected", "false");
    rebuildSimulation();
  });

  els.btnPresetRandom.addEventListener("click", () => {
    const size = Number(els.arraySize.value) || 12;
    state.baseArray = generateRandomArray(size);
    rebuildSimulation();
  });

  els.arraySize.addEventListener("change", () => {
    const size = Number(els.arraySize.value) || 12;
    state.baseArray = generateRandomArray(size);
    rebuildSimulation();
  });

  els.btnPresetWorst.addEventListener("click", () => {
    const size = Number(els.arraySize.value) || 12;
    state.baseArray = Array.from({ length: size }, (_, i) => (i + 1) * 7);
    rebuildSimulation();
  });

  els.btnPresetReversed.addEventListener("click", () => {
    const size = Number(els.arraySize.value) || 12;
    state.baseArray = Array.from({ length: size }, (_, i) => (size - i) * 7);
    rebuildSimulation();
  });

  els.btnPresetDuplicates.addEventListener("click", () => {
    state.baseArray = [45, 18, 72, 18, 90, 45, 12, 72, 18, 45, 30, 12];
    rebuildSimulation();
  });

  els.customForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = els.customInput.value.trim();
    if (!raw) return;

    const parsed = raw
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((num) => Number.isFinite(num) && num > 0 && num <= 999);

    if (parsed.length < 2 || parsed.length > 20) {
      alert("Insira entre 2 e 20 números inteiros positivos (1 a 999) separados por vírgula.");
      return;
    }

    state.baseArray = parsed;
    rebuildSimulation();
  });

  els.btnPlay.addEventListener("click", startPlayback);
  els.btnPause.addEventListener("click", pausePlayback);
  els.btnStep.addEventListener("click", stepForward);
  els.btnPrev.addEventListener("click", stepBackward);
  els.btnReset.addEventListener("click", resetSimulation);

  els.stepScrubber.addEventListener("input", (event) => {
    pausePlayback();
    state.currentIndex = Number(event.target.value);
    renderSnapshot();
  });

  els.speedSlider.addEventListener("input", (event) => {
    const level = Number(event.target.value);
    const speedMap = {
      1: { ms: 1200, label: "0.5x" },
      2: { ms: 900, label: "0.7x" },
      3: { ms: 700, label: "0.85x" },
      4: { ms: 550, label: "1.0x" },
      5: { ms: 400, label: "1.4x" },
      6: { ms: 280, label: "2.0x" },
      7: { ms: 190, label: "2.8x" },
      8: { ms: 120, label: "4.0x" },
      9: { ms: 70, label: "6.0x" },
      10: { ms: 35, label: "10.0x" },
    };
    const cfg = speedMap[level] || speedMap[4];
    state.speedMs = cfg.ms;
    els.speedLabel.textContent = cfg.label;

    if (state.timerId !== null) {
      pausePlayback();
      startPlayback();
    }
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "SELECT") return;

    if (event.code === "Space") {
      event.preventDefault();
      if (state.timerId !== null) pausePlayback();
      else startPlayback();
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      stepForward();
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      stepBackward();
    } else if (event.key === "r" || event.key === "R") {
      resetSimulation();
    }
  });

  rebuildSimulation();
})();