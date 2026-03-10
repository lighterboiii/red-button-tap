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

# --- Логарифмирование ---
log_salary = np.log(avg_salary)

# --- Boxplot ---
plt.figure(figsize=(7,5))
plt.boxplot(log_salary, vert=False)
plt.title("Средня ЗП по регионам РФ в 2024г")
plt.xlabel("ln(руб.)")
plt.savefig("boxplot_log_salary.png")
plt.close()

# --- Histogram ---
plt.figure(figsize=(7,5))
plt.hist(log_salary, bins=20, color="skyblue", edgecolor="black")
plt.title("Средня ЗП по регионам РФ в 2024г")
plt.xlabel("ln(руб.)")
plt.ylabel("Количество регионов")
plt.savefig("histogram_log_salary.png")
plt.close()

# --- KDE ---
kde = gaussian_kde(log_salary)
x_vals = np.linspace(min(log_salary)*0.95, max(log_salary)*1.05, 300)
y_vals = kde(x_vals)
h = kde.factor  # коэффициент сглаживания

plt.figure(figsize=(7,5))
plt.plot(x_vals, y_vals, color="red")
plt.title("Средняя ЗП по регионам РФ в 2024г")
plt.xlabel("ln(руб.)")
plt.ylabel("Density")
plt.text(x_vals[-1]*0.7, max(y_vals)*0.9, f"h = {h:.3f}", fontsize=10, color="blue")
plt.savefig("kde_log_salary.png")
plt.close()