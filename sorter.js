let delay = 50;
let arrLength = 100;
const arr = [];
const timers = [];
const range = (size, startAt = 0) => {
  return [...Array(size).keys()].map((i) => i + startAt);
};
const swap = (i, j, arr) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;

  return buildHTML(arr, [i, j]);
};
const stopAllTimer = () => {
  while (timers.length) {
    clearInterval(timers.pop());
  }
  $(".history").html("");
};
const generateRandoms = () => {
  stopAllTimer();
  while (arr.length) {
    arr.pop();
  }
  while (arr.length < arrLength) {
    arr.push(Math.ceil(Math.random() * 1000));
  }

  $(".num-arr").html("");
  $("#generated-arr").html(buildHTML(arr));
};
const buildHTML = (arr, highlighs = []) => {
  return arr
    .map((num, idx) => {
      const highlighted = highlighs.indexOf(idx) !== -1;
      return `<span class='num ${highlighted && "highlight"}'>${num}</span>`;
    })
    .join("");
};
const startReplayHistory = (
  histories,
  target = $("#selection-sort .history")
) => {
  const result = {
    idx: 0,
    histories,
    runner: function () {
      // console.log(this.idx, this.histories[this.idx]);
      target.html(`<div class='num-arr'>${this.histories[this.idx]}</div>`);
      this.idx++;

      if (this.idx === this.histories.length) {
        clearInterval(this.timer);
      }
    },
  };

  result.timer = setInterval(result.runner.bind(result), delay);
  timers.push(result.timer);
};
const bubbleSort = (arr) => {
  const histories = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      histories.push(buildHTML(arr, [j, j + 1]));
      if (arr[j] > arr[j + 1]) {
        histories.push(swap(j + 1, j, arr));
      }
    }
  }

  startReplayHistory(histories, $("#bubble-sort .history"));
};

const insertionSort = (arr) => {
  const histories = [];
  for (let l = 1; l < arr.length; l++) {
    let target = arr[l];
    let j = l - 1;
    while (j >= 0 && arr[j] > target) {
      arr[j + 1] = arr[j];
      histories.push(buildHTML(arr, [j, j + 1]));
      j--;
    }
    arr[j + 1] = target;
    histories.push(buildHTML(arr, [l, j + 1]));
  }

  startReplayHistory(histories, $("#insertion-sort .history"));
};
const selectionSort = (arr) => {
  const histories = [];
  for (let l = 0; l < arr.length; l++) {
    let minIndex = l;
    for (let k = l + 1; k < arr.length; k++) {
      if (arr[minIndex] > arr[k]) {
        minIndex = k;
      }
      histories.push(buildHTML(arr, [minIndex, k]));
    }
    if (minIndex !== l) {
      histories.push(swap(l, minIndex, arr));
    }
  }

  startReplayHistory(histories, $("#selection-sort .history"));
};

const mergeSort = (arr) => {
  const histories = [];
  const sort = (start, end) => {
    if (start >= end) return;

    const mid = parseInt((start + end) / 2);
    sort(start, mid);
    sort(mid + 1, end);

    let leftStart = start;
    let rightStart = mid + 1;

    let sorted = [];
    while (leftStart <= mid && rightStart <= end) {
      if (arr[leftStart] < arr[rightStart]) {
        sorted.push(arr[leftStart]);
        histories.push(buildHTML(arr, [leftStart]));
        leftStart++;
      } else {
        sorted.push(arr[rightStart]);
        histories.push(buildHTML(arr, [rightStart]));
        rightStart++;
      }
    }
    while (leftStart <= mid) {
      sorted.push(arr[leftStart]);
      histories.push(buildHTML(arr, [leftStart]));
      leftStart++;
    }
    while (rightStart <= end) {
      sorted.push(arr[rightStart]);
      histories.push(buildHTML(arr, [rightStart]));
      rightStart++;
    }
    for (let i = start; i <= end; i++) {
      arr[i] = sorted.shift();
    }
    histories.push(buildHTML(arr, range(end - start + 1, start)));
  };
  sort(0, arr.length - 1);

  startReplayHistory(histories, $("#merge-sort .history"));
};
const quickSort = (arr) => {
  const histories = [];
  const sort = (start, end) => {
    if (end >= arr.length || start < 0 || end - start <= 0) {
      return;
    }

    let pivot = end;
    let index = start;
    for (let i = start; i <= end; i++) {
      if (i === pivot) continue;

      if (arr[i] <= arr[pivot]) {
        histories.push(swap(i, index, arr));

        index++;
      }
    }

    histories.push(swap(pivot, index, arr));

    sort(start, index - 1);
    sort(index + 1, end);
  };
  sort(0, arr.length - 1);

  startReplayHistory(histories, $("#quick-sort .history"));
};

const cokctailSort = (arr) => {
  const histories = [];

  for (let i = 0; i < arr.length / 2; i++) {
    let j;
    for (j = i; j < arr.length - i - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        histories.push(swap(j, j + 1, arr));
      }
    }
    for (j = arr.length - i; j >= i; j--) {
      if (arr[j - 1] > arr[j]) {
        histories.push(swap(j, j - 1, arr));
      }
    }
  }

  startReplayHistory(histories, $("#cocktail-sort .history"));
};
$(document).ready(() => {
  $("#arr-length-input").on("change", (e) => {
    arrLength = parseInt(e.target.value);
  });
  generateRandoms();

  $("#generate-arr").click(generateRandoms);
  $("#start-bubble-sort").click(() => {
    stopAllTimer();

    bubbleSort(arr.slice());
  });
  $("#start-insertion-sort").click(() => {
    stopAllTimer();

    insertionSort(arr.slice());
  });
  $("#start-selection-sort").click(() => {
    stopAllTimer();

    selectionSort(arr.slice());
  });
  $("#start-merge-sort").click(() => {
    stopAllTimer();

    mergeSort(arr.slice());
  });
  $("#start-quick-sort").click(() => {
    stopAllTimer();

    quickSort(arr.slice());
  });
  $("#start-cocktail-sort").click(() => {
    stopAllTimer();

    cokctailSort(arr.slice());
  });
});
