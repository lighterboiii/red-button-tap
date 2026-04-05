import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# -------------------------------
# 1. Исходные данные
# -------------------------------
data = {
    'Регион': ['Belgorod', 'Bryansk', 'Vladimir', 'Voronezh', 'Ivanovo', 'Kaluga', 'Koatroma', 'Kursk', 'Lipetsk',
               'Moscow (reg.)', 'Orel', 'Ryazan', 'Smolensk', 'Tambov', 'Tver', 'Tula', 'Yaroslavl', 'Moscow (city)',
               'Kareliya', 'Komi', 'Arkhangelsk', 'Vologda', 'Kaliningrad', 'Leningrad', 'Murmansk', 'Novgorod',
               'Pskov', 'Saint-Petersburg (city)', 'Adygheya', 'Kalmykiya', 'Krimea', 'Krasnodar', 'Astrakhan',
               'Volgograd', 'Rostov', 'Sivastopol (city)', 'Daghestan', 'Ingushetiya', 'Kabardino-Balkariya',
               'Karachaevo-Cherkesiya', 'Noth.Osetiya-Alaniya', 'Chechen', 'Stavropol', 'Bashkortostan', 'Mariy-El',
               'Mordoviya', 'Tatarstan', 'Udmurtiya', 'Chuvashiya', 'Perm', 'Kirov', 'Nizhniy Novgorod', 'Orenburg',
               'Penza', 'Samara', 'Saratov', 'Uliyanovsk', 'Kurgan', 'Sverdlovsk', 'Tumen', 'Cheliabinsk',
               'Altay (resp.)', 'Buryatiya', 'Tyva', 'Khakassia', 'Altay', 'Zabaikalie', 'Krasnoyarsk', 'Irkutsk',
               'Kemerovo', 'Novosibirsk', 'Omsk', 'Tomsk', 'Sakha (Yakutiya)', 'Kamchatka', 'Primorie', 'Habarovsk',
               'Amur', 'Magadan', 'Sakhalin', 'Jewish', 'Chukotka'],
    'ПКОрг': [96.7, 96.7, 91.9, 99.8, 97.2, 96.2, 93.6, 91.9, 95.2, 91.5, 94.7, 95.6, 96.8, 97.2, 89.5, 89.4, 94.8,
              100, 95.6, 92.9, 93, 97.2, 94.4, 98.5, 94, 96.8, 90.8, 98.2, 94.5, 89.7, 100, 93.4, 93.8, 82.9, 85.1,
              69.6, 72.5, 100, 91.5, 92.3, 90.7, 96.9, 98.1, 96.6, 89.1, 82, 99.8, 90.4, 92.8, 92.5, 92.8, 97.2,
              96.4, 96.6, 80.9, 82.4, 91.4, 85.5, 95.8, 91.1, 93.7, 97.7, 88.2, 89.8, 91.6, 91.8, 97.2, 93.2, 93.3,
              89.1, 81.9, 84.4, 76.6, 95.8, 98.6, 87.9, 94.9, 91.6, 94.3, 95.8, 91.8, 94.3],
    'Глоб.ИС': [95, 95.1, 90.8, 97.8, 95.2, 94.2, 89.8, 85.8, 93.5, 90.4, 92.2, 93.2, 96.3, 95.6, 85, 87.9, 93.8, 99,
                93.5, 90.9, 91.1, 94.7, 93.3, 97.2, 90.1, 95.6, 89.8, 97.7, 91.9, 85.4, 99.3, 91, 91.8, 79.4, 83.5,
                68.7, 68.5, 100, 85.2, 90.4, 80.6, 94.4, 97.1, 95.5, 86.6, 80.3, 98.6, 88.6, 91.6, 90.7, 88.8, 96,
                95.1, 92.9, 78.5, 79.5, 89.9, 82.3, 93, 89.1, 91.1, 96.5, 71.3, 83.9, 87.1, 89.2, 92.8, 90.4, 87.5,
                86.6, 79.6, 81.2, 75.5, 88.1, 96.1, 85.5, 93.6, 88.7, 90.2, 94.5, 86.6, 93.4],
    # … вставить остальные колонки: 'ИнтОрг', 'ОргWS', 'ПКРаб', 'ЭДО', 'ПКДХ', 'ИнтДХ', 'ШПДДХ'
}

df = pd.DataFrame(data)
df.set_index('Регион', inplace=True)

# -------------------------------
# 2. Стандартизация
# -------------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)
df_scaled = pd.DataFrame(X_scaled, columns=df.columns, index=df.index)
df_scaled.to_csv('scaled_data.csv')  # для вставки в отчет

# -------------------------------
# 3. PCA
# -------------------------------
pca = PCA(n_components=9)
X_pca = pca.fit_transform(df_scaled)

# Scree plot
plt.figure(figsize=(8,5))
plt.plot(np.arange(1,10), pca.explained_variance_ratio_, marker='o')
plt.xlabel('Компонента')
plt.ylabel('Доля объяснённой дисперсии')
plt.title('Scree Plot')
plt.savefig('scree_plot.png', dpi=300)
plt.close()

# Накопленная дисперсия
cumulative_var = np.cumsum(pca.explained_variance_ratio_)
plt.figure(figsize=(8,5))
plt.plot(np.arange(1,10), cumulative_var, marker='o')
plt.xlabel('Компонента')
plt.ylabel('Накопленная дисперсия')
plt.title('Накопленная доля объяснённой дисперсии')
plt.savefig('cumulative_variance.png', dpi=300)
plt.close()

# -------------------------------
# 4. Таблица нагрузок
# -------------------------------
loadings = pd.DataFrame(pca.components_.T, columns=[f'PC{i+1}' for i in range(9)], index=df.columns)
loadings.to_csv('loadings.csv')

# -------------------------------
# 5. Расчёт субиндексов (первые 2 компоненты)
# -------------------------------
df_scores = pd.DataFrame(X_pca[:, :2], columns=['SubIndex_Org', 'SubIndex_Pop'], index=df.index)
df_scores.to_csv('subindexes.csv')

# -------------------------------
# 6. Scatter Plot PC1 vs PC2
# -------------------------------
plt.figure(figsize=(10,7))
plt.scatter(df_scores['SubIndex_Org'], df_scores['SubIndex_Pop'], color='blue')
for i, txt in enumerate(df_scores.index):
    plt.annotate(txt, (df_scores['SubIndex_Org'][i], df_scores['SubIndex_Pop'][i]), fontsize=6)
plt.xlabel('SubIndex_Org (Цифровизация организаций)')
plt.ylabel('SubIndex_Pop (Цифровизация населения)')
plt.title('Scatter Plot PC1 vs PC2')
plt.savefig('scatter_PC1_PC2.png', dpi=300)
plt.close()

# -------------------------------
# 7. Biplot
# -------------------------------
plt.figure(figsize=(10,7))
plt.scatter(df_scores['SubIndex_Org'], df_scores['SubIndex_Pop'], color='blue', alpha=0.5)
for i, txt in enumerate(df_scores.index):
    plt.annotate(txt, (df_scores['SubIndex_Org'][i], df_scores['SubIndex_Pop'][i]), fontsize=6)

for i in range(len(df.columns)):
    plt.arrow(0, 0, loadings['PC1'][i]*3, loadings['PC2'][i]*3, color='red', alpha=0.5)
    plt.text(loadings['PC1'][i]*3.2, loadings['PC2'][i]*3.2, df.columns[i], color='red', fontsize=8)

plt.xlabel('SubIndex_Org')
plt.ylabel('SubIndex_Pop')
plt.title('Biplot')
plt.grid()
plt.savefig('biplot.png', dpi=300)
plt.close()

print("Все файлы готовы: scaled_data.csv, loadings.csv, subindexes.csv, scree_plot.png, cumulative_variance.png, scatter_PC1_PC2.png, biplot.png")