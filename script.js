let processes = [];
let currentMode = '';
let selectedAlgorithm = '';
let timeQuantum = null;

function setMode(mode) {
  currentMode = mode;
  document.getElementById('btn-preemptive').classList.toggle('active', mode === 'preemptive');
  document.getElementById('btn-nonpreemptive').classList.toggle('active', mode === 'nonpreemptive');

  const algoDiv = document.getElementById('algorithms');
  const quantumDiv = document.getElementById('quantumInput');
  const processInput = document.getElementById('processInput');
  const processTable = document.getElementById('processTable');
  const computeBtn = document.getElementById('computeBtn');
  const resultHeader = document.getElementById('resultHeader');
  const resultTable = document.getElementById('resultTable');
  const ganttHeader = document.getElementById('ganttHeader');
  const ganttChart = document.getElementById('ganttChart');

  algoDiv.classList.remove('hidden');
  quantumDiv.classList.add('hidden');
  processInput.classList.add('hidden');
  processTable.classList.add('hidden');
  computeBtn.classList.add('hidden');
  resultHeader.classList.add('hidden');
  resultTable.classList.add('hidden');
  ganttHeader.classList.add('hidden');
  ganttChart.classList.add('hidden');

  selectedAlgorithm = '';
  algoDiv.innerHTML = '';

  const algos = mode === 'preemptive'
    ? ['SJF (Preemptive)', 'Round Robin']
    : ['FCFS', 'SJF (Non-Preemptive)'];

  algos.forEach(algo => {
    const btn = document.createElement('button');
    btn.textContent = algo;
    btn.onclick = () => {
      selectedAlgorithm = algo;
      document.querySelectorAll('.algorithm-buttons button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      quantumDiv.classList.toggle('hidden', algo !== 'Round Robin');

      processInput.classList.remove('hidden');
      processTable.classList.remove('hidden');
      computeBtn.classList.remove('hidden');
    };
    algoDiv.appendChild(btn);
  });
}

function addProcess() {
  const arrivalTime = document.getElementById('arrivalTime').value;
  const burstTime = document.getElementById('burstTime').value;
  if (arrivalTime === '' || burstTime === '') return alert('Please fill both fields.');

  const id = processes.length ? Math.max(...processes.map(p => p.id)) + 1 : 1;
  processes.push({ id, arrivalTime: +arrivalTime, burstTime: +burstTime });
  renderTable();
  document.getElementById('arrivalTime').value = '';
  document.getElementById('burstTime').value = '';
}

function deleteProcess(id) {
  processes = processes.filter(p => p.id !== id);
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector('#processTable tbody');
  tbody.innerHTML = '';
  processes.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>P${p.id}</td>
      <td>${p.arrivalTime}</td>
      <td>${p.burstTime}</td>
      <td><button class="delete-btn" onclick="deleteProcess(${p.id})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

function computeSchedule() {
  if (!selectedAlgorithm) return alert('Please select an algorithm.');
  if (selectedAlgorithm === 'Round Robin') {
    timeQuantum = document.getElementById('timeQuantum').value;
    if (!timeQuantum) return alert('Please enter Time Quantum for Round Robin.');
    timeQuantum = parseInt(timeQuantum, 10);
  }

  let completedProcesses = [];

  if (selectedAlgorithm === 'FCFS') {
    let currentTime = 0;
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    sorted.forEach(p => {
      const startTime = Math.max(currentTime, p.arrivalTime);
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;

      completedProcesses.push({
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime,
        turnaroundTime,
        waitingTime
      });

      currentTime = completionTime;
    });

    renderResultTable(completedProcesses);
  } else if (selectedAlgorithm === 'Round Robin') {
    let currentTime = 0;
    let remainingProcesses = [...processes].map(p => ({ ...p, remainingBurstTime: p.burstTime, startTime: null }));
    let processOrder = [];

    let readyQueue = [];
    let visited = [];

    while (remainingProcesses.some(p => p.remainingBurstTime > 0)) {
      remainingProcesses.forEach(p => {
        if (!visited.includes(p.id) && p.arrivalTime <= currentTime) {
          readyQueue.push(p);
          visited.push(p.id);
        }
      });

      if (readyQueue.length === 0) {
        currentTime++;
        continue;
      }

      let process = readyQueue.shift();

      let timeSlice = Math.min(timeQuantum, process.remainingBurstTime);
      if (process.startTime === null) process.startTime = currentTime;

      process.remainingBurstTime -= timeSlice;
      currentTime += timeSlice;
      processOrder.push({ ...process, timeSlice, currentTime });

      remainingProcesses.forEach(p => {
        if (!visited.includes(p.id) && p.arrivalTime <= currentTime) {
          readyQueue.push(p);
          visited.push(p.id);
        }
      });

      if (process.remainingBurstTime > 0) {
        readyQueue.push(process);
      } else {
        const completionTime = currentTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        completedProcesses.push({
          id: process.id,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          completionTime,
          turnaroundTime,
          waitingTime
        });
      }
    }

    renderResultTable(completedProcesses);
    renderGanttChart(processOrder);
  } else if (selectedAlgorithm === 'SJF (Preemptive)') {
    let currentTime = 0;
    let remainingProcesses = [...processes].map(p => ({
      ...p,
      remainingBurstTime: p.burstTime,
      isCompleted: false
    }));
    let completed = 0;
    let processOrder = [];

    while (completed < remainingProcesses.length) {
      let readyQueue = remainingProcesses.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);
      if (readyQueue.length === 0) {
        currentTime++;
        continue;
      }

      readyQueue.sort((a, b) => a.remainingBurstTime - b.remainingBurstTime || a.arrivalTime - b.arrivalTime);
      let currentProcess = readyQueue[0];

      currentProcess.remainingBurstTime--;
      processOrder.push({ id: currentProcess.id, currentTime: currentTime + 1 });

      if (currentProcess.remainingBurstTime === 0) {
        currentProcess.isCompleted = true;
        completed++;
        currentProcess.completionTime = currentTime + 1;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      }

      currentTime++;
    }

    completedProcesses = remainingProcesses.map(p => ({
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: p.completionTime,
      turnaroundTime: p.turnaroundTime,
      waitingTime: p.waitingTime
    }));

    let gantt = [];
    for (let i = 0; i < processOrder.length; i++) {
      let curr = processOrder[i];
      if (gantt.length && gantt[gantt.length - 1].id === curr.id) {
        gantt[gantt.length - 1].timeSlice++;
        gantt[gantt.length - 1].currentTime = curr.currentTime;
      } else {
        gantt.push({ id: curr.id, timeSlice: 1, currentTime: curr.currentTime });
      }
    }

    renderResultTable(completedProcesses);
    renderGanttChart(gantt);
  } else {
    alert('Selected algorithm is not implemented.');
  }

  document.getElementById('resultHeader').classList.remove('hidden');
  document.getElementById('resultTable').classList.remove('hidden');
}

function renderResultTable(results) {
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';
  results.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>P${p.id}</td>
      <td>${p.arrivalTime}</td>
      <td>${p.burstTime}</td>
      <td>${p.completionTime}</td>
      <td>${p.turnaroundTime}</td>
      <td>${p.waitingTime}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderGanttChart(processOrder) {
  const ganttChart = document.getElementById('ganttChart');
  ganttChart.innerHTML = '';

  let startTime = 0;

  processOrder.forEach(entry => {
    const bar = document.createElement('div');
    const width = entry.timeSlice * 20;

    bar.style.width = `${width}px`;
    bar.style.background = '#4CAF50';
    bar.style.border = '1px solid #333';
    bar.style.color = '#fff';
    bar.style.padding = '4px';
    bar.style.textAlign = 'center';
    bar.style.fontSize = '12px';
    bar.textContent = `P${entry.id} (${startTime}-${entry.currentTime})`;

    ganttChart.appendChild(bar);
    startTime = entry.currentTime;
  });

  document.getElementById('ganttHeader').classList.remove('hidden');
  ganttChart.classList.remove('hidden');
}
