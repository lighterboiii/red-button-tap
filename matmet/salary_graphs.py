import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde

# Данные по средней ЗП на душу населения
avg_salary = np.array([
65822, 58487, 64721, 63353, 49723, 74197, 56898, 65127, 67750, 99205,
56134, 64455, 60415, 55168, 64706, 73868, 66006, 162572, 74210, 88854,
135206, 82026, 71493, 66608, 82026, 114277, 62975, 54986, 110473, 56301,
49162, 55310, 70410, 62551, 61254, 62482, 56942, 44639, 40588, 46507,
48489, 48163, 41840, 57183, 67579, 60998, 57133, 75764, 67561, 60844,
74845, 58255, 69546, 64059, 57468, 70393, 58626, 59743, 63209, 79079,
121907, 124744, 163879, 84331, 70946, 63529, 67541, 71616, 55281, 95026,
87154, 78202, 76770, 65404, 78524, 72926, 126868, 85190, 132710, 88920,
90296, 87040, 156881, 130360, 78795, 188561
])

# --- Boxplot ---
plt.figure(figsize=(7,5))
plt.boxplot(avg_salary, vert=False)
plt.title("Средняя номинальная ЗП на душу населения по регионам РФ в 2024 году")
plt.xlabel("рублей")
plt.savefig("boxplot_salary.png")
plt.close()

# --- Histogram ---
plt.figure(figsize=(7,5))
plt.hist(avg_salary, bins=20, color="skyblue", edgecolor="black")
plt.title("Ср.номинальная ЗП на душу населения по регионам РФ в 2024 году")
plt.xlabel("рублей")
plt.ylabel("Количество регионов")
plt.savefig("histogram_salary.png")
plt.close()

# --- KDE ---
kde = gaussian_kde(avg_salary)
h_value = kde.factor  # коэффициент сглаживания
x_vals = np.linspace(0, max(avg_salary)*1.05, 300)
y_vals = kde(x_vals)

plt.figure(figsize=(7,5))
plt.plot(x_vals, y_vals, color="red", label=f"h = {h_value:.3f}")
plt.title("Ср.номинальная ЗП на душу населения по регионам РФ в 2024 году")
plt.xlabel("рублей")
plt.ylabel("Density")
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.savefig("kde_salary_with_h.png")
plt.close()