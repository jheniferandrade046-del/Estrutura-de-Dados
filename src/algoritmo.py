from dataclasses import dataclass
import random
from typing import List, Protocol, Sequence, Tuple, TypeVar


class Comparable(Protocol):
    def __lt__(self, other: object) -> bool: ...
    def __le__(self, other: object) -> bool: ...
    def __gt__(self, other: object) -> bool: ...
    def __ge__(self, other: object) -> bool: ...


T = TypeVar("T", bound=Comparable)


@dataclass
class SortMetrics:
    comparisons: int = 0
    movements: int = 0

    @property
    def total_operations(self) -> int:
        return self.comparisons + self.movements


def quick_sort(data: Sequence[T]) -> Tuple[List[T], SortMetrics]:
    arr: List[T] = list(data)
    metrics = SortMetrics()

    if len(arr) > 1:
        _quick_sort_recursive(arr, 0, len(arr) - 1, metrics)

    return arr, metrics


def _quick_sort_recursive(
    arr: List[T], low: int, high: int, metrics: SortMetrics
) -> None:
    if low < high:
        pivot_index: int = _lomuto_partition(arr, low, high, metrics)
        _quick_sort_recursive(arr, low, pivot_index - 1, metrics)
        _quick_sort_recursive(arr, pivot_index + 1, high, metrics)


def _lomuto_partition(
    arr: List[T], low: int, high: int, metrics: SortMetrics
) -> int:
    pivot: T = arr[high]
    i: int = low - 1

    for j in range(low, high):
        metrics.comparisons += 1
        if arr[j] <= pivot:
            i += 1
            if i != j:
                arr[i], arr[j] = arr[j], arr[i]
                metrics.movements += 1

    if i + 1 != high:
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        metrics.movements += 1

    return i + 1


def merge_sort(data: Sequence[T]) -> Tuple[List[T], SortMetrics]:
    arr: List[T] = list(data)
    metrics = SortMetrics()

    if len(arr) > 1:
        _merge_sort_recursive(arr, 0, len(arr) - 1, metrics)

    return arr, metrics


def _merge_sort_recursive(
    arr: List[T], left_idx: int, right_idx: int, metrics: SortMetrics
) -> None:
    if left_idx < right_idx:
        mid_idx: int = left_idx + (right_idx - left_idx) // 2
        _merge_sort_recursive(arr, left_idx, mid_idx, metrics)
        _merge_sort_recursive(arr, mid_idx + 1, right_idx, metrics)
        _merge(arr, left_idx, mid_idx, right_idx, metrics)


def _merge(
    arr: List[T],
    left_idx: int,
    mid_idx: int,
    right_idx: int,
    metrics: SortMetrics,
) -> None:
    left_part: List[T] = arr[left_idx : mid_idx + 1]
    right_part: List[T] = arr[mid_idx + 1 : right_idx + 1]

    i: int = 0
    j: int = 0
    k: int = left_idx

    while i < len(left_part) and j < len(right_part):
        metrics.comparisons += 1
        if left_part[i] <= right_part[j]:
            arr[k] = left_part[i]
            i += 1
        else:
            arr[k] = right_part[j]
            j += 1
        metrics.movements += 1
        k += 1

    while i < len(left_part):
        arr[k] = left_part[i]
        metrics.movements += 1
        i += 1
        k += 1

    while j < len(right_part):
        arr[k] = right_part[j]
        metrics.movements += 1
        j += 1
        k += 1


def run_benchmark_scenario(title: str, dataset: List[int]) -> None:
    original_snapshot: List[int] = list(dataset)

    qs_sorted, qs_metrics = quick_sort(dataset)
    ms_sorted, ms_metrics = merge_sort(dataset)

    assert dataset == original_snapshot
    assert qs_sorted == ms_sorted

    print(f"\n{'=' * 74}")
    print(f"CENÁRIO: {title} (n = {len(dataset)})")
    print(f"{'=' * 74}")
    print(f"Antes : {dataset}")
    print(f"Depois: {qs_sorted}")
    print("-" * 74)
    print(
        f"{'Algoritmo':<28} | {'Comparações':>12} | {'Trocas/Mov.':>12} | {'Total Ops':>12}"
    )
    print("-" * 74)
    print(
        f"{'Quick Sort (pivô fixo)':<28} | {qs_metrics.comparisons:>12} | "
        f"{qs_metrics.movements:>12} | {qs_metrics.total_operations:>12}"
    )
    print(
        f"{'Merge Sort':<28} | {ms_metrics.comparisons:>12} | "
        f"{ms_metrics.movements:>12} | {ms_metrics.total_operations:>12}"
    )
    print("-" * 74)


if __name__ == "__main__":
    random.seed(42)

    caso_medio: List[int] = random.sample(range(1, 100), 15)
    run_benchmark_scenario("(a) Caso Médio — Lista Aleatória",