import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn import preprocessing
from sklearn import metrics
from joblib import dump, load
from math import sqrt
from sklearn.metrics import mean_squared_error

# Import Data
sign_language = pd.read_csv('./datasets/concatenated_data.csv')

## Show Data Set
sign_language.head()

# Preprocessing
data = sign_language.iloc[:, 1:6].values
le = preprocessing.LabelEncoder()
target = le.fit_transform(sign_language.iloc[:, 0].values)

# Train Test Split
data_train, data_test, target_train, target_test = train_test_split(data, target, test_size=0.2, random_state=12)

# Training and Predictions
from sklearn.neighbors import KNeighborsClassifier
classifier = KNeighborsClassifier(n_neighbors=5)
classifier.fit(data_train, target_train)

# Predict
target_pred = classifier.predict(data_test)

# Algorithm evaluation
from sklearn.metrics import classification_report, confusion_matrix
print("Confusion Matrix for K = 5\n")
print(confusion_matrix(target_test, target_pred))
print("\nClassification Report K = 5\n")
print(classification_report(target_test, target_pred))

# PLOTTING DATA

neighbors = np.arange(1, 40)
## Error Rate with K Value
error = []

## Root Mean Square Error
rmse_val = []

## Model Accuracy
train_accuracy = np.empty(len(neighbors))
test_accuracy = np.empty(len(neighbors))

## Calculating error for K values between 1 and 40
for i, k in enumerate(neighbors):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(data_train, target_train)

    pred_i = knn.predict(data_test)
    error.append(np.mean(pred_i != target_test))

    # Compute traning and test data accuracy
    train_accuracy[i] = knn.score(data_train, target_train)
    test_accuracy[i] = knn.score(data_test, target_test)

    error_plot = sqrt(mean_squared_error(target_test,pred_i)) #calculate rmse
    rmse_val.append(error_plot) #store rmse values
    print('RMSE value for k= ' , k , 'is:', error_plot)

## Plot Error Rate vs K Value
plt.figure(figsize=(12, 6))
plt.plot(range(1, 40), error, color='red', linestyle='dashed', marker='o', markerfacecolor='blue', markersize=10, label = 'Error')
plt.legend()
plt.title('Error Rate as K Value Increases')
plt.xlabel('K Value')
plt.ylabel('Mean Error')
plt.savefig('error_rate_vs_k_value.png')
plt.show()

## Plot Model Accuracy vs K value
plt.figure(figsize=(12, 6))
plt.plot(neighbors, test_accuracy, label = 'Testing dataset Accuracy')
plt.plot(neighbors, train_accuracy, label = 'Training dataset Accuracy')
plt.legend()
plt.title('Accuracy per K Value')
plt.xlabel('n_neighbors')
plt.ylabel('Accuracy')
plt.savefig('model_accuracy.png')
plt.show()