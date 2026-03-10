import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde

# Вставляем твои данные ВРП на душу населения
vrp = np.array([
1341408.9, 627017.8, 893416.3, 1494401.9, 435227.7, 792281.5,
316018.2, 747687.1, 950272.5, 9244579.6, 398720.4, 692685.4,
556552.9, 522646.8, 750838.4, 1149160.2, 849769.9, 32339001.6,
434291.1, 1049365.5, 1263045.1, 501455.5, 761589.6, 1081822.9,
785205.9, 1915187.7, 1127497.3, 408968.1, 288750.0, 10908028.0,
223013.0, 166710.2, 722497.8, 4772036.0, 777718.3, 1384980.9,
2693193.0, 253191.6, 1034705.4, 95319.7, 291100.4, 143310.6,
266555.8, 397223.4, 1340782.0, 2460269.4, 304473.1, 396833.0,
4583352.3, 1102900.3, 601316.7, 2197280.1, 605915.5, 2672241.8,
1763998.8, 659002.8, 2646488.2, 1345119.0, 673635.5, 380466.7,
4128119.1, 15946597.2, 8628903.5, 5379401.8, 1938291.9, 2589084.6,
108336.5, 122532.5, 378551.6, 1024355.4, 3719646.8, 2539383.9,
1883825.1, 2216436.2, 1056600.3, 912449.4, 503918.8, 2229816.5,
718358.3, 440147.3, 1862934.3, 1262368.1, 793851.9, 403892.8,
1624560.7, 102215.3, 186709.4
])

# Boxplot
plt.figure(figsize=(7,5))
plt.boxplot(vrp, vert=False)
plt.title("ВРП на душу населения по регионам РФ в 2024 году")
plt.xlabel("млн.руб.")
plt.savefig("boxplot_vrp_ispravlenny.png")
plt.close()

# Гистограмма
plt.figure(figsize=(7,5))
counts, bins, patches = plt.hist(vrp, bins=20, color="skyblue", edgecolor="black")
# Подписи над столбцами (число регионов в каждой корзине)
for count, patch in zip(counts, patches):
    plt.text(patch.get_x() + patch.get_width()/2, count + 0.5, int(count),
             ha='center', va='bottom', fontsize=8)
plt.title("ВРП на душу населения по регионам РФ в 2024 году")
plt.xlabel("млн.руб.")
plt.ylabel("Количество регионов")
# Добавляем сетку по оси Y
plt.grid(axis='y', linestyle='--', alpha=0.7)

plt.savefig("histogram_vrp_ispravlenny.png")
plt.close()

# KDE
kde = gaussian_kde(vrp)  # по умолчанию используется метод Скотта
h_value = kde.factor    # текущий коэффициент сглаживания

# Создаём точки для построения кривой
x_vals = np.linspace(0, max(vrp)*1.05, 300)
y_vals = kde(x_vals)

# Построение графика
plt.figure(figsize=(7,5))
plt.plot(x_vals, y_vals, color="red", label=f"h = {h_value:.3f}")
plt.title("ВРП на душу населения по регионам РФ за 2024 год")
plt.xlabel("млн.руб.")
plt.ylabel("Density")
plt.legend()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.savefig("kde_vrp_with_h.png")
plt.close()