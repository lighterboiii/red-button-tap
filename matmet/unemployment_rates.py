import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde

# Данные по безработице (%) по регионам
unemployment = np.array([
3.5, 3.9, 2.3, 4.0, 2.7, 3.3, 3.5, 2.1, 2.6, 2.7,
4.4, 3.0, 3.7, 2.4, 4.2, 2.2, 3.4, 1.3, 6.2, 5.6,
4.8, 7.1, 4.6, 3.6, 2.9, 3.3, 4.4, 2.5, 3.5, 1.7,
4.3, 5.1, 2.8, 3.1, 2.7, 2.6, 3.6, 3.4, 16.2, 26.7,
6.5, 8.0, 9.7, 9.1, 4.0, 3.0, 3.2, 2.6, 2.4, 2.9,
3.0, 3.3, 2.2, 1.8, 1.9, 3.5, 2.6, 2.0, 2.5, 4.3,
3.2, 2.4, 1.5, 1.9, 3.6, 2.4, 10.5, 5.6, 3.8, 4.7,
2.4, 5.9, 4.3, 4.3, 4.2, 4.6, 9.9, 7.1, 7.0, 3.0,
3.6, 2.1, 2.7, 3.0, 3.6, 4.7, 2.2
])

# --- Boxplot ---
plt.figure(figsize=(7,5))
plt.boxplot(unemployment, vert=False)
plt.title("Уровень безработицы по регионам РФ в 2024")
plt.xlabel("Уровень безработицы в % от трудоспособного нас.")
plt.savefig("boxplot_unemployment.png")
plt.close()

# --- Histogram ---
plt.figure(figsize=(7,5))
plt.hist(unemployment, bins=20, color="lightgreen", edgecolor="black")
plt.title("Уровень безработицы по регионам РФ в 2024")
plt.xlabel("Уровень безработицы в % от трудоспособного нас.")
plt.ylabel("Количество регионов")
plt.savefig("histogram_unemployment.png")
plt.close()

# --- KDE ---
kde = gaussian_kde(unemployment)
h_value = kde.factor  # коэффициент сглаживания
x_vals = np.linspace(0, max(unemployment)*1.05, 300)
y_vals = kde(x_vals)

plt.figure(figsize=(7,5))
plt.plot(x_vals, y_vals, color="red", label=f"h = {h_value:.3f}")
plt.title("Уровень безработицы по регионам РФ в 2024")
plt.xlabel("Уровень безработицы в % от трудоспособного нас.")
plt.ylabel("Density")
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.savefig("kde_unemployment_with_h.png")
plt.close()